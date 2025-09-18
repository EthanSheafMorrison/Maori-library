import { FamiliarityBadge } from './FamiliarityBadge'
import { useVocab } from '../context/VocabContext'
import type { MediaItem } from '../types'
import { useNavigate } from 'react-router-dom'
import { useQueue } from '../context/QueueContext'

export function MediaCard({ item }: { item: MediaItem }) {
  const { savedById, toggle } = useVocab()
  const anySaved = item.cards.some(c => savedById[c.id])
  const navigate = useNavigate()
  const { isQueued, toggle: toggleQueue } = useQueue()
  const queued = isQueued(item.id)

  return (
    <article className="card overflow-hidden">
      <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
        <div className="text-gray-400">▶</div>
        <div className="absolute top-2 right-2">
          <FamiliarityBadge value={item.familiarity} size={42} />
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-medium text-gray-900 line-clamp-2" style={{ fontSize: 'var(--fs-3)' }}>{item.title}</h3>
          <span className="text-muted text-caption">{item.duration}</span>
        </div>
        {item.hasTranscript && (
          <div className="flex items-center gap-2 text-muted text-small">
            <span>Transcript</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <button className="btn-primary flex-1" onClick={() => navigate(`/watch/${item.id}`, { state: { item } })}>Play</button>
          <button className="btn-secondary" onClick={() => toggleQueue(item.id)}>
            {queued ? 'Queued' : 'Queue'}
          </button>
          <button className="btn-secondary" onClick={() => item.cards.forEach(c => toggle(c))}>
            {anySaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </article>
  )
}


