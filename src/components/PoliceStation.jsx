import React from 'react'
import { AlertCircle, Shield, Zap } from 'lucide-react'
import SubmitForm from './SubmitForm'
import CaseCard from './CaseCard'

export default function PoliceStation({ pendingCases, showSubmitForm, setShowSubmitForm, newCase, setNewCase, submitCase, votes, voteForCase, sirenActive, onOpenCase }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-gradient-to-r from-black via-gray-900 to-black border-4 border-red-600 rounded-xl p-8 mb-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-white to-red-600 animate-pulse" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Shield className="w-16 h-16 text-red-600" />
              {sirenActive && <Zap className="w-8 h-8 text-red-600 absolute -top-2 -right-2 animate-spin" />}
            </div>
            <div>
              <h2 className="text-4xl font-black text-white mb-2">POLICE STATION</h2>
              <p className="text-red-600 font-bold text-lg">Report Crimes • Gather Evidence • Build Cases</p>
            </div>
          </div>

          <div className="text-right">
            <div className="bg-red-600 px-6 py-3 rounded-lg mb-2">
              <p className="text-white font-black text-3xl">{pendingCases.length}</p>
              <p className="text-white text-sm font-bold">ACTIVE REPORTS</p>
            </div>
          </div>
        </div>
      </div>

      {!showSubmitForm && (
        <button onClick={() => setShowSubmitForm(true)} className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-xl font-black text-2xl hover:scale-102 transition-all shadow-2xl border-4 border-black mb-8 hover:from-red-700 hover:to-red-800">
          <div className="flex items-center justify-center gap-4"><AlertCircle className="w-8 h-8" />FILE NEW CRIME REPORT (+100 POINTS)<AlertCircle className="w-8 h-8" /></div>
        </button>
      )}

      {showSubmitForm && <SubmitForm newCase={newCase} setNewCase={setNewCase} onSubmit={submitCase} onCancel={() => setShowSubmitForm(false)} />}

      <div className="bg-gray-100 border-4 border-black rounded-xl p-6">
        <h3 className="text-2xl font-black mb-6 flex items-center gap-3"><AlertCircle className="w-7 h-7 text-red-600" />PENDING INVESTIGATIONS</h3>

        <div className="mb-6">
          <a className="px-4 py-2 rounded border-2 font-bold" href="#locker" onClick={(e)=>{e.preventDefault(); document.getElementById('evidence-locker')?.scrollIntoView({behavior:'smooth'})}}>Open Evidence Locker</a>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {pendingCases.length === 0 ? (
            <p className="text-gray-500 font-bold text-center py-8 col-span-2">No pending cases</p>
          ) : (
            pendingCases.map(c => <CaseCard key={c.id} c={c} voted={!!votes[c.id]} onVote={voteForCase} onOpen={onOpenCase} />)
          )}
        </div>

        <div id="evidence-locker" className="mt-12">
          {/* placeholder locker component will be injected by App when needed */}
        </div>
      </div>
    </div>
  )
}
