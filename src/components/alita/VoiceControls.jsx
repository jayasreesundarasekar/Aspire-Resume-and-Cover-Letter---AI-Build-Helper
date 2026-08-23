import { useState } from 'react'
import { Mic, Volume2, VolumeX, Loader2 } from 'lucide-react'
import { LANGUAGES } from '../../data/languages.js'
import { getVoiceProvider } from '../../services/voiceService.js'

export default function VoiceControls({ settings, onSettingsChange, onTranscript }) {
  const [listening, setListening] = useState(false)
  const provider = getVoiceProvider(settings.voiceProvider)

  async function handleMic() {
    setListening(true)
    try {
      const transcript = await provider.listen(settings.language)
      onTranscript(transcript)
    } catch (err) {
      onTranscript('', err.message)
    } finally {
      setListening(false)
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select
        value={settings.language}
        onChange={e => onSettingsChange({ ...settings, language: e.target.value })}
        className="bg-surface2 border border-line rounded-lg px-2 py-1.5 text-xs text-ink mono-tick"
      >
        {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
      </select>

      <button
        onClick={() => onSettingsChange({ ...settings, autoSpeak: !settings.autoSpeak })}
        title={settings.autoSpeak ? 'Alita will speak replies' : 'Alita is muted'}
        className={`p-2 rounded-lg border ${settings.autoSpeak ? 'border-signal text-signal' : 'border-line text-muted'}`}
      >
        {settings.autoSpeak ? <Volume2 size={15} /> : <VolumeX size={15} />}
      </button>

      <button
        onClick={handleMic}
        disabled={listening}
        title="Speak to Alita"
        className={`p-2 rounded-lg border ${listening ? 'border-amber text-amber animate-pulse' : 'border-line text-muted hover:text-ink'}`}
      >
        {listening ? <Loader2 size={15} className="animate-spin" /> : <Mic size={15} />}
      </button>
    </div>
  )
}
