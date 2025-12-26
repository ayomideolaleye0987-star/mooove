import React from 'react'

import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function About({ wallet }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadMessages() }, [])

  const loadMessages = async () => {
    const { data } = await supabase.from('public_messages').select('*').order('created_at', { ascending: false }).limit(50)
    setMessages(data || [])
  }

  const canPost = async () => {
    if (!wallet) return false
    const since = new Date(Date.now() - 24*60*60*1000).toISOString()
    const { count } = await supabase.from('public_messages').select('*', { count: 'exact', head: true }).gte('created_at', since).eq('wallet', wallet)
    return (count || 0) === 0
  }

  const postMessage = async () => {
    if (!wallet) { alert('Connect wallet to post'); return }
    setLoading(true)
    if (!await canPost()) { alert('You already posted in the last 24 hours'); setLoading(false); return }
    const { error } = await supabase.from('public_messages').insert({ wallet, message })
    if (error) { console.error(error); alert('Failed to post') }
    setMessage('')
    await loadMessages()
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="font-black text-3xl mb-4">About AVAX Chronicles</h2>
      <div className="bg-white p-6 rounded-xl border-4 border-black mb-6">
        <p className="mb-4">AVAX Chronicles is a community-driven decentralized courtroom simulation for the Avalanche ecosystem. Users submit crime reports (transaction links or tweets) and the community votes to bring the top cases to trial.</p>
        <h3 className="font-bold mt-4">Not legal advice</h3>
        <p className="text-sm text-gray-600">This project is community-driven and not a substitute for legal action. All data is user-submitted and we do not verify claims. Use your judgment.</p>
        <h3 className="font-bold mt-4">Support & Public Messages</h3>
        <p className="text-sm text-gray-600">Users can post a public support message (rate-limited to one per day). Messages are visible to everyone.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border-4 border-black">
        <h3 className="font-black">Public Support Board</h3>
        <p className="text-sm text-gray-600">One message per day per wallet. Messages are public.</p>
        <div className="mt-4">
          <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full p-3 border-2 rounded" rows={3} />
          <div className="flex gap-4 mt-3">
            <button onClick={postMessage} className="bg-red-600 text-white px-6 py-3 rounded-lg font-black" disabled={loading}>{loading ? 'Posting...' : 'Post Message'}</button>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-black mb-3">Recent Messages</h4>
          <div className="space-y-2">
            {messages.map(m => (
              <div key={m.id} className="p-3 border rounded bg-gray-50">
                <div className="text-xs text-gray-500">{m.wallet}</div>
                <div className="mt-1">{m.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

