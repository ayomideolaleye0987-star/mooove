import React, { useState } from 'react'

import LockerLottie from './LockerLottie'

export default function EvidenceLocker({ cases = [] , onOpenCase}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white border-4 border-black rounded-xl p-6 flex items-center gap-6">
        <div className={`locker w-40 h-40 bg-gray-900 rounded-lg relative overflow-hidden transform transition-all ${open ? 'scale-110' : 'scale-100'}`}>
          <div className={`locker-door absolute inset-0 bg-gray-800 transform origin-left transition-transform ${open ? 'translate-x-40 rotate-12' : 'translate-x-0'}`} />
          <div className="locker-handle absolute right-3 top-3 w-3 h-10 bg-yellow-400" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <LockerLottie />
          </div>
        </div>

        <div>
          <div className="font-black text-2xl">Evidence Locker</div>
          <div className="text-sm text-gray-600">Open the locker to reveal case folders</div>
          <div className="mt-4 flex gap-3">
            <button onClick={() => setOpen(o => !o)} className="px-4 py-2 rounded border-2 font-bold">{open ? 'Close Locker' : 'Open Locker'}</button>
            <button onClick={() => setOpen(true)} className="px-4 py-2 rounded bg-red-600 text-white font-black">Force Open</button>
          </div>
        </div>
      </div>

      <div className={`mt-6 grid gap-4 transition-all ${open ? 'opacity-100 max-h-screen' : 'opacity-40 max-h-0 overflow-hidden'}`}>
        {cases.length === 0 ? (
          <div className="text-gray-500">No archived case folders</div>
        ) : (
          cases.map(c => (
            <div key={c.id} className="p-4 border-2 rounded bg-gray-50 flex items-center justify-between">
              <div>
                <div className="font-black">{c.title}</div>
                <div className="text-sm text-gray-600">{c.accused}</div>
              </div>
              <button onClick={() => onOpenCase && onOpenCase(c.id)} className="px-4 py-2 rounded border-2 font-bold">Open Folder</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
