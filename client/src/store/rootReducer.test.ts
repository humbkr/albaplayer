import { persistStore } from 'redux-persist'
import { makeStore } from 'store/store'
import { fetchLibrary, setLastScan } from 'modules/library/store'

const createPersistedStore = async () => {
  const store = makeStore()
  // Resolves once the persisted state has been rehydrated.
  const persistor = await new Promise<ReturnType<typeof persistStore>>(
    (resolve) => {
      const p = persistStore(store, null, () => resolve(p))
    }
  )

  return { store, persistor }
}

describe('library persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists the library data but not the transient flags', async () => {
    const { store, persistor } = await createPersistedStore()

    store.dispatch(setLastScan('2026-10-01'))
    store.dispatch(fetchLibrary.pending('requestId'))
    await persistor.flush()

    const persisted = JSON.parse(
      localStorage.getItem('persist:library') ?? '{}'
    )

    expect(persisted.lastScan).toBe(JSON.stringify('2026-10-01'))
    expect(persisted).not.toHaveProperty('isFetching')
    expect(persisted).not.toHaveProperty('isInitialized')
    expect(persisted).not.toHaveProperty('initHasFailed')
  })

  it('does not restore a fetch in progress after a page reload', async () => {
    const first = await createPersistedStore()
    first.store.dispatch(setLastScan('2026-10-01'))
    first.store.dispatch(fetchLibrary.pending('requestId'))
    await first.persistor.flush()
    first.persistor.pause()

    const { store } = await createPersistedStore()
    const { library } = store.getState()

    expect(library.lastScan).toBe('2026-10-01')
    expect(library.isFetching).toBe(false)
  })
})
