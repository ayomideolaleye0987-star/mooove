import React from 'react'

export default function BadgeModal({ badge, open, onClose }) {
  if (!open || !badge) return null
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-xl max-w-md w-full border-4 border-black">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-2xl font-black">{badge.name}</div>
            <div className="text-sm text-gray-600 mt-1">{badge.key}</div>
          </div>
          <button aria-label="Close badge details" onClick={onClose} className="px-3 py-2 bg-gray-100 rounded">Close</button>
        </div>
        <div className="mt-4 text-sm text-gray-700">{badge.description}</div>
        {badge.min_points !== undefined && (
          <div className="mt-4 text-xs text-gray-500">Requires {badge.min_points} points</div>
        )}
      </div>
    </div>
  )
}
