import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { isSnowtraceTxUrl, isTwitterStatusUrl } from '../utils/validators'
import { fetchTxDetails, fetchTweetEmbed } from '../utils/fetchers'
import AppealForm from './AppealForm'
import AppealList from './AppealList'
import EvidencePile from './EvidencePile'
import { showToast } from '../lib/toast'

export default function CaseDetail({ caseId }) {
  const [caseObj, setCaseObj] = useState(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [newEvidence, setNewEvidence] = useState('')
  const [appeals, setAppeals] = useState([])

  useEffect(() => { if (caseId) loadCase() }, [caseId])

  const loadCase = async () => {
    const { data } = await supabase.from('cases').select('*').eq('id', caseId).single()
    setCaseObj(data)
    const { data: msgs } = await supabase.from('case_messages').select('*').eq('case_id', caseId).order('created_at', { ascending: true })
    setMessages(msgs || [])
    const { data: appealsData, error: appealsError } = await supabase.from('appeals').select('*').eq('case_id', caseId).order('created_at', { ascending: false })
    if (appealsError) console.error(appealsError)
    setAppeals(appealsData || [])
  }

  const addMessage = async () => {
    if (!message) return
    await supabase.from('case_messages').insert({ case_id: caseId, message })
    setMessage('')
    loadCase()
  }

  const addEvidence = async () => {
    if (!newEvidence) return
    let evidenceEntry = { type: 'other', value: newEvidence }
    if (isSnowtraceTxUrl(newEvidence)) {
      evidenceEntry.type = 'tx'
      evidenceEntry.meta = await fetchTxDetails(newEvidence)
    } else if (isTwitterStatusUrl(newEvidence)) {
      evidenceEntry.type = 'tweet'
      evidenceEntry.meta = await fetchTweetEmbed(newEvidence)
    } else {
      showToast('Only Snowtrace tx links or Twitter status links are allowed as evidence', { type: 'error' })
      return
    }

    const updated = ((caseObj.evidence || []))
    updated.push(evidenceEntry)
    await supabase.from('cases').update({ evidence: updated }).eq('id', caseId)
    setNewEvidence('')
    loadCase()
  }

  if (!caseObj) return <div className="p-8">Select a case</div>

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h3 className="font-black text-3xl">{caseObj.title}</h3>
      <div className="mt-4">{caseObj.description}</div>

      <div className="mt-6 bg-white p-4 border-4 border-black rounded-xl">
        <h4 className="font-black">Evidence</h4>
        {(caseObj.evidence || []).length === 0 ? <div className="text-gray-500 mt-3">No evidence yet</div> : (
          <>
            <EvidencePile size={Math.min(220, 80 + (caseObj.evidence || []).length * 30)} />
            <div className="grid gap-4 mt-3">
              {(caseObj.evidence || []).map((e, i) => (
                <div key={i} className="p-3 border rounded">
                  <div className="font-bold">{e.type.toUpperCase()}</div>
                  <a className="text-blue-600" href={e.value} target="_blank" rel="noreferrer">{e.value}</a>
                  {e.meta && <pre className="mt-2 text-xs overflow-auto" style={{maxHeight:120}}>{JSON.stringify(e.meta, null, 2)}</pre>}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-4">
          <input value={newEvidence} onChange={e => setNewEvidence(e.target.value)} placeholder="Paste Snowtrace tx link or Twitter status link" className="w-full p-3 border-2 rounded" />
          <div className="flex gap-4 mt-3">
            <button onClick={addEvidence} className="bg-red-600 text-white px-6 py-3 rounded-lg font-black">Add Evidence</button>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Case link copied') }} className="px-4 py-2 border-2 rounded">Copy Link</button>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 border-4 border-black rounded-xl">
        <h4 className="font-black">Public Chat</h4>
        <div className="mt-2 space-y-2">
          {messages.map(m => <div key={m.id} className="p-2 bg-gray-50 border rounded">{m.message}</div>)}
        </div>
        <div className="mt-4 flex gap-2">
          <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Say something about this case" className="flex-1 p-2 border rounded" />
          <button onClick={addMessage} className="bg-black text-white px-4 py-2 rounded">Send</button>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-black">Appeals</h4>
        <AppealList caseId={caseId} externalAppeals={appeals} />
        <AppealForm caseId={caseId} wallet={window?.ethereum?.selectedAddress || null} onSubmitted={(newAppeal) => setAppeals(prev => [newAppeal, ...(prev || [])])} />
      </div>
    </div>
  )
}
