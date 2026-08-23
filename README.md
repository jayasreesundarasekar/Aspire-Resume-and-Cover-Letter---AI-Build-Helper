# Aspire

Mission control for your career: an ATS-friendly resume & cover letter builder,
an ATS score checker, a task-breakdown planner with calendar + streaks, an
arcade break, and **Alita** — a multilingual AI agent with voice and document
analysis.

Built with React + Vite + Tailwind. No backend is required to demo it — every
AI feature has a local fallback — but the app is architected so you can drop
in a real model and a real voice in a few minutes.

## Run it

```bash
npm install
npm run dev
```

Open the printed local URL. You'll see a falling-glitter intro the first
time you open the app each session, then a sign-in screen. Everything
persists to `localStorage`, so your account, resumes, tasks, streak, ATS
history, and chats survive a refresh.

## Accounts

Sign-up/login is fully functional but **demo-only**: accounts are stored in
plain text in `localStorage` via `src/context/AuthContext.jsx`, with no
hashing, sessions, or server. That's fine for a capstone demo, but replace
it with a real backend (hashed passwords, HTTPS, real sessions/JWTs) before
this ever touches real user data.

## Project structure

```
src/
  pages/            one file per route (Login, Signup, Dashboard, Resume, Cover Letter, ATS, Tasks, Arcade, Alita)
  components/
    auth/            route guard (ProtectedRoute)
    common/           shared UI + IntroSplash (the glitter intro)
    layout/           the app shell (sidebar, streak, account)
    ...               feature components per module
  services/
    aiService.js    every LLM-backed feature funnels through here
    voiceService.js Alita's voice — provider interface (browser TTS/STT today, custom voice later)
    atsService.js   local, offline heuristic ATS scorer
  context/
    AppContext.jsx   app data (resumes, tasks, streak, chats), persisted to localStorage
    AuthContext.jsx  demo account system, persisted to localStorage
  data/languages.js 40 languages Alita can speak/listen in
```

## Wiring a real AI model

`src/services/aiService.js` calls `POST {VITE_API_BASE_URL}/api/generate`
with `{ task, payload }` and expects `{ result }` back. Stand up a tiny
backend route that holds your API key server-side (never call an LLM
provider directly from the browser with a secret key), forward to your
model of choice, and set `VITE_API_BASE_URL` in a `.env` file:

```
VITE_API_BASE_URL=https://your-backend.example.com
```

Until you do, every feature (resume drafting, cover letters, task breakdown,
chat, document summarization) runs on a local template fallback so the app
is fully demoable with zero setup. The ATS score checker is intentionally
**fully local** — no API needed, ever.

## Wiring Alita's custom voice

`src/services/voiceService.js` exports `getVoiceProvider(name)`:

- `'browser'` (default) — uses the Web Speech API. Free, works offline,
  supports the 40 languages in `data/languages.js`, but sounds robotic and
  voice quality/language coverage varies by browser/OS.
- `'elevenlabs'` — a ready-to-fill adapter. Point it at a backend route
  (`/api/voice/speak`) that calls ElevenLabs (or any TTS provider) with your
  cloned voice ID and streams audio back. Swap `settings.voiceProvider` to
  `'elevenlabs'` once that route exists — no UI code changes needed.

Speech-to-text (the mic button) always uses the browser's built-in
`SpeechRecognition` API today.

## Document analysis

PDF text extraction runs client-side via `pdf.js` (`FileUpload.jsx`), then
the extracted text goes through `summarizeDocument()` in `aiService.js` —
so once your backend is wired, PDF summarization works immediately.

Audio/video transcription needs a server (e.g. Whisper) — the file is
handed off with a placeholder message until that route exists.

## Notes on scope

This is a real, working frontend for every feature that doesn't require a
paid third-party account (ATS scoring, resume/cover-letter drafting UI,
task breakdown, calendar, streaks, the arcade game, chat, voice UI, PDF
text extraction). AI generation quality and true custom-voice audio depend
on the backend you connect — the seams for both are already built.
