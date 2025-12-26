// Lightweight wrapper that tries to use `window.storage` (platform-specific) and falls back to localStorage
export const storage = {
  async list(prefix) {
    if (window.storage?.list) return window.storage.list(prefix)
    const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix))
    return { keys }
  },

  async get(key) {
    if (window.storage?.get) return window.storage.get(key)
    const value = localStorage.getItem(key)
    return value == null ? null : { value }
  },

  async set(key, value) {
    if (window.storage?.set) return window.storage.set(key, value)
    localStorage.setItem(key, value)
  }
}

// Additional helpers to mirror supabase profile locally when offline
export async function saveLocalProfile(profile) {
  try {
    localStorage.setItem('profile:' + profile.wallet, JSON.stringify(profile))
  } catch (e) { console.error(e) }
}

export function loadLocalProfile(wallet) {
  try {
    const v = localStorage.getItem('profile:' + wallet)
    return v ? JSON.parse(v) : null
  } catch (e) { return null }
}
