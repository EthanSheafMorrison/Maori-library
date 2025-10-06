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
    <article className="card overflow-hidden flex flex-col h-[360px] sm:h-[380px]">
      <div className="relative h-[180px] sm:h-[200px] bg-gray-100">
        {item.thumbnailUrl ? (
          <img src={item.thumbnailUrl} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">▶</div>
        )}
        <div className="absolute top-2 right-2">
          <FamiliarityBadge value={item.familiarity} size={42} />
        </div>
      </div>
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-medium text-gray-900 line-clamp-2" style={{ fontSize: 'var(--fs-3)' }}>{item.title}</h3>
          <span className="text-muted text-caption">{item.duration}</span>
        </div>
        {item.hasTranscript && (
          <div className="flex items-center gap-2 text-muted text-small">
            <span>Transcript</span>
          </div>
        )}
        <div className="flex items-center gap-3 mt-auto">
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


