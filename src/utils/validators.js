export const isSnowtraceTxUrl = (url) => {
  try {
    const u = new URL(url)
    // Accept snowtrace domain and common patterns
    return /snowtrace\.io$/.test(u.hostname) && /\/tx\//.test(u.pathname)
  } catch (e) {
    return false
  }
}

export const isTwitterStatusUrl = (url) => {
  try {
    const u = new URL(url)
    return /twitter\.com$/.test(u.hostname) && /\/status\//.test(u.pathname)
  } catch (e) {
    return false
  }
}

export const extractTxHash = (url) => {
  try {
    const u = new URL(url)
    const parts = u.pathname.split('/')
    const tx = parts.find(p => p && p.length > 0 && p !== 'tx')
    return tx || null
  } catch (e) {
    return null
  }
}

export const extractTweetId = (url) => {
  try {
    const u = new URL(url)
    const parts = u.pathname.split('/')
    return parts.includes('status') ? parts[parts.indexOf('status') + 1] : null
  } catch (e) {
    return null
  }
}
