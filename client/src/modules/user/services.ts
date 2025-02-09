import { logout as apiLogout } from 'modules/user/authApi'
import { store } from 'store/store'
import { graphqlAPISlice } from 'api/api'

export async function logoutUser() {
  await apiLogout()
  store.dispatch(graphqlAPISlice.util.resetApiState())
  graphqlAPISlice.util.invalidateTags(['Auth'])
}
