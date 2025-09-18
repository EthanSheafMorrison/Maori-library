import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'

type TranscriptItem = { s: number; t: string; text: string }

type WatchState = {
  item?: { id: string; title: string; duration: string }
}

const mockTranscript: TranscriptItem[] = [
  { s: 2, t: '0:02', text: 'Pixy Williams, wahine Māori tuatahi hei kaikōata whetū.' },
  { s: 15, t: '0:15', text: 'Ko Piki Te Ora tōna ingoa whānau.' },
  { s: 28, t: '0:28', text: 'I whānau mai ia ki te wā kāinga o Rātapu.' },
  { s: 41, t: '0:41', text: 'I te tau 1949, ka puta te waiata Blue Smoke.' },
  { s: 58, t: '0:58', text: 'He oha ki ngā hōia o te pakanga.' },
  { s: 72, t: '1:12', text: 'Ka rangona whānuitia e Aotearoa.' },
  { s: 92, t: '1:32', text: 'He wahine toa, he reo māia.' },
]

export function VideoPlayer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation() as { state: WatchState }
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentTime, setCurrentTime] = useState(0)

  const activeIdx = useMemo(() => {
    let idx = 0
    for (let i = 0; i < mockTranscript.length; i++) {
      if (mockTranscript[i].s <= currentTime) idx = i
      else break
    }
    return idx
  }, [currentTime])

  const meta = useMemo(() => {
    return state?.item ?? { id: id ?? '1', title: 'Kōrero hauora: te whare tapa whā i te mahi', duration: '3:45' }
  }, [id, state])

  useEffect(() => {
    const el = document.getElementById(`ts-${activeIdx}`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div className="container-app section">
      <div className="mb-3 flex items-center justify-between">
        <button className="btn-secondary text-small" onClick={() => navigate(-1)}>← Back to library</button>
        <div className="text-caption text-muted">{meta.duration}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_360px]">
        {/* Player column */}
        <div className="card p-0 overflow-hidden min-w-0">
          <div className="bg-black aspect-video">
            <video
              ref={videoRef}
              className="w-full h-full"
              controls
              src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
              onTimeUpdate={(e) => setCurrentTime((e.target as HTMLVideoElement).currentTime)}
            />
          </div>
          <div className="p-5">
            <h1 className="h2 mb-1">{meta.title}</h1>
            <div className="text-caption text-muted">Demo video • Transcript on the right</div>
          </div>
        </div>

        {/* Transcript column */}
        <aside className="card p-0 overflow-hidden min-w-0">
          <div className="border-b p-4 flex items-center justify-between">
            <div className="font-semibold">Transcript</div>
            <Link to="#" className="text-caption text-accent">Download</Link>
          </div>
          <div className="p-3 border-b">
            <input className="w-full rounded-full border px-4 py-2 text-small" placeholder="Search transcript…" />
          </div>
          <div className="max-h-[60vh] overflow-auto p-3 space-y-2">
            {mockTranscript.map((row, i) => {
              const isActive = i === activeIdx
              return (
                <button
                  key={i}
                  id={`ts-${i}`}
                  className={`w-full text-left rounded-[var(--radius)] px-3 py-2 hover:bg-[color:var(--color-accent-soft)] ${isActive ? 'bg-[color:var(--color-accent-soft)]' : ''}`}
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = row.s
                      videoRef.current.play().catch(() => {})
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-caption text-muted shrink-0">{row.t || formatTime(row.s)}</span>
                    <span className="text-small">{row.text}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}


