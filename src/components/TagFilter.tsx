import { TAGS } from '../tags'

interface TagFilterProps {
  selected: Set<string>
  onChange: (selected: Set<string>) => void
}

export function TagFilter({ selected, onChange }: TagFilterProps) {
  const toggle = (value: string) => {
    const next = new Set(selected)
    if (next.has(value)) {
      next.delete(value)
    } else {
      next.add(value)
    }
    onChange(next)
  }

  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1 px-4 -mx-4">
      {TAGS.map((tag) => (
        <button
          key={tag.value}
          onClick={() => toggle(tag.value)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-500 border transition-colors ${
            selected.has(tag.value)
              ? 'bg-amber-dim border-amber/30 text-amber'
              : 'bg-bg-elevated border-border text-text-muted hover:text-text hover:border-border-light'
          }`}
        >
          {tag.emoji}&ensp;{tag.label}
        </button>
      ))}
    </div>
  )
}
