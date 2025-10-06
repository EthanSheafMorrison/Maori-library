import { useNavigate } from 'react-router-dom'

type SidebarMenuProps = {
  search: string
  onSearchChange: (next: string) => void
}

export function SidebarMenu({ search, onSearchChange }: SidebarMenuProps) {
  const navigate = useNavigate()

  return (
    <div className="sidebar-sticky space-y-3">
      <div className="card p-4">
        <input
          className="w-full rounded-full border px-4 py-2 text-small ring-brand-focus"
          placeholder="Search titles or kupu (e.g., ‘pakihi’, ‘hauora’)"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      <nav className="card p-4 space-y-4">
        <button className="w-full flex items-center gap-3 text-left hover:opacity-80" onClick={() => navigate('/')}> 
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-pink-600">▶</span>
          <span className="font-medium">Watch</span>
        </button>
        <button className="w-full flex items-center gap-3 text-left hover:opacity-80" onClick={() => navigate('/series')}>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-cyan-100 text-cyan-600">▦</span>
          <span className="font-medium">Series</span>
        </button>
        <button className="w-full flex items-center gap-3 text-left hover:opacity-80" onClick={() => navigate('/library')}>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100 text-emerald-600">▣</span>
          <span className="font-medium">Library</span>
        </button>
        <button className="w-full flex items-center gap-3 text-left hover:opacity-80" onClick={() => navigate('/progress')}>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-indigo-100 text-indigo-600">▥</span>
          <span className="font-medium">Progress</span>
        </button>
        <button className="w-full flex items-center gap-3 text-left hover:opacity-80" onClick={() => navigate('/method')}>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-amber-100 text-amber-600">?</span>
          <span className="font-medium">Method</span>
        </button>
      </nav>
    </div>
  )
}

export default SidebarMenu


