import { SiweMessage } from 'siwe'
import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Use server-side Supabase client (requires SUPABASE_SERVICE_KEY)
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY) : null

// Vercel serverless function style: exports default handler
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { message, signature } = req.body || {}
  if (!message || !signature) return res.status(400).json({ error: 'Missing message or signature' })

  try {
    if (!supabaseAdmin) {
      console.warn('SUPABASE_SERVICE_KEY not configured; cannot validate nonce or upsert profile securely')
    }

    const siweMsg = new SiweMessage(message)
    const fields = await siweMsg.validate(signature)
    const wallet = fields.address
    const nonce = fields.nonce

    // Verify nonce exists and not used and not expired
    if (supabaseAdmin) {
      const { data: nonceRow, error: nErr } = await supabaseAdmin.from('siwe_nonces').select('*').eq('nonce', nonce).single()
      if (nErr || !nonceRow) {
        console.warn('Nonce not found or error', nErr)
        return res.status(400).json({ error: 'Invalid or missing nonce' })
      }
      if (nonceRow.used) return res.status(400).json({ error: 'Nonce already used' })
      if (new Date(nonceRow.expires_at) < new Date()) return res.status(400).json({ error: 'Nonce expired' })
    }

    // Create/ensure profile row (using admin client if possible)
    if (supabaseAdmin) {
      const { error: upsertErr } = await supabaseAdmin.from('profiles').upsert({ wallet }).select()
      if (upsertErr) console.error('Upsert profile failed', upsertErr)
      // mark nonce used
      await supabaseAdmin.from('siwe_nonces').update({ used: true }).eq('nonce', nonce)
    }

    // Sign a short-lived JWT tied to wallet (expires in 15 minutes)
    const jwtSecret = process.env.SUPABASE_JWT_SECRET || process.env.SUPABASE_SERVICE_KEY
    if (!jwtSecret) {
      console.warn('SUPABASE_JWT_SECRET/SUPABASE_SERVICE_KEY not set; returning success without token')
      return res.json({ ok: true, wallet })
    }

    const token = jwt.sign({ sub: wallet, role: 'authenticated' }, jwtSecret, { algorithm: 'HS256', expiresIn: '15m' })

    return res.json({ ok: true, wallet, token })
  } catch (err) {
    console.error('SIWE verification failed', err)
    return res.status(400).json({ error: 'SIWE verification failed' })
  }
}
