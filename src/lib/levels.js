export function computeLevel(points = 0) {
  return Math.floor((points || 0) / 100)
}

export function pointsToNextLevel(points = 0) {
  const level = computeLevel(points)
  return (level + 1) * 100 - (points || 0)
}

export const rankName = (points = 0) => {
  if (points >= 1000) return 'Veteran'
  if (points >= 500) return 'Detective'
  if (points >= 100) return 'Investigator'
  return 'Newcomer'
}
