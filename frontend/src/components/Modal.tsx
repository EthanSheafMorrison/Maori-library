import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40 anim-fade-in" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div role="dialog" aria-modal="true" className="w-full max-w-lg rounded-xl bg-white p-5 shadow-2xl ring-1 ring-black/10 anim-scale-in">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="h3 text-gray-900">{title}</h2>
            <button className="btn-secondary text-small" onClick={onClose} aria-label="Close">✕</button>
          </div>
          <div className="text-gray-700 text-small leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}


