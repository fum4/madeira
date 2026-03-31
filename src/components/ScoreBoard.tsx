interface ScoreBoardProps {
  accommodations: { _id: string; title: string }[]
  scores: Record<string, number>
}

export function ScoreBoard({ accommodations, scores }: ScoreBoardProps) {
  if (accommodations.length === 0) return null

  const ranked = accommodations
    .map((a) => ({ ...a, score: scores[a._id] || 0 }))
    .filter((a) => a.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  if (ranked.length === 0) return null

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none px-4 -mx-4">
      {ranked.map((a, i) => (
        <div
          key={a._id}
          className="flex-shrink-0 flex items-center gap-2 rounded-full bg-bg-elevated border border-border px-3 py-1.5 text-sm animate-fade-in"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <span className="text-base">{medals[i] ?? `#${i + 1}`}</span>
          <span className="text-text-bright font-500 truncate max-w-[120px]">
            {a.title}
          </span>
          <span className="text-amber font-600 tabular-nums">{a.score}🍌</span>
        </div>
      ))}
    </div>
  )
}
