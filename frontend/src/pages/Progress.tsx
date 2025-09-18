import { useMemo } from 'react'
import { useProgress } from '../context/ProgressContext'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function Progress() {
  const { progress, accuracy, reset } = useProgress()
  const level = useMemo(() => Math.floor(progress.xp / 200) + 1, [progress.xp])
  const levelTitle = useMemo(() => {
    const map = ['Kākano', 'Akonga', 'Kaiako', 'Pouako', 'Tohunga']
    return map[Math.min(map.length - 1, level - 1)]
  }, [level])
  const levelProgress = useMemo(() => progress.xp % 200, [progress.xp])
  const weekData = useMemo(() => {
    const base = Array.isArray(progress.history) ? progress.history : []
    const days = [...base]
    // ensure last 7 days present
    const today = new Date()
    const map: Record<string, { date: string; xp: number; answered: number }> = {}
    days.forEach(d => { map[d.date] = { date: d.date, xp: d.xp, answered: d.answered } })
    for (let i = 6; i >= 0; i--) {
      const dt = new Date(+today - i * 86400000)
      const key = dt.toISOString().slice(0, 10)
      if (!map[key]) map[key] = { date: key, xp: 0, answered: 0 }
    }
    const entries = Object.values(map).sort((a, b) => a.date.localeCompare(b.date))
    return entries.map(e => ({ day: new Date(e.date).toLocaleDateString(undefined, { weekday: 'short' }), xp: e.xp, answered: e.answered }))
  }, [progress.history])

  return (
    <div>
      <h1 className="h1 mb-4">Your progress</h1>
      <div className="space-y-6">
        <div className="card p-6">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <dt className="text-muted text-caption">Answered</dt>
              <dd className="font-semibold" style={{ fontSize: 'var(--fs-2)' }}>{progress.totalAnswered}</dd>
            </div>
            <div>
              <dt className="text-muted text-caption">Correct</dt>
              <dd className="font-semibold" style={{ fontSize: 'var(--fs-2)' }}>{progress.totalCorrect}</dd>
            </div>
            <div>
              <dt className="text-muted text-caption">Accuracy</dt>
              <dd className="font-semibold" style={{ fontSize: 'var(--fs-2)' }}>{accuracy}%</dd>
            </div>
            <div>
              <dt className="text-muted text-caption">Streak</dt>
              <dd className="font-semibold" style={{ fontSize: 'var(--fs-2)' }}>{progress.streak} days</dd>
            </div>
          </dl>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Level {level}: {levelTitle}</div>
              <div className="text-sm text-gray-500">{levelProgress}/200 XP</div>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
              <div className="h-3 bg-blue-600" style={{ width: `${(levelProgress / 200) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="h2 mb-4">Last 7 days</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="xp" name="XP" fill="#2563eb" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="h2 mb-2">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <Badge unlocked={progress.streak >= 3} label="3-day streak" />
            <Badge unlocked={progress.streak >= 7} label="7-day streak" />
            <Badge unlocked={progress.streak >= 30} label="Monthly streak" />
            <Badge unlocked={progress.totalAnswered >= 50} label="50 answers" />
            <Badge unlocked={progress.totalCorrect >= 50} label="50 correct" />
            <Badge unlocked={progress.xp >= 1000} label="1000 XP" />
          </div>
        </div>

        <button className="btn-secondary" onClick={reset}>Reset progress</button>
      </div>
    </div>
  )
}

function Badge({ unlocked, label }: { unlocked: boolean; label: string }) {
  return (
    <div className={`rounded-full border px-3 py-1 text-sm ${unlocked ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
      {unlocked ? '🏅 ' : '🔒 '} {label}
    </div>
  )
}


