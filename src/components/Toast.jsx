import React, { useEffect, useState } from 'react'

export default function Toast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    function handler(e) {
      const id = Date.now() + Math.random()
      const toast = { id, message: e.detail.message, type: e.detail.type || 'default' }
      setToasts(prev => [toast, ...prev])
      const dur = e.detail.duration || 3500
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), dur)
    }
    window.addEventListener('mooove:toast', handler)
    return () => window.removeEventListener('mooove:toast', handler)
  }, [])

  return (
    <div aria-live="polite" className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className={`px-3 py-2 rounded shadow ${t.type === 'error' ? 'bg-red-600 text-white' : 'bg-black text-white'}`}>
          {t.message}
        </div>
      ))}
    </div>
  )
}
