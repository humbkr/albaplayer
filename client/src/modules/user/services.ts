import { logout as apiLogout } from 'modules/user/authApi'
import store from 'store/store'
import { graphqlAPI } from 'api/api'
import { setLoggedOut } from 'modules/user/store/store'

export async function logoutUser() {
  await apiLogout()
  store.dispatch(setLoggedOut(true))
  store.dispatch(graphqlAPI.util.resetApiState())
  graphqlAPI.util.invalidateTags(['Auth'])
}
