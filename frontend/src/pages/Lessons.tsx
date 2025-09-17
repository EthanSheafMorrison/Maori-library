type Lesson = {
  id: string
  title: string
  description: string
  cards: { id: string; front: string; back: string }[]
}

const sampleLessons: Lesson[] = [
  {
    id: 'greetings',
    title: 'Ngā mihi (Greetings)',
    description: 'Common greetings and farewells',
    cards: [
      { id: '1', front: 'Kia ora', back: 'Hello' },
      { id: '2', front: 'Tēnā koe', back: 'Greetings to one person' },
      { id: '3', front: 'Ka kite', back: 'See you' },
    ],
  },
  {
    id: 'numbers',
    title: 'Ngā tau (Numbers 1–10)',
    description: 'Counting basics',
    cards: [
      { id: '4', front: 'Tahi', back: 'One' },
      { id: '5', front: 'Rua', back: 'Two' },
      { id: '6', front: 'Toru', back: 'Three' },
    ],
  },
]

export function Lessons() {
  return (
    <div>
      <h1 className="h1 mb-4">Lessons</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {sampleLessons.map(lesson => (
          <article key={lesson.id} className="card p-5">
            <h2 className="h2">{lesson.title}</h2>
            <p className="text-muted mb-3">{lesson.description}</p>
            <p className="text-sm text-muted">{lesson.cards.length} cards</p>
          </article>
        ))}
      </div>
    </div>
  )
}


