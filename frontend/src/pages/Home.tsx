import { useEffect, useMemo, useState } from 'react'
import { useProgress } from '../context/ProgressContext'
import { HorizontalRow } from '../components/HorizontalRow'
import { HeroFeatured } from '../components/HeroFeatured'
import { Flame } from '../components/Flame'
// import { DailyGoal } from '../components/DailyGoal'
import type { MediaItem } from '../types'
import { media, playlists } from '../data/media'
import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

export function Home() {
  const { progress } = useProgress()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState(params.get('q') || '')
  // sidebar tabs removed
  const [showFilters, setShowFilters] = useState(false)
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>(params.get('pl') || '')
  const [hasTranscript, setHasTranscript] = useState(params.get('tr') === '1')
  const [minFamiliarity, setMinFamiliarity] = useState<number>(Number(params.get('min') || 0))
  const streakPill = useMemo(() => `Continue streak: ${progress.streak || 0} day${(progress.streak || 0) === 1 ? '' : 's'}`,[progress.streak])

  // removed playlist counts sidebar

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

  // removed recent sidebar

  const featured = useMemo(() => filteredMedia[0] || media[0], [filteredMedia])

  // Persist state to URL
  useEffect(() => {
    const next = new URLSearchParams()
    if (search) next.set('q', search)
    // no sidebar tab state now
    if (selectedPlaylistId) next.set('pl', selectedPlaylistId)
    if (hasTranscript) next.set('tr', '1')
    if (minFamiliarity > 0) next.set('min', String(minFamiliarity))
    setParams(next, { replace: true })
  }, [search, selectedPlaylistId, hasTranscript, minFamiliarity, setParams])

  return (
    <div className="layout-main">
      {/* Sidebar: primary nav actions */}
      <aside className="space-y-3">
        <div className="sidebar-sticky space-y-3">
          <div className="card p-4">
            <input
              className="w-full rounded-full border px-4 py-2 text-small ring-brand-focus"
              placeholder="Search titles or kupu (e.g., ‘pakihi’, ‘hauora’)"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <nav className="card p-4 space-y-4">
            <button className="w-full flex items-center gap-3 text-left hover:opacity-80" onClick={() => navigate('/')}> 
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-pink-600">▶</span>
              <span className="font-medium">Watch</span>
            </button>
            <button className="w-full flex items-center gap-3 text-left hover:opacity-80" onClick={() => navigate('/series')}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-cyan-100 text-cyan-600">▦</span>
              <span className="font-medium">Series</span>
            </button>
            <button className="w-full flex items-center gap-3 text-left hover:opacity-80" onClick={() => navigate('/library')}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100 text-emerald-600">▣</span>
              <span className="font-medium">Library</span>
            </button>
            <button className="w-full flex items-center gap-3 text-left hover:opacity-80" onClick={() => navigate('/progress')}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-indigo-100 text-indigo-600">▥</span>
              <span className="font-medium">Progress</span>
            </button>
            <button className="w-full flex items-center gap-3 text-left hover:opacity-80" onClick={() => navigate('/method')}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-amber-100 text-amber-600">?</span>
              <span className="font-medium">Method</span>
            </button>
            {/* <button className="w-full flex items-center gap-3 text-left hover:opacity-80" onClick={() => alert('Premium coming soon!')}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-500">★</span>
              <span className="font-medium">Try Premium</span>
            </button> */}
          </nav>
        </div>
      </aside>

      {/* Main column */}
      <section className="space-y-6">
        {/* Top toolbar: streak + filters inline */}
        <div className="toolbar-sticky flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2 text-small">
            <span className="pill">
              <Flame level={progress.streak || 0} />
              {streakPill}
            </span>
            {/* Daily goal hidden */}
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
        {/* Hero */}
        {featured && (
          <HeroFeatured item={featured} />
        )}

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

        <div className="space-y-8">
          <HorizontalRow
            title="Recommended for you"
            items={filteredMedia.slice(0, 12)}
          />
          {playlists.map(pl => (
            <HorizontalRow
              key={pl.id}
              title={pl.title}
              items={media.filter(m => m.playlistId === pl.id)}
              viewAllHref={`/playlist/${pl.id}`}
            />
          ))}
        </div>
      </section>
    </div>
  )
}


