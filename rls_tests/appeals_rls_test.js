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

  // Create a case as userA
  const caseRes = await fetch(`${SUPABASE_URL}/cases`, { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${tokenA}` }, body: JSON.stringify({ title: 'appeal-test', accused: 'target', description: 'testing appeals', submitted_by: userA }) })
  console.log('create case status', caseRes.status)
  const caseJson = await caseRes.json()
  const caseId = caseJson[0].id
  console.log('created case', caseId)

  // userB submits an appeal with appellant=userB (should succeed)
  const appeal1 = await fetch(`${SUPABASE_URL}/appeals`, { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${tokenB}` }, body: JSON.stringify({ case_id: caseId, appellant: userB, reason: 'I want review' }) })
  console.log('appeal1 status (should be 201)', appeal1.status)

  // userB attempts to submit an appeal but claims appellant=userA (mismatch) - should be rejected
  const appeal2 = await fetch(`${SUPABASE_URL}/appeals`, { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${tokenB}` }, body: JSON.stringify({ case_id: caseId, appellant: userA, reason: 'Bad actor' }) })
  console.log('appeal2 status (should be rejected 403)', appeal2.status)

  // userA submits an appeal as themselves (should succeed)
  const appeal3 = await fetch(`${SUPABASE_URL}/appeals`, { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${tokenA}` }, body: JSON.stringify({ case_id: caseId, appellant: userA, reason: 'I contest the case' }) })
  console.log('appeal3 status (should be 201)', appeal3.status)

  console.log('Appeals RLS checks finished')
}

run().catch(e => { console.error(e); process.exit(1) })
