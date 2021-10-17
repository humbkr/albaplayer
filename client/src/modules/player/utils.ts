/**
 * Computes the next / previous position in an list of consecutive integers
 * when looping.
 *
 * @param currentValue integer
 *   The current value in the list.
 * @param change integer
 *   The number of positions you want to switch from. Negative value to go
 *   backward.
 * @param length integer
 *   The length of the list of integers.
 *
 */
// eslint-disable-next-line import/prefer-default-export
export const setCycleNumPos = (
  currentValue: number,
  change: number,
  length: number
) => {
  let newPos = currentValue + change
  if (newPos >= length) {
    newPos -= length
  }
  if (newPos < 0) {
    newPos += length
  }
  return newPos
}
