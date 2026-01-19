import { useState, useEffect, useRef, useCallback, type ChangeEvent } from 'react'
import './HairQuizChat.css' // Import the custom CSS file

// --- Type Definitions for Data from Backend API ---
type RawOption = {
  name: string
  value: string
  // Add other properties if they are used in logic (e.g., 'image_url')
}

type RawQuestion = {
  id: string
  component: string // e.g., "inputName", "inputRadioV2"
  group: string
  next?: string | null // Default next question ID
  reply: string // Likely placeholder or internal
  tag: string // e.g., "user", "form"
  text: string // The question text
  tamil_text?: string // Localized text
  type: string // e.g., "text", "tel", "single_choice", "multiple_choice", "file"
  optionMap?: RawOption[] // Options for choice questions
  fn?: {
    if?: unknown[] // JSONLogic-style branching
  }
}

// --- Internal Chat Question Types (derived from RawQuestion) ---
type QuestionOption = {
  id: string // From option.name or index
  label: string // From option.name
  value?: string // From option.value (used for logic in computeNextId)
}

type Question = {
  id: string
  text: string
  options: QuestionOption[]
  raw: RawQuestion // Keep raw for complex logic like `fn.if`
}

type Message = {
  id: string
  sender: 'bot' | 'user'
  text: string
  type?: 'text' | 'typing' // 'text' by default, 'typing' for bot typing indicator
  options?: QuestionOption[] // To display clickable options with bot messages
  isCurrentQuestion?: boolean // To highlight current question's options
  imageUrl?: string // For displaying uploaded images
}

// --- Process Raw Quiz Config into Internal QUESTIONS map ---
let QUESTIONS_MAP_GLOBAL: Record<string, Question> = {}; // Global to be set after fetch

// --- Helper Functions for NLP and Logic ---
function normalise(text: string): string {
  return text.trim().toLowerCase()
}

// Evaluates the 'fn.if' JSONLogic-like structure from raw config
function computeNextId(raw: RawQuestion, replyValue: string): string | null {
  const baseNext = raw.next ?? null
  const fn = raw.fn
  const ifArr = fn && Array.isArray(fn.if) ? (fn.if as unknown[]) : null

  if (!ifArr || ifArr.length === 0) return baseNext // No complex logic, just use `next`

  for (let i = 0; i < ifArr.length - 1; i += 2) {
    const cond = ifArr[i] as any
    const targetNextId = ifArr[i + 1]

    if (typeof targetNextId !== 'string') continue

    if (cond && typeof cond === 'object' && cond['==']) {
      const equalityCheck = cond['==']
      if (Array.isArray(equalityCheck) && equalityCheck.length === 2) {
        const varPart = equalityCheck[0]
        const expectedValue = equalityCheck[1]

        if (
          typeof varPart === 'object' &&
          varPart['var'] === 'reply' &&
          typeof expectedValue === 'string' &&
          expectedValue === replyValue
        ) {
          if (QUESTIONS_MAP_GLOBAL[targetNextId]) {
            return targetNextId
          } else {
            console.warn(`computeNextId: Target question ID '${targetNextId}' not found in fetched questions.`)
          }
        }
      }
    }
  }

  const lastItem = ifArr[ifArr.length - 1]
  if (typeof lastItem === 'string' && QUESTIONS_MAP_GLOBAL[lastItem]) {
    return lastItem
  }

  return baseNext
}

// Attempts to match user raw input to one of the available options for a question.
function matchOptionFromInput(question: Question, rawInput: string): QuestionOption | undefined {
  const value = normalise(rawInput)

  if (!value) return undefined

  // 1) Special handling for gender-like questions (if options exist)
  if (question.id === 'gender' && question.options.length > 0) {
    const maleKeywords = /\b(male|man|boy|guy|him|he)\b/
    const femaleKeywords = /\b(female|woman|girl|lady|she|her)\b/
    const unsureKeywords = /\b(idk|not sure|prefer not to say|other|rather not say)\b/

    const isMaleIntent = maleKeywords.test(value) && !femaleKeywords.test(value)
    const isFemaleIntent = femaleKeywords.test(value) && !maleKeywords.test(value)
    const isUnsureIntent = unsureKeywords.test(value)

    if (isMaleIntent) return question.options.find((opt) => normalise(opt.value!) === 'm')
    if (isFemaleIntent) return question.options.find((opt) => normalise(opt.value!) === 'f')
    if (isUnsureIntent) {
      return question.options.find((opt) => normalise(opt.label).includes('other'))
    }
  }

  // If the question has options, try matching against them
  if (question.options.length > 0) {
    // 2) General "not sure" / "other" handling for any question with options
    const unsureKeywords = /\b(idk|not sure|don.?t know|no idea|cannot say|can\'t say|other)\b/
    if (unsureKeywords.test(value)) {
      const otherOption = question.options.find(
        (opt) =>
          normalise(opt.id).includes('other') ||
          normalise(opt.label).includes('other') ||
          normalise(opt.label).includes('not sure') ||
          normalise(opt.value ?? '').includes('other')
      )
      if (otherOption) return otherOption
    }

    // 3) Allow numbered answers: 1,2,3...
    const asNumber = Number(value)
    if (Number.isInteger(asNumber) && asNumber >= 1 && asNumber <= question.options.length) {
      return question.options[asNumber - 1]
    }

    // 4) Exact label match
    const exact = question.options.find((opt) => normalise(opt.label) === value)
    if (exact) return exact

    // 5) Enhanced Fuzzy: check for significant keywords and partial matches
    const words = value.split(/\s+/).filter(Boolean); // Split input into words

    let bestMatch: { option: QuestionOption; score: number } | undefined = undefined;

    for (const option of question.options) {
      const normalisedLabel = normalise(option.label);
      const normalisedValue = normalise(option.value ?? '');
      const normalisedId = normalise(option.id);

      let score = 0;
      for (const word of words) {
        if (normalisedLabel.includes(word) || normalisedValue.includes(word) || normalisedId.includes(word)) {
          score++;
        }
      }

      if (score > 0) {
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { option, score };
        } else if (score === bestMatch.score) {
          if (normalisedLabel.length < normalise(bestMatch.option.label).length && normalisedLabel.includes(value)) {
            bestMatch = { option, score };
          }
        }
      }
    }

    if (bestMatch) return bestMatch.option;
  }

  return undefined // No match found
}

// --- Main Chat Component ---
export function HairQuizChat() {
  const [questionsMap, setQuestionsMap] = useState<Record<string, Question>>({});
  const [_startQuestionId, setStartQuestionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null)
  const [questionStack, setQuestionStack] = useState<string[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isBotTyping, setIsBotTyping] = useState(false)
  const [input, setInput] = useState('')
  // Store answers including Base64 for images
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string | { data: string; mimeType: string }>>({}); 

  const chatMessagesRef = useRef<HTMLDivElement>(null) // Ref for scrolling
  const inputRef = useRef<HTMLInputElement>(null); // Ref for auto-focusing input

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // --- Fetch questions from backend ---
  useEffect(() => {
    const fetchQuizConfig = async () => {
      try {
        if (!BACKEND_URL) {
          throw new Error('VITE_BACKEND_URL is not defined in environment variables.');
        }
        
        const response = await fetch(`${BACKEND_URL}/api/quiz/questions`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const processedQuestions: Record<string, Question> = {};
        let firstQId: string | null = null;
        if (data && Array.isArray(data.questions)) {
          for (const raw of data.questions) {
            const options: QuestionOption[] =
              raw.optionMap?.map((opt: RawOption, index: number) => ({
                id: opt.name || String(index + 1),
                label: opt.name,
                value: opt.value,
              })) ?? [];

            processedQuestions[raw.id] = {
              id: raw.id,
              text: raw.text,
              options,
              raw,
            };
            if (!firstQId) firstQId = raw.id;
          }
        }

        QUESTIONS_MAP_GLOBAL = processedQuestions; // Set global map
        if (firstQId) {
          setStartQuestionId(firstQId);
        } else {
          console.warn("No starting question ID found in fetched quiz config. Using fallback 'first_name'.");
          setStartQuestionId('first_name'); // Fallback in case of empty config
        }

        setQuestionsMap(processedQuestions);
        // Ensure initial currentQuestionId and stack are set after fetching
        setCurrentQuestionId(firstQId);
        setQuestionStack([firstQId!]); // Use ! as we have a fallback for firstQId

        if (firstQId && processedQuestions[firstQId]) {
            setMessages([
                {
                    id: 'welcome',
                    sender: 'bot',
                    text: 'Hello, I’m your Traya hair expert. Let’s start with a few quick questions to understand your hair better.',
                },
                {
                    id: firstQId,
                    sender: 'bot',
                    text: processedQuestions[firstQId].text,
                    options: processedQuestions[firstQId].options.length > 0 ? processedQuestions[firstQId].options : undefined,
                    isCurrentQuestion: true,
                },
            ]);
        }

      } catch (e: any) {
        setError(e.message);
        console.error("Failed to fetch quiz config:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizConfig();
  }, [BACKEND_URL]);


  // Scroll to the bottom of the chat when messages update or bot is typing
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }, [messages, isBotTyping])

  // Auto-focus input when currentQuestionId changes (i.e., a new question is asked)
  useEffect(() => {
    if (inputRef.current && !isBotTyping && currentQuestionId && questionsMap[currentQuestionId]?.raw.type !== 'file') {
      inputRef.current.focus();
    }
  }, [currentQuestionId, isBotTyping, questionsMap]);


  const currentQuestion = currentQuestionId ? questionsMap[currentQuestionId] : undefined;

  // Function to submit quiz answers to backend
  const submitQuizAnswers = async (answers: Record<string, string | { data: string; mimeType: string }>) => {
    if (!BACKEND_URL) {
      console.error('VITE_BACKEND_URL is not defined, cannot submit answers.');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.statusText}`);
      }

      console.log('Quiz answers submitted successfully!');
      // Optionally handle success message or redirect
    } catch (submitError) {
      console.error('Error submitting quiz answers:', submitError);
      showBotMessage('There was an error submitting your quiz. Please try again.');
    }
  };


  // Helper to display a bot message with typing indicator
  const showBotMessage = (text: string, nextQuestionId: string | null = null, options?: QuestionOption[], imageUrl?: string) => {
    setIsBotTyping(true)
    setCurrentQuestionId(null) // Temporarily hide input options while bot is typing or for validation errors

    window.setTimeout(() => {
      setIsBotTyping(false)
      setMessages((prev:any) => {
        const newMessages = [
          ...prev,
          {
            id: `bot-msg-${Date.now()}`,
            sender: 'bot',
            text: text,
            options: options,
            isCurrentQuestion: !!nextQuestionId, // Mark as current if it's a re-ask or new question
            imageUrl: imageUrl, // Pass image URL for bot messages if needed
          },
        ];

        // Ensure only the very last bot message with options is marked as isCurrentQuestion
        for(let i = 0; i < newMessages.length; i++) {
            if (newMessages[i].sender === 'bot') {
                newMessages[i].isCurrentQuestion = false;
            }
        }
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].sender === 'bot' && nextQuestionId) {
            newMessages[newMessages.length - 1].isCurrentQuestion = true;
        }

        return newMessages;
      })
        setCurrentQuestionId(nextQuestionId)
    }, 600)
  }

  // Helper to advance to the next question
  const goToNext = (
    question: Question,
    // --- MODIFIED HERE: replyValue can now be a string or the filePayload object ---
    replyValue: string | { data: string; mimeType: string }, 
    _option?: QuestionOption
  ) => {
    // Store answer based on question type
    if (question.raw.type === 'file' && typeof replyValue !== 'string') {
      // If it's a file question and replyValue is the filePayload object
      setQuizAnswers((prev) => ({ ...prev, [question.id]: replyValue }));
    } else if (typeof replyValue === 'string') {
      // For string answers (text inputs, options)
      setQuizAnswers((prev) => ({ ...prev, [question.id]: replyValue }));
    } else {
      // Fallback for unexpected types (should not happen with correct usage)
      console.warn('goToNext received unexpected replyValue type for question', question.id, replyValue);
      setQuizAnswers((prev) => ({ ...prev, [question.id]: 'Invalid_Reply_Type' }));
    }
  
    // --- IMPORTANT: The computeNextId function still needs a string for its branching logic ---
    const nextId = computeNextId(
      question.raw,
      typeof replyValue === 'string' ? replyValue : 'File Uploaded' // Use a generic string for logic
    );
  
    if (!nextId || !questionsMap[nextId]) {
      // End of this flow or no next question defined – show a summary
      showBotMessage('Thanks for sharing! We’re analysing your responses to recommend the best Traya plan for you.');
      setCurrentQuestionId(null); // End the quiz flow
      // Submit all answers. Ensure `replyValue` is correctly represented if it's an object.
      submitQuizAnswers({ ...quizAnswers, [question.id]: typeof replyValue === 'string' ? replyValue : replyValue });
      return;
    }

    // Move to the next question in the selected branch with a typing delay
    setIsBotTyping(true)
    setCurrentQuestionId(null) // Temporarily unset to hide input options

    window.setTimeout(() => {
      const nextQuestion = questionsMap[nextId]
      if (!nextQuestion) {
        showBotMessage('Oops, something went wrong and I could not find the next question.')
        setCurrentQuestionId(null)
        return
      }

      setIsBotTyping(false)
      setCurrentQuestionId(nextQuestion.id)
      setQuestionStack((prev) => [...prev, nextQuestion.id]) // Add to history
      setMessages((prev:any) => {
        const newMessages = [
          ...prev,
          {
            id: nextQuestion.id,
            sender: 'bot',
            text: nextQuestion.text,
            options: nextQuestion.options.length > 0 ? nextQuestion.options : undefined,
            isCurrentQuestion: true, // Mark this as the current question
          },
        ];

        // Ensure only the very last bot message with options is marked as isCurrentQuestion
        for(let i = 0; i < newMessages.length; i++) {
            if (newMessages[i].sender === 'bot' && newMessages[i].id !== nextQuestion.id) {
                newMessages[i].isCurrentQuestion = false;
            }
        }
        return newMessages;
      });
    }, 600)
  }

  // Handles going back to the previous question in the stack
  const handleGoBack = useCallback(() => {
    if (isBotTyping) return
    if (questionStack.length <= 1) {
      showBotMessage('You are at the beginning of the quiz.')
      return
    }

    const newStack = questionStack.slice(0, -1)
    const prevId = newStack[newStack.length - 1]
    const prevQuestion = questionsMap[prevId]

    setIsBotTyping(true)
    setCurrentQuestionId(null) // Temporarily hide input
    setQuestionStack(newStack)
    // Also remove the last answer when going back
    setQuizAnswers(prev => {
        const newAnswers = { ...prev };
        delete newAnswers[questionStack[questionStack.length - 1]];
        return newAnswers;
    });


    window.setTimeout(() => {
      setIsBotTyping(false)
      setCurrentQuestionId(prevQuestion.id)
      setMessages((prev:any) => {
        const newMessages = [
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
            options: prevQuestion.options.length > 0 ? prevQuestion.options : undefined,
            isCurrentQuestion: true, // Mark this as the current question
          },
        ];
        // Ensure only the very last bot message with options is marked as isCurrentQuestion
        for(let i = 0; i < newMessages.length; i++) {
            if (newMessages[i].sender === 'bot' && newMessages[i].id !== `${prevQuestion.id}-reask-${Date.now()}`) {
                newMessages[i].isCurrentQuestion = false;
            }
        }
        return newMessages;
      });
    }, 400)
  }, [isBotTyping, questionStack, questionsMap, currentQuestionId, showBotMessage, setQuizAnswers]);


  // Handles when a user clicks on an option button
  const handleOptionClick = (option: QuestionOption) => {
    if (!currentQuestion || isBotTyping) return

    // Immediately show the user's selected option as a message
    setMessages((prev) => [
      ...prev,
      {
        id: `user-option-${Date.now()}`,
        sender: 'user',
        text: option.label,
      },
    ]);

    // Then proceed to the next question based on the selected option
    goToNext(currentQuestion, option.value ?? option.label, option)
  }

// Handle file input change (reads file as Base64)
const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
  if (!currentQuestion || !event.target.files || event.target.files.length === 0) return;

  const file = event.target.files[0];
  const fileName = file.name;

  // Display image in chat immediately using a temporary Object URL
  const objectUrl = URL.createObjectURL(file); 
  setMessages((prev) => [
      ...prev,
      {
          id: `user-file-${Date.now()}`,
          sender: 'user',
          text: `Uploaded: ${fileName}`,
          imageUrl: objectUrl, // Display the image preview
      },
  ]);
  
  // Read file as Base64 for sending to backend
  const reader = new FileReader();
  reader.onload = () => {
      const base64Data = reader.result as string; // Will be "data:image/jpeg;base64,..."
      const mimeType = file.type;
      const filePayload = { data: base64Data, mimeType: mimeType };

      // --- CRITICAL FIX HERE: Pass the actual filePayload object ---
      goToNext(currentQuestion, filePayload); 
  };
  reader.onerror = (error) => {
      console.error("Error reading file:", error);
      showBotMessage("Failed to read the file. Please try again.");
  };
  reader.readAsDataURL(file); // Read as Base64
};

  // Validates user input for specific question types
  const validateInput = (question: Question, value: string): string | null => {

    if (question.id === 'first_name') {
      if (value.length < 2) {
        return 'Please provide a valid name to continue (at least 2 characters).'
      }
    }

    if (question.id === 'phone_number') {
      // Basic 10-digit phone number validation
      if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) {
        return 'Please enter a valid 10-digit phone number.'
      }
    }

    if (question.id === 'email') {
      // Basic email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address.'
      }
    }

    if (question.id === 'C1d' /* age question */) {
      const ageMatch = value.match(/\d{1,3}/)
      if (!ageMatch) {
        return 'Please provide your age (e.g., "27").'
      }
      const age = Number(ageMatch[0])
      if (age < 18 || age > 120) { // Updated age validation: must be >= 18
        return 'Traya treatment is only available to adults 18 and above. Please enter a realistic age.'
      }
    }

    return null // No validation error
  }

  // Main handler for user input
  const handleUserSubmit = () => {
    if (!currentQuestion || isBotTyping) return

    const value = input.trim()
    if (!value && currentQuestion.raw.type !== 'file') return 

    // Special commands first
    const lower = value.toLowerCase()
    if (/\b(back|go back|previous|change answer|edit answer)\b/.test(lower)) {
      handleGoBack()
      setInput('')
      return
    }

    // For file input, `handleFileChange` is the primary handler.
    if (currentQuestion.raw.type === 'file') {
      // If the user tries to submit an empty text for a file input, prompt them to choose a file.
      showBotMessage('Please choose a file to upload to continue.', currentQuestion.id);
      return; 
    }


    // Perform validation for specific question types (for text inputs)
    const validationError = validateInput(currentQuestion, value)
    if (validationError) {
      showBotMessage(validationError, currentQuestion.id) // Show specific error
      setInput('')
      return
    }

    // Add user message to chat history (only for text input)
    setMessages((prev) => [
      ...prev,
      {
        id: `user-answer-${Date.now()}`,
        sender: 'user',
        text: value,
      },
    ]);
    setInput(''); // Clear input field
    

    // Determine the next step based on question type (options or free text)
    if (currentQuestion.options.length === 0) {
      // For free-text input questions
      goToNext(currentQuestion, value)
      return
    }

    // For questions with predefined options, try to match user input to an option
    const matchedOption = matchOptionFromInput(currentQuestion, value)

    if (!matchedOption) {
      // If no option matched, show a clarification message
      showBotMessage(
        `I didn’t quite get that. Please reply with one of: ${currentQuestion.options
          .map((o, idx) => `${idx + 1}. ${o.label}`)
          .join('  |  ')}.`,
        currentQuestion.id
      )
      return
    }

    // If an option was matched, proceed to the next question based on that option
    goToNext(currentQuestion, matchedOption.value ?? matchedOption.label, matchedOption)
  }

  // Determine placeholder and tip dynamically
  const inputPlaceholder = currentQuestion?.text
    ? `Type your answer for "${currentQuestion.text}"`
    : 'Please wait...'

  const inputTip = (() => {
    if (!currentQuestion) return null

    if (currentQuestion.raw.type === 'file') {
        return <p className="chat-tip-text">Tip: Click "Choose File" to upload your scalp image.</p>
    }

    if (currentQuestion.options.length > 0) {
      return (
        <p className="chat-tip-text">
          Tip: You can reply with the option text (e.g. &quot;{currentQuestion.options[0].label}&quot;) or click the buttons above.
        </p>
      )
    }

    // Specific tips for free-text fields
    if (currentQuestion.id === 'first_name') return <p className="chat-tip-text">Tip: Type your full name.</p>
    if (currentQuestion.id === 'phone_number') return <p className="chat-tip-text">Tip: Enter your 10-digit phone number.</p>
    if (currentQuestion.id === 'email') return <p className="chat-tip-text">Tip: Enter your email address.</p>
    if (currentQuestion.id === 'C1d') return <p className="chat-tip-text">Tip: Enter your age (e.g., "27").</p>

    return null // No specific tip
  })()


  // --- Render UI ---
  if (isLoading) {
    return (
      <div className="chat-wrapper">
        <div className="chat-container">
          <main className="chat-main custom-scrollbar flex items-center justify-center">
            <p className="text-gray-400">Loading quiz questions...</p>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-wrapper">
        <div className="chat-container">
          <main className="chat-main custom-scrollbar flex items-center justify-center">
            <p className="text-red-400">Error loading quiz: {error}</p>
          </main>
        </div>
      </div>
    );
  }


  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <header className="chat-header">
          <div className="chat-header-avatar">
            T
          </div>
          <div>
            <p className="chat-header-title">Traya Hair Quiz</p>
            <p className="chat-header-subtitle">Chat with us to understand your hair in under 2 minutes</p>
          </div>
        </header>

        <main ref={chatMessagesRef} className="chat-main custom-scrollbar">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message-row ${message.sender === 'user' ? 'user' : 'bot'}`}
            >
              <div
                className={`chat-message-bubble ${message.sender === 'user' ? 'user' : 'bot'} ${message.sender === 'bot' && message.isCurrentQuestion ? 'current-question' : ''}`}
              >
                <p className="chat-message-text">{message.text}</p>
                {/* Display image for user messages, if available */}
                {message.imageUrl && message.sender === 'user' && (
                  <img src={message.imageUrl} alt="Uploaded scalp" className="mt-2 max-w-full h-auto rounded-lg" />
                )}
                {message.options && message.isCurrentQuestion && (
                  <div className="chat-options-container">
                    {message.options.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleOptionClick(option)}
                        disabled={isBotTyping}
                        className="chat-option-button"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isBotTyping && (
            <div className="typing-indicator-row">
              <div className="typing-indicator-bubble">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
        </main>
        <footer className="chat-footer">
          <div className="chat-input-area">
            {/* Condition: Show file input if it's the current question AND its type is 'file' AND bot is not typing */}
            {currentQuestion?.raw.type === 'file' && !isBotTyping ? (
                <label className="chat-file-input-label">
                    Choose File
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isBotTyping} // Still disable if bot is typing
                        className="chat-file-input"
                    />
                </label>
            ) : (
                // This block handles either text inputs OR a disabled placeholder
                <input
                    ref={inputRef} // Attach ref here
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault()
                            handleUserSubmit()
                        }
                    }}
                    // Disable if no current question, or bot is typing, or current question is file type (as file is handled by label)
                    disabled={!currentQuestion || isBotTyping || currentQuestion?.raw.type === 'file'} 
                    placeholder={
                        !currentQuestion
                            ? "Quiz complete!" // Or some other final message
                            : isBotTyping
                                ? 'Please wait...'
                                : currentQuestion.raw.type === 'file'
                                    ? 'Upload your image above' // Placeholder when file input is expected
                                    : inputPlaceholder // Default text input placeholder
                    }
                    className="chat-input"
                />
            )}
            
            {/* The send button is only for text inputs */}
            {currentQuestion?.raw.type !== 'file' && ( 
                <button
                    type="button"
                    onClick={handleUserSubmit}
                    disabled={!currentQuestion || isBotTyping || !input.trim()}
                    className="chat-send-button"
                >
                    Send
                </button>
            )}
          </div>
          {inputTip}
          {!currentQuestion && !isBotTyping && (
             <p className="chat-complete-message">
               Quiz complete! Thank you for your responses.
             </p>
          )}
        </footer>
      </div>
    </div>
  )
}

export default HairQuizChat