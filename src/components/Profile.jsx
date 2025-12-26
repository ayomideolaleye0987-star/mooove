import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { computeLevel, pointsToNextLevel, rankName } from '../lib/levels'
import BadgesList from './BadgesList'

const randomEmoji = () => ['🛡️','👮','⚖️','🔔','🕵️','🧾','🚓','🔒'][Math.floor(Math.random()*8)]

export default function Profile({ wallet }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activitiesCount, setActivitiesCount] = useState(0)

  useEffect(() => {
    if (!wallet) return
    loadProfile()
  }, [wallet])

  const loadProfile = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('profiles').select('*').eq('wallet', wallet).single()
    if (error && error.code !== 'PGRST116') console.error(error)
    setProfile(data)

    const { count } = await supabase.from('activities').select('*', { count: 'exact', head: true }).eq('wallet', wallet)
    setActivitiesCount(count || 0)

    setLoading(false)
  }

  const upsert = async () => {
    setLoading(true)
    const payload = {
      wallet,
      username: profile?.username || null,
      bio: profile?.bio || null,
      twitter: profile?.twitter || null,
      emoji_avatar: profile?.emoji_avatar || randomEmoji()
    }
    const { error } = await supabase.from('profiles').upsert(payload)
    if (error) console.error(error)
    setLoading(false)
    loadProfile()
  }

  if (!wallet) return <div className="p-8">Connect wallet to manage your profile</div>

  const level = computeLevel(profile?.points || 0)
  const next = pointsToNextLevel(profile?.points || 0)
  const progressPercent = Math.min(100, ((profile?.points || 0) % 100))

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="font-black text-3xl mb-4">Profile</h2>
      {loading && <p>Loading...</p>}
      {profile && (
        <div className="bg-white p-6 rounded-xl border-4 border-black">
          <div className="flex items-center gap-6">
            <div className="text-6xl">{profile.emoji_avatar || randomEmoji()}</div>
            <div>
              <div className="font-black text-xl">{profile.username || wallet}</div>
              <div className="text-sm text-gray-600">{profile.twitter ? `@${profile.twitter}` : ''}</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-sm text-gray-500">Points</div>
              <div className="font-black text-2xl">{profile.points || 0}</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold">Badges</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                <BadgesList wallet={wallet} />
              </div>
            </div>

            <div>
              <h4 className="font-bold">Activity</h4>
              <div className="mt-2 text-sm text-gray-600">Total activity events: {activitiesCount}</div>
              <div className="mt-4">
                <div className="text-sm text-gray-500">Level</div>
                <div className="font-black text-xl">{level} — <span className="text-sm text-gray-600">{rankName(profile?.points || 0)}</span></div>
                <div className="text-xs text-gray-500">{next} points to next level</div>
                <div className="mt-2" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progressPercent} aria-label={`Progress to next level ${progressPercent} percent`}>
                  <div className="w-56 bg-gray-200 h-2 rounded"><div className="bg-black h-2 rounded" style={{width: `${progressPercent}%`}} /></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block font-bold text-sm">Username</label>
            <input value={profile.username || ''} onChange={e => setProfile({...profile, username: e.target.value})} className="w-full p-3 border-2 rounded-lg mt-1" />
            <label className="block font-bold text-sm mt-3">Bio</label>
            <textarea value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full p-3 border-2 rounded-lg mt-1" />
            <label className="block font-bold text-sm mt-3">Twitter username</label>
            <input value={profile.twitter || ''} onChange={e => setProfile({...profile, twitter: e.target.value})} className="w-full p-3 border-2 rounded-lg mt-1" />
            <div className="flex gap-4 mt-4">
              <button onClick={upsert} className="bg-red-600 text-white px-6 py-3 rounded-lg font-black">Save Profile</button>
              <button onClick={() => setProfile({...profile, emoji_avatar: randomEmoji()})} className="px-6 py-3 rounded-lg border-2">Random Avatar</button>
            </div>
          </div>
        </div>
      )}      {!profile && !loading && (
        <div className="bg-white p-6 rounded-xl border-4 border-black">No profile yet — click save to create one</div>
      )}
    </div>
  )
}