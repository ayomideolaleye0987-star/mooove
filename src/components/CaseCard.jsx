import React from 'react'
import { Users } from 'lucide-react'

export default function CaseCard({ c, voted, onVote }) {
  return (
    <div className="bg-white border-4 border-black rounded-xl p-6 hover:border-red-600 transition-all shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-black text-xl mb-2 text-black">{c.title}</h4>
          <p className="text-red-600 font-bold">ACCUSED: {c.accused}</p>
        </div>
        <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-black text-sm">PENDING</div>
      </div>

      <p className="text-gray-700 font-medium mb-4 text-sm line-clamp-3">{c.description}</p>

      <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-black" />
          <span className="font-black text-lg">{c.votes} VOTES</span>
        </div>

        <button onClick={() => onVote(c.id)} disabled={voted} className={`px-6 py-2 rounded-lg font-black transition-all border-2 ${voted ? 'bg-gray-300 text-gray-600 cursor-not-allowed border-gray-400' : 'bg-red-600 text-white hover:bg-red-700 border-black'}`}>
          {voted ? 'VOTED' : 'VOTE (+25 PTS)'}
        </button>
      </div>
    </div>
  )
}
