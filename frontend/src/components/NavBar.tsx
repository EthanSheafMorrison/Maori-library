import { NavLink } from 'react-router-dom'
import { useVocab } from '../context/VocabContext'
import { useQueue } from '../context/QueueContext'
// Daily goal button moved to Home toolbar

export function NavBar() {
  const { savedList } = useVocab()
  const { queuedIds } = useQueue()
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'inline-flex items-center rounded-full px-3 py-1 text-sm text-[color:var(--color-surface)] bg-[color:var(--color-surface)]/20'
      : 'inline-flex items-center rounded-full px-3 py-1 text-sm text-[color:var(--color-surface)] opacity-80 hover:opacity-100 hover:bg-[color:var(--color-surface)]/10'

  return (
    <header className="border-b border-transparent">
      <div className="container-app py-4">
        <div className="flex items-center justify-between rounded-full bg-[color:var(--color-accent)] px-4 py-2 shadow-[var(--shadow-card)]">
          <NavLink to="/" className="h3 font-bold text-[color:var(--color-surface)]">
            Tokotoko
          </NavLink>
          <nav className="flex items-center gap-6">
            <NavLink to="/lessons" className={linkClass}>
              Lessons
            </NavLink>
            <NavLink to="/practice" className={linkClass}>
              Practice
            </NavLink>
            <NavLink to="/method" className={linkClass}>
              Method
            </NavLink>
            <NavLink to="/my-vocab" className={linkClass}>
              My Vocab{savedList.length ? ` (${savedList.length})` : ''}
            </NavLink>
            <NavLink to="/my-queues" className={linkClass}>
              My Queues{queuedIds.length ? ` (${queuedIds.length})` : ''}
            </NavLink>
            <NavLink
              to="/progress"
              aria-label="Profile"
              className={() => 'inline-flex items-center rounded-full bg-[color:var(--color-surface)] px-[var(--btn-px)] py-[var(--btn-py)] text-sm font-medium text-[color:var(--color-text)] shadow-sm hover:bg-[color:var(--color-accent-soft)] ring-brand-focus'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.5a8.25 8.25 0 1 1 16.5 0v.75a.75.75 0 0 1-.75.75h-15a.75.75 0 0 1-.75-.75v-.75Z"
                />
              </svg>
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}


