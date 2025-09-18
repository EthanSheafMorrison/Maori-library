import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { media, playlists } from '../data/media'
import { MediaCard } from '../components/MediaCard'

export function Playlist() {
  const { id } = useParams()
  const navigate = useNavigate()

  const playlist = useMemo(() => playlists.find(p => p.id === id), [id])
  const items = useMemo(() => media.filter(m => m.playlistId === id), [id])

  if (!playlist) {
    return (
      <div className="space-y-4">
        <div className="card p-4">
          <div className="h3 mb-2">Playlist not found</div>
          <button className="btn-secondary text-small" onClick={() => navigate(-1)}>Go back</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="h2">{playlist.title}</h1>
            {playlist.description && (
              <p className="text-muted text-small mt-1">{playlist.description}</p>
            )}
            <div className="text-caption text-muted mt-2">{items.length} videos</div>
          </div>
          <button className="btn-secondary text-small" onClick={() => navigate('/')}>← Home</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map(item => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}


