import { useState, useEffect } from 'react'

function getTargetMidnight() {
  const now = new Date()
  const target = new Date(now)
  target.setHours(24, 0, 0, 0)
  return target.getTime()
}

function formatTimeLeft(ms: number) {
  if (ms <= 0) return { h: '00', m: '00', s: '00', expired: true }
  const totalSeconds = Math.floor(ms / 1000)
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const s = String(totalSeconds % 60).padStart(2, '0')
  return { h, m, s, expired: false }
}

function SingleDigit({ char }: { char: string }) {
  return (
    <span className="inline-block overflow-hidden h-[1.2em] w-[0.65em] relative">
      <span
        key={char}
        className="inline-block animate-[digit-in_0.25s_ease-out]"
      >
        {char}
      </span>
    </span>
  )
}

function AnimatedValue({ value }: { value: string }) {
  return (
    <>
      {value.split('').map((char, i) => (
        <SingleDigit key={`${i}-${char}`} char={char} />
      ))}
    </>
  )
}

export function CountdownBanner() {
  const [target] = useState(getTargetMidnight)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const { h, m, s, expired } = formatTimeLeft(target - now)

  return (
    <>
      <style>{`
        @keyframes digit-in {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div className="bg-amber-dim border border-amber/15 rounded-xl px-4 py-3 flex flex-col items-center gap-1.5">
        <span className="text-[12px] text-amber font-500 tracking-widest">
          {expired ? 'Timpul a expirat!' : 'Ştiți bancul cu timpu?'}
        </span>
        {!expired && (
          <div className="flex items-baseline gap-1 font-[var(--font-display)] text-text-bright text-2xl font-700 tabular-nums">
            <AnimatedValue value={h} />
            <span className="text-text-muted mx-1">:</span>
            <AnimatedValue value={m} />
            <span className="text-text-muted mx-1">:</span>
            <AnimatedValue value={s} />
          </div>
        )}
      </div>
    </>
  )
}
