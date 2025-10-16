import { Flame } from './Flame'
// import { DailyGoal } from './DailyGoal'
import { useProgress } from '../context/ProgressContext'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

type TopToolbarProps = {
  onToggleFilters?: () => void
  activeFiltersCount?: number
}

export function TopToolbar({ onToggleFilters, activeFiltersCount = 0 }: TopToolbarProps) {
  const { progress } = useProgress()
  const navigate = useNavigate()
  const streakPill = useMemo(() => `Continue streak: ${progress.streak || 0} day${(progress.streak || 0) === 1 ? '' : 's'}`,[progress.streak])

  return (
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
        {onToggleFilters && (
          <button className="btn-secondary text-small" onClick={onToggleFilters}>
            Filter
            {activeFiltersCount > 0 && (
              <span className="meta-pill ml-2">{activeFiltersCount}</span>
            )}
          </button>
        )}
        <button className="btn-secondary text-small" onClick={() => navigate('/my-queues')}>My queues</button>
      </div>
    </div>
  )
}

export default TopToolbar


