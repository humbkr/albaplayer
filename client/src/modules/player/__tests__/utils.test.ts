import {
  getNextShuffleStep,
  getPreviousShuffleStep,
  setCycleNumPos,
} from 'modules/player/utils'

const createItems = (count: number): QueueItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${index}`,
    track: {
      id: `${index}`,
      title: `Track ${index}`,
      src: `/stream/${index}`,
      number: index,
      disc: '',
      duration: 100,
      cover: '',
    },
  }))

// Plays a whole shuffle round from `start`, returning the positions played.
const playShuffleRound = (items: QueueItem[], start: number) => {
  const positions = [start]
  let history: string[] = []
  let step = getNextShuffleStep(items, start, history, false)
  while (step) {
    positions.push(step.position)
    history = step.history
    step = getNextShuffleStep(items, step.position, history, false)
  }

  return positions
}

describe('player > utils', () => {
  describe('setCycleNumPos', () => {
    test('should return the next position in the list', () => {
      expect(setCycleNumPos(1, 1, 3)).toBe(2)
      expect(setCycleNumPos(3, 1, 3)).toBe(1)
    })

    test('should return the previous position in the list', () => {
      expect(setCycleNumPos(1, -1, 3)).toBe(0)
      expect(setCycleNumPos(3, -1, 3)).toBe(2)
    })
  })

  describe('getNextShuffleStep', () => {
    test('plays every item exactly once per round', () => {
      const items = createItems(20)

      for (let run = 0; run < 20; run++) {
        const positions = playShuffleRound(items, 5)

        expect(positions).toHaveLength(20)
        expect(new Set(positions).size).toBe(20)
      }
    })

    test('records the current item and the picked one in the history', () => {
      const items = createItems(3)

      const step = getNextShuffleStep(items, 1, [], false)

      expect(step?.history).toEqual(['item-1', items[step!.position].id])
      expect(step?.position).not.toBe(1)
    })

    test('ignores items removed from the queue since they were played', () => {
      const items = createItems(3)

      const step = getNextShuffleStep(
        items,
        0,
        ['item-removed', 'item-0'],
        false
      )

      expect(step?.history.slice(0, 2)).toEqual(['item-removed', 'item-0'])
      expect([1, 2]).toContain(step?.position)
    })

    test('stops once every item has been played without loop all', () => {
      const items = createItems(2)

      expect(getNextShuffleStep(items, 1, ['item-0', 'item-1'], false)).toBe(
        null
      )
    })

    test('starts a new round without replaying the current item with loop all', () => {
      const items = createItems(3)

      for (let run = 0; run < 20; run++) {
        const step = getNextShuffleStep(
          items,
          2,
          ['item-0', 'item-1', 'item-2'],
          true
        )

        expect(step?.position).not.toBe(2)
        expect(step?.history).toEqual(['item-2', items[step!.position].id])
      }
    })

    test('replays the only item of the queue with loop all', () => {
      const items = createItems(1)

      expect(getNextShuffleStep(items, 0, ['item-0'], true)).toEqual({
        position: 0,
        history: ['item-0', 'item-0'],
      })
    })

    test('returns null for an empty queue', () => {
      expect(getNextShuffleStep([], undefined, [], true)).toBe(null)
    })
  })

  describe('getPreviousShuffleStep', () => {
    test('goes back to the item played before the current one', () => {
      const items = createItems(3)

      expect(
        getPreviousShuffleStep(items, 0, ['item-2', 'item-1', 'item-0'])
      ).toEqual({ position: 1, history: ['item-2', 'item-1'] })
    })

    test('goes back to the last played item if the current one is not in the history', () => {
      const items = createItems(3)

      expect(getPreviousShuffleStep(items, 0, ['item-2', 'item-1'])).toEqual({
        position: 1,
        history: ['item-2', 'item-1'],
      })
    })

    test('skips the items removed from the queue', () => {
      const items = createItems(3)

      expect(
        getPreviousShuffleStep(items, 0, ['item-2', 'item-removed', 'item-0'])
      ).toEqual({ position: 2, history: ['item-2'] })
    })

    test('returns null when nothing was played before', () => {
      const items = createItems(3)

      expect(getPreviousShuffleStep(items, 0, ['item-0'])).toBe(null)
      expect(getPreviousShuffleStep(items, 0, [])).toBe(null)
    })
  })
})
