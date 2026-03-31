interface VoteOverviewProps {
  votes: { _id: string; accommodationId: string; userName: string; stars: number }[]
  accommodations: { _id: string; title: string; imageUrl?: string }[]
  onSelectAccommodation: (id: string) => void
}

export function VoteOverview({ votes, accommodations, onSelectAccommodation }: VoteOverviewProps) {
  // Group votes by user
  const byUser = new Map<string, { accommodationId: string; stars: number }[]>()
  for (const v of votes) {
    const list = byUser.get(v.userName) ?? []
    list.push({ accommodationId: v.accommodationId, stars: v.stars })
    byUser.set(v.userName, list)
  }

  const getTitle = (accId: string) =>
    accommodations.find((a) => a._id === accId)?.title ?? '???'

  const users = [...byUser.entries()].sort((a, b) => a[0].localeCompare(b[0]))

  if (users.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="text-5xl mb-4 opacity-60">🗳️</div>
        <p className="text-text-muted text-base">Nimeni n-a votat încă</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {users.map(([userName, userVotes], i) => {
        const sorted = [...userVotes].sort((a, b) => b.stars - a.stars)
        return (
          <div
            key={userName}
            className="animate-fade-in rounded-2xl bg-bg-card border border-border p-4"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-full bg-amber/20 text-amber text-xs font-600 flex items-center justify-center">
                {userName[0].toUpperCase()}
              </span>
              <span className="text-text-bright font-600 text-sm">{userName}</span>
            </div>
            <div className="space-y-1.5">
              {sorted.map((v) => (
                <button
                  key={v.accommodationId}
                  onClick={() => onSelectAccommodation(v.accommodationId)}
                  className="flex items-center gap-2 text-sm w-full text-left hover:bg-bg-elevated rounded-lg px-1 -mx-1 py-0.5 transition-colors"
                >
                  <span className="text-amber font-600 shrink-0 whitespace-nowrap w-16 inline-block">
                    {'🍌'.repeat(v.stars)}
                  </span>
                  <span className="text-text truncate hover:text-amber transition-colors">{getTitle(v.accommodationId)}</span>
                </button>
              ))}
              {sorted.length < 3 && (
                <p className="text-xs text-text-muted italic">
                  {3 - sorted.length} {sorted.length === 2 ? 'vot' : 'voturi'} rămase
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
