import React from 'react'
import { Scale, Shield, Trophy } from 'lucide-react'

export default function Header({ points, wallet, onConnect, currentPage, setCurrentPage, sirenActive }) {
  return (
    <div className="bg-black border-b-4 border-red-600 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Scale className="w-10 h-10 text-red-600 animate-pulse" />
              {sirenActive && currentPage === 'police' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">AVAX <span className="text-red-600">CHRONICLES</span></h1>
              <p className="text-xs text-gray-400 font-bold tracking-widest">COMMUNITY JUSTICE</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage('police')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                currentPage === 'police' ? 'bg-red-600 text-white shadow-lg scale-105' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Shield className="w-5 h-5" />
              POLICE
            </button>

            <button
              onClick={() => setCurrentPage('court')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                currentPage === 'court' ? 'bg-red-600 text-white shadow-lg scale-105' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Shield className="w-5 h-5" />
              COURT
            </button>

            <button
              onClick={() => setCurrentPage('profile')}
              className={`px-4 py-2 rounded-lg font-bold ${currentPage === 'profile' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              PROFILE
            </button>

            <button
              onClick={() => setCurrentPage('my_cases')}
              className={`px-4 py-2 rounded-lg font-bold ${currentPage === 'my_cases' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              MY CASES
            </button>

            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`px-4 py-2 rounded-lg font-bold ${currentPage === 'dashboard' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              DASHBOARD
            </button>

            <button
              onClick={() => setCurrentPage('about')}
              className={`px-4 py-2 rounded-lg font-bold ${currentPage === 'about' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              ABOUT
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-red-600 px-5 py-3 rounded-lg shadow-lg">
              <Trophy className="w-5 h-5 text-white" />
              <span className="font-black text-white text-lg">{points}</span>
            </div>

            {wallet ? (
              <div className="bg-gray-800 border-2 border-red-600 px-5 py-3 rounded-lg">
                <span className="text-white font-bold text-sm">{wallet.slice(0, 6)}...{wallet.slice(-4)}</span>
              </div>
            ) : (
              <button onClick={onConnect} className="bg-red-600 text-white px-8 py-3 rounded-lg font-black hover:bg-red-700 transition-all shadow-lg hover:scale-105">CONNECT WALLET</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
