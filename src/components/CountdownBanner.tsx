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

interface CountdownBannerProps {
  h: string
  m: string
  s: string
  expired: boolean
}

export function CountdownBanner({ h, m, s, expired }: CountdownBannerProps) {
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
          {expired ? 'Timpul amea!' : 'Ştiți bancul cu timpul?'}
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
