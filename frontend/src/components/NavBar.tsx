import { NavLink } from 'react-router-dom'
import { useVocab } from '../context/VocabContext'

export function NavBar() {
  const { savedList } = useVocab()
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'text-[color:var(--color-accent)] font-semibold'
      : 'text-gray-700 hover:text-[color:var(--color-accent)]'

  return (
    <header className="bg-[color:var(--color-surface)] border-b">
      <div className="container-app py-3 flex items-center justify-between">
        <NavLink to="/" className="h3 font-bold">
          Kotahi
        </NavLink>
        <nav className="flex items-center gap-6">
          <NavLink to="/lessons" className={linkClass}>
            Lessons
          </NavLink>
          <NavLink to="/practice" className={linkClass}>
            Practice
          </NavLink>
          <NavLink to="/my-vocab" className={linkClass}>
            My Vocab{savedList.length ? ` (${savedList.length})` : ''}
          </NavLink>
          <NavLink to="/progress" className={linkClass}>
            Progress
          </NavLink>
        </nav>
      </div>
    </header>
  )
}


