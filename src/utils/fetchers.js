import { extractTxHash, extractTweetId } from './validators'

export async function fetchTxDetails(txUrl) {
  const hash = extractTxHash(txUrl)
  if (!hash) return null

  const apiKey = import.meta.env.VITE_SNOWTRACE_API_KEY
  if (!apiKey) return null

  const url = `https://api.snowtrace.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${hash}&apikey=${apiKey}`
  try {
    const res = await fetch(url)
    const data = await res.json()
    if (data && data.result) return data.result
    return null
  } catch (e) {
    console.error('Failed to fetch tx details', e)
    return null
  }
}

export async function fetchTweetEmbed(tweetUrl) {
  const id = extractTweetId(tweetUrl)
  if (!id) return null
  try {
    // Use Twitter oEmbed endpoint to get embeddable html (rate-limited)
    const res = await fetch(`https://publish.twitter.com/oembed?url=${encodeURIComponent(tweetUrl)}`)
    if (!res.ok) return null
    const json = await res.json()
    return json
  } catch (e) {
    console.error('Failed to fetch tweet oembed', e)
    return null
  }
}
