import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { VocabCard } from '../types'

type VocabContextValue = {
  savedById: Record<string, VocabCard>
  savedList: VocabCard[]
  isSaved: (id: string) => boolean
  save: (card: VocabCard) => void
  unsave: (id: string) => void
  toggle: (card: VocabCard) => void
  clearAll: () => void
}

const VocabContext = createContext<VocabContextValue | undefined>(undefined)
const STORAGE_KEY = 'kupu-vocab-v1'

export function VocabProvider({ children }: { children: React.ReactNode }) {
  const [savedById, setSavedById] = useState<Record<string, VocabCard>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as Record<string, VocabCard>) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedById))
    } catch {
      // ignore storage errors
    }
  }, [savedById])

  const savedList = useMemo(() => Object.values(savedById), [savedById])

  function isSaved(id: string) {
    return Boolean(savedById[id])
  }

  function save(card: VocabCard) {
    setSavedById(prev => ({ ...prev, [card.id]: card }))
  }

  function unsave(id: string) {
    setSavedById(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  function toggle(card: VocabCard) {
    setSavedById(prev => {
      const next = { ...prev }
      if (next[card.id]) {
        delete next[card.id]
      } else {
        next[card.id] = card
      }
      return next
    })
  }

  function clearAll() {
    setSavedById({})
  }

  const value = useMemo<VocabContextValue>(() => ({
    savedById,
    savedList,
    isSaved,
    save,
    unsave,
    toggle,
    clearAll,
  }), [savedById, savedList])

  return (
    <VocabContext.Provider value={value}>{children}</VocabContext.Provider>
  )
}

export function useVocab() {
  const ctx = useContext(VocabContext)
  if (!ctx) throw new Error('useVocab must be used within VocabProvider')
  return ctx
}


