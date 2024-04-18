import { userHasRole } from 'modules/user/utils'

describe('user utils', () => {
  describe('userHasRole', () => {
    it('should return true if user has role', () => {
      expect(
        userHasRole(
          { id: 1, name: 'User 1', roles: ['admin', 'listener'] },
          'admin'
        )
      ).toBe(true)
    })

    it('should return false if user does not have role', () => {
      expect(
        userHasRole(
          { id: 1, name: 'User 1', roles: ['admin', 'listener'] },
          'root'
        )
      ).toBe(false)
    })
  })
})
