import { SiweMessage } from 'siwe'
import { supabase } from '../src/lib/supabaseClient'
import jwt from 'jsonwebtoken'

// Vercel serverless function style: exports default handler
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { message, signature } = req.body || {}
  if (!message || !signature) return res.status(400).json({ error: 'Missing message or signature' })

  try {
    const siweMsg = new SiweMessage(message)
    const fields = await siweMsg.validate(signature)
    const wallet = fields.address

    // Create/ensure profile row
    const { error: upsertErr } = await supabase.from('profiles').upsert({ wallet }).select()
    if (upsertErr) console.error('Upsert profile failed', upsertErr)

    // Sign a temporary JWT tied to wallet (expires in 1 hour)
    const jwtSecret = process.env.SUPABASE_JWT_SECRET || process.env.SUPABASE_SERVICE_KEY
    if (!jwtSecret) {
      console.warn('SUPABASE_JWT_SECRET/SUPABASE_SERVICE_KEY not set; returning success without token')
      return res.json({ ok: true, wallet })
    }

    const token = jwt.sign({ sub: wallet, role: 'authenticated' }, jwtSecret, { algorithm: 'HS256', expiresIn: '1h' })

    return res.json({ ok: true, wallet, token })
  } catch (err) {
    console.error('SIWE verification failed', err)
    return res.status(400).json({ error: 'SIWE verification failed' })
  }
}
