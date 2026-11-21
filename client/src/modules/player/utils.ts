import { getRandomInt } from 'common/utils/utils'

export enum PlayerPlaybackMode {
  PLAYER_REPEAT_NO_REPEAT,
  PLAYER_REPEAT_LOOP_ALL,
  PLAYER_REPEAT_LOOP_ONE,
}

/**
 * Computes the next / previous position in a list of consecutive integers
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

type ShuffleStep = {
  // Queue position to play.
  position: number
  // Shuffle history once that position is played.
  history: string[]
}

const getItemId = (items: QueueItem[], position?: number) =>
  position === undefined ? undefined : items[position]?.id

/**
 * Picks the next queue item to play in shuffle mode: a random item not played
 * yet in the current shuffle round. Once every item has been played, a new
 * round starts if loopAll is set, otherwise returns null.
 *
 * @param items The queue items.
 * @param position The queue position navigated from.
 * @param history The ids of the items played in the current shuffle round.
 * @param loopAll Whether to start a new round once every item has been played.
 */
export const getNextShuffleStep = (
  items: QueueItem[],
  position: number | undefined,
  history: string[],
  loopAll: boolean
): ShuffleStep | null => {
  const currentId = getItemId(items, position)
  let roundHistory =
    currentId !== undefined && history[history.length - 1] !== currentId
      ? [...history, currentId]
      : history

  const played = new Set(roundHistory)
  let candidates = items.flatMap((item, index) =>
    played.has(item.id) ? [] : [index]
  )

  if (candidates.length === 0) {
    if (!loopAll || items.length === 0) {
      return null
    }

    // New round: avoid playing the same item twice in a row unless it is the
    // only one in the queue.
    roundHistory = currentId !== undefined ? [currentId] : []
    candidates =
      items.length > 1
        ? items.flatMap((item, index) => (item.id === currentId ? [] : [index]))
        : [0]
  }

  const nextPosition = candidates[getRandomInt(0, candidates.length - 1)]

  return {
    position: nextPosition,
    history: [...roundHistory, items[nextPosition].id],
  }
}

/**
 * Picks the queue item played before the current one in shuffle mode, skipping
 * the items removed from the queue since. Returns null if there is none.
 *
 * @param items The queue items.
 * @param position The queue position navigated from.
 * @param history The ids of the items played in the current shuffle round.
 */
export const getPreviousShuffleStep = (
  items: QueueItem[],
  position: number | undefined,
  history: string[]
): ShuffleStep | null => {
  const currentId = getItemId(items, position)
  const previousIds =
    history[history.length - 1] === currentId ? history.slice(0, -1) : history

  for (let i = previousIds.length - 1; i >= 0; i--) {
    const previousPosition = items.findIndex(
      (item) => item.id === previousIds[i]
    )
    if (previousPosition !== -1) {
      return {
        position: previousPosition,
        history: previousIds.slice(0, i + 1),
      }
    }
  }

  return null
}
