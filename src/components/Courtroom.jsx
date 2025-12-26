import React from 'react'
import { Building2, Clock, Gavel, ChevronRight } from 'lucide-react'
import AnimatedJudge from './AnimatedJudge'
import StampButton from './StampButton'

export default function Courtroom({ phaseInfo, timeRemaining, activeCase, activeCaseId, currentPhase, pendingCases, onActivateCase, onGoToPolice, castVerdict, formatTime }) {
  const PhaseIcon = phaseInfo.icon

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-gradient-to-b from-black to-gray-900 border-4 border-red-600 rounded-xl p-8 mb-8 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-white" />
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-1 bg-white" />
        </div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <Building2 className="w-16 h-16 text-red-600" />
            <div>
              <h2 className="text-4xl font-black text-white mb-2">COURTROOM</h2>
              <p className="text-red-600 font-bold text-lg flex items-center gap-2"><PhaseIcon className="w-5 h-5" />{phaseInfo.title}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="bg-red-600 px-8 py-4 rounded-lg">
              <div className="flex items-center gap-3 mb-1"><Clock className="w-6 h-6 text-white" /><p className="text-white font-black text-3xl">{formatTime(timeRemaining)}</p></div>
              <p className="text-white text-sm font-bold">TIME REMAINING</p>
            </div>
          </div>
        </div>
      </div>

      {activeCase ? (
        <div className="bg-white border-4 border-black rounded-xl p-8 shadow-2xl">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="bg-red-600 text-white px-4 py-2 rounded-lg inline-block mb-4 font-black">CASE #{activeCaseId?.slice(-8).toUpperCase()}</div>
              <h3 className="text-4xl font-black mb-3">{activeCase.title}</h3>
              <p className="text-red-600 font-bold text-xl">ACCUSED: {activeCase.accused}</p>
            </div>
            <div className="bg-black text-red-600 px-6 py-3 rounded-lg border-4 border-red-600 animate-pulse"><span className="font-black text-lg">IN SESSION</span></div>
          </div>

          <div className="bg-gray-100 border-4 border-black rounded-xl p-6 mb-6">
            <h4 className="font-black text-lg mb-3">CASE DESCRIPTION:</h4>
            <p className="font-medium text-lg leading-relaxed">{activeCase.description}</p>
          </div>

          {activeCase.evidence && (
            <div className="bg-red-50 border-4 border-red-600 rounded-xl p-6 mb-6"><h4 className="font-black text-lg mb-3 text-red-600">EVIDENCE:</h4><p className="font-medium">{activeCase.evidence}</p></div>
          )}

          {currentPhase === 'investigation' && (<div className="bg-black text-white p-6 rounded-xl border-4 border-red-600"><p className="text-center font-bold text-lg">🔍 Evidence gathering in progress...</p></div>)}

          {currentPhase === 'deliberation' && (<div className="bg-black text-white p-6 rounded-xl border-4 border-red-600"><p className="text-center font-bold text-lg">⚖️ Final deliberations underway...</p></div>)}

          {currentPhase === 'verdict' && (
            <div className="space-y-4">
              <div className="bg-red-600 text-white p-6 rounded-xl text-center"><Gavel className="w-12 h-12 mx-auto mb-3" /><p className="font-black text-2xl mb-2">CAST YOUR VERDICT</p><p className="font-bold">All rise for the jury decision</p></div>

              <div className="grid grid-cols-3 gap-4">
                <StampButton onClick={() => castVerdict('guilty')} className="bg-red-600 text-white py-6 rounded-xl font-black text-xl hover:bg-red-700 transition border-4 border-black shadow-lg hover:scale-105">GUILTY</StampButton>
                <StampButton onClick={() => castVerdict('not guilty')} className="bg-black text-white py-6 rounded-xl font-black text-xl hover:bg-gray-900 transition border-4 border-black shadow-lg hover:scale-105">NOT GUILTY</StampButton>
                <StampButton onClick={() => castVerdict('adjourn')} className="bg-white text-black py-6 rounded-xl font-black text-xl hover:bg-gray-100 transition border-4 border-black shadow-lg hover:scale-105">ADJOURN</StampButton>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border-4 border-black rounded-xl p-12 text-center shadow-2xl">
          <Gavel className="w-24 h-24 mx-auto mb-6 text-gray-400" />
          <h3 className="text-3xl font-black mb-4">NO ACTIVE CASE</h3>
          <p className="text-gray-600 font-bold text-lg mb-6">Select a case from the Police Station to bring to trial</p>

          {currentPhase === 'new_case' && pendingCases.length > 0 && (
            <div className="mt-8">
              <h4 className="text-xl font-black mb-6">TOP VOTED CASES:</h4>
              <div className="grid gap-4 max-w-2xl mx-auto">
                {pendingCases.slice(0, 3).map(c => (
                  <div key={c.id} className="bg-gray-100 border-4 border-black rounded-xl p-6 flex items-center justify-between hover:border-red-600 transition">
                    <div className="text-left flex-1"><h5 className="font-black text-lg mb-1">{c.title}</h5><p className="text-sm font-bold text-gray-600">{c.votes} votes</p></div>
                    <button onClick={() => onActivateCase(c.id)} className="bg-red-600 text-white px-6 py-3 rounded-lg font-black hover:bg-red-700 transition border-2 border-black">BRING TO TRIAL</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={onGoToPolice} className="mt-8 bg-red-600 text-white px-8 py-4 rounded-lg font-black text-lg hover:bg-red-700 transition inline-flex items-center gap-3 border-4 border-black shadow-lg">GO TO POLICE STATION<ChevronRight className="w-6 h-6" /></button>
        </div>
      )}
    </div>
  )
}
