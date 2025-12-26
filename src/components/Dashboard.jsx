import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  const [stats, setStats] = useState({})

  useEffect(() => { loadStats() }, [])

  const loadStats = async () => {
    const [{ count: casesCount }, { count: usersCount }] = await Promise.all([
      supabase.from('cases').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('wallet', { count: 'exact', head: true }),
    ])
    setStats({ cases: casesCount, users: usersCount })
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="font-black text-3xl mb-4">Dashboard</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border-4 border-black">
          <div className="text-sm text-gray-500">Total Cases</div>
          <div className="font-black text-3xl">{stats.cases ?? '—'}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border-4 border-black">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="font-black text-3xl">{stats.users ?? '—'}</div>
        </div>
      </div>
    </div>
  )
}
