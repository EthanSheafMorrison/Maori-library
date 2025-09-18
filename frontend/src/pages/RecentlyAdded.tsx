import { useMemo } from 'react'
import { media } from '../data/media'
import { MediaCard } from '../components/MediaCard'

export function RecentlyAdded() {
  const items = useMemo(() => {
    return [...media]
      .sort((a, b) => (b.addedAt || '').localeCompare(a.addedAt || ''))
  }, [])

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="h2">Recently added</h1>
        <div className="text-caption text-muted mt-2">{items.length} videos</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map(item => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}


