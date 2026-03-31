import { useState, useEffect, useRef, useCallback } from 'react'

function getTargetMidnight() {
  const now = new Date()
  const target = new Date(now)
  target.setHours(24, 0, 0, 0)
  return target.getTime()
}

export function useCountdown() {
  const [target] = useState(getTargetMidnight)
  const [now, setNow] = useState(Date.now())
  const [muted, setMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const audio = new Audio('/ticking.wav')
    audio.loop = true
    audio.volume = 0.3
    audioRef.current = audio

    const start = () => {
      if (!startedRef.current) {
        audio.play().catch(() => {})
        startedRef.current = true
      }
      document.removeEventListener('click', start)
      document.removeEventListener('touchstart', start)
    }
    document.addEventListener('click', start)
    document.addEventListener('touchstart', start)

    return () => {
      audio.pause()
      document.removeEventListener('click', start)
      document.removeEventListener('touchstart', start)
    }
  }, [])

  // Sync muted state
  useEffect(() => {
    if (!audioRef.current) return
    if (muted) {
      audioRef.current.pause()
    } else if (startedRef.current) {
      audioRef.current.play().catch(() => {})
    }
  }, [muted])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const ms = target - now
  const expired = ms <= 0

  useEffect(() => {
    if (expired && audioRef.current) {
      audioRef.current.pause()
    }
  }, [expired])

  const toggleMute = useCallback(() => setMuted((m) => !m), [])

  if (expired) return { h: '00', m: '00', s: '00', expired: true, muted, toggleMute }

  const totalSeconds = Math.floor(ms / 1000)
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const s = String(totalSeconds % 60).padStart(2, '0')
  return { h, m, s, expired: false, muted, toggleMute }
}
