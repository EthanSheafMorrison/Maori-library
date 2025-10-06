import { useMemo, useState } from 'react'
import { useProgress } from '../context/ProgressContext'
import { Modal } from './Modal'

function formatMinutes(totalSec: number) {
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${min}:${String(sec).padStart(2, '0')}`
}

export function DailyGoal() {
  const { progress, setGoalMinutes } = useProgress()
  const [open, setOpen] = useState(false)
  const [custom, setCustom] = useState(progress.goalMinutes)

  const goalSec = progress.goalMinutes * 60
  const clamped = Math.min(progress.watchedTodaySec, goalSec)
  const pct = Math.min(100, Math.round((clamped / goalSec) * 100))
  const remain = Math.max(0, goalSec - progress.watchedTodaySec)

  const presets = useMemo(() => [
    { label: 'Casual', minutes: 15, help: 'Keeping your skills fresh' },
    { label: 'Learner', minutes: 30, help: 'Making progress every day' },
    { label: 'Serious', minutes: 60, help: 'Making progress very quickly' },
  ], [])

  return (
    <div className="inline-flex items-center gap-2">
      <button
        className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-surface)] px-3 py-1 text-sm text-[color:var(--color-text)] shadow-sm hover:bg-[color:var(--color-accent-soft)] ring-brand-focus"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <span className="relative block h-6 w-6 rounded-full overflow-hidden bg-[color:var(--color-accent-soft)]">
          <span
            className="absolute left-0 bottom-0 h-full bg-[color:var(--color-accent)]"
            style={{ width: `${pct}%` }}
            aria-hidden
          />
        </span>
        <span>{pct}%</span>
      </button>

      <Modal open={open} onClose={() => { setOpen(false); setCustom(progress.goalMinutes) }} title="Daily goal">
        <div className="space-y-3">
          <div className="text-small text-muted">{`Today: ${formatMinutes(progress.watchedTodaySec)} / ${progress.goalMinutes} min`}</div>
          <div className="space-y-2">
            {presets.map(p => (
              <button
                key={p.minutes}
                className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left ${custom === p.minutes ? 'bg-[color:var(--color-accent-soft)] border-[color:var(--color-accent)]' : 'hover:bg-[color:var(--color-accent-soft)]'}`}
                onClick={() => setCustom(p.minutes)}
              >
                <span>
                  <div className="font-medium">{p.label}</div>
                  <div className="text-caption text-muted">{p.help}</div>
                </span>
                <span className="text-sm">{p.minutes} min/day</span>
              </button>
            ))}
            <div className="rounded-lg border p-3">
              <div className="font-medium mb-2">Choose your own goal</div>
              <div className="flex items-center gap-2">
                <input
                  className="w-16 rounded border px-2 py-1 text-small"
                  type="number"
                  min={5}
                  max={180}
                  value={custom}
                  onChange={e => setCustom(Number(e.target.value))}
                />
                <span className="text-small text-muted">min/day</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button className="btn-secondary text-small" onClick={() => { setOpen(false); setCustom(progress.goalMinutes) }}>Cancel</button>
            <button className="btn-primary text-small" onClick={() => { setGoalMinutes(custom); setOpen(false) }}>Save</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

