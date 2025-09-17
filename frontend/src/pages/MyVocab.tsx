import { FlashcardPractice } from '../components/FlashcardPractice'
import { useVocab } from '../context/VocabContext'

export function MyVocab() {
  const { savedList, clearAll, unsave } = useVocab()

  const hasAny = savedList.length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My vocab</h1>
        {hasAny && (
          <button className="btn-secondary" onClick={clearAll}>Clear all</button>
        )}
      </div>

      {!hasAny && (
        <p className="text-gray-600">You haven’t saved any words yet. Save words during practice to build your list.</p>
      )}

      {hasAny && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-white p-5">
            <h2 className="text-lg font-semibold mb-3">Saved words</h2>
            <ul className="space-y-2">
              {savedList.map(card => (
                <li key={card.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{card.front}</div>
                    <div className="text-sm text-gray-600">{card.back}</div>
                  </div>
                  <button className="btn-secondary" onClick={() => unsave(card.id)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-3">Practice saved</h2>
            <FlashcardPractice cards={savedList} />
          </div>
        </div>
      )}
    </div>
  )
}


