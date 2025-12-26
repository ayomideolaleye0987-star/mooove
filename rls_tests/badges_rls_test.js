const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be set')
  process.exit(1)
}

function makeToken(sub, role='authenticated') {
  return jwt.sign({ sub, role }, SUPABASE_SERVICE_KEY, { algorithm: 'HS256', expiresIn: '1h' })
}

async function run() {
  const wallet = 'wallet_badge_test_0001'
  const token = makeToken(wallet)

  // Insert or upsert profile with 0 points
  const res1 = await fetch(`${SUPABASE_URL}/profiles`, { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ wallet, points: 0 }) })
  console.log('create profile status', res1.status)

  // Update points to 150
  const res2 = await fetch(`${SUPABASE_URL}/profiles?wallet=eq.${wallet}`, { method: 'PATCH', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ points: 150 }) })
  console.log('update points status', res2.status)

  // Give Postgres time to run triggers - small wait
  await new Promise(r => setTimeout(r, 1000))

  // Read profile and check badges
  const res3 = await fetch(`${SUPABASE_URL}/profiles?select=wallet,points,badges&wallet=eq.${wallet}`, { headers: { 'Authorization': `Bearer ${token}` } })
  const j = await res3.json()
  const profile = j[0]
  console.log('profile after update', profile)
  if (profile && profile.badges && profile.badges.includes('investigator')) {
    console.log('Badge assignment OK')
    process.exit(0)
  } else {
    console.error('Badge assignment FAILED')
    process.exit(2)
  }
}

run().catch(e => { console.error(e); process.exit(1) })
