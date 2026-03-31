import { AccommodationCard } from './AccommodationCard'

interface AccommodationListProps {
  accommodations: { _id: string; url: string; title: string; imageUrl?: string }[]
  scores: Record<string, number>
  votes: { _id: string; accommodationId: string; userName: string; stars: number }[]
  comments: { _id: string; accommodationId: string; userName: string; type: 'pro' | 'con'; text: string }[]
  userName: string
  userVotes: { _id: string; accommodationId: string; userName: string; stars: number }[]
  onVote: (accommodationId: string, stars: 1 | 2 | 3) => void
  onRemoveVote: (accommodationId: string) => void
  onAddComment: (accommodationId: string, type: 'pro' | 'con', text: string) => void
  onDeleteComment: (id: string) => void
  onDeleteAccommodation: (id: string) => void
}

export function AccommodationList({
  accommodations,
  scores,
  votes,
  comments,
  userName,
  userVotes,
  onVote,
  onRemoveVote,
  onAddComment,
  onDeleteComment,
  onDeleteAccommodation,
}: AccommodationListProps) {
  const sorted = [...accommodations].sort(
    (a, b) => (scores[b._id] || 0) - (scores[a._id] || 0)
  )

  if (accommodations.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="text-5xl mb-4 opacity-60">🏠</div>
        <p className="text-text-muted text-base">No places added yet</p>
        <p className="text-text-muted text-sm mt-1">
          Tap the <span className="text-amber font-600">+</span> button to add one
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {sorted.map((accommodation, i) => (
        <AccommodationCard
          key={accommodation._id}
          accommodation={accommodation}
          accommodations={accommodations}
          score={scores[accommodation._id] || 0}
          votes={votes.filter(
            (v) => v.accommodationId === accommodation._id
          )}
          comments={comments.filter(
            (c) => c.accommodationId === accommodation._id
          )}
          userName={userName}
          userVotes={userVotes}
          onVote={onVote}
          onRemoveVote={onRemoveVote}
          onAddComment={onAddComment}
          onDeleteComment={onDeleteComment}
          onDelete={onDeleteAccommodation}
          index={i}
        />
      ))}
    </div>
  )
}
