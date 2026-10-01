export const FIBONACCI_DECK = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', '☕']

const NUMERIC_CARD_VALUES = FIBONACCI_DECK.map(Number).filter((v) => !Number.isNaN(v))

export function average(participants) {
  const numeric = Object.values(participants)
    .map((p) => p.vote)
    .filter((v) => v != null && !Number.isNaN(Number(v)))
    .map(Number)

  if (numeric.length === 0) return null
  return numeric.reduce((sum, n) => sum + n, 0) / numeric.length
}

export function nearestCardValue(avg) {
  if (avg == null) return null
  return NUMERIC_CARD_VALUES.reduce((closest, value) =>
    Math.abs(value - avg) < Math.abs(closest - avg) ? value : closest,
  )
}
