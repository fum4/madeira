import { useState } from 'react'
import { VoteSelector } from './VoteSelector'
import { VoteSummary } from './VoteSummary'
import { CommentSection } from './CommentSection'

interface AccommodationCardProps {
  accommodation: { _id: string; url: string; title: string; imageUrl?: string }
  accommodations: { _id: string; title: string }[]
  score: number
  votes: { _id: string; accommodationId: string; userName: string; stars: number }[]
  comments: { _id: string; accommodationId: string; userName: string; type: 'pro' | 'con'; text: string }[]
  userName: string
  userVotes: { _id: string; accommodationId: string; userName: string; stars: number }[]
  onVote: (accommodationId: string, stars: 1 | 2 | 3) => void
  onRemoveVote: (accommodationId: string) => void
  onAddComment: (accommodationId: string, type: 'pro' | 'con', text: string) => void
  onDeleteComment: (id: string) => void
  onDelete: (id: string) => void
  index: number
}

export function AccommodationCard({
  accommodation,
  accommodations,
  score,
  votes,
  comments,
  userName,
  userVotes,
  onVote,
  onRemoveVote,
  onAddComment,
  onDeleteComment,
  onDelete,
  index,
}: AccommodationCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const currentUserVote = votes.find((v) => v.userName === userName)
  const pros = comments.filter((c) => c.type === 'pro').length
  const cons = comments.filter((c) => c.type === 'con').length

  const domain = (() => {
    try {
      return new URL(accommodation.url).hostname.replace('www.', '')
    } catch {
      return ''
    }
  })()

  return (
    <div
      className="animate-fade-in rounded-2xl bg-bg-card border border-border overflow-hidden transition-all hover:border-border-light"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {accommodation.imageUrl && (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={accommodation.imageUrl}
            alt={accommodation.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3.5 flex items-start gap-3"
      >
        <div
          className={`
            shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center text-center
            ${
              score > 0
                ? 'bg-amber-dim border border-amber/20 text-amber'
                : 'bg-bg-elevated border border-border text-text-muted'
            }
          `}
        >
          <span className="text-lg font-700 leading-none">{score}</span>
          <span className="text-[9px] opacity-60">pts</span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-text-bright font-600 text-base leading-snug truncate">
            {accommodation.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
            {domain && <span>{domain}</span>}
            {currentUserVote && (
              <span className="text-amber">
                {'★'.repeat(currentUserVote.stars)}
              </span>
            )}
          </div>
          {(pros > 0 || cons > 0) && (
            <div className="flex gap-1.5 mt-1.5">
              {pros > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-dim text-green border border-green/10">
                  +{pros}
                </span>
              )}
              {cons > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-dim text-red border border-red/10">
                  −{cons}
                </span>
              )}
            </div>
          )}
        </div>

        <svg
          className={`shrink-0 w-4 h-4 text-text-muted transition-transform mt-1 ${
            expanded ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="animate-fade-in px-4 pb-4 space-y-4 border-t border-border pt-4">
          <a
            href={accommodation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-amber hover:text-amber-bright transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Vezi cocioaba
          </a>

          <VoteSummary votes={votes} currentUser={userName} />

          <VoteSelector
            accommodationId={accommodation._id}
            userVotes={userVotes}
            accommodations={accommodations}
            onVote={onVote}
            onRemoveVote={onRemoveVote}
          />

          <CommentSection
            comments={comments}
            userName={userName}
            onAdd={(type, text) => onAddComment(accommodation._id, type, text)}
            onDelete={onDeleteComment}
          />

          <button
            onClick={() => setShowDeleteDialog(true)}
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-red transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Şterge cocioaba
          </button>
        </div>
      )}

      {showDeleteDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={() => setShowDeleteDialog(false)}
        >
          <div className="absolute inset-0 bg-bg-overlay animate-fade-in" />
          <div
            className="relative animate-fade-in-scale bg-bg-card border border-border rounded-2xl overflow-hidden w-screen max-w-sm text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {accommodation.imageUrl && (
              <div className="aspect-[16/9]">
                <img
                  src={accommodation.imageUrl}
                  alt={accommodation.title}
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
            )}
            <div className="p-5 space-y-4">
              <div className="text-3xl">🗑️</div>
              <p className="text-sm text-text-bright leading-relaxed">
                Arunci cocioaba la gunoi?
                <br />
                <span className="text-text-muted text-xs">Voturile şi comentariile vor dispărea.</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="flex-1 rounded-xl bg-bg-elevated border border-border px-4 py-2.5 text-sm text-text hover:text-text-bright hover:border-border-light transition-colors"
                >
                  Am greşit boss
                </button>
                <button
                  onClick={() => {
                    onDelete(accommodation._id)
                    setShowDeleteDialog(false)
                  }}
                  className="flex-1 rounded-xl bg-red/90 text-white font-600 text-sm px-4 py-2.5 hover:bg-red transition-colors active:scale-[0.98]"
                >
                  Dǎ-o-n plm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
