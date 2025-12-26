import { SiweMessage } from 'siwe'

export async function signInWithWallet(ethProvider, address) {
  const domain = window.location.host
  const siweMessage = new SiweMessage({
    domain,
    address,
    statement: 'Sign in to Avax Chronicles.',
    uri: window.location.origin,
    version: '1',
    chainId: '43114'
  })

  const message = siweMessage.prepareMessage()
  // personal_sign expects params: [message, wallet]
  const signature = await ethProvider.request({ method: 'personal_sign', params: [message, address] })

  const res = await fetch('/api/siwe-verify', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, signature })
  })
  const json = await res.json()
  if (!json.ok) throw new Error(json.error || 'SIWE failed')
  return json // { ok, wallet, token? }
}
