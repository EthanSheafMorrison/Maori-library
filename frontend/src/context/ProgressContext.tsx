import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type DayStat = { date: string; answered: number; correct: number; xp: number }

type ProgressState = {
  totalAnswered: number
  totalCorrect: number
  lastUpdated: string | null
  xp: number
  streak: number
  lastActiveDate: string | null
  history: DayStat[]
}

type ProgressContextValue = {
  progress: ProgressState
  accuracy: number
  recordAnswer: (correct: boolean) => void
  reset: () => void
}

const defaultState: ProgressState = {
  totalAnswered: 0,
  totalCorrect: 0,
  lastUpdated: null,
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  history: [],
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined)

const STORAGE_KEY = 'kupu-progress-v1'

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return defaultState
      const parsed = JSON.parse(raw) as Partial<ProgressState>
      return {
        ...defaultState,
        ...parsed,
        xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
        streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
        lastActiveDate: typeof parsed.lastActiveDate === 'string' ? parsed.lastActiveDate : null,
        history: Array.isArray(parsed.history) ? parsed.history : [],
      }
    } catch {
      return defaultState
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      // ignore storage errors
    }
  }, [progress])

  const accuracy = useMemo(() => {
    if (progress.totalAnswered === 0) return 0
    return Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
  }, [progress])

  function recordAnswer(correct: boolean) {
    setProgress(prev => {
      const now = new Date()
      const today = now.toISOString().slice(0, 10)

      // Update streak
      let streak = prev.streak
      if (!prev.lastActiveDate) {
        streak = 1
      } else {
        const prevDate = new Date(prev.lastActiveDate + 'T00:00:00')
        const diffDays = Math.floor((+now - +prevDate) / (1000 * 60 * 60 * 24))
        if (diffDays === 0) {
          // same day, keep streak
        } else if (diffDays === 1) {
          streak = prev.streak + 1
        } else if (diffDays > 1) {
          streak = 1
        }
      }

      // XP: +10 per correct, +2 per attempt bonus
      const gained = (correct ? 10 : 0) + 2

      // Update or insert today's history entry
      const history = [...prev.history]
      const lastIdx = history.length - 1
      if (lastIdx >= 0 && history[lastIdx].date === today) {
        history[lastIdx] = {
          ...history[lastIdx],
          answered: history[lastIdx].answered + 1,
          correct: history[lastIdx].correct + (correct ? 1 : 0),
          xp: history[lastIdx].xp + gained,
        }
      } else {
        history.push({ date: today, answered: 1, correct: correct ? 1 : 0, xp: gained })
      }

      return {
        totalAnswered: prev.totalAnswered + 1,
        totalCorrect: prev.totalCorrect + (correct ? 1 : 0),
        lastUpdated: now.toISOString(),
        xp: prev.xp + gained,
        streak,
        lastActiveDate: today,
        history,
      }
    })
  }

  function reset() {
    setProgress(defaultState)
  }

  const value = useMemo<ProgressContextValue>(() => ({
    progress,
    accuracy,
    recordAnswer,
    reset,
  }), [progress, accuracy])

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}


