import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { media } from '../data/media'
import { useVocab } from '../context/VocabContext'
import type { VocabCard } from '../types'

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
  const { savedList, save, unsave } = useVocab()
  const [meaningByWord, setMeaningByWord] = useState<Record<string, string>>({})
  const [openTipKey, setOpenTipKey] = useState<string | null>(null)

  const currentMedia = useMemo(() => {
    const mediaId = state?.item?.id ?? id ?? '1'
    return media.find(m => m.id === mediaId)
  }, [id, state])

  const vocabByLowerFront = useMemo(() => {
    const lookup = new Map<string, VocabCard>()
    const cards = currentMedia?.cards ?? []
    for (const c of cards) {
      lookup.set(c.front.toLocaleLowerCase(), c)
    }
    return lookup
  }, [currentMedia])

  const activeIdx = useMemo(() => {
    let idx = 0
    for (let i = 0; i < mockTranscript.length; i++) {
      if (mockTranscript[i].s <= currentTime) idx = i
      else break
    }
    return idx
  }, [currentTime])

  const meta = useMemo(() => {
    const fallback = { id: id ?? '1', title: 'Kōrero hauora: te whare tapa whā i te mahi', duration: '3:45' }
    if (currentMedia) return { id: currentMedia.id, title: currentMedia.title, duration: currentMedia.duration }
    return state?.item ?? fallback
  }, [currentMedia, id, state])

  useEffect(() => {
    const el = document.getElementById(`ts-${activeIdx}`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  function renderTranscriptText(text: string) {
    // Match unicode words, including macrons and apostrophes/hyphens
    const wordRegex = /\p{L}[\p{L}\-’']*/gu
    const nodes: ReactNode[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = wordRegex.exec(text)) !== null) {
      const found = match[0]
      const start = match.index
      if (lastIndex < start) nodes.push(text.slice(lastIndex, start))

      const lower = found.toLocaleLowerCase()
      const mediaCard = vocabByLowerFront.get(lower)
      const savedCard = savedList.find(c => c.front.toLocaleLowerCase() === lower)
      const cardToShow = savedCard ?? mediaCard
      const meaningValue = meaningByWord[lower] ?? ''

      const tipKey = `${start}-${found}`
      nodes.push(
        <span key={tipKey} className="relative inline-flex items-center">
          <button
            type="button"
            className={cardToShow ? 'highlight' : 'underline decoration-dotted cursor-pointer'}
            aria-haspopup="dialog"
            aria-expanded={openTipKey === tipKey}
            onClick={(e) => { e.stopPropagation(); setOpenTipKey(prev => prev === tipKey ? null : tipKey) }}
          >
            {found}
          </button>
          <span
            className={`pointer-events-auto absolute left-1/2 -translate-x-1/2 bottom-full mb-2 ${openTipKey === tipKey ? 'block' : 'hidden'} whitespace-nowrap rounded-md border bg-white px-3 py-2 text-caption text-gray-700 shadow-md anim-fade-in z-10`}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-medium text-gray-900">{cardToShow?.front ?? found}</span>
            {cardToShow?.back && <span className="mx-1 text-gray-300">•</span>}
            {cardToShow?.back && <span>{cardToShow.back}</span>}
            {savedCard ? (
              <button
                className="pointer-events-auto btn-secondary !py-1 !px-2 !text-caption ml-2"
                onClick={(e) => { e.stopPropagation(); unsave(savedCard.id) }}
              >
                Remove
              </button>
            ) : mediaCard ? (
              <button
                className="pointer-events-auto btn-secondary !py-1 !px-2 !text-caption ml-2"
                onClick={(e) => { e.stopPropagation(); save(mediaCard) }}
              >
                Save
              </button>
            ) : (
              <span className="ml-2 inline-flex items-center gap-2">
                <input
                  className="pointer-events-auto border rounded px-2 py-1 text-caption"
                  placeholder="meaning"
                  value={meaningValue}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setMeaningByWord(prev => ({ ...prev, [lower]: e.target.value }))}
                />
                <button
                  className="pointer-events-auto btn-secondary !py-1 !px-2 !text-caption"
                  disabled={!meaningValue.trim()}
                  onClick={(e) => {
                    e.stopPropagation()
                    const newCard: VocabCard = { id: lower, front: found, back: meaningValue.trim() }
                    save(newCard)
                  }}
                >
                  Save
                </button>
              </span>
            )}
          </span>
        </span>
      )

      lastIndex = wordRegex.lastIndex
    }
    if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
    return nodes
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
                    <span className="text-small">{renderTranscriptText(row.text)}</span>
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


