import React, { useEffect, useState } from 'react'

export default function TimerAnimated({ seconds }) {
  const [s, setS] = useState(seconds)
  useEffect(() => setS(seconds), [seconds])
  useEffect(() => {
    const t = setInterval(() => setS(prev => Math.max(0, prev - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  const format = (secs) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    return `${h}h ${m}m ${s}s`
  }

  return (
    <div className="bg-red-600 px-6 py-4 rounded-lg inline-block text-center">
      <div className="flex items-center gap-3">
        <div className="font-black text-2xl">{format(s)}</div>
      </div>
      <div className="text-sm text-white">TIME REMAINING</div>
    </div>
  )
}
