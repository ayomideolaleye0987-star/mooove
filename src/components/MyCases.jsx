import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function MyCases({ wallet }) {
  const [cases, setCases] = useState([])

  useEffect(() => { if (wallet) loadMyCases() }, [wallet])

  const loadMyCases = async () => {
    const { data, error } = await supabase.from('cases').select('*').eq('submitted_by', wallet)
    if (error) console.error(error)
    setCases(data || [])
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(cases, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'my-cases.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importJson = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const imported = JSON.parse(evt.target.result)
        // naive import: insert as new cases with reference to wallet
        for (const c of imported) {
          const payload = {
            title: c.title,
            accused: c.accused,
            description: c.description,
            evidence: c.evidence || [],
            submitted_by: wallet,
            anonymous: c.anonymous || false,
            status: c.status || 'pending'
          }
          await supabase.from('cases').insert(payload)
        }
        loadMyCases()
        alert('Imported cases')
      } catch (err) { console.error(err); alert('Invalid file') }
    }
    reader.readAsText(file)
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="font-black text-3xl mb-6">My Case Logs</h2>
      <div className="flex gap-4 mb-6">
        <button onClick={exportJson} className="bg-red-600 text-white px-6 py-3 rounded-lg font-black">Export to flash drive (download)</button>
        <label className="px-6 py-3 border-2 rounded-lg cursor-pointer">Import from flash drive (upload)
          <input type="file" accept="application/json" onChange={importJson} className="hidden" />
        </label>
      </div>

      <div className="grid gap-4">
        {cases.length === 0 ? <div className="text-gray-500">No cases yet</div> : cases.map(c => (
          <div key={c.id} className="bg-white p-4 rounded-xl border-4 border-black">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-black">{c.title}</div>
                <div className="text-sm text-gray-600">{c.accused}</div>
              </div>
              <div className="text-sm">Status: {c.status}</div>
            </div>
            <div className="mt-3 text-sm text-gray-700">{c.description}</div>
            <div className="mt-3">
              <div className="font-bold">Evidence:</div>
              <ul className="list-disc ml-6">
                {(c.evidence || []).map((e, idx) => <li key={idx}><a className="text-blue-600" href={e.value} target="_blank" rel="noreferrer">{e.value}</a></li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
