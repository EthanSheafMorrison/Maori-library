import { useMemo, useState } from 'react'
import { useProgress } from '../context/ProgressContext'
import { Modal } from '../components/Modal'
import { IconBolt, IconCalendar, IconClock, IconFlame, IconMedal, IconShield, IconStar } from '../components/Icons'

export function Progress() {
  const { progress, reset } = useProgress()
  const [openOutside, setOpenOutside] = useState(false)
  const [outsideMinutesToAdd, setOutsideMinutesToAdd] = useState<number>(30)

  // Outside-hours simple local persistence
  const outsideHoursKey = 'kupu-outside-hours-v1'
  const [outsideMinutes, setOutsideMinutes] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(outsideHoursKey)
      return raw ? Number(raw) || 0 : 0
    } catch { return 0 }
  })
  function commitOutsideMinutes(totalMin: number) {
    const clamped = Math.max(0, Math.floor(totalMin))
    setOutsideMinutes(clamped)
    try { localStorage.setItem(outsideHoursKey, String(clamped)) } catch { /* ignore */ }
  }

  // Input-time metrics from watch history
  const totalWatchSec = useMemo(() => (progress.watchHistory || []).reduce((sum, d) => sum + (d.seconds || 0), 0), [progress.watchHistory])
  const totalInputHours = useMemo(() => (totalWatchSec + outsideMinutes * 60) / 3600, [totalWatchSec, outsideMinutes])

  // Month and calendar
  const today = useMemo(() => new Date(), [])
  const [viewYear, setViewYear] = useState<number>(today.getFullYear())
  const [viewMonth, setViewMonth] = useState<number>(today.getMonth())
  const monthLabel = useMemo(() => new Date(viewYear, viewMonth, 1).toLocaleString(undefined, { month: 'long', year: 'numeric' }), [viewYear, viewMonth])
  const watchSet = useMemo(() => new Set((progress.watchHistory || []).map(d => d.date)), [progress.watchHistory])
  const answeredSet = useMemo(() => new Set((progress.history || []).map(d => d.date)), [progress.history])

  const calendarDays = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1)
    const last = new Date(viewYear, viewMonth + 1, 0)
    // Sunday-first grid
    const start = new Date(first)
    start.setDate(first.getDate() - first.getDay())
    const end = new Date(last)
    end.setDate(last.getDate() + (6 - last.getDay()))
    const days: { iso: string; inMonth: boolean; active: boolean; day: number }[] = []
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const iso = new Date(d).toISOString().slice(0, 10)
      const active = watchSet.has(iso) || answeredSet.has(iso)
      days.push({ iso, inMonth: d.getMonth() === viewMonth, active, day: d.getDate() })
    }
    return days
  }, [viewYear, viewMonth, watchSet, answeredSet])

  // Weeks-in-a-row metric (weeks with any activity)
  const activeWeekKeys = useMemo(() => {
    function weekKey(iso: string) {
      const d = new Date(iso + 'T00:00:00')
      const tmp = new Date(d)
      const day = (d.getDay() + 6) % 7 // Monday=0
      tmp.setDate(d.getDate() - day + 3)
      const week1 = new Date(tmp.getFullYear(), 0, 4)
      const week = 1 + Math.round(((tmp.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
      return `${tmp.getFullYear()}-W${String(week).padStart(2, '0')}`
    }
    const union = new Set<string>()
    ;(progress.watchHistory || []).forEach(d => union.add(weekKey(d.date)))
    ;(progress.history || []).forEach(d => union.add(weekKey(d.date)))
    return union
  }, [progress.watchHistory, progress.history])
  const weeksInARow = useMemo(() => {
    const keys = new Set(activeWeekKeys)
    // iterate backward from this week
    function currentWeekKey(base = new Date()) {
      const d = new Date(base)
      const day = (d.getDay() + 6) % 7
      d.setDate(d.getDate() - day + 3)
      const week1 = new Date(d.getFullYear(), 0, 4)
      const week = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
      return { y: d.getFullYear(), w: week }
    }
    function keyOf(y: number, w: number) { return `${y}-W${String(w).padStart(2, '0')}` }
    let { y, w } = currentWeekKey(today)
    let count = 0
    while (keys.has(keyOf(y, w))) {
      count++
      w -= 1
      if (w <= 0) { y -= 1; const lastWeek = new Date(y, 11, 28) // always in last ISO week
        const d = currentWeekKey(lastWeek); w = d.w }
    }
    return count
  }, [activeWeekKeys, today])

  const hoursThisMonth = useMemo(() => {
    const year = today.getFullYear(); const month = today.getMonth()
    const inMonth = (iso: string) => { const d = new Date(iso + 'T00:00:00'); return d.getFullYear() === year && d.getMonth() === month }
    const sec = (progress.watchHistory || []).filter(d => inMonth(d.date)).reduce((s, d) => s + d.seconds, 0)
    return Math.round((sec / 3600) * 10) / 10
  }, [progress.watchHistory, today])

  // Levels based on input hours
  const thresholds = useMemo(() => [0, 50, 150, 300, 600], [])
  const inputLevel = useMemo(() => {
    const h = totalInputHours
    let lvl = 1
    for (let i = thresholds.length - 1; i >= 0; i--) { if (h >= thresholds[i]) { lvl = i + 1; break } }
    return lvl
  }, [totalInputHours, thresholds])
  const nextThreshold = thresholds[Math.min(thresholds.length - 1, inputLevel)]
  const hoursToNext = Math.max(0, Math.round((nextThreshold - totalInputHours) * 10) / 10)

  // Simple statistic: total minutes watched across all time
  const totalMinutesWatched = useMemo(() => Math.floor(totalWatchSec / 60), [totalWatchSec])

  return (
    <div>
      <h1 className="h1 mb-4">Your progress</h1>
      <div className="space-y-6">
        {/* Overview grid to mirror reference layout */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Left sidebar column */}
          <div className="space-y-4 md:col-span-1">
            <div className="card p-6">
              <div className="font-semibold mb-3 flex items-center gap-2"><span className="icon-circle accent"><IconShield /></span> Overall progression</div>
              <div className="text-muted text-caption mb-6">You are currently in</div>
              <div className="text-[2rem] font-semibold">Level {inputLevel}</div>
              <div className="mt-4">
                <div className="text-caption text-muted mb-1">Total input time</div>
                <div className="font-semibold" style={{ fontSize: 'var(--fs-3)' }}>{Math.round(totalInputHours * 10) / 10} hrs</div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 mt-2">
                  <div className="h-2 bg-blue-600" style={{ width: `${Math.min(100, (totalInputHours / thresholds[thresholds.length - 1]) * 100)}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-caption text-muted">
                  <span>Hours to level {inputLevel + 1}</span>
                  <span className="font-medium text-[color:var(--color-text)]">{hoursToNext} hrs</span>
                </div>
                <button className="btn-secondary w-full mt-4 text-small">Hours to level {inputLevel + 1} {hoursToNext} hrs</button>
              </div>
            </div>

            <div className="card p-6">
              <div className="font-semibold mb-3 flex items-center gap-2"><span className="icon-circle accent"><IconClock /></span> Outside hours</div>
              <div className="rounded-lg bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)] p-6 text-center mb-4">
                <div className="text-3xl font-bold">{Math.floor(outsideMinutes / 60)}</div>
                <div className="text-caption">hours outside the platform</div>
              </div>
              <div className="space-y-2">
                <button className="btn-secondary text-small w-full" onClick={() => setOpenOutside(true)}>Add hours outside the platform</button>
              </div>
            </div>

            <div className="card p-6">
              <div className="font-semibold mb-3 flex items-center gap-2"><span className="icon-circle accent"><IconStar /></span> Statistics</div>
              <div className="rounded-lg bg-gray-50 p-6 text-center">
                <div className="text-3xl font-bold">{totalMinutesWatched}</div>
                <div className="text-caption text-muted">minutes watched</div>
              </div>
            </div>
          </div>

          {/* Main area spanning two columns */}
          <div className="space-y-4 md:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold flex items-center gap-2"><span className="icon-circle accent"><IconCalendar /></span> Your activity</div>
                <div className="flex items-center gap-2">
                  <button aria-label="Previous month" className="row-arrow" onClick={() => {
                    const d = new Date(viewYear, viewMonth - 1, 1)
                    setViewYear(d.getFullYear()); setViewMonth(d.getMonth())
                  }}>‹</button>
                  <div className="font-medium">{monthLabel}</div>
                  <button aria-label="Next month" className="row-arrow" onClick={() => {
                    const d = new Date(viewYear, viewMonth + 1, 1)
                    setViewYear(d.getFullYear()); setViewMonth(d.getMonth())
                  }}>›</button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Metrics column */}
                <dl className="space-y-3">
                  <div className="rounded-lg border p-3">
                    <dt className="text-caption text-muted flex items-center gap-2"><span className="icon-circle muted"><IconFlame /></span> Current streak</dt>
                    <dd className="font-semibold" style={{ fontSize: 'var(--fs-3)' }}>{progress.streak}</dd>
                    <div className="h-1.5 w-full rounded-full bg-gray-200 mt-2">
                      <div className="h-1.5 rounded-full bg-[color:var(--color-accent)]" style={{ width: `${Math.min(100, (progress.streak / 7) * 100)}%` }} />
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <dt className="text-caption text-muted flex items-center gap-2"><span className="icon-circle muted"><IconBolt /></span> Weeks in a row</dt>
                    <dd className="font-semibold" style={{ fontSize: 'var(--fs-3)' }}>{weeksInARow}</dd>
                  </div>
                  <div className="rounded-lg border p-3">
                    <dt className="text-caption text-muted flex items-center gap-2"><span className="icon-circle muted"><IconClock /></span> Hours this month</dt>
                    <dd className="font-semibold" style={{ fontSize: 'var(--fs-3)' }}>{hoursThisMonth}</dd>
                  </div>
                </dl>
                {/* Calendar column */}
                <div>
                  <div className="grid grid-cols-7 gap-1 text-center justify-items-center">
                    {['M','T','W','T','F','S','S'].map((d,i) => (
                      <div key={i} className="text-caption text-muted">{d}</div>
                    ))}
                    {calendarDays.map((d, i) => (
                      <div
                        key={i}
                        className={`w-7 h-7 md:w-8 md:h-8 rounded-md flex items-center justify-center text-[10px] md:text-[11px] border ${d.active ? 'bg-[color:var(--color-accent-soft)] border-[color:var(--color-accent)] text-[color:var(--color-text)]' : 'bg-white border-gray-200'} ${d.inMonth ? '' : 'text-gray-400'}`}
                      >
                        {d.day}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold flex items-center gap-2"><span className="icon-circle accent"><IconMedal /></span> Levels</div>
              </div>
              <div className="space-y-2">
                {[1,2,3,4,5].map((lv) => {
                  const min = thresholds[lv-1]
                  const next = thresholds[Math.min(thresholds.length - 1, lv)]
                  const unlocked = inputLevel >= lv
                  return (
                    <div key={lv} className={`rounded-lg border p-3 flex items-center justify-between ${unlocked ? 'bg-white' : 'opacity-60'}`}>
                      <div className="flex items-center gap-3">
                        <span className={`icon-circle ${unlocked ? 'accent' : 'muted'}`}>
                          {lv <= 2 ? <IconShield /> : lv === 3 ? <IconStar /> : <IconMedal />}
                        </span>
                        <div className="font-medium">Level {lv}</div>
                      </div>
                        <div className="text-caption text-muted">Hours of input: {min}</div>
                      <div className="w-40 h-1.5 rounded-full bg-gray-200">
                        <div className="h-1.5 rounded-full bg-[color:var(--color-accent)]" style={{ width: `${Math.max(0, Math.min(100, ((totalInputHours - min) / Math.max(1, (next - min))) * 100))}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            {/* Badges section */}
            <div className="card p-6">
              <div className="font-semibold mb-2 flex items-center gap-2"><span className="icon-circle accent"><IconStar /></span> Badges</div>
              <div className="flex flex-wrap gap-3">
                <Badge unlocked={progress.streak >= 3} label="3-day streak" icon={<IconFlame />} />
                <Badge unlocked={progress.streak >= 7} label="7-day streak" icon={<IconFlame />} />
                <Badge unlocked={weeksInARow >= 4} label="4 weeks" icon={<IconCalendar />} />
                <Badge unlocked={hoursThisMonth >= 5} label=">=5h this month" icon={<IconClock />} />
                <Badge unlocked={inputLevel >= 2} label="Level 2" icon={<IconMedal />} />
              </div>
            </div>
          </div>
        </div>

        <button className="btn-secondary" onClick={reset}>Reset progress</button>
      </div>

      {/* Outside hours modal */}
      <Modal open={openOutside} onClose={() => setOpenOutside(false)} title="Add outside hours">
        <div className="space-y-3">
          <div className="text-small text-muted">Log time you studied outside the app this month.</div>
          <div className="flex items-center gap-2">
            <input className="w-20 rounded border px-2 py-1 text-small" type="number" min={5} max={600} value={outsideMinutesToAdd} onChange={e => setOutsideMinutesToAdd(Number(e.target.value))} />
            <span className="text-small text-muted">minutes</span>
          </div>
          <div className="flex justify-end gap-2">
            <button className="btn-secondary text-small" onClick={() => setOpenOutside(false)}>Cancel</button>
            <button className="btn-primary text-small" onClick={() => { commitOutsideMinutes(outsideMinutes + outsideMinutesToAdd); setOpenOutside(false); }}>Save</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function Badge({ unlocked, label, icon }: { unlocked: boolean; label: string; icon: React.ReactNode }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${unlocked ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
      <span className="inline-flex items-center justify-center w-5 h-5">{icon}</span>
      {unlocked ? '🏅 ' : '🔒 '} {label}
    </div>
  )
}
