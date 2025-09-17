import { FamiliarityBar } from './FamiliarityBar'
import { useVocab } from '../context/VocabContext'
import type { VocabCard } from '../types'

type MediaItem = {
  id: string
  title: string
  duration: string
  familiarity: number
  cards: VocabCard[]
}

export function MediaCard({ item }: { item: MediaItem }) {
  const { savedById, toggle } = useVocab()
  const anySaved = item.cards.some(c => savedById[c.id])

  return (
    <article className="card overflow-hidden">
      <div className="aspect-video bg-gray-100 flex items-center justify-center">
        <div className="text-gray-400">▶</div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-medium text-gray-900 line-clamp-2" style={{ fontSize: 'var(--fs-3)' }}>{item.title}</h3>
          <span className="text-muted text-caption">{item.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-muted text-small">
          <span>Transcript</span>
        </div>
        <FamiliarityBar value={item.familiarity} />
        <div className="flex items-center gap-3">
          <button className="btn-primary flex-1">Play</button>
          <button className="btn-secondary" onClick={() => item.cards.forEach(c => toggle(c))}>
            {anySaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </article>
  )
}


