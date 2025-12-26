import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Badge from './Badge'

export default function BadgesList({ wallet, small = false }) {
  const [allBadges, setAllBadges] = useState([])
  const [profileBadges, setProfileBadges] = useState([])

  useEffect(() => {
    load()
  }, [wallet])

  const load = async () => {
    const { data: badges } = await supabase.from('badges').select('*').order('min_points')
    setAllBadges(badges || [])
    if (wallet) {
      const { data: p } = await supabase.from('profiles').select('badges, points').eq('wallet', wallet).single()
      setProfileBadges(p?.badges || [])
    }
  }

  return (
    <div className={small? 'flex gap-2 flex-wrap text-xs' : 'flex gap-2 flex-wrap'}>
      {allBadges.map(b => (
        <div key={b.key} className="badge-item" style={{marginBottom:6}}>
          <Badge badge={{ key: b.key, name: b.name + (profileBadges.includes(b.key) ? ' ✓' : ''), description: b.description }} />
        </div>
      ))}
    </div>
  )
}
