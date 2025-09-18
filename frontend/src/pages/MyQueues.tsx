import { useMemo } from 'react'
import { useQueue } from '../context/QueueContext'
import { media } from '../data/media'
import { MediaCard } from '../components/MediaCard'

export function MyQueues() {
  const { queuedIds, clear } = useQueue()
  const items = useMemo(() => queuedIds.map(id => media.find(m => m.id === id)).filter(Boolean), [queuedIds]) as typeof media

  return (
    <div className="space-y-4">
      <div className="card p-4 flex items-center justify-between">
        <div>
          <h1 className="h3">My Queues</h1>
          <div className="text-caption text-muted">{items.length} {items.length === 1 ? 'item' : 'items'}</div>
        </div>
        {items.length > 0 && (
          <button className="btn-secondary text-small" onClick={clear}>Clear all</button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card p-6 text-center text-muted">No items queued yet. Add some from the home page.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map(item => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}


