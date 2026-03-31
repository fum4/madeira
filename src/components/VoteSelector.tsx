import { useState } from 'react'

interface VoteSelectorProps {
  accommodationId: string
  userVotes: { _id: string; accommodationId: string; userName: string; stars: number }[]
  accommodations: { _id: string; title: string; imageUrl?: string }[]
  onVote: (accommodationId: string, stars: 1 | 2 | 3) => void
  onRemoveVote: (accommodationId: string) => void
}

const starSounds: Record<number, string> = {
  1: '/1_star.mp3',
  2: '/2_stars.wav',
  3: '/3_stars.wav',
}

function playVoteSound(stars: 1 | 2 | 3) {
  new Audio(starSounds[stars]).play().catch(() => {})
}

const starLabels = [
  { stars: 3 as const, label: '🍌🍌🍌', description: 'E ce tre frate' },
  { stars: 2 as const, label: '🍌🍌', description: 'Hai cǎ merge' },
  { stars: 1 as const, label: '🍌', description: 'Sǎ zicem' },
]

export function VoteSelector({
  accommodationId,
  userVotes,
  accommodations,
  onVote,
  onRemoveVote,
}: VoteSelectorProps) {
  const [pendingVote, setPendingVote] = useState<{
    stars: 1 | 2 | 3
    existingTitle: string
    existingImageUrl?: string
    existingStars: number
  } | null>(null)

  const currentVote = userVotes.find(
    (v) => v.accommodationId === accommodationId
  )

  const getExistingHolder = (stars: 1 | 2 | 3) => {
    const existing = userVotes.find(
      (v) => v.stars === stars && v.accommodationId !== accommodationId
    )
    if (!existing) return null
    return accommodations.find((a) => a._id === existing.accommodationId)
  }

  const handleVoteClick = (stars: 1 | 2 | 3) => {
    if (currentVote?.stars === stars) {
      onRemoveVote(accommodationId)
      return
    }

    const existingHolder = getExistingHolder(stars)
    if (existingHolder) {
      setPendingVote({
        stars,
        existingTitle: existingHolder.title,
        existingImageUrl: existingHolder.imageUrl,
        existingStars: stars,
      })
    } else {
      onVote(accommodationId, stars)
      playVoteSound(stars)
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-text-muted font-500 uppercase tracking-wider">
        Votul tǎu
      </p>
      <div className="flex gap-2">
        {starLabels.map(({ stars, label, description }) => {
          const isActive = currentVote?.stars === stars

          return (
            <button
              key={stars}
              onClick={() => handleVoteClick(stars)}
              className={`
                flex-1 rounded-lg py-2.5 px-2 text-center transition-all active:scale-95
                ${
                  isActive
                    ? 'bg-amber/20 border-amber/50 text-amber border shadow-[0_0_12px_rgba(240,160,48,0.15)]'
                    : 'bg-bg-input border border-border text-text-muted hover:text-text hover:border-border-light'
                }
              `}
            >
              <div className={`text-base ${isActive ? '' : 'grayscale opacity-50'}`}>
                {label}
              </div>
              <div className="text-[10px] mt-0.5 opacity-70">{description}</div>
            </button>
          )
        })}
      </div>
      {currentVote && (
        <p className="text-xs text-amber/70 text-center">
          You gave this place {currentVote.stars}🍌
        </p>
      )}

      {/* Confirmation dialog */}
      {pendingVote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={() => setPendingVote(null)}
        >
          <div className="absolute inset-0 bg-bg-overlay animate-fade-in" />
          <div
            className="relative animate-fade-in-scale bg-bg-card border border-border rounded-2xl overflow-hidden max-w-xs w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {pendingVote.existingImageUrl && (
              <div className="aspect-[16/9]">
                <img
                  src={pendingVote.existingImageUrl}
                  alt={pendingVote.existingTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
           <div className="p-5 space-y-4">
            <div className="text-3xl text-amber">
              {'🍌'.repeat(pendingVote.existingStars)}
            </div>
            <p className="text-sm text-text-bright leading-relaxed">
              You already gave <span className="font-600 text-amber">{pendingVote.existingStars}🍌</span> to{' '}
              <span className="font-600 text-text-bright">"{pendingVote.existingTitle}"</span>.
              Move it here instead?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPendingVote(null)}
                className="flex-1 rounded-xl bg-bg-elevated border border-border px-4 py-2.5 text-sm text-text hover:text-text-bright hover:border-border-light transition-colors"
              >
                Am greşit boss
              </button>
              <button
                onClick={() => {
                  onVote(accommodationId, pendingVote.stars)
                  playVoteSound(pendingVote.stars)
                  setPendingVote(null)
                }}
                className="flex-1 rounded-xl bg-amber text-bg font-600 text-sm px-4 py-2.5 hover:bg-amber-bright transition-colors active:scale-[0.98]"
              >
                Schimb votul
              </button>
            </div>
           </div>
          </div>
        </div>
      )}
    </div>
  )
}
