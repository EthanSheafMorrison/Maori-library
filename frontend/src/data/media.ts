import type { MediaItem, Playlist } from '../types'

export const playlists: Playlist[] = [
  { id: 'hauora', title: 'Kōrero Hauora', description: 'Health and wellbeing kōrero' },
  { id: 'pakihi', title: 'Pakihi Māori', description: 'Business and enterprise' },
  { id: 'hangarau', title: 'Te Ao Hangarau', description: 'Technology and innovation' },
  { id: 'purakau', title: 'Pūrākau', description: 'Stories and legends' },
]

export const media: MediaItem[] = [
  {
    id: '1',
    title: 'He kupu mō te pakihi iti',
    duration: '4:12',
    familiarity: 62,
    playlistId: 'pakihi',
    tags: ['pakihi', 'kaupapa'],
    hasTranscript: true,
    addedAt: '2025-09-10',
    cards: [
      { id: 'biz1', front: 'pakihi', back: 'business' },
      { id: 'biz2', front: 'kaihoko', back: 'customer' },
    ],
  },
  {
    id: '2',
    title: 'Kōrero hauora: te whare tapa whā i te mahi',
    duration: '3:45',
    familiarity: 74,
    playlistId: 'hauora',
    tags: ['hauora', 'tinana'],
    hasTranscript: true,
    addedAt: '2025-09-14',
    cards: [
      { id: 'health1', front: 'hauora', back: 'health, wellbeing' },
      { id: 'health2', front: 'tinana', back: 'body' },
    ],
  },
  {
    id: '3',
    title: 'Pūrākau: Māui me te rā',
    duration: '5:01',
    familiarity: 55,
    playlistId: 'purakau',
    tags: ['pūrākau', 'Māui'],
    hasTranscript: false,
    addedAt: '2025-09-16',
    cards: [
      { id: 'story1', front: 'pūrākau', back: 'legend, story' },
      { id: 'story2', front: 'Māui', back: 'demigod Māui' },
    ],
  },
  {
    id: '4',
    title: 'Te ao hangarau: kupu hou mō te AI',
    duration: '2:58',
    familiarity: 43,
    playlistId: 'hangarau',
    tags: ['hangarau', 'AI'],
    hasTranscript: true,
    addedAt: '2025-09-17',
    cards: [
      { id: 'ai1', front: 'hangarau', back: 'technology' },
      { id: 'ai2', front: 'mātai mariko', back: 'artificial intelligence' },
    ],
  },
]


