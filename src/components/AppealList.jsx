import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AppealList({ caseId, externalAppeals }) {
  const [appeals, setAppeals] = useState([])

  useEffect(() => {
    if (externalAppeals) {
      setAppeals(externalAppeals)
    } else if (caseId) {
      load()
    }
  }, [caseId, externalAppeals])

  const load = async () => {
    const { data, error } = await supabase.from('appeals').select('*').eq('case_id', caseId).order('created_at', { ascending: false })
    if (error) console.error(error)
    setAppeals(data || [])
  }

  return (
    <div className="mt-3 bg-white p-3 border-2 rounded">
      {appeals.length === 0 ? <div className="text-sm text-gray-500">No appeals</div> : appeals.map(a => (
        <div key={a.id} className="p-2 border-b last:border-b-0">
          <div className="text-sm text-gray-600">{a.appellant}</div>
          <div className="mt-1">{a.reason}</div>
        </div>
      ))}
    </div>
  )
}
