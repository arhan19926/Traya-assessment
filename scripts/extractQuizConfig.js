// Lightweight extractor: pulls the embedded quiz JSON out of the Next.js chunk
// and saves it to frontend/src/quizConfig.json.
//
// Usage (from repo root):
//   node scripts/extractQuizConfig.js
//
// If the chunk URL ever changes, update CHUNK_URL below.

const fs = require('fs')
const path = require('path')
const https = require('https')

// Chunk containing the JSON.parse('{"questions":[...]}') payload you found
const CHUNK_URL =
  'https://form.traya.health/_next/static/chunks/70662-186ebeba72de4b81.js'

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = ''
        res.on('data', (d) => {
          data += d.toString()
        })
        res.on('end', () => resolve(data))
      })
      .on('error', reject)
  })
}

async function main() {
  console.log(`Downloading chunk: ${CHUNK_URL}`)
  const js = await fetchText(CHUNK_URL)

  // The chunk typically has something like:
  //   p = JSON.parse('{"questions":[...]}')
  // Sometimes the JSON string is additionally escaped (\") inside the JS string literal.
  //
  // We'll locate JSON.parse(<string literal>) and safely decode the JS string literal.

  const parseCalls = js.match(/JSON\.parse\((['"`])[\s\S]*?\1\)/g) ?? []

  function decodeJsStringLiteral(lit) {
    // lit includes surrounding quotes, like '...'
    const quote = lit[0]
    const body = lit.slice(1, -1)
    let out = ''
    for (let i = 0; i < body.length; i++) {
      const ch = body[i]
      if (ch !== '\\') {
        out += ch
        continue
      }
      const next = body[++i]
      if (next === undefined) break
      if (next === 'n') out += '\n'
      else if (next === 'r') out += '\r'
      else if (next === 't') out += '\t'
      else if (next === 'b') out += '\b'
      else if (next === 'f') out += '\f'
      else if (next === 'v') out += '\v'
      else if (next === '0') out += '\0'
      else if (next === 'x') {
        const hex = body.slice(i + 1, i + 3)
        if (/^[0-9a-fA-F]{2}$/.test(hex)) {
          out += String.fromCharCode(parseInt(hex, 16))
          i += 2
        } else out += next
      } else if (next === 'u') {
        const hex = body.slice(i + 1, i + 5)
        if (/^[0-9a-fA-F]{4}$/.test(hex)) {
          out += String.fromCharCode(parseInt(hex, 16))
          i += 4
        } else out += next
      } else {
        // handles \", \', \\ etc.
        out += next
      }
    }
    return out
  }

  let parsed = null

  // First: search through JSON.parse(...) calls and pick one that looks like it contains questions
  for (const call of parseCalls) {
    const m = call.match(/^JSON\.parse\((['"`])([\s\S]*?)\1\)$/)
    if (!m) continue
    const decoded = decodeJsStringLiteral(m[1] + m[2] + m[1])
    if (!decoded.includes('"questions"')) continue
    try {
      parsed = JSON.parse(decoded)
      if (parsed && Array.isArray(parsed.questions)) break
    } catch {
      // ignore and continue
    }
  }

  // Fallback: try direct regex captures (unescaped and escaped variants)
  if (!parsed) {
    const unescapedMatch = js.match(/JSON\.parse\('(\{[\s\S]*?\})'\)/)
    if (unescapedMatch) {
      try {
        const candidate = unescapedMatch[1]
        if (candidate.includes('"questions"')) parsed = JSON.parse(candidate)
      } catch {
        // ignore
      }
    }
  }

  if (!parsed || !Array.isArray(parsed.questions)) {
    throw new Error(
      'Could not find questions JSON in chunk. The chunk may have changed; update CHUNK_URL or refine extraction.'
    )
  }

  const outPath = path.join(process.cwd(), 'frontend', 'src', 'quizConfig.json')
  fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2), 'utf8')

  console.log(
    `Saved ${outPath} with ${parsed.questions ? parsed.questions.length : 0} questions.`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

