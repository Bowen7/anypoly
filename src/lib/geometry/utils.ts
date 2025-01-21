import type { N2 } from '../types'

// To fix floating point precision issue
const EPSILON = 0.001

export const intersectN2 = (
  line1Start: N2,
  line1End: N2,
  line2Start: N2,
  line2End: N2,
): N2 | null => {
  const dx1 = line1End[0] - line1Start[0]
  const dy1 = line1End[1] - line1Start[1]

  const dx2 = line2End[0] - line2Start[0]
  const dy2 = line2End[1] - line2Start[1]

  const denominator = (dx1 * dy2 - dy1 * dx2)

  if (Math.abs(denominator) < EPSILON) {
    return null
  }

  const t1 = ((line2Start[0] - line1Start[0]) * dy2 - (line2Start[1] - line1Start[1]) * dx2) / denominator
  const t2 = ((line1Start[0] - line2Start[0]) * dy1 - (line1Start[1] - line2Start[1]) * dx1) / -denominator

  if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
    const intersectionX = line1Start[0] + t1 * dx1
    const intersectionY = line1Start[1] + t1 * dy1

    return [intersectionX, intersectionY]
  }

  return null
}
