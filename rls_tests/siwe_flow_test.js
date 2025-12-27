const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be set')
  process.exit(1)
}

async function run() {
  // Get a nonce
  const nRes = await fetch(`${SUPABASE_URL.replace(/(^https?:\/\/[^/]+).*/,'')}/api/siwe-nonce`)
  console.log('nonce status', nRes.status)
  const n = await nRes.json()
  console.log('nonce', n)
  // We cannot sign in infra test; ensure nonce persisted in DB via service key by querying table
  const token = jwt.sign({ sub: 'test-admin', role: 'service_role' }, SUPABASE_SERVICE_KEY, { algorithm: 'HS256', expiresIn: '1h' })
  const sel = await fetch(`${SUPABASE_URL}/siwe_nonces?select=*&nonce=eq.${n.nonce}`, { headers: { 'Authorization': `Bearer ${token}` } })
  console.log('nonce query status', sel.status)
  const j = await sel.json()
  console.log('nonce row', j)
}

run().catch(e => { console.error(e); process.exit(1) })
