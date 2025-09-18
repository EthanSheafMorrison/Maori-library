import { useMemo, useState } from 'react'
import { useProgress } from '../context/ProgressContext'
import type { VocabCard } from '../types'
import { useVocab } from '../context/VocabContext'

export type Card = VocabCard

export function FlashcardPractice({ cards, lessonId }: { cards: Card[]; lessonId?: string }) {
  const { recordAnswer } = useProgress()
  const { isSaved, toggle } = useVocab()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const [answered, setAnswered] = useState<{ id: string; correct: boolean }[]>([])

  const current = cards[currentIndex]
  const isComplete = currentIndex >= cards.length

  const accuracy = useMemo(() => {
    if (answered.length === 0) return 0
    const correct = answered.filter(a => a.correct).length
    return Math.round((correct / answered.length) * 100)
  }, [answered])

  function handleReveal() {
    setIsRevealed(true)
  }

  function handleAnswer(correct: boolean) {
    if (!current) return
    setAnswered(prev => [...prev, { id: current.id, correct }])
    recordAnswer(correct, current.id, lessonId)
    setIsRevealed(false)
    setCurrentIndex(i => i + 1)
  }

  function handleRestart() {
    setCurrentIndex(0)
    setIsRevealed(false)
    setAnswered([])
  }

  if (cards.length === 0) {
    return <p>No cards available.</p>
  }

  if (isComplete) {
    return (
      <div className="mx-auto max-w-md rounded-lg border bg-white p-6 text-center shadow-sm">
        <h2 className="text-2xl font-semibold mb-2">Session complete</h2>
        <p className="text-gray-600 mb-4">
          You answered {answered.filter(a => a.correct).length} of {answered.length} correctly ({accuracy}%).
        </p>
        <button className="btn-primary" onClick={handleRestart}>
          Practice again
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-lg border bg-white p-6 shadow-sm relative">
        {current && (
          <button
            aria-label={isSaved(current.id) ? 'Unsave word' : 'Save word'}
            className="absolute right-4 top-4 text-yellow-500 hover:text-yellow-600"
            onClick={() => toggle(current)}
            title={isSaved(current.id) ? 'Unsave' : 'Save'}
          >
            {isSaved(current.id) ? '★' : '☆'}
          </button>
        )}
        <div className="mb-4 text-sm text-gray-500">Card {currentIndex + 1} of {cards.length}</div>
        <div className="min-h-40 mb-6 flex items-center justify-center rounded-lg border bg-gray-50 p-6 text-center">
          <div>
            <div className="text-2xl font-bold mb-2">{current.front}</div>
            {isRevealed && (
              <div className="text-lg text-gray-700">{current.back}</div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center gap-3">
          {!isRevealed ? (
            <button className="btn-primary" onClick={handleReveal}>Reveal</button>
          ) : (
            <>
              <button className="btn-secondary" onClick={() => handleAnswer(false)}>Need practice</button>
              <button className="btn-primary" onClick={() => handleAnswer(true)}>I knew it</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Utility component-scoped classes via Tailwind's @apply directive
// Defined here to keep JSX minimal
// Note: requires Tailwind to be active in the project
// Using global CSS utilities in index.css isn't necessary with v4


