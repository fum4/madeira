import { useState } from 'react'

interface CommentSectionProps {
  comments: { _id: string; userName: string; type: 'pro' | 'con'; text: string }[]
  userName: string
  onAdd: (type: 'pro' | 'con', text: string) => void
  onDelete: (id: string) => void
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

export function CommentSection({
  comments,
  userName,
  onAdd,
  onDelete,
}: CommentSectionProps) {
  const [prosOpen, setProsOpen] = useState(true)
  const [consOpen, setConsOpen] = useState(true)

  const pros = comments.filter((c) => c.type === 'pro')
  const cons = comments.filter((c) => c.type === 'con')

  return (
    <div className="space-y-2">
      {/* PRO section */}
      <div className="rounded-lg border border-green/10 overflow-hidden">
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
                <div key={c._id} className="flex items-start justify-between gap-1 py-1 group">
                  <div className="min-w-0">
                    <p className="text-xs text-text-bright leading-relaxed">{c.text}</p>
                    <p className="text-[10px] text-text-muted">— {c.userName}</p>
                  </div>
                  {c.userName === userName && (
                    <button
                      onClick={() => onDelete(c._id)}
                      className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red shrink-0 text-xs transition-opacity"
                      aria-label="Delete comment"
                    >
                      ×
                    </button>
                  )}
                </div>
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
      <div className="rounded-lg border border-red/10 overflow-hidden">
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
                <div key={c._id} className="flex items-start justify-between gap-1 py-1 group">
                  <div className="min-w-0">
                    <p className="text-xs text-text-bright leading-relaxed">{c.text}</p>
                    <p className="text-[10px] text-text-muted">— {c.userName}</p>
                  </div>
                  {c.userName === userName && (
                    <button
                      onClick={() => onDelete(c._id)}
                      className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red shrink-0 text-xs transition-opacity"
                      aria-label="Delete comment"
                    >
                      ×
                    </button>
                  )}
                </div>
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
