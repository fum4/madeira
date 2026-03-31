import { useState } from 'react'

interface NameEntryProps {
  onSubmit: (name: string) => void
}

export function NameEntry({ onSubmit }: NameEntryProps) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed) onSubmit(trimmed)
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-5">
      <div className="animate-fade-in w-full max-w-sm text-center">
        {/* Decorative island silhouette */}
        <div className="mb-8 text-6xl opacity-80" aria-hidden>
          🏝️
        </div>

        <h1 className="font-[var(--font-display)] text-4xl md:text-5xl font-600 text-text-bright tracking-tight leading-tight mb-3">
          Madeira Stays
        </h1>
        <p className="text-text-muted text-base mb-10">
          Find the perfect place for the crew
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Numele"
            autoFocus
            className="w-full rounded-xl bg-bg-input border border-border px-5 py-3.5 text-text-bright text-center text-lg placeholder:text-text-muted focus:outline-none focus:border-amber/50 focus:ring-1 focus:ring-amber/30 transition-all"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full rounded-xl bg-amber text-bg font-600 text-base px-5 py-3.5 transition-all hover:bg-amber-bright disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            Dǎ-i bice
          </button>
        </form>
      </div>
    </div>
  )
}
