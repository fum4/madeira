import { TAGS } from '../tags'

interface TagPickerProps {
  value?: string
  onChange: (value: string | undefined) => void
}

export function TagPicker({ value, onChange }: TagPickerProps) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {TAGS.map((tag) => (
        <button
          key={tag.value}
          type="button"
          onClick={() => onChange(value === tag.value ? undefined : tag.value)}
          className={`rounded-lg px-2.5 py-1.5 text-xs font-500 border transition-colors ${
            value === tag.value
              ? 'bg-amber-dim border-amber/30 text-amber'
              : 'bg-bg-input border-border text-text-muted hover:text-text hover:border-border-light'
          }`}
        >
          {tag.emoji} {tag.label}
        </button>
      ))}
    </div>
  )
}
