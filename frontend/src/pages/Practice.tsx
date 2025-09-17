import { FlashcardPractice, type Card } from '../components/FlashcardPractice'

const cards: Card[] = [
  { id: '1', front: 'Kia ora', back: 'Hello' },
  { id: '2', front: 'Tēnā koe', back: 'Greetings (to one person)' },
  { id: '3', front: 'Whānau', back: 'Family' },
  { id: '4', front: 'Waiata', back: 'Song' },
]

export function Practice() {
  return (
    <div>
      <h1 className="h1 mb-4">Quick practice</h1>
      <FlashcardPractice cards={cards} />
    </div>
  )
}


