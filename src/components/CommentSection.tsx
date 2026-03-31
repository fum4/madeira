import { useState } from 'react'

interface CommentSectionProps {
  comments: { _id: string; userName: string; type: 'pro' | 'con'; text: string }[]
  userName: string
  onAdd: (type: 'pro' | 'con', text: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
}

function CommentInput({
  type,
  placeholder,
  onSubmit,
}: {
  type: 'pro' | 'con'
  placeholder: string
  onSubmit: (text: string) => void
}) {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setText('')
  }

  const color = type === 'pro' ? 'green' : 'red'

  return (
    <form onSubmit={handleSubmit} className="flex gap-1.5 mt-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 min-w-0 rounded-lg bg-bg-input border border-border px-2.5 py-1.5 text-xs text-text-bright placeholder:text-text-muted focus:outline-none focus:border-${color}/30 transition-colors`}
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className={`shrink-0 rounded-lg border px-2 py-1.5 text-xs font-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
          type === 'pro'
            ? 'bg-green-dim border-green/20 text-green hover:border-green/40'
            : 'bg-red-dim border-red/20 text-red hover:border-red/40'
        }`}
      >
        Zic
      </button>
    </form>
  )
}

function CommentItem({
  comment,
  isOwn,
  onDelete,
  onEdit,
}: {
  comment: { _id: string; userName: string; text: string }
  isOwn: boolean
  onDelete: () => void
  onEdit: (text: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(comment.text)
  const [menuOpen, setMenuOpen] = useState(false)

  if (editing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const trimmed = editText.trim()
          if (trimmed && trimmed !== comment.text) {
            onEdit(trimmed)
          }
          setEditing(false)
        }}
        className="flex gap-1.5 py-1"
      >
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          autoFocus
          className="flex-1 min-w-0 rounded-lg bg-bg-input border border-border px-2 py-1 text-xs text-text-bright focus:outline-none focus:border-amber/40 transition-colors"
        />
        <button
          type="submit"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-dim text-green hover:bg-green/20 text-sm transition-colors"
        >
          ✓
        </button>
        <button
          type="button"
          onClick={() => { setEditText(comment.text); setEditing(false) }}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-dim text-red hover:bg-red/20 text-sm transition-colors"
        >
          ✕
        </button>
      </form>
    )
  }

  return (
    <div className="flex items-start justify-between gap-1 py-1">
      <div className="min-w-0">
        <p className="text-xs text-text-bright leading-relaxed">{comment.text}</p>
        <p className="text-[10px] text-text-muted">— {comment.userName}</p>
      </div>
      {isOwn && (
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 flex items-center justify-center rounded-md text-text hover:text-text-bright hover:bg-bg-elevated transition-colors"
            aria-label="Comment options"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-7 z-50 animate-fade-in-scale bg-bg-card border border-border rounded-xl shadow-lg shadow-black/30 overflow-hidden min-w-[210px]">
                <button
                  onClick={() => {
                    setEditText(comment.text)
                    setEditing(true)
                    setMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2.5 text-xs flex items-center gap-2 text-text-bright hover:bg-bg-elevated transition-colors"
                >
                  <span className="text-amber">✎</span>
                  M-a luat gura pe dinainte
                </button>
                <button
                  onClick={() => {
                    onDelete()
                    setMenuOpen(false)
                  }}
                  className="w-full text-left px-3 py-2.5 text-xs flex items-center gap-2 text-red hover:bg-red-dim transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Numai zic nimic
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export function CommentSection({
  comments,
  userName,
  onAdd,
  onDelete,
  onEdit,
}: CommentSectionProps) {
  const [prosOpen, setProsOpen] = useState(true)
  const [consOpen, setConsOpen] = useState(true)

  const pros = comments.filter((c) => c.type === 'pro')
  const cons = comments.filter((c) => c.type === 'con')

  return (
    <div className="space-y-2">
      {/* PRO section */}
      <div className="rounded-lg border border-green/10 overflow-visible">
        <button
          onClick={() => setProsOpen(!prosOpen)}
          className="w-full flex items-center justify-between px-3 py-2 bg-green-dim hover:bg-green/[0.08] transition-colors"
        >
          <div className="text-xs font-600 text-green flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green" />
            De bine ({pros.length})
          </div>
          <svg
            className={`w-3 h-3 text-green/60 transition-transform ${prosOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {prosOpen && (
          <div className="px-3 pb-2.5 pt-1">
            {pros.length === 0 && (
              <p className="text-xs text-text-muted italic py-1">Nimic de bine momentan</p>
            )}
            <div className="space-y-1">
              {pros.map((c) => (
                <CommentItem
                  key={c._id}
                  comment={c}
                  isOwn={c.userName === userName}
                  onDelete={() => onDelete(c._id)}
                  onEdit={(text) => onEdit(c._id, text)}
                />
              ))}
            </div>
            <CommentInput
              type="pro"
              placeholder="Ia zi bossule"
              onSubmit={(text) => onAdd('pro', text)}
            />
          </div>
        )}
      </div>

      {/* CON section */}
      <div className="rounded-lg border border-red/10 overflow-visible">
        <button
          onClick={() => setConsOpen(!consOpen)}
          className="w-full flex items-center justify-between px-3 py-2 bg-red-dim hover:bg-red/[0.08] transition-colors"
        >
          <div className="text-xs font-600 text-red flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red" />
            De rǎu ({cons.length})
          </div>
          <svg
            className={`w-3 h-3 text-red/60 transition-transform ${consOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {consOpen && (
          <div className="px-3 pb-2.5 pt-1">
            {cons.length === 0 && (
              <p className="text-xs text-text-muted italic py-1">Niciun cârcotaş încǎ</p>
            )}
            <div className="space-y-1">
              {cons.map((c) => (
                <CommentItem
                  key={c._id}
                  comment={c}
                  isOwn={c.userName === userName}
                  onDelete={() => onDelete(c._id)}
                  onEdit={(text) => onEdit(c._id, text)}
                />
              ))}
            </div>
            <CommentInput
              type="con"
              placeholder="Ia zi bossule"
              onSubmit={(text) => onAdd('con', text)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
