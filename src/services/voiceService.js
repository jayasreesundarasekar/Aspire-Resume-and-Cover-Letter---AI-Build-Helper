// ---------------------------------------------------------------------------
// voiceService.js
//
// Alita's voice runs through a provider interface so the app can start on
// the free, built-in browser voice and later swap in a custom cloned voice
// (e.g. ElevenLabs) without touching any UI code.
//
// Every provider implements: speak(text, lang) and listen() -> Promise<string>
// ---------------------------------------------------------------------------

class BrowserVoiceProvider {
  speak(text, lang = 'en-US') {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) return reject(new Error('Speech synthesis unsupported'))
      window.speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = lang
      const voices = window.speechSynthesis.getVoices()
      const match = voices.find(v => v.lang === lang) || voices.find(v => v.lang?.startsWith(lang.split('-')[0]))
      if (match) utter.voice = match
      utter.onend = resolve
      utter.onerror = e => reject(e.error || new Error('Speech synthesis failed'))
      window.speechSynthesis.speak(utter)
    })
  }

  stop() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  }

  listen(lang = 'en-US') {
    return new Promise((resolve, reject) => {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SR) return reject(new Error('Speech recognition unsupported in this browser'))
      const recognition = new SR()
      recognition.lang = lang
      recognition.interimResults = false
      recognition.maxAlternatives = 1
      recognition.onresult = e => resolve(e.results[0][0].transcript)
      recognition.onerror = e => reject(new Error(e.error))
      recognition.start()
    })
  }
}

// Ready-to-fill adapter for a custom/cloned voice provider. Wire this to your
// own backend route (never call ElevenLabs directly from the browser with a
// secret key) that returns an audio stream for `text`, then play it here.
class ElevenLabsVoiceProvider {
  constructor({ apiBaseUrl, voiceId } = {}) {
    this.apiBaseUrl = apiBaseUrl
    this.voiceId = voiceId
  }

  async speak(text) {
    if (!this.apiBaseUrl || !this.voiceId) {
      throw new Error('Custom voice not configured yet — set apiBaseUrl and voiceId in settings.')
    }
    const res = await fetch(`${this.apiBaseUrl}/api/voice/speak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceId: this.voiceId })
    })
    if (!res.ok) throw new Error('Custom voice request failed')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    return audio.play()
  }

  stop() {
    // no-op placeholder — track the Audio instance per call if you need stop control
  }

  listen() {
    return new BrowserVoiceProvider().listen()
  }
}

export function getVoiceProvider(providerName, config = {}) {
  if (providerName === 'elevenlabs') return new ElevenLabsVoiceProvider(config)
  return new BrowserVoiceProvider()
}
