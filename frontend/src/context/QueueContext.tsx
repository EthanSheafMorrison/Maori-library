import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type QueueContextValue = {
  queuedById: Record<string, true>
  queuedIds: string[]
  isQueued: (id: string) => boolean
  add: (id: string) => void
  remove: (id: string) => void
  toggle: (id: string) => void
  clear: () => void
}

const QueueContext = createContext<QueueContextValue | undefined>(undefined)
const STORAGE_KEY = 'kupu-queue-v1'

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const [queuedById, setQueuedById] = useState<Record<string, true>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return {}
      const ids: string[] = JSON.parse(raw)
      return ids.reduce<Record<string, true>>((acc, id) => { acc[id] = true; return acc }, {})
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      const ids = Object.keys(queuedById)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
      // ignore
    }
  }, [queuedById])

  const queuedIds = useMemo(() => Object.keys(queuedById), [queuedById])

  function isQueued(id: string) {
    return Boolean(queuedById[id])
  }

  function add(id: string) {
    setQueuedById(prev => ({ ...prev, [id]: true }))
  }

  function remove(id: string) {
    setQueuedById(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  function toggle(id: string) {
    setQueuedById(prev => {
      const next = { ...prev }
      if (next[id]) delete next[id]
      else next[id] = true
      return next
    })
  }

  function clear() {
    setQueuedById({})
  }

  const value = useMemo<QueueContextValue>(() => ({
    queuedById,
    queuedIds,
    isQueued,
    add,
    remove,
    toggle,
    clear,
  }), [queuedById, queuedIds])

  return (
    <QueueContext.Provider value={value}>{children}</QueueContext.Provider>
  )
}

export function useQueue() {
  const ctx = useContext(QueueContext)
  if (!ctx) throw new Error('useQueue must be used within QueueProvider')
  return ctx
}


