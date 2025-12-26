import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { showToast } from '../lib/toast'

export default function AppealForm({ caseId, wallet, onSubmitted }) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const submitAppeal = async () => {
    if (!wallet) { showToast('Connect wallet to appeal', { type: 'error' }); return }
    if (!reason.trim()) { showToast('Reason required', { type: 'error' }); return }
    setLoading(true)
    const { data, error } = await supabase.from('appeals').insert({ case_id: caseId, appellant: wallet, reason }).select().single()
    setLoading(false)
    if (error) { console.error(error); showToast('Failed to submit appeal', { type: 'error' }) } else { setReason(''); onSubmitted && onSubmitted(data); showToast('Appeal submitted', { type: 'default' }) }
  }

  return (
    <div className="mt-6 bg-white p-4 border-4 border-black rounded-xl">
      <h4 className="font-black">Appeal Case</h4>
      <textarea value={reason} onChange={e=>setReason(e.target.value)} className="w-full p-3 border-2 rounded mt-2" rows={4} placeholder="State your grounds for appeal" />
      <div className="flex gap-3 mt-3">
        <button onClick={submitAppeal} className="bg-red-600 text-white px-4 py-2 rounded font-black" disabled={loading}>{loading? 'Submitting...' : 'Submit Appeal'}</button>
      </div>
    </div>
  )
}
