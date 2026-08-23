import { useEffect, useRef, useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '../common/UI.jsx'
import VoiceControls from './VoiceControls.jsx'
import FileUpload from './FileUpload.jsx'
import { summarizeDocument } from '../../services/aiService.js'
import { getVoiceProvider } from '../../services/voiceService.js'

export default function ChatWindow({ messages, onSend, busy, settings, onSettingsChange }) {
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!settings.autoSpeak) return
    const last = messages[messages.length - 1]
    if (last?.role === 'assistant') {
      getVoiceProvider(settings.voiceProvider).speak(last.content, settings.language).catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length])

  function submit() {
    if (!input.trim() || busy) return
    onSend(input.trim())
    setInput('')
  }

  async function handleFile(result) {
    if (result.kind === 'error') {
      onSend(`(attached ${result.fileName} — could not read file: ${result.error})`, { skipReply: true })
      return
    }
    if (result.kind === 'audio' || result.kind === 'video') {
      onSend(`Attached ${result.fileName}. Transcribing audio/video needs a connected backend (e.g. Whisper) — see README for wiring it up.`, { skipReply: true, asAssistant: true })
      return
    }
    onSend(`📎 Attached ${result.fileName}`, { skipReply: true })
    const summary = await summarizeDocument(result.text, result.fileName)
    onSend(summary, { asAssistant: true })
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5 space-y-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted">Say hello to Alita, or attach a document to summarize.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap
              ${m.role === 'user' ? 'bg-amber text-ink' : 'bg-surface2 text-ink border border-line'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="bg-surface2 border border-line rounded-xl px-4 py-2.5">
              <Loader2 size={14} className="animate-spin text-signal" />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-line px-4 py-3">
        <div className="mb-2">
          <VoiceControls
            settings={settings}
            onSettingsChange={onSettingsChange}
            onTranscript={(text, err) => text ? setInput(prev => (prev ? prev + ' ' : '') + text) : null}
          />
        </div>
        <div className="flex items-center gap-2">
          <FileUpload onExtracted={handleFile} />
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Message Alita…"
            className="flex-1 bg-surface2 border border-line rounded-lg px-3 py-2 text-sm outline-none focus:border-signal"
          />
          <Button onClick={submit} disabled={busy || !input.trim()}><Send size={15} /></Button>
        </div>
      </div>
    </div>
  )
}
