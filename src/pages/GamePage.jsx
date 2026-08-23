import { useEffect, useRef, useState } from 'react'
import { Panel } from '../components/common/UI.jsx'
import { useApp } from '../context/AppContext.jsx'

const W = 480, H = 560
const GRAVITY = 0.45, FLAP = -7.5, PIPE_GAP = 150, PIPE_W = 56, PIPE_SPEED = 2.4

function useBestScore() {
  const [best, setBest] = useState(() => Number(localStorage.getItem('aspire_flappy_best') || 0))
  const save = s => {
    if (s > best) {
      setBest(s)
      localStorage.setItem('aspire_flappy_best', String(s))
    }
  }
  return [best, save]
}

export default function GamePage() {
  const canvasRef = useRef(null)
  const stateRef = useRef(null)
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [best, saveBest] = useBestScore()
  const { touchStreak } = useApp()

  function reset() {
    stateRef.current = {
      birdY: H / 2, vel: 0, pipes: [{ x: W, gapY: 180 }], frame: 0, score: 0, dead: false
    }
    setScore(0)
  }

  function flap() {
    if (!running) { start(); return }
    if (stateRef.current && !stateRef.current.dead) stateRef.current.vel = FLAP
  }

  function start() {
    reset()
    setRunning(true)
    touchStreak()
  }

  useEffect(() => {
    if (!running) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf

    function loop() {
      const s = stateRef.current
      if (!s.dead) {
        s.vel += GRAVITY
        s.birdY += s.vel
        s.frame++

        if (s.frame % 95 === 0) s.pipes.push({ x: W, gapY: 80 + Math.random() * (H - 260) })
        s.pipes.forEach(p => { p.x -= PIPE_SPEED })
        if (s.pipes[0] && s.pipes[0].x < -PIPE_W) {
          s.pipes.shift()
          s.score++
          setScore(s.score)
        }

        const birdX = 90
        for (const p of s.pipes) {
          const inX = birdX + 16 > p.x && birdX - 16 < p.x + PIPE_W
          const inGap = s.birdY - 14 > p.gapY && s.birdY + 14 < p.gapY + PIPE_GAP
          if (inX && !inGap) s.dead = true
        }
        if (s.birdY > H - 20 || s.birdY < 0) s.dead = true
        if (s.dead) saveBest(s.score)
      }

      ctx.clearRect(0, 0, W, H)
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, '#FFFDF6')
      grad.addColorStop(1, '#F0DDA1')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      ctx.fillStyle = '#9C6B1E'
      s.pipes.forEach(p => {
        ctx.fillRect(p.x, 0, PIPE_W, p.gapY)
        ctx.fillRect(p.x, p.gapY + PIPE_GAP, PIPE_W, H - (p.gapY + PIPE_GAP))
      })

      ctx.fillStyle = '#C9971F'
      ctx.beginPath()
      ctx.arc(90, s.birdY, 14, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#2E2113'
      ctx.font = '600 28px "Space Grotesk", sans-serif'
      ctx.fillText(String(s.score), W / 2 - 8, 50)

      if (s.dead) {
        ctx.fillStyle = 'rgba(251,243,225,0.85)'
        ctx.fillRect(0, 0, W, H)
        ctx.fillStyle = '#2E2113'
        ctx.font = '600 24px "Space Grotesk", sans-serif'
        ctx.fillText('Tap or press space to retry', W / 2 - 150, H / 2)
        setRunning(false)
        return
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [running])

  useEffect(() => {
    function onKey(e) { if (e.code === 'Space') { e.preventDefault(); flap() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [running])

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      <p className="mono-tick text-xs text-signal uppercase tracking-widest mb-2">Arcade</p>
      <h1 className="font-display text-3xl font-semibold mb-2">Break Time</h1>
      <p className="text-muted mb-8 text-sm">A quick Flappy-Bird break between build sessions. Space, click, or tap to flap.</p>

      <Panel title="Best">
        <p className="font-display text-2xl text-amber mb-4">{best}</p>
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            onClick={flap}
            className="rounded-lg border border-line cursor-pointer"
          />
        </div>
        {!running && (
          <p className="text-center text-sm text-muted mt-4">Click the canvas to start</p>
        )}
      </Panel>
    </div>
  )
}
