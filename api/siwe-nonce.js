import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY) : null

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const nonce = crypto.randomBytes(16).toString('hex')
    const wallet = (req.method === 'POST' && req.body && req.body.wallet) ? req.body.wallet : null

    if (!supabaseAdmin) {
      // Fallback: return nonce but cannot persist — not recommended for production
      return res.json({ nonce })
    }

    const { error } = await supabaseAdmin.from('siwe_nonces').insert({ nonce, wallet })
    if (error) return res.status(500).json({ error: 'Failed to persist nonce' })

    return res.json({ nonce })
  } catch (err) {
    console.error('Failed to generate nonce', err)
    return res.status(500).json({ error: 'Failed to generate nonce' })
  }
}
