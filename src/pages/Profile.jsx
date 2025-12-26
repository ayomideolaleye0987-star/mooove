import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { computeLevel, pointsToNextLevel, rankName } from '../lib/levels'
import BadgesList from '../components/BadgesList'
import { showToast } from '../lib/toast'

export default function ProfilePage({ wallet }) {
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ username: '', bio: '', twitter: '', emoji_avatar: '' })

  useEffect(() => { if (wallet) loadProfile() }, [wallet])

  const loadProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('wallet', wallet).single()
    setProfile(data)
    setForm({ username: data?.username || '', bio: data?.bio || '', twitter: data?.twitter || '', emoji_avatar: data?.emoji_avatar || '' })
  }

  const save = async () => {
    const { error } = await supabase.from('profiles').upsert({ wallet, ...form }).select()
    if (error) { showToast('Failed to save profile', { type: 'error' }); console.error(error) } else { showToast('Profile saved') ; setEditing(false); loadProfile() }
  }

  if (!wallet) return <div className="p-6">Connect your wallet to edit your profile</div>
  if (!profile) return <div className="p-6">Loading...</div>

  const level = computeLevel(profile.points || 0)
  const next = pointsToNextLevel(profile.points || 0)

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="flex items-center gap-4">
        <div className="text-5xl">{profile.emoji_avatar || '🪪'}</div>
        <div>
          <div className="text-2xl font-black">{profile.username || (wallet || '').slice(0,8)}</div>
          <div className="text-sm text-gray-500">{profile.twitter ? `@${profile.twitter}` : ''}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-sm text-gray-500">Points</div>
          <div className="font-black text-xl">{profile.points || 0}</div>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded border">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Level</div>
            <div className="font-black text-xl">{level} — <span className="text-sm text-gray-600">{rankName(profile.points)}</span></div>
            <div className="text-xs text-gray-500">{next} points to next level</div>
          </div>
          <div>
            <button onClick={() => setEditing(!editing)} className="px-3 py-2 border rounded">{editing? 'Cancel' : 'Edit'}</button>
          </div>
        </div>

        {editing ? (
          <div className="mt-4 grid gap-2">
            <input value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="p-2 border" placeholder="Display name" />
            <input value={form.twitter} onChange={e => setForm({...form, twitter: e.target.value})} className="p-2 border" placeholder="Twitter handle" />
            <input value={form.emoji_avatar} onChange={e => setForm({...form, emoji_avatar: e.target.value})} className="p-2 border" placeholder="Emoji avatar" />
            <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="p-2 border" placeholder="Bio" />
            <div className="flex gap-2"><button onClick={save} className="bg-black text-white px-4 py-2 rounded">Save</button></div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="text-sm text-gray-600">{profile.bio}</div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h4 className="font-black">Badges</h4>
        <div className="mt-2">
          <BadgesList wallet={wallet} />
        </div>
      </div>

    </div>
  )
}
