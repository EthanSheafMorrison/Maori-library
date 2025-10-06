import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { playlists, media } from '../data/media'
import type { Playlist } from '../types'
import { SidebarMenu } from '../components/SidebarMenu'
import { TopToolbar } from '../components/TopToolbar'

export function Series() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const playlistsWithCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    media.forEach(m => {
      if (m.playlistId) counts[m.playlistId] = (counts[m.playlistId] || 0) + 1
    })
    return playlists.map<Playlist & { count: number }>(p => ({ ...p, count: counts[p.id] || 0 }))
  }, [])

  return (
    <div className="container-app section">
      <div className="layout-main">
        <aside className="space-y-3">
          <SidebarMenu search={search} onSearchChange={setSearch} />
        </aside>
        <section className="space-y-6">
          <TopToolbar />
          <h1 className="h1">Series</h1>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {playlistsWithCounts.map(p => (
              <div key={p.id} className="card p-4 flex flex-col gap-2">
                <div className="font-medium" style={{ fontSize: 'var(--fs-3)' }}>{p.title}</div>
                <div className="text-caption text-muted">{p.count} videos</div>
                <div className="mt-2">
                  <button className="btn-secondary text-small" onClick={() => navigate(`/playlist/${p.id}`)}>Open →</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Series


