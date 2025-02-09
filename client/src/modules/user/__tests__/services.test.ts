import { logout as apiLogout } from 'modules/user/authApi'
import { store } from 'store/store'
import { graphqlAPISlice } from 'api/api'
import { logoutUser } from 'modules/user/services'

vi.mock('store/store', () => ({
  store: {
    dispatch: vi.fn(),
  },
}))

vi.mock('api/api', () => ({
  graphqlAPISlice: {
    util: {
      resetApiState: vi.fn(),
      invalidateTags: vi.fn(),
    },
  },
}))

vi.mock('modules/user/store/store', () => ({
  setLoggedOut: vi.fn(),
}))

vi.mock('modules/user/authApi', () => ({
  logout: vi.fn(),
}))

describe('user utils', () => {
  describe('logoutUser', () => {
    it('should logout user', async () => {
      await logoutUser()

      expect(apiLogout).toHaveBeenCalled()
      expect(store.dispatch).toHaveBeenCalledWith(
        graphqlAPISlice.util.resetApiState()
      )
      expect(graphqlAPISlice.util.invalidateTags).toHaveBeenCalledWith(['Auth'])
    })
  })
})
