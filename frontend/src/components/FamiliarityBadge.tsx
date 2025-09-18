import { useState } from 'react'
import { Modal } from './Modal'
export function FamiliarityBadge({ value, size = 40 }: { value: number; size?: number }) {
  const [open, setOpen] = useState(false)
  const [learnMore, setLearnMore] = useState(false)
  const clamped = Math.max(0, Math.min(100, Math.round(value)))
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - clamped / 100)
  const strokeColor = clamped < 40 ? '#ef4444' : clamped < 70 ? '#f59e0b' : '#10b981'
  const levelText = clamped < 40 ? 'Low' : clamped < 70 ? 'Medium' : 'High'
  const tooltip = `${levelText} familiarity — ${clamped}%. Rough guide: Low < 40, Medium 40–69, High ≥ 70.`

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-full bg-white/90 shadow-[0_1px_6px_rgba(0,0,0,0.25)] ring-1 ring-white/70 relative group focus:outline-none"
      style={{ width: size, height: size }}
      aria-label={`Familiarity: ${clamped} percent (${levelText})`}
      aria-expanded={open}
      onClick={(e) => { e.stopPropagation(); setOpen(v => !v) }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transform: `rotate(-90deg)`, transformOrigin: '50% 50%' }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize={size * 0.35}
          fill="#111111"
        >
          {clamped}
        </text>
      </svg>
      {!open && (
        <div className="pointer-events-none absolute top-full mt-2 right-0 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-[10px] text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 z-20">
          {tooltip}
        </div>
      )}
      {open && (
        <div className="absolute top-full mt-2 right-0 z-30 w-64 rounded-lg bg-white p-3 text-[12px] text-gray-800 shadow-xl ring-1 ring-black/10">
          <div className="font-medium mb-1">Familiarity</div>
          <p className="mb-2">
            This estimates how familiar you are with kupu in this video based on saved words and practice.
          </p>
          <ul className="list-disc ml-4 mb-2">
            <li>Low: below 40%</li>
            <li>Medium: 40–69%</li>
            <li>High: 70% or more</li>
          </ul>
          <div className="flex justify-between items-center gap-2">
            <button className="text-[11px] underline text-[color:var(--color-accent)]" onClick={(e) => { e.stopPropagation(); setLearnMore(true) }}>Why is this important?</button>
            <button className="btn-secondary text-small" onClick={(e) => { e.stopPropagation(); setOpen(false) }}>Close</button>
          </div>
        </div>
      )}
      <Modal open={learnMore} onClose={() => setLearnMore(false)} title="Why familiarity matters">
        <p>
          Building familiarity with kupu helps your comprehension grow faster. Videos with higher familiarity let you reinforce known words, while lower familiarity exposes you to new vocabulary at the right challenge level.
        </p>
        <ul className="list-disc ml-5 my-3">
          <li>Target High familiarity for quick wins and confidence</li>
          <li>Mix Medium to introduce new kupu while staying comfortable</li>
          <li>Sprinkle Low to stretch and learn fresh vocabulary</li>
        </ul>
        <p>
          Use filters to find videos with transcripts and topics you know. As you save words and practice, your familiarity will update.
        </p>
      </Modal>
    </button>
  )
}


