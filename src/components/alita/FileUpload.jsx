import { useRef, useState } from 'react'
import { Paperclip, Loader2 } from 'lucide-react'
import { Button } from '../common/UI.jsx'

// Lazily import pdfjs only when a PDF is actually uploaded, keeping initial bundle light.
async function extractPdfText(file) {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString()

  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
  let text = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map(it => it.str).join(' ') + '\n'
  }
  return text
}

export default function FileUpload({ onExtracted }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      if (file.type === 'application/pdf') {
        const text = await extractPdfText(file)
        onExtracted({ fileName: file.name, kind: 'pdf', text })
      } else if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
        // Transcription needs a backend (e.g. Whisper) — hand off the file
        // reference and let the connected backend transcribe it server-side.
        onExtracted({ fileName: file.name, kind: file.type.startsWith('audio/') ? 'audio' : 'video', text: '', file })
      } else {
        const text = await file.text()
        onExtracted({ fileName: file.name, kind: 'text', text })
      }
    } catch (err) {
      onExtracted({ fileName: file.name, kind: 'error', text: '', error: err.message })
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  return (
    <>
      <input ref={inputRef} type="file" hidden accept=".pdf,.txt,.md,audio/*,video/*" onChange={handleFile} />
      <Button variant="ghost" onClick={() => inputRef.current?.click()} disabled={busy}>
        {busy ? <Loader2 size={16} className="animate-spin" /> : <Paperclip size={16} />}
      </Button>
    </>
  )
}
