import { playerSelector, queueSelector } from 'modules/player/store/selectors'

const mockStore = {
  player: {
    playing: true,
  },
  queue: {
    current: 0,
  },
}

describe('player > store > selectors', () => {
  describe('playerSelector', () => {
    it('returns the correct part of the store', () => {
      expect(playerSelector(mockStore)).toEqual({ playing: true })
    })
  })

  describe('queueSelector', () => {
    it('returns the correct part of the store', () => {
      expect(queueSelector(mockStore)).toEqual({ current: 0 })
    })
  })
})
