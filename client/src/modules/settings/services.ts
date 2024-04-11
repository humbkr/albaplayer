import store from 'store/store'
import { graphqlAPI } from 'api/api'
import { initLibrary } from 'modules/library/store'

// Refresh app data.
export async function refreshData() {
  store.dispatch(initLibrary(true))
  store.dispatch({
    type: `${graphqlAPI.reducerPath}/invalidateTags`,
    payload: ['Collections', 'Users'],
  })
}
