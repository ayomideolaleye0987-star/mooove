import React, { useState } from 'react'

export default function StampButton({ children, onClick, className = '' }) {
  const [stamped, setStamped] = useState(false)

  const handle = async () => {
    setStamped(true)
    if (onClick) await onClick()
    setTimeout(() => setStamped(false), 1200)
  }

  return (
    <button className={`relative overflow-hidden inline-flex items-center justify-center ${className}`} onClick={handle}>
      <span className={`transform ${stamped ? 'scale-95' : 'scale-100'} transition-transform`}>{children}</span>

      <span className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity ${stamped ? 'opacity-100' : 'opacity-0'}`}>
        <span className="bg-black text-white px-4 py-2 rounded font-black rotate-6 shadow-lg">STAMPED</span>
      </span>
    </button>
  )
}
