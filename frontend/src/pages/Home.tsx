import { useEffect, useMemo, useState } from 'react'
import { useProgress } from '../context/ProgressContext'
import { MediaCard } from '../components/MediaCard'
import { Flame } from '../components/Flame'
import type { MediaItem, Playlist } from '../types'
import { media, playlists } from '../data/media'
import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

export function Home() {
  const { progress } = useProgress()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState(params.get('q') || '')
  const [activeTab, setActiveTab] = useState<'playlists' | 'recent'>((params.get('tab') as 'playlists' | 'recent') || 'playlists')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>(params.get('pl') || '')
  const [hasTranscript, setHasTranscript] = useState(params.get('tr') === '1')
  const [minFamiliarity, setMinFamiliarity] = useState<number>(Number(params.get('min') || 0))
  const streakPill = useMemo(() => `Continue streak: ${progress.streak || 0} day${(progress.streak || 0) === 1 ? '' : 's'}`,[progress.streak])

  const playlistsWithCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    media.forEach(m => {
      if (m.playlistId) counts[m.playlistId] = (counts[m.playlistId] || 0) + 1
    })
    return playlists.map<Playlist & { count: number }>(p => ({ ...p, count: counts[p.id] || 0 }))
  }, [])

  const filteredMedia = useMemo<MediaItem[]>(() => {
    const q = search.trim().toLowerCase()
    return media.filter(item => {
      if (selectedPlaylistId && item.playlistId !== selectedPlaylistId) return false
      if (hasTranscript && !item.hasTranscript) return false
      if (item.familiarity < minFamiliarity) return false

      if (!q) return true
      const inTitle = item.title.toLowerCase().includes(q)
      const inTags = (item.tags || []).some(t => t.toLowerCase().includes(q))
      const inCards = item.cards.some(c => c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q))
      return inTitle || inTags || inCards
    })
    // Recommended: highest familiarity first
    .sort((a, b) => b.familiarity - a.familiarity)
  }, [search, selectedPlaylistId, hasTranscript, minFamiliarity])

  const recentMedia = useMemo(() => {
    return [...media]
      .sort((a, b) => (b.addedAt || '').localeCompare(a.addedAt || ''))
      .slice(0, 6)
  }, [])

  // Persist state to URL
  useEffect(() => {
    const next = new URLSearchParams()
    if (search) next.set('q', search)
    if (activeTab !== 'playlists') next.set('tab', activeTab)
    if (selectedPlaylistId) next.set('pl', selectedPlaylistId)
    if (hasTranscript) next.set('tr', '1')
    if (minFamiliarity > 0) next.set('min', String(minFamiliarity))
    setParams(next, { replace: true })
  }, [search, activeTab, selectedPlaylistId, hasTranscript, minFamiliarity, setParams])

  return (
    <div className="layout-main">
      {/* Sidebar with search on top */}
      <aside className="space-y-3">
        <div className="card p-4">
          <input
            className="w-full rounded-full border px-4 py-2 text-small ring-brand-focus"
            placeholder="Search titles or kupu (e.g., ‘pakihi’, ‘hauora’)"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className={`tab ${activeTab === 'playlists' ? 'tab-active' : ''}`} onClick={() => setActiveTab('playlists')}>Playlists</button>
          <button className={`tab ${activeTab === 'recent' ? 'tab-active' : ''}`} onClick={() => setActiveTab('recent')}>Recently added</button>
        </div>
        {activeTab === 'playlists' ? (
          <div className="space-y-3">
            {playlistsWithCounts.map(p => (
              <div key={p.id} className="flex items-center justify-between card p-4">
                <div>
                  <div className="font-medium" style={{ fontSize: 'var(--fs-3)' }}>{p.title}</div>
                  <div className="text-caption text-muted">{p.count} videos</div>
                </div>
                <button className="btn-secondary text-small" onClick={() => navigate(`/playlist/${p.id}`)}>Open →</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {recentMedia.map(item => (
              <div key={item.id} className="card p-4">
                <div className="font-medium line-clamp-2" style={{ fontSize: 'var(--fs-3)' }}>{item.title}</div>
                <div className="text-caption text-muted flex items-center justify-between mt-1">
                  <span>{item.duration} • {item.addedAt}</span>
                  <button className="btn-secondary text-small" onClick={() => navigate(`/watch/${item.id}`, { state: { item } })}>Play</button>
                </div>
              </div>
            ))}
            <div className="text-center">
              <button className="btn-secondary text-small" onClick={() => navigate('/recent')}>See all →</button>
            </div>
          </div>
        )}
      </aside>

      {/* Main column */}
      <section className="space-y-4">
          <div className="card p-3 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2 text-small">
            <span className="pill">
              <Flame level={progress.streak || 0} />
              {streakPill}
            </span>
            {progress.lastActiveDate !== new Date().toISOString().slice(0,10) && (
              <span className="accent-box">Don’t lose your streak today</span>
            )}
          </div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary text-small" onClick={() => setShowFilters(s => !s)}>
                Filter
                {(selectedPlaylistId || hasTranscript || minFamiliarity > 0) && (
                  <span className="meta-pill ml-2">{[selectedPlaylistId && 'Playlist', hasTranscript && 'Transcript', minFamiliarity > 0 && `≥ ${minFamiliarity}%`].filter(Boolean).length}</span>
                )}
              </button>
              <button className="btn-secondary text-small" onClick={() => navigate('/my-queues')}>My queues</button>
            </div>
        </div>

        <div className={`collapse-wrap ${showFilters ? 'open' : 'closed'}`}>
          <div className="collapse-inner">
            <div className="card p-4 space-y-4 anim-scale-in">
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="form-field">
                  <div className="text-muted mb-1">Playlist</div>
                  <select className="select w-full" value={selectedPlaylistId} onChange={e => setSelectedPlaylistId(e.target.value)}>
                    <option value="">All</option>
                    {playlists.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </label>
                <label className="form-field flex items-end gap-2">
                  <input type="checkbox" className="checkbox" checked={hasTranscript} onChange={e => setHasTranscript(e.target.checked)} />
                  <span>Has transcript</span>
                </label>
                <label className="form-field">
                  <div className="text-muted mb-1">Min familiarity: {minFamiliarity}%</div>
                  <input type="range" min={0} max={100} step={5} value={minFamiliarity} onChange={e => setMinFamiliarity(Number(e.target.value))} className="range" />
                </label>
              </div>
              {(selectedPlaylistId || hasTranscript || minFamiliarity > 0) && (
                <div className="flex flex-wrap items-center gap-2">
                  {selectedPlaylistId && (
                    <span className="chip chip-active">
                      Playlist
                      <button aria-label="Clear playlist" onClick={() => setSelectedPlaylistId('')}>
                        ×
                      </button>
                    </span>
                  )}
                  {hasTranscript && (
                    <span className="chip chip-active">
                      Transcript
                      <button aria-label="Clear transcript" onClick={() => setHasTranscript(false)}>
                        ×
                      </button>
                    </span>
                  )}
                  {minFamiliarity > 0 && (
                    <span className="chip chip-active">
                      ≥ {minFamiliarity}%
                      <button aria-label="Clear familiarity" onClick={() => setMinFamiliarity(0)}>
                        ×
                      </button>
                    </span>
                  )}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button className="btn-secondary text-small" onClick={() => { setSelectedPlaylistId(''); setHasTranscript(false); setMinFamiliarity(0) }}>Clear</button>
                <button className="btn-primary text-small" onClick={() => setShowFilters(false)}>Done</button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="h3 mb-3">Recommended for you</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredMedia.map(item => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}


