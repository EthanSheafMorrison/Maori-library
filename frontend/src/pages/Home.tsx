import { useMemo } from 'react'
import { useProgress } from '../context/ProgressContext'
import { MediaCard } from '../components/MediaCard'
import type { VocabCard } from '../types'

type Playlist = { id: string; title: string; count: number }
type Media = { id: string; title: string; duration: string; familiarity: number; cards: VocabCard[] }

const playlists: Playlist[] = [
  { id: 'hauora', title: 'Kōrero Hauora', count: 12 },
  { id: 'pakihi', title: 'Pakihi Māori', count: 18 },
  { id: 'hangarau', title: 'Te Ao Hangarau', count: 9 },
  { id: 'purakau', title: 'Pūrākau', count: 14 },
]

const recommended: Media[] = [
  {
    id: '1',
    title: 'He kupu mō te pakihi iti',
    duration: '4:12',
    familiarity: 62,
    cards: [
      { id: 'biz1', front: 'pakihi', back: 'business' },
      { id: 'biz2', front: 'kaihoko', back: 'customer' },
    ],
  },
  {
    id: '2',
    title: 'Kōrero hauora: te whare tapa whā i te mahi',
    duration: '3:45',
    familiarity: 74,
    cards: [
      { id: 'health1', front: 'hauora', back: 'health, wellbeing' },
      { id: 'health2', front: 'tinana', back: 'body' },
    ],
  },
  {
    id: '3',
    title: 'Pūrākau: Māui me te rā',
    duration: '5:01',
    familiarity: 55,
    cards: [
      { id: 'story1', front: 'pūrākau', back: 'legend, story' },
      { id: 'story2', front: 'Māui', back: 'demigod Māui' },
    ],
  },
  {
    id: '4',
    title: 'Te ao hangarau: kupu hou mō te AI',
    duration: '2:58',
    familiarity: 43,
    cards: [
      { id: 'ai1', front: 'hangarau', back: 'technology' },
      { id: 'ai2', front: 'mātai mariko', back: 'artificial intelligence' },
    ],
  },
]

export function Home() {
  const { progress } = useProgress()
  const streakPill = useMemo(() => `Continue streak: ${progress.streak || 0} day${(progress.streak || 0) === 1 ? '' : 's'}`,[progress.streak])

  return (
    <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
      {/* Sidebar with search on top */}
      <aside className="space-y-3">
        <div className="card p-4">
          <input className="w-full rounded-full border px-4 py-2 text-small ring-brand-focus" placeholder="Search titles or kupu (e.g., ‘pakihi’, ‘hauora’)" />
        </div>
        <div className="flex items-center gap-2">
          <button className="tab tab-active">Playlists</button>
          <button className="tab">Recently added</button>
        </div>
        <div className="space-y-3">
          {playlists.map(p => (
            <div key={p.id} className="flex items-center justify-between card p-4">
              <div>
                <div className="font-medium" style={{ fontSize: 'var(--fs-3)' }}>{p.title}</div>
                <div className="text-caption text-muted">{p.count} videos</div>
              </div>
              <button className="btn-secondary text-small">Open →</button>
            </div>
          ))}
        </div>
      </aside>

      {/* Main column */}
      <section className="space-y-4">
        <div className="card p-3 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2 text-small">
            <span className="pill">
              <span>⚡</span>
              {streakPill}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-small">Filter</button>
            <button className="btn-secondary text-small">My queues</button>
          </div>
        </div>

        <div>
          <h2 className="h3 mb-3">Recommended for you</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recommended.map(item => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}


