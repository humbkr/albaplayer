import { logout as apiLogout } from 'modules/user/authApi'
import store from 'store/store'
import { graphqlAPI } from 'api/api'
import { setLoggedOut } from 'modules/user/store/store'

import { logoutUser, userHasRole } from 'modules/user/utils'

jest.mock('store/store', () => ({
  dispatch: jest.fn(),
}))

jest.mock('api/api', () => ({
  graphqlAPI: {
    util: {
      resetApiState: jest.fn(),
      invalidateTags: jest.fn(),
    },
  },
}))

jest.mock('modules/user/store/store', () => ({
  setLoggedOut: jest.fn(),
}))

jest.mock('modules/user/authApi', () => ({
  logout: jest.fn(),
}))

describe('user utils', () => {
  describe('logoutUser', () => {
    it('should logout user', async () => {
      await logoutUser()

      expect(apiLogout).toHaveBeenCalled()
      expect(store.dispatch).toHaveBeenCalledWith(setLoggedOut(true))
      expect(store.dispatch).toHaveBeenCalledWith(
        graphqlAPI.util.resetApiState()
      )
      expect(graphqlAPI.util.invalidateTags).toHaveBeenCalledWith(['Auth'])
    })
  })

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
          'owner'
        )
      ).toBe(false)
    })
  })
})
