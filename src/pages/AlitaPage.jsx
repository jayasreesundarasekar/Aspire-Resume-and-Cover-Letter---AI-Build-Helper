import { useState } from 'react'
import { Plus, MessageSquare, Trash2 } from 'lucide-react'
import ChatWindow from '../components/alita/ChatWindow.jsx'
import { chatReply } from '../services/aiService.js'
import { useApp } from '../context/AppContext.jsx'

function newChat() {
  return { id: crypto.randomUUID(), title: 'New chat', messages: [], createdAt: Date.now() }
}

export default function AlitaPage() {
  const { state, setState, touchStreak } = useApp()
  const [activeId, setActiveId] = useState(state.chats[0]?.id || null)
  const [busy, setBusy] = useState(false)

  const chats = state.chats
  const active = chats.find(c => c.id === activeId) || null

  function ensureActive() {
    if (active) return active
    const c = newChat()
    setState(s => ({ ...s, chats: [c, ...s.chats] }))
    setActiveId(c.id)
    return c
  }

  function updateChat(id, updater) {
    setState(s => ({ ...s, chats: s.chats.map(c => c.id === id ? updater(c) : c) }))
  }

  async function handleSend(text, opts = {}) {
    const chat = ensureActive()
    const id = chat.id
    const userMsg = { role: opts.asAssistant ? 'assistant' : 'user', content: text, at: Date.now() }

    updateChat(id, c => ({
      ...c,
      title: c.messages.length === 0 && !opts.asAssistant ? text.slice(0, 40) : c.title,
      messages: [...c.messages, userMsg]
    }))
    touchStreak()

    if (opts.skipReply || opts.asAssistant) return

    setBusy(true)
    try {
      const currentMessages = [...chat.messages, userMsg]
      const reply = await chatReply(currentMessages)
      updateChat(id, c => ({ ...c, messages: [...c.messages, { role: 'assistant', content: reply, at: Date.now() }] }))
    } finally {
      setBusy(false)
    }
  }

  function updateSettings(next) {
    setState(s => ({ ...s, settings: next }))
  }

  function startNewChat() {
    const c = newChat()
    setState(s => ({ ...s, chats: [c, ...s.chats] }))
    setActiveId(c.id)
  }

  function deleteChat(id) {
    setState(s => ({ ...s, chats: s.chats.filter(c => c.id !== id) }))
    if (activeId === id) setActiveId(null)
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="px-8 pt-8 pb-4">
        <p className="mono-tick text-xs text-signal uppercase tracking-widest mb-2">Module 04</p>
        <h1 className="font-display text-3xl font-semibold">Alita</h1>
        <p className="text-muted text-sm mt-1">Your AI agent — chat, voice, and document analysis in one place.</p>
      </div>

      <div className="flex-1 flex min-h-0 mx-8 mb-8 border border-line rounded-xl overflow-hidden bg-surface">
        <aside className="w-60 shrink-0 border-r border-line flex flex-col">
          <button onClick={startNewChat} className="flex items-center gap-2 m-3 px-3 py-2 rounded-lg bg-surface2 border border-line text-sm text-ink hover:border-signal">
            <Plus size={14} /> New chat
          </button>
          <div className="flex-1 overflow-y-auto scrollbar-thin px-2 space-y-1">
            {chats.map(c => (
              <div key={c.id}
                className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer ${c.id === activeId ? 'bg-surface2 text-ink' : 'text-muted hover:text-ink'}`}
                onClick={() => setActiveId(c.id)}>
                <MessageSquare size={13} className="shrink-0" />
                <span className="truncate flex-1">{c.title}</span>
                <button onClick={e => { e.stopPropagation(); deleteChat(c.id) }} className="opacity-0 group-hover:opacity-100 text-muted hover:text-danger">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <ChatWindow
            messages={active?.messages || []}
            onSend={handleSend}
            busy={busy}
            settings={state.settings}
            onSettingsChange={updateSettings}
          />
        </div>
      </div>
    </div>
  )
}
