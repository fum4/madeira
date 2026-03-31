import { useState } from 'react'

interface HeaderProps {
  userName: string
  hasVoted: boolean
  onChangeName: () => void
  onRename: (newName: string) => Promise<string | null>
  currentPage: 'accommodations' | 'votes'
  onNavigate: (page: 'accommodations' | 'votes') => void
}

export function Header({ userName, hasVoted, onChangeName, onRename, currentPage, onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showLogout, setShowLogout] = useState(true)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [newName, setNewName] = useState(userName)
  const [renameError, setRenameError] = useState<string | null>(null)

  const handleNameClick = () => {
    if (hasVoted) {
      setNewName(userName)
      setRenameError(null)
      setShowRenameDialog(true)
    } else {
      onChangeName()
    }
  }

  const handleRename = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = newName.trim()
    if (trimmed && trimmed !== userName) {
      const error = await onRename(trimmed)
      if (error) {
        setRenameError(error)
        return
      }
    }
    setShowRenameDialog(false)
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => onNavigate('accommodations')}
            className="font-[var(--font-display)] text-lg font-600 text-text-bright tracking-tight flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <span>🏝️</span> Madeira Stays
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNameClick}
              className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-text hover:text-text-bright transition-colors"
            >
              <span className="w-5 h-5 rounded-full bg-amber/20 text-amber text-xs font-600 flex items-center justify-center">
                {userName[0].toUpperCase()}
              </span>
              {userName}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-text-bright transition-colors"
              aria-label="Menu"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-bg flex flex-col">
          <div className="border-b border-border">
            <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-amber/20 text-amber text-sm font-600 flex items-center justify-center">
                  {userName[0].toUpperCase()}
                </span>
                <span className="text-text-bright font-600 text-base">{userName}</span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-text-bright transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <nav className="flex-1 max-w-2xl mx-auto w-full px-4 pt-6 space-y-1">
            <button
              onClick={() => {
                onNavigate('accommodations')
                setMenuOpen(false)
              }}
              style={{ animationDelay: '50ms' }}
              className={`animate-fade-in w-full text-left px-4 py-4 rounded-xl text-base flex items-center gap-3 transition-colors ${
                currentPage === 'accommodations'
                  ? 'text-amber bg-amber-dim'
                  : 'text-text-bright hover:bg-bg-elevated'
              }`}
            >
              <span className="text-xl">🏠</span>
              Cocioabe
            </button>
            <button
              onClick={() => {
                onNavigate('votes')
                setMenuOpen(false)
              }}
              style={{ animationDelay: '100ms' }}
              className={`animate-fade-in w-full text-left px-4 py-4 rounded-xl text-base flex items-center gap-3 transition-colors ${
                currentPage === 'votes'
                  ? 'text-amber bg-amber-dim'
                  : 'text-text-bright hover:bg-bg-elevated'
              }`}
            >
              <span className="text-xl">🗳️</span>
              Cine cum a votat
            </button>
            {showLogout && (
              <button
                onClick={() => {
                  new Audio('/logout.wav').play().catch(() => {})
                  setShowLogout(false)
                }}
                style={{ animationDelay: '150ms' }}
                className="animate-fade-in w-full text-left px-4 py-4 rounded-xl text-base flex items-center gap-3 text-text-muted hover:bg-bg-elevated transition-colors"
              >
                <span className="text-xl">🚪</span>
                Logout
              </button>
            )}
          </nav>
        </div>
      )}

      {/* Rename dialog */}
      {showRenameDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={() => setShowRenameDialog(false)}
        >
          <div className="absolute inset-0 bg-bg-overlay animate-fade-in" />
          <div
            className="relative animate-fade-in-scale bg-bg-card border border-border rounded-2xl overflow-hidden w-screen max-w-sm text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleRename} className="p-5 space-y-4">
              <div className="text-3xl">✏️</div>
              <p className="text-sm text-text-bright">Schimbă-ți numele</p>
              <input
                type="text"
                value={newName}
                onChange={(e) => { setNewName(e.target.value); setRenameError(null) }}
                autoFocus
                className={`w-full rounded-xl bg-bg-input border px-4 py-3 text-sm text-text-bright text-center placeholder:text-text-muted focus:outline-none transition-colors ${
                  renameError ? 'border-red/50 focus:border-red/50' : 'border-border focus:border-amber/40'
                }`}
              />
              {renameError && (
                <p className="text-xs text-red">{renameError}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowRenameDialog(false)}
                  className="flex-1 rounded-xl bg-bg-elevated border border-border px-4 py-2.5 text-sm text-text hover:text-text-bright hover:border-border-light transition-colors"
                >
                  Lasă
                </button>
                <button
                  type="submit"
                  disabled={!newName.trim() || newName.trim() === userName}
                  className="flex-1 rounded-xl bg-amber text-bg font-600 text-sm px-4 py-2.5 hover:bg-amber-bright disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-[0.98]"
                >
                  Schimbă
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
