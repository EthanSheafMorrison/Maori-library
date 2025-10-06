import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type DayStat = { date: string; answered: number; correct: number; xp: number }
type WatchDay = { date: string; seconds: number }
type LearnedMap = Record<string, number> // cardId -> consecutive correct count
type LessonProgress = Record<string, { learned: number; total: number }>

type ProgressState = {
  totalAnswered: number
  totalCorrect: number
  lastUpdated: string | null
  xp: number
  streak: number
  lastActiveDate: string | null
  history: DayStat[]
  watchHistory: WatchDay[]
  learnedByCard: LearnedMap
  lessonProgress: LessonProgress
  goalMinutes: number
  watchedTodaySec: number
}

type ProgressContextValue = {
  progress: ProgressState
  accuracy: number
  recordAnswer: (correct: boolean, cardId?: string, lessonId?: string) => void
  recordWatch: (seconds: number) => void
  setGoalMinutes: (minutes: number) => void
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
  watchHistory: [],
  learnedByCard: {},
  lessonProgress: {},
  goalMinutes: 15,
  watchedTodaySec: 0,
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined)

const STORAGE_KEY = 'kupu-progress-v1'

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return defaultState
      type ParsedProgress = Partial<ProgressState> & { watchHistory?: WatchDay[]; goalMinutes?: number; watchedTodaySec?: number }
      const parsed = JSON.parse(raw) as ParsedProgress
      return {
        ...defaultState,
        ...parsed,
        xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
        streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
        lastActiveDate: typeof parsed.lastActiveDate === 'string' ? parsed.lastActiveDate : null,
        history: Array.isArray(parsed.history) ? parsed.history : [],
        watchHistory: Array.isArray(parsed.watchHistory) ? parsed.watchHistory as WatchDay[] : [],
        learnedByCard: parsed && typeof parsed === 'object' && parsed['learnedByCard'] && typeof parsed['learnedByCard'] === 'object' ? (parsed['learnedByCard'] as LearnedMap) : {},
        lessonProgress: parsed && typeof parsed === 'object' && parsed['lessonProgress'] && typeof parsed['lessonProgress'] === 'object' ? (parsed['lessonProgress'] as LessonProgress) : {},
        goalMinutes: typeof parsed.goalMinutes === 'number' ? parsed.goalMinutes : 15,
        watchedTodaySec: typeof parsed.watchedTodaySec === 'number' ? parsed.watchedTodaySec : 0,
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

  function recordAnswer(correct: boolean, cardId?: string, lessonId?: string) {
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

      // Reset watched counter if new day
      const watchedTodaySec = prev.lastActiveDate === today ? prev.watchedTodaySec : 0

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

      // Learned tracking
      const learnedByCard: LearnedMap = { ...prev.learnedByCard }
      if (cardId) {
        const current = learnedByCard[cardId] || 0
        learnedByCard[cardId] = correct ? Math.min(current + 1, 3) : 0
      }

      // Lesson progress aggregation (consider learned when streak >= 2)
      const lessonProgress: LessonProgress = { ...prev.lessonProgress }
      if (lessonId && cardId) {
        const entry = lessonProgress[lessonId] || { learned: 0, total: 0 }
        // total increases only first time we see the card for that lesson in this map
        if (!prev.lessonProgress[lessonId] || prev.lessonProgress[lessonId]!.total === entry.total) {
          // We'll approximate total by counting unique cards encountered; caller should keep stable ids
          entry.total = Math.max(entry.total, (entry.total || 0) + (learnedByCard[cardId] === (correct ? 1 : 0) ? 1 : 0))
        }
        const wasLearned = (prev.learnedByCard[cardId] || 0) >= 2
        const isLearned = (learnedByCard[cardId] || 0) >= 2
        if (!wasLearned && isLearned) entry.learned = Math.max(0, entry.learned + 1)
        if (wasLearned && !isLearned) entry.learned = Math.max(0, entry.learned - 1)
        lessonProgress[lessonId] = entry
      }

      return {
        totalAnswered: prev.totalAnswered + 1,
        totalCorrect: prev.totalCorrect + (correct ? 1 : 0),
        lastUpdated: now.toISOString(),
        xp: prev.xp + gained,
        streak,
        lastActiveDate: today,
        history,
        watchHistory: prev.watchHistory, // unchanged here
        learnedByCard,
        lessonProgress,
        goalMinutes: prev.goalMinutes,
        watchedTodaySec,
      }
    })
  }

  function recordWatch(seconds: number) {
    if (!Number.isFinite(seconds) || seconds <= 0) return
    setProgress(prev => {
      const now = new Date()
      const today = now.toISOString().slice(0, 10)

      // Update streak similar to answering
      let streak = prev.streak
      if (!prev.lastActiveDate) {
        streak = 1
      } else {
        const prevDate = new Date(prev.lastActiveDate + 'T00:00:00')
        const diffDays = Math.floor((+now - +prevDate) / (1000 * 60 * 60 * 24))
        if (diffDays === 0) {
          // same day
        } else if (diffDays === 1) {
          streak = prev.streak + 1
        } else if (diffDays > 1) {
          streak = 1
        }
      }

      const base = prev.lastActiveDate === today ? prev.watchedTodaySec : 0

      // Update or insert today's watch history entry
      const watchHistory: WatchDay[] = [...(prev.watchHistory || [])]
      const lastIdx = watchHistory.length - 1
      if (lastIdx >= 0 && watchHistory[lastIdx].date === today) {
        watchHistory[lastIdx] = { date: today, seconds: watchHistory[lastIdx].seconds + Math.floor(seconds) }
      } else {
        watchHistory.push({ date: today, seconds: Math.floor(seconds) })
      }

      return {
        ...prev,
        lastUpdated: now.toISOString(),
        lastActiveDate: today,
        streak,
        watchedTodaySec: base + Math.floor(seconds),
        watchHistory,
      }
    })
  }

  function setGoalMinutes(minutes: number) {
    const clamped = Math.max(5, Math.min(180, Math.floor(minutes)))
    setProgress(prev => ({ ...prev, goalMinutes: clamped }))
  }

  function reset() {
    setProgress(defaultState)
  }

  const value = useMemo<ProgressContextValue>(() => ({
    progress,
    accuracy,
    recordAnswer,
    recordWatch,
    setGoalMinutes,
    reset,
  }), [progress, accuracy])

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}


