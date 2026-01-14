import { useState } from 'react'
import rawQuizConfig from './quizConfig.json'

type RawOption = {
  name: string
  value: string
}

type RawQuestion = {
  id: string
  text: string
  type: string
  next?: string | null
  optionMap?: RawOption[]
  fn?: {
    if?: unknown[]
  }
}

type QuestionOption = {
  id: string
  label: string
  value?: string
}

type Question = {
  id: string
  text: string
  options: QuestionOption[]
  raw: RawQuestion
}

type Message = {
  id: string
  sender: 'bot' | 'user'
  text: string
  type?: 'text' | 'typing'
}

function computeNextId(raw: RawQuestion, reply: string): string | null {
  const baseNext = raw.next ?? null
  const fn = raw.fn
  const ifArr = fn && Array.isArray(fn.if) ? (fn.if as unknown[]) : null

  if (!ifArr || ifArr.length === 0) return baseNext ?? null

  // JSONLogic-style: ["condition1", "value1", "condition2", "value2", ..., fallback]
  for (let i = 0; i < ifArr.length - 1; i += 2) {
    const cond = ifArr[i] as any
    const target = ifArr[i + 1]
    if (!cond || typeof target !== 'string') continue

    // We only support pattern: {"==":[{"var":"reply"},"SomeValue"]}
    const eq = cond['==']
    if (Array.isArray(eq) && eq.length === 2) {
      const right = eq[1]
      if (typeof right === 'string' && right === reply) {
        return target
      }
    }
  }

  const last = ifArr[ifArr.length - 1]
  if (typeof last === 'string') return last

  return baseNext ?? null
}
const RAW_QUESTIONS = (rawQuizConfig as { questions: RawQuestion[] }).questions

const QUESTIONS: Record<string, Question> = {}

for (const raw of RAW_QUESTIONS) {
  const options: QuestionOption[] =
    raw.optionMap?.map((opt, index) => ({
      id: opt.name || String(index + 1),
      label: opt.name,
      value: opt.value,
    })) ?? []

  QUESTIONS[raw.id] = {
    id: raw.id,
    text: raw.text,
    options,
    raw,
  }
}

const START_QUESTION_ID = 'first_name'

function normalise(text: string): string {
  return text.trim().toLowerCase()
}

function matchOptionFromInput(question: Question, rawInput: string): QuestionOption | undefined {
  const value = normalise(rawInput)

  if (!value) return undefined

  // 1) Special handling for gender-like questions: detect intent from loose phrases
  const genderLikeQuestion = question.id.includes('gender')
  if (genderLikeQuestion) {
    const isMale =
      /\b(male|man|boy|guy|him|he)\b/.test(value) && !/\bfemale\b/.test(value) && !/\bgirl\b/.test(value)
    const isFemale =
      /\b(female|woman|girl|lady|she|her)\b/.test(value) && !/\bmale\b/.test(value) && !/\bman\b/.test(value)

    if (isMale) return question.options.find((opt) => opt.id === 'male')
    if (isFemale) return question.options.find((opt) => opt.id === 'female')

    const unsureGender = /\b(idk|not sure|prefer not|other)\b/.test(value)
    if (unsureGender) return question.options.find((opt) => opt.id === 'other')
  }

  // 2) Special handling for age-type questions: extract a number and map to a range
  const ageLikeQuestion =
    question.id.includes('age') || question.options.some((opt) => /\d/.test(opt.label))

  if (ageLikeQuestion) {
    const numberMatch = value.match(/\d{1,3}/)
    if (numberMatch) {
      const age = Number(numberMatch[0])
      if (Number.isFinite(age)) {
        // naive mapping based on the common ranges we use (Under 18, 18-24, 25-34, 35-44, 45+)
        if (age < 18) return question.options.find((opt) => opt.id.includes('under-18'))
        if (age >= 18 && age <= 24) return question.options.find((opt) => opt.id.startsWith('18-24'))
        if (age >= 25 && age <= 34) return question.options.find((opt) => opt.id.startsWith('25-34'))
        if (age >= 35 && age <= 44) return question.options.find((opt) => opt.id.startsWith('35-44'))
        if (age >= 45) return question.options.find((opt) => opt.id.startsWith('45-plus'))
      }
    }
  }

  // 3) For concern-like questions, treat "not sure" / "idk" as "other"
  const concernLikeQuestion = question.id.includes('concern')
  if (concernLikeQuestion && /\b(idk|not sure|don.?t know|no idea)\b/.test(value)) {
    const otherOption =
      question.options.find((opt) => opt.id === 'other') ??
      question.options.find((opt) => normalise(opt.label).includes('other'))
    if (otherOption) return otherOption
  }

  // 4) Allow numbered answers: 1,2,3...
  const asNumber = Number(value)
  if (Number.isInteger(asNumber) && asNumber >= 1 && asNumber <= question.options.length) {
    return question.options[asNumber - 1]
  }

  // 5) Exact label match
  const exact = question.options.find((opt) => normalise(opt.label) === value)
  if (exact) return exact

  // 6) Fuzzy: contains key word from option id or label
  return question.options.find((opt) => {
    const idMatch = value.includes(normalise(opt.id))
    const labelMatch = value.includes(normalise(opt.label))
    return idMatch || labelMatch
  })
}

export function HairQuizChat() {
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(START_QUESTION_ID)
  const [questionStack, setQuestionStack] = useState<string[]>([START_QUESTION_ID])
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hi, I’m your Traya hair expert. I’ll ask a few quick questions to understand your hair better.',
    },
    {
      id: START_QUESTION_ID,
      sender: 'bot',
      text: QUESTIONS[START_QUESTION_ID].text,
    },
  ])
  const [isBotTyping, setIsBotTyping] = useState(false)
  const [input, setInput] = useState('')

  const currentQuestion = currentQuestionId ? QUESTIONS[currentQuestionId] : undefined

  const goToNext = (question: Question, replyValue: string, option?: QuestionOption) => {
    const nextId = computeNextId(question.raw, option?.value ?? replyValue)

    if (!nextId) {
      // End of this flow – show a bot typing effect then a summary
      setIsBotTyping(true)
      setCurrentQuestionId(null)

      window.setTimeout(() => {
        setIsBotTyping(false)
        setMessages((prev) => [
          ...prev,
          {
            id: 'summary',
            sender: 'bot',
            text: 'Thanks for sharing! We’re analysing your responses to recommend the best Traya plan for you.',
          },
        ])
      }, 700)
      return
    }

    // Move to the next question in the selected branch with a typing delay
    setIsBotTyping(true)
    setCurrentQuestionId(null)

    window.setTimeout(() => {
      const nextQuestion = QUESTIONS[nextId]
      setIsBotTyping(false)
      setCurrentQuestionId(nextQuestion.id)
      setQuestionStack((prev) => [...prev, nextQuestion.id])
      setMessages((prev) => [
        ...prev,
        {
          id: nextQuestion.id,
          sender: 'bot',
          text: nextQuestion.text,
        },
      ])
    }, 600)
  }

  const handleGoBack = () => {
    if (isBotTyping) return
    if (questionStack.length <= 1) return

    const newStack = questionStack.slice(0, -1)
    const prevId = newStack[newStack.length - 1]
    const prevQuestion = QUESTIONS[prevId]

    setIsBotTyping(true)
    setCurrentQuestionId(null)
    setQuestionStack(newStack)

    window.setTimeout(() => {
      setIsBotTyping(false)
      setCurrentQuestionId(prevQuestion.id)
      setMessages((prev) => [
        ...prev,
        {
          id: `${prevQuestion.id}-back-${Date.now()}`,
          sender: 'bot',
          text: "No problem, let's go back to the previous question.",
        },
        {
          id: `${prevQuestion.id}-reask-${Date.now()}`,
          sender: 'bot',
          text: prevQuestion.text,
        },
      ])
    }, 400)
  }

  const handleUserSubmit = () => {
    if (!currentQuestion || isBotTyping) return

    const value = input.trim()
    if (!value) return

    // support "back" commands to revisit the previous question
    const lower = value.toLowerCase()
    if (/\b(back|go back|previous|change answer|edit answer)\b/.test(lower)) {
      handleGoBack()
      setInput('')
      return
    }

    // push user message
    setMessages((prev) => [
      ...prev,
      {
        id: `${currentQuestion.id}-answer-${Date.now()}`,
        sender: 'user',
        text: value,
      },
    ])

    setInput('')

    // For questions without predefined options (free-text, numeric, etc.), just move on
    if (currentQuestion.options.length === 0) {
      goToNext(currentQuestion, value)
      return
    }

    const matchedOption = matchOptionFromInput(currentQuestion, value)

    if (!matchedOption) {
      // if we can't understand, gently guide the user and don't advance
      setIsBotTyping(true)
      setCurrentQuestionId(currentQuestion.id)

      window.setTimeout(() => {
        setIsBotTyping(false)
        setMessages((prev) => [
          ...prev,
          {
            id: `${currentQuestion.id}-clarify-${Date.now()}`,
            sender: 'bot',
            text: `I didn’t quite get that. Please reply with one of: ${currentQuestion.options
              .map((o, idx) => `${idx + 1}. ${o.label}`)
              .join('  |  ')}.`,
          },
        ])
      }, 600)

      return
    }

    goToNext(currentQuestion, matchedOption.value ?? matchedOption.label, matchedOption)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-slate-900/60 border border-slate-800 rounded-3xl shadow-2xl shadow-slate-950/60 overflow-hidden flex flex-col h-[600px]">
        <header className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-emerald-500 flex items-center justify-center text-sm font-semibold text-slate-950">
            Traya
          </div>
          <div>
            <p className="text-sm font-semibold">Traya Hair Quiz</p>
            <p className="text-xs text-slate-400">Chat with us to understand your hair in under 2 minutes</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                  message.sender === 'user'
                    ? 'bg-emerald-500 text-slate-950 rounded-br-sm'
                    : 'bg-slate-800 text-slate-100 rounded-bl-sm'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}

          {isBotTyping && (
            <div className="flex justify-start">
              <div className="max-w-[60%] rounded-2xl px-3 py-2 text-xs bg-slate-800 text-slate-300 rounded-bl-sm flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-500 animate-pulse" />
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-500 animate-pulse delay-75" />
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-500 animate-pulse delay-150" />
              </div>
            </div>
          )}
        </main>

        <footer className="border-t border-slate-800 bg-slate-900/80 backdrop-blur px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  handleUserSubmit()
                }
              }}
              disabled={!currentQuestion || isBotTyping}
              placeholder={
                currentQuestion && !isBotTyping
                  ? 'Type your answer here (e.g. Male, 25-34, Hairfall, or 1/2/3...)'
                  : 'Please wait...'
              }
              className="flex-1 text-xs sm:text-sm rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={handleUserSubmit}
              disabled={!currentQuestion || isBotTyping || !input.trim()}
              className="shrink-0 inline-flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold px-3 py-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">
            Tip: You can reply with the option text (e.g. &quot;Male&quot;) or just the number (1, 2, 3...).
          </p>
        </footer>
      </div>
    </div>
  )
}

export default HairQuizChat

