export const FIBONACCI_DECK = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', '☕']

export function average(votes) {
  const numeric = Object.values(votes)
    .map((v) => v.value)
    .filter((v) => v != null && !Number.isNaN(Number(v)))
    .map(Number)

  if (numeric.length === 0) return null
  return numeric.reduce((sum, n) => sum + n, 0) / numeric.length
}
