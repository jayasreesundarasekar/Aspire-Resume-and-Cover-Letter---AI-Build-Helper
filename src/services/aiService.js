// ---------------------------------------------------------------------------
// aiService.js
//
// Single point of contact for every LLM-backed feature in Aspire: resume &
// cover letter drafting, ATS-aware suggestions, task breakdown, chat replies,
// and document summarization.
//
// WIRING A REAL MODEL:
//   Never call an LLM provider directly from the browser with a secret key.
//   Stand up a thin backend route (e.g. /api/generate) that holds the API key
//   server-side and forwards { task, payload } to your provider of choice
//   (Anthropic, OpenAI, etc). Set VITE_API_BASE_URL in a .env file to point
//   here — see README.md.
//
//   Until that backend exists, every function below falls back to a local,
//   template-based generator so the app is fully demoable with zero setup.
// ---------------------------------------------------------------------------

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

async function callBackend(task, payload) {
  if (!API_BASE_URL) return null
  try {
    const res = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, payload })
    })
    if (!res.ok) throw new Error(`Backend responded ${res.status}`)
    const data = await res.json()
    return data.result
  } catch (err) {
    console.warn(`[aiService] backend call failed for "${task}", using local fallback:`, err.message)
    return null
  }
}

export async function generateResume(form) {
  const remote = await callBackend('generate_resume', form)
  if (remote) return remote

  const { name, role, summary, experience = [], education = [], skills = [] } = form
  return [
    `${name || 'Your Name'}`,
    `${role || 'Target Role'}`,
    '',
    'SUMMARY',
    summary || `Results-driven ${role || 'professional'} with a track record of shipping measurable outcomes.`,
    '',
    'EXPERIENCE',
    ...experience.flatMap(e => [
      `${e.title || 'Role'} — ${e.company || 'Company'} (${e.dates || 'Dates'})`,
      ...(e.bullets || ['Delivered impact using quantifiable action-verb bullets.']).map(b => `  • ${b}`)
    ]),
    '',
    'EDUCATION',
    ...education.map(ed => `${ed.degree || 'Degree'} — ${ed.school || 'School'} (${ed.year || 'Year'})`),
    '',
    'SKILLS',
    (skills.length ? skills : ['Add your core skills here']).join(' · ')
  ].join('\n')
}

export async function generateCoverLetter(form) {
  const remote = await callBackend('generate_cover_letter', form)
  if (remote) return remote

  const { name, company, role, highlight } = form
  return `Dear Hiring Team at ${company || '[Company]'},

I'm writing to apply for the ${role || '[Role]'} position. ${highlight || 'My background aligns closely with what this role needs, and I bring a habit of turning ambiguous problems into shipped, measured results.'}

I'd welcome the chance to talk through how I can contribute to your team.

Sincerely,
${name || '[Your Name]'}`
}

export async function breakdownTask(description) {
  const remote = await callBackend('breakdown_task', { description })
  if (remote) return remote

  // Local heuristic: turn a free-text goal into a generic but sane build sequence.
  return [
    'Define the scope and success criteria in one paragraph',
    'List the concrete deliverables and constraints',
    'Sketch the architecture or outline before writing anything',
    'Build the smallest working version end-to-end',
    'Fill in the remaining features one at a time',
    'Test against the original success criteria',
    'Polish, document, and ship'
  ].map((text, i) => ({ id: `${Date.now()}-${i}`, text, done: false }))
}

export async function chatReply(messages) {
  const remote = await callBackend('chat', { messages })
  if (remote) return remote

  const last = messages[messages.length - 1]?.content || ''
  return `(Local demo mode — connect a backend for real answers.) I heard: "${last.slice(0, 140)}". Once VITE_API_BASE_URL is set, I'll reason over your full conversation and any attached documents.`
}

export async function summarizeDocument(text, fileName) {
  const remote = await callBackend('summarize_document', { text, fileName })
  if (remote) return remote

  const trimmed = text.trim().replace(/\s+/g, ' ')
  const preview = trimmed.slice(0, 400)
  return `(Local demo mode) Extracted ${trimmed.length.toLocaleString()} characters from ${fileName}. First excerpt:\n\n"${preview}${trimmed.length > 400 ? '…' : ''}"\n\nConnect a backend to get a real AI summary here.`
}
