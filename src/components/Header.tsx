interface HeaderProps {
  userName: string
  onChangeName: () => void
}

export function Header({ userName, onChangeName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <h1 className="font-[var(--font-display)] text-lg font-600 text-text-bright tracking-tight">
          Madeira Stays
        </h1>
        <button
          onClick={onChangeName}
          className="flex items-center gap-2 rounded-full bg-bg-elevated border border-border px-3 py-1.5 text-sm text-text hover:text-text-bright hover:border-border-light transition-colors"
        >
          <span className="w-5 h-5 rounded-full bg-amber/20 text-amber text-xs font-600 flex items-center justify-center">
            {userName[0].toUpperCase()}
          </span>
          {userName}
        </button>
      </div>
    </header>
  )
}
