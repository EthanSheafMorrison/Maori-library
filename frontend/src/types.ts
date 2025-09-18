export type VocabCard = {
  id: string
  front: string
  back: string
}


// Media types shared across the app
export type Playlist = {
  id: string
  title: string
  description?: string
}

export type MediaItem = {
  id: string
  title: string
  duration: string
  familiarity: number
  cards: VocabCard[]
  playlistId?: string
  tags?: string[]
  addedAt?: string // ISO date string for sorting by recency
  hasTranscript?: boolean
}


