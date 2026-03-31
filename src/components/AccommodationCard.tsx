import { useState, useEffect, useRef } from 'react'
import { VoteSelector } from './VoteSelector'
import { TagPicker } from './TagPicker'
import { getTag } from '../tags'
import { VoteSummary } from './VoteSummary'
import { CommentSection } from './CommentSection'

interface AccommodationCardProps {
  accommodation: { _id: string; url: string; title: string; imageUrl?: string; addedBy?: string; tag?: string }
  accommodations: { _id: string; title: string; imageUrl?: string }[]
  score: number
  votes: { _id: string; accommodationId: string; userName: string; stars: number }[]
  comments: { _id: string; accommodationId: string; userName: string; type: 'pro' | 'con'; text: string }[]
  commentReactions: { _id: string; commentId: string; userName: string; type: 'like' | 'dislike' }[]
  userName: string
  userVotes: { _id: string; accommodationId: string; userName: string; stars: number }[]
  onVote: (accommodationId: string, stars: 1 | 2 | 3) => void
  onRemoveVote: (accommodationId: string) => void
  onAddComment: (accommodationId: string, type: 'pro' | 'con', text: string) => void
  onDeleteComment: (id: string) => void
  onEditComment: (id: string, text: string) => void
  onToggleReaction: (commentId: string, type: 'like' | 'dislike') => void
  onDelete: (id: string) => void
  onEdit: (url: string, title: string, imageUrl?: string, tag?: string) => void
  index: number
  highlight?: boolean
  onHighlightDone?: () => void
}

export function AccommodationCard({
  accommodation,
  accommodations,
  score,
  votes,
  comments,
  commentReactions,
  userName,
  userVotes,
  onVote,
  onRemoveVote,
  onAddComment,
  onDeleteComment,
  onEditComment,
  onToggleReaction,
  onDelete,
  onEdit,
  index,
  highlight,
  onHighlightDone,
}: AccommodationCardProps) {
  const [expanded, setExpanded] = useState(highlight ?? false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editUrl, setEditUrl] = useState(accommodation.url)
  const [editTitle, setEditTitle] = useState(accommodation.title)
  const [editImageUrl, setEditImageUrl] = useState(accommodation.imageUrl ?? '')
  const [editTag, setEditTag] = useState<string | undefined>(accommodation.tag)
  const [showCopied, setShowCopied] = useState(false)
  const [showLinkCopied, setShowLinkCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const currentUserVote = votes.find((v) => v.userName === userName)
  const pros = comments.filter((c) => c.type === 'pro').length
  const cons = comments.filter((c) => c.type === 'con').length

  // Handle highlight from share link
  useEffect(() => {
    if (highlight && cardRef.current) {
      setExpanded(true)
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Clear highlight after animation
        setTimeout(() => onHighlightDone?.(), 2000)
      }, 100)
    }
  }, [highlight, onHighlightDone])

  const domain = (() => {
    try {
      return new URL(accommodation.url).hostname.replace('www.', '')
    } catch {
      return ''
    }
  })()

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}?highlight=${accommodation._id}`
    if (navigator.share) {
      try {
        await navigator.share({ title: accommodation.title, url })
      } catch {
        // User cancelled share — ignore
      }
    } else {
      await navigator.clipboard.writeText(url)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    }
  }

  return (
    <div
      ref={cardRef}
      className={`animate-fade-in rounded-2xl bg-bg-card border overflow-visible transition-all hover:border-border-light ${
        highlight
          ? 'border-amber/50 shadow-[0_0_24px_rgba(240,160,48,0.2)] animate-[pulse-glow_1.5s_ease-in-out_2]'
          : 'border-border'
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {accommodation.imageUrl && (
        <div className="aspect-[16/9] overflow-hidden rounded-t-2xl cursor-pointer" onClick={() => setExpanded(!expanded)}>
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
            {accommodation.addedBy && <span>· {accommodation.addedBy}</span>}
            {currentUserVote && (
              <span className="text-amber">
                {'★'.repeat(currentUserVote.stars)}
              </span>
            )}
          </div>
          {(pros > 0 || cons > 0 || accommodation.tag) && (
            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              {accommodation.tag && (() => {
                const tag = getTag(accommodation.tag)
                return tag ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-bg-elevated text-text-muted border border-border">
                    {tag.label}
                  </span>
                ) : null
              })()}
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
          <div className="flex items-center justify-between sm:justify-start sm:gap-3 flex-wrap">
            <a
              href={accommodation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-amber hover:text-amber-bright transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Vezi cocioaba
            </a>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text-bright transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {showCopied ? 'Ai copiat link-ul!' : 'Împǎrtǎşeşte'}
            </button>
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?highlight=${accommodation._id}`)
                setShowLinkCopied(true)
                setTimeout(() => setShowLinkCopied(false), 2000)
              }}
              className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text-bright transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {showLinkCopied ? 'Bravo bossule' : 'Copiază linkul'}
            </button>
          </div>

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
            commentReactions={commentReactions}
            userName={userName}
            onAdd={(type, text) => onAddComment(accommodation._id, type, text)}
            onDelete={onDeleteComment}
            onEdit={onEditComment}
            onToggleReaction={onToggleReaction}
          />

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditUrl(accommodation.url)
                setEditTitle(accommodation.title)
                setEditImageUrl(accommodation.imageUrl ?? '')
                setEditTag(accommodation.tag)
                setShowEditDialog(true)
              }}
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-bright transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifică cocioaba
            </button>
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

      {showEditDialog && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={() => setShowEditDialog(false)}
        >
          <div className="absolute inset-0 bg-bg-overlay animate-fade-in" />
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (editUrl.trim() && editTitle.trim()) {
                onEdit(editUrl.trim(), editTitle.trim(), editImageUrl.trim() || undefined, editTag)
                setShowEditDialog(false)
              }
            }}
            className="relative w-full sm:max-w-md animate-slide-up sm:animate-fade-in-scale bg-bg-card border border-border rounded-t-2xl sm:rounded-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-[var(--font-display)] text-lg font-600 text-text-bright">
                Ia zi boss
              </h2>
              <button
                type="button"
                onClick={() => setShowEditDialog(false)}
                className="text-text-muted hover:text-text-bright text-xl leading-none transition-colors"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                placeholder="Pune linku napoi"
                required
                className="w-full rounded-xl bg-bg-input border border-border px-4 py-3 text-sm text-text-bright placeholder:text-text-muted focus:outline-none focus:border-amber/40 transition-colors"
              />
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Dǎ-i un nume n-auzi"
                required
                className="w-full rounded-xl bg-bg-input border border-border px-4 py-3 text-sm text-text-bright placeholder:text-text-muted focus:outline-none focus:border-amber/40 transition-colors"
              />
              <input
                type="url"
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                placeholder="Imagine (opțional, da nu fi leprǎ)"
                className="w-full rounded-xl bg-bg-input border border-border px-4 py-3 text-sm text-text-bright placeholder:text-text-muted focus:outline-none focus:border-amber/40 transition-colors"
              />
              <TagPicker value={editTag} onChange={setEditTag} />
            </div>
            <button
              type="submit"
              disabled={!editUrl.trim() || !editTitle.trim()}
              className="w-full rounded-xl bg-amber text-bg font-600 text-sm px-4 py-3 hover:bg-amber-bright disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              Dǎ-i cu ea
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
