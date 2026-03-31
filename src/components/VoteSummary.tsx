interface VoteSummaryProps {
  votes: { _id: string; userName: string; stars: number }[]
  currentUser: string
}

export function VoteSummary({ votes, currentUser }: VoteSummaryProps) {
  if (votes.length === 0) return null

  const sorted = [...votes].sort((a, b) => b.stars - a.stars)

  return (
    <div className="flex flex-wrap gap-1.5">
      {sorted.map((v) => (
        <div
          key={v._id}
          className={`
            flex items-center gap-1 rounded-full px-2 py-0.5 text-xs
            ${
              v.userName === currentUser
                ? 'bg-amber/15 text-amber border border-amber/20'
                : 'bg-bg-elevated text-text-muted border border-border'
            }
          `}
        >
          <span className="font-500">{v.userName}</span>
          <span className="text-amber">{'★'.repeat(v.stars)}</span>
        </div>
      ))}
    </div>
  )
}
