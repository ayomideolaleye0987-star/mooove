export function showToast(message, { duration = 3500, type = 'default' } = {}) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('mooove:toast', { detail: { message, duration, type } }))
}
