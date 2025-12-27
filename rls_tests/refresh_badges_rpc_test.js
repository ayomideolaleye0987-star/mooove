const fetch = require('node-fetch')

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be set')
  process.exit(1)
}

async function run() {
  const wallet = 'wallet_refresh_test_001'
  const token = SUPABASE_SERVICE_KEY

  // Upsert a profile
  await fetch(`${SUPABASE_URL}/profiles`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ wallet, points: 150 }) })
  // Call RPC refresh
  const res = await fetch(`${SUPABASE_URL}/rpc/refresh_badges_for_wallet`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_wallet: wallet }) })
  console.log('rpc status', res.status)
  // Verify badges
  const after = await fetch(`${SUPABASE_URL}/profiles?select=wallet,badges&wallet=eq.${wallet}`, { headers: { 'Authorization': `Bearer ${token}` } })
  const json = await after.json()
  console.log('profile', json[0])
  if (json[0] && json[0].badges && json[0].badges.includes('investigator')) process.exit(0)
  else process.exit(2)
}

run().catch(e => { console.error(e); process.exit(1) })