import { useState, useCallback, useMemo, useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'
import type { Id } from '../convex/_generated/dataModel'
import { NameEntry } from './components/NameEntry'
import { Header } from './components/Header'
import { ScoreBoard } from './components/ScoreBoard'
import { AccommodationList } from './components/AccommodationList'
import { AddAccommodation } from './components/AddAccommodation'
import { VoteOverview } from './components/VoteOverview'
import { TagFilter } from './components/TagFilter'

const STORAGE_KEY = 'madeira-stays-user'

function App() {
  const [userName, setUserNameState] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEY)
  )

  const setUserName = useCallback((name: string) => {
    localStorage.setItem(STORAGE_KEY, name)
    setUserNameState(name)
  }, [])

  const clearUser = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUserNameState(null)
  }, [])

  const accommodations = useQuery(api.accommodations.list)
  const votes = useQuery(api.votes.list)
  const comments = useQuery(api.comments.list)
  const commentReactions = useQuery(api.commentReactions.list)

  const addAccommodation = useMutation(api.accommodations.add)
  const updateAccommodation = useMutation(api.accommodations.update)
  const removeAccommodation = useMutation(api.accommodations.remove)
  const castVote = useMutation(api.votes.cast)
  const removeVote = useMutation(api.votes.remove)
  const addComment = useMutation(api.comments.add)
  const updateComment = useMutation(api.comments.update)
  const deleteComment = useMutation(api.comments.remove)
  const renameUser = useMutation(api.users.rename)
  const toggleReaction = useMutation(api.commentReactions.toggle)

  const scores = useMemo(() => {
    if (!votes) return {}
    const map: Record<string, number> = {}
    for (const v of votes) {
      const key = v.accommodationId as string
      map[key] = (map[key] || 0) + v.stars
    }
    return map
  }, [votes])

  const userVotes = useMemo(
    () => (votes ?? []).filter((v) => v.userName === userName),
    [votes, userName]
  )

  const [currentPage, setCurrentPage] = useState<'accommodations' | 'votes'>('accommodations')
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const [tagFilter, setTagFilter] = useState<Set<string>>(new Set())

  const filteredAccommodations = useMemo(() => {
    if (!accommodations) return []
    if (tagFilter.size === 0) return accommodations
    return accommodations.filter((a) => a.tag && tagFilter.has(a.tag))
  }, [accommodations, tagFilter])

  // Handle ?highlight=<id> from share links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('highlight')
    if (id) {
      setHighlightId(id)
      setCurrentPage('accommodations')
      // Clean URL without reload
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  if (!userName) {
    return <NameEntry onSubmit={setUserName} />
  }

  const loading = accommodations === undefined || votes === undefined || comments === undefined || commentReactions === undefined

  return (
    <div className="min-h-dvh flex flex-col">
      <Header
        userName={userName}
        hasVoted={userVotes.length > 0}
        onChangeName={clearUser}
        onRename={async (newName) => {
          try {
            await renameUser({ oldName: userName, newName })
            setUserName(newName)
            return null
          } catch (e) {
            return e instanceof Error ? e.message : 'Ceva n-a mers'
          }
        }}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-20 rounded-2xl" />
            ))}
          </div>
        ) : currentPage === 'accommodations' ? (
          <>
            <ScoreBoard accommodations={accommodations} scores={scores} />
            <TagFilter selected={tagFilter} onChange={setTagFilter} />
            <AccommodationList
              accommodations={filteredAccommodations}
              scores={scores}
              votes={votes}
              comments={comments}
              commentReactions={commentReactions}
              userName={userName}
              userVotes={userVotes}
              highlightId={highlightId}
              onHighlightDone={() => setHighlightId(null)}
              onVote={(accId, stars) =>
                castVote({
                  accommodationId: accId as Id<'accommodations'>,
                  userName,
                  stars,
                })
              }
              onRemoveVote={(accId) =>
                removeVote({
                  accommodationId: accId as Id<'accommodations'>,
                  userName,
                })
              }
              onAddComment={(accId, type, text) =>
                addComment({
                  accommodationId: accId as Id<'accommodations'>,
                  userName,
                  type,
                  text,
                })
              }
              onDeleteComment={(id) =>
                deleteComment({ id: id as Id<'comments'> })
              }
              onEditComment={(id, text) =>
                updateComment({ id: id as Id<'comments'>, text })
              }
              onDeleteAccommodation={(id) =>
                removeAccommodation({ id: id as Id<'accommodations'> })
              }
              onEditAccommodation={(id, url, title, imageUrl, tag) =>
                updateAccommodation({ id: id as Id<'accommodations'>, url, title, imageUrl, tag })
              }
              onToggleReaction={(commentId, type) =>
                toggleReaction({ commentId: commentId as Id<'comments'>, userName, type })
              }
            />
          </>
        ) : (
          <VoteOverview votes={votes} accommodations={accommodations} />
        )}
      </main>

      {currentPage === 'accommodations' && (
        <AddAccommodation
          onAdd={async (url, title, imageUrl, tag) => {
            await addAccommodation({ url, title, imageUrl, addedBy: userName, tag })
          }}
        />
      )}
    </div>
  )
}

export default App
