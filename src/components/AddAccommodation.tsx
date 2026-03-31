import { useState } from 'react'

interface AddAccommodationProps {
  onAdd: (url: string, title: string, imageUrl?: string) => Promise<void>
}

export function AddAccommodation({ onAdd }: AddAccommodationProps) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!url.trim() || !title.trim()) return

    setLoading(true)
    try {
      await onAdd(url.trim(), title.trim(), imageUrl.trim() || undefined)
      setUrl('')
      setTitle('')
      setImageUrl('')
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-amber text-bg shadow-lg shadow-amber/20 flex items-center justify-center text-2xl font-500 hover:bg-amber-bright active:scale-90 transition-all"
        aria-label="Add accommodation"
      >
        +
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <div className="absolute inset-0 bg-bg-overlay animate-fade-in" />

          <form
            onSubmit={handleSubmit}
            className="relative w-full sm:max-w-md animate-slide-up sm:animate-fade-in-scale bg-bg-card border border-border rounded-t-2xl sm:rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-[var(--font-display)] text-lg font-600 text-text-bright">
                Add a place
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-text-muted hover:text-text-bright text-xl leading-none transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Airbnb or Booking.com link"
                autoFocus
                required
                className="w-full rounded-xl bg-bg-input border border-border px-4 py-3 text-sm text-text-bright placeholder:text-text-muted focus:outline-none focus:border-amber/40 transition-colors"
              />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give it a name (e.g. 'Ocean view villa')"
                required
                className="w-full rounded-xl bg-bg-input border border-border px-4 py-3 text-sm text-text-bright placeholder:text-text-muted focus:outline-none focus:border-amber/40 transition-colors"
              />
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL (optional)"
                className="w-full rounded-xl bg-bg-input border border-border px-4 py-3 text-sm text-text-bright placeholder:text-text-muted focus:outline-none focus:border-amber/40 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !url.trim() || !title.trim()}
              className="w-full rounded-xl bg-amber text-bg font-600 text-sm px-4 py-3 hover:bg-amber-bright disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {loading ? 'Adding...' : 'Add listing'}
            </button>
          </form>
        </div>
      )}
    </>
  )
}
