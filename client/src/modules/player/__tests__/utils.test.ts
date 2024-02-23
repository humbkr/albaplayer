import { setCycleNumPos } from 'modules/player/utils'

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
})
