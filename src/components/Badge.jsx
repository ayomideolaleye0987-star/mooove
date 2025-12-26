import React, { useState } from 'react'
import BadgeModal from './BadgeModal'

export default function Badge({ badge }) {
  if (!badge) return null
  const [open, setOpen] = useState(false)
  const id = badge.key || badge.id || (badge.name || '').replace(/\s+/g, '-').toLowerCase()
  const emoji = badge.key === 'veteran' ? '🏅' : badge.key === 'detective' ? '🕵️' : badge.key === 'investigator' ? '🧾' : '🔰'

  return (
    <div className="badge-wrapper">
      <button type="button" aria-expanded={open} aria-controls={`badge-desc-${id}`} onClick={() => setOpen(true)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true) } }} className="badge inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2" title={badge.description}>
        <span aria-hidden className="badge-emoji">{emoji}</span>
        <span className="badge-name font-bold">{badge.name}</span>
      </button>
      <BadgeModal badge={badge} open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
