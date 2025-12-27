import { SiweMessage } from 'siwe'

async function fetchNonce() {
  const res = await fetch('/api/siwe-nonce')
  if (!res.ok) throw new Error('Failed to get nonce')
  const j = await res.json()
  return j.nonce
}

export async function signInWithWallet(ethProvider, address) {
  const domain = window.location.host
  const nonce = await fetchNonce()

  const siweMessage = new SiweMessage({
    domain,
    address,
    statement: 'Sign in to Avax Chronicles.',
    uri: window.location.origin,
    version: '1',
    chainId: '43114',
    nonce
  })

  const message = siweMessage.prepareMessage()
  // personal_sign expects params: [message, wallet]
  const signature = await ethProvider.request({ method: 'personal_sign', params: [message, address] })

  const res = await fetch('/api/siwe-verify', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, signature })
  })
  const json = await res.json()
  if (!json.ok) throw new Error(json.error || 'SIWE failed')
  // If token present, set supabase client auth
  if (json.token && window?.__SUPABASE_CLIENT__) {
    try { window.__SUPABASE_CLIENT__.auth.setAuth(json.token) } catch (e) { console.warn('Failed to set supabase token', e) }
  }
  return json // { ok, wallet, token? }
}
