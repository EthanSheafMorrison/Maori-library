import type { MediaItem } from '../types'
import { FamiliarityBadge } from './FamiliarityBadge'
import { useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { media } from '../data/media'
import { Modal } from './Modal'
import { MediaCard } from './MediaCard'

type HeroFeaturedProps = {
  item: MediaItem
}

export function HeroFeatured({ item }: HeroFeaturedProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const siblings = useMemo(() => media.filter(m => m.playlistId && m.playlistId === item.playlistId), [item.playlistId])

  return (
    <div className="hero">
      {item.heroUrl ? (
        <img src={item.heroUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="hero-media" />
      )}
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="flex items-center gap-2 mb-2">
          <FamiliarityBadge value={item.familiarity} size={36} />
          <span className="text-caption text-muted">{item.duration}</span>
        </div>
        <h2 className="h2 text-white drop-shadow">{item.title}</h2>
        <div className="mt-4 flex items-center gap-2">
          <button className="btn-primary" onClick={() => navigate(`/watch/${item.id}`, { state: { item } })}>Play</button>
          {item.playlistId && (
            <button className="btn-secondary" onClick={() => setOpen(true)}>More info</button>
          )}
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={item.title} maxWidthClass="max-w-5xl">
        <div className="space-y-4">
          <div className="relative aspect-[16/6] overflow-hidden rounded-lg">
            {item.heroUrl ? (
              <img src={item.heroUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gray-200" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-primary" onClick={() => { setOpen(false); navigate(`/watch/${item.id}`, { state: { item } }) }}>Play</button>
            {item.playlistId && (
              <button className="btn-secondary" onClick={() => { setOpen(false); navigate(`/playlist/${item.playlistId}`) }}>Open playlist</button>
            )}
          </div>
          {siblings.length > 0 && (
            <div>
              <div className="h3 mb-2">Episodes</div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {siblings.map(s => (
                  <MediaCard key={s.id} item={s} />
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}


