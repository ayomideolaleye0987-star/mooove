const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')

// Requires SUPABASE_URL and SUPABASE_SERVICE_KEY env vars
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be set')
  process.exit(1)
}

function makeToken(sub) {
  return jwt.sign({ sub, role: 'authenticated' }, SUPABASE_SERVICE_KEY, { algorithm: 'HS256', expiresIn: '1h' })
}

async function run() {
  const userA = 'wallet_a_0000000000000000000000000000001'
  const userB = 'wallet_b_0000000000000000000000000000002'

  const tokenA = makeToken(userA)
  const tokenB = makeToken(userB)

  // 1) Ensure public_messages: userA can post once, second post fails
  const res1 = await fetch(`${SUPABASE_URL}/public_messages`, { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${tokenA}` }, body: JSON.stringify({ wallet: userA, message: 'test1' }) })
  console.log('post1 status', res1.status)

  const res2 = await fetch(`${SUPABASE_URL}/public_messages`, { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${tokenA}` }, body: JSON.stringify({ wallet: userA, message: 'test2' }) })
  console.log('post2 status (should be rejected by policy)', res2.status)

  // 2) Votes unique constraint test: insert two identical votes should fail on second
  const caseRes = await fetch(`${SUPABASE_URL}/cases`, { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${tokenA}` }, body: JSON.stringify({ title: 't', accused: 'a', description: 'd', submitted_by: userA }) })
  const caseJson = await caseRes.json()
  const caseId = caseJson[0].id
  console.log('created case', caseId)

  const v1 = await fetch(`${SUPABASE_URL}/votes`, { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${tokenA}` }, body: JSON.stringify({ case_id: caseId, voter: userA }) })
  console.log('vote1 status', v1.status)

  const v2 = await fetch(`${SUPABASE_URL}/votes`, { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${tokenA}` }, body: JSON.stringify({ case_id: caseId, voter: userA }) })
  console.log('vote2 status (should fail due to unique constraint)', v2.status)

  console.log('RLS tests finished')
}

run().catch(e => { console.error(e); process.exit(1) })
