import { useRef } from 'react'
import type { MediaItem } from '../types'
import { MediaCard } from './MediaCard'
import { useNavigate } from 'react-router-dom'

type HorizontalRowProps = {
  title: string
  items: MediaItem[]
  viewAllHref?: string
}

export function HorizontalRow({ title, items, viewAllHref }: HorizontalRowProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  const scrollByAmount = (delta: number) => {
    const el = containerRef.current
    if (!el) return
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

  if (!items || items.length === 0) return null

  return (
    <section className="space-y-3">
      <div className="row-container">
        <div className="flex items-center justify-between">
          <h3 className="h3 text-[color:var(--color-text)]">{title}</h3>
          <div className="flex items-center gap-2">
            <div className="row-arrows hidden md:flex">
              <button aria-label="Scroll left" className="row-arrow" onClick={() => scrollByAmount(-600)}>‹</button>
              <button aria-label="Scroll right" className="row-arrow" onClick={() => scrollByAmount(600)}>›</button>
            </div>
            {viewAllHref && (
              <button className="btn-secondary text-small" onClick={() => navigate(viewAllHref)}>View all →</button>
            )}
          </div>
        </div>
        <div ref={containerRef} className="row-scroll">
          {items.map(item => (
            <div key={item.id} className="row-item">
              <MediaCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


