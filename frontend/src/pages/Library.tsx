import { useMemo, useState } from 'react'
import { media } from '../data/media'
import type { MediaItem } from '../types'
import { MediaCard } from '../components/MediaCard'
import { SidebarMenu } from '../components/SidebarMenu'
import { TopToolbar } from '../components/TopToolbar'

export function Library() {
  const [search, setSearch] = useState('')

  const filtered: MediaItem[] = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return media
    return media.filter(item => {
      const inTitle = item.title.toLowerCase().includes(q)
      const inTags = (item.tags || []).some(t => t.toLowerCase().includes(q))
      const inCards = item.cards.some(c => c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q))
      return inTitle || inTags || inCards
    })
  }, [search])

  return (
    <div className="container-app section">
      <div className="layout-main">
        <aside className="space-y-3">
          <SidebarMenu search={search} onSearchChange={setSearch} />
        </aside>
        <section className="space-y-6">
          <TopToolbar />
          <h1 className="h1">Library</h1>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(item => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Library


