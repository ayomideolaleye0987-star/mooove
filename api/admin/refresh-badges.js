import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const ADMIN_SECRET = process.env.ADMIN_SECRET
const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY) : null

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const secret = req.headers['x-admin-secret']
  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) return res.status(403).json({ error: 'Unauthorized' })

  const { wallet } = req.body || {}
  if (!wallet) return res.status(400).json({ error: 'Missing wallet' })

  try {
    if (!supabaseAdmin) return res.status(500).json({ error: 'Server misconfigured' })
    const { error } = await supabaseAdmin.rpc('refresh_badges_for_wallet', { p_wallet: wallet })
    if (error) return res.status(500).json({ error: 'Refresh failed', details: error })
    return res.json({ ok: true })
  } catch (err) {
    console.error('refresh-badges error', err)
    return res.status(500).json({ error: 'Server error' })
  }
}