import { store } from 'store/store'
import { graphqlAPISlice } from 'api/api'
import { initLibrary } from 'modules/library/store'

// Refresh app data.
export async function refreshData() {
  store.dispatch(initLibrary(true))
  store.dispatch({
    type: `${graphqlAPISlice.reducerPath}/invalidateTags`,
    payload: ['Collections', 'Users'],
  })
}
