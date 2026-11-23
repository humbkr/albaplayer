import { makeStore } from 'store/store'
import { userConfigApi } from 'modules/user/api'
import {
  defaultUserConfig,
  parseUserConfig,
  selectUserConfig,
  updateBrowserConfig,
  updatePlayerConfig,
} from 'modules/settings/userConfig'
import {
  SETTINGS_BROWSER_ONCLICK,
  SETTINGS_BROWSER_TRACKS_PANE_DISPLAY,
  SETTINGS_PLAYER_TIME_DISPLAY,
  SETTINGS_PLAYER_TIME_VISIBILITY,
} from 'modules/settings/constants'

const user: User = { id: 1, name: 'root', roles: ['root'] }

const makeStoreWithUser = async () => {
  const store = makeStore()
  await store.dispatch(
    userConfigApi.util.upsertQueryData('getUser', undefined, user)
  )

  return store
}

const mockFetchResponse = (status: number, body: object) =>
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  )

describe('userConfig', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('parseUserConfig', () => {
    it('returns the defaults when there is no stored config', () => {
      expect(parseUserConfig(undefined)).toEqual(defaultUserConfig)
      expect(parseUserConfig('')).toEqual(defaultUserConfig)
    })

    it('returns the defaults when the stored config is invalid', () => {
      expect(parseUserConfig('not json')).toEqual(defaultUserConfig)
    })

    it('merges the stored config over the defaults', () => {
      const config = parseUserConfig(
        JSON.stringify({ browser: { sortAlbums: 'year' } })
      )

      expect(config.browser).toEqual({
        ...defaultUserConfig.browser,
        sortAlbums: 'year',
      })
    })

    it('replaces unknown option values with the defaults', () => {
      const config = parseUserConfig(
        JSON.stringify({
          browser: {
            sortTracks: 'unknown',
            sortAlbums: 42,
            onClickBehavior: null,
            tracksPaneDisplay: SETTINGS_BROWSER_TRACKS_PANE_DISPLAY.tracksOnly,
          },
        })
      )

      expect(config.browser).toEqual({
        ...defaultUserConfig.browser,
        tracksPaneDisplay: SETTINGS_BROWSER_TRACKS_PANE_DISPLAY.tracksOnly,
      })
    })

    it.each(['null', '42', '"text"', '[]', '{"browser":"text"}'])(
      'returns the defaults when the stored config shape is invalid (%s)',
      (data) => {
        expect(parseUserConfig(data)).toEqual(defaultUserConfig)
      }
    )

    it('parses the player config', () => {
      const config = parseUserConfig(
        JSON.stringify({
          player: {
            timeDisplay: SETTINGS_PLAYER_TIME_DISPLAY.remaining,
            timeVisibility: SETTINGS_PLAYER_TIME_VISIBILITY.never,
          },
        })
      )

      expect(config.player).toEqual({
        timeDisplay: SETTINGS_PLAYER_TIME_DISPLAY.remaining,
        timeVisibility: SETTINGS_PLAYER_TIME_VISIBILITY.never,
      })
      expect(config.browser).toEqual(defaultUserConfig.browser)
    })

    it('replaces an unknown player option value with the default', () => {
      const config = parseUserConfig(
        JSON.stringify({
          player: { timeDisplay: 'unknown', timeVisibility: 'unknown' },
        })
      )

      expect(config.player).toEqual(defaultUserConfig.player)
    })
  })

  describe('updateBrowserConfig', () => {
    it('updates the config optimistically and keeps it on success', async () => {
      const fetchMock = mockFetchResponse(200, {
        data: { updateUser: { id: 1 } },
      })
      const store = await makeStoreWithUser()

      store.dispatch(updateBrowserConfig({ sortAlbums: 'year' }))

      expect(selectUserConfig(store.getState()).browser.sortAlbums).toBe('year')

      await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled())
      await vi.waitFor(() =>
        expect(
          Object.values(store.getState().graphqlApi.mutations)[0]?.status
        ).toBe('fulfilled')
      )
      expect(selectUserConfig(store.getState()).browser.sortAlbums).toBe('year')
    })

    it('rolls the config back when the request fails', async () => {
      mockFetchResponse(500, { errors: [{ message: 'Server error' }] })
      const store = await makeStoreWithUser()

      store.dispatch(
        updateBrowserConfig({ onClickBehavior: SETTINGS_BROWSER_ONCLICK.add })
      )

      expect(selectUserConfig(store.getState()).browser.onClickBehavior).toBe(
        SETTINGS_BROWSER_ONCLICK.add
      )

      await vi.waitFor(() =>
        expect(selectUserConfig(store.getState()).browser.onClickBehavior).toBe(
          SETTINGS_BROWSER_ONCLICK.play
        )
      )
    })

    it('sends the saves one at a time, the last one carrying the latest config', async () => {
      const resolvers: (() => void)[] = []
      const bodies: string[] = []
      vi.spyOn(globalThis, 'fetch').mockImplementation(async (_url, init) => {
        bodies.push(init?.body as string)
        await new Promise<void>((resolve) => resolvers.push(resolve))

        return new Response(
          JSON.stringify({ data: { updateUser: { id: 1 } } }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      })
      const store = await makeStoreWithUser()

      store.dispatch(updateBrowserConfig({ sortAlbums: 'year' }))
      store.dispatch(
        updateBrowserConfig({ onClickBehavior: SETTINGS_BROWSER_ONCLICK.add })
      )
      store.dispatch(updateBrowserConfig({ sortTracks: 'title' }))

      await vi.waitFor(() => expect(resolvers).toHaveLength(1))
      resolvers[0]()
      await vi.waitFor(() => expect(resolvers).toHaveLength(2))
      resolvers[1]()

      await vi.waitFor(() =>
        expect(
          Object.values(store.getState().graphqlApi.mutations).every(
            (mutation) => mutation?.status === 'fulfilled'
          )
        ).toBe(true)
      )
      expect(bodies).toHaveLength(2)
      const lastSaved = JSON.parse(
        JSON.parse(bodies[1]).variables.input.data
      ) as { browser: Record<string, string> }
      expect(lastSaved.browser).toMatchObject({
        sortAlbums: 'year',
        onClickBehavior: SETTINGS_BROWSER_ONCLICK.add,
        sortTracks: 'title',
      })
    })

    it('keeps changes saved after a failed save', async () => {
      const responses = [
        { status: 500, body: { errors: [{ message: 'Server error' }] } },
        { status: 200, body: { data: { updateUser: { id: 1 } } } },
      ]
      const resolvers: (() => void)[] = []
      vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
        const { status, body } = responses[resolvers.length]
        await new Promise<void>((resolve) => resolvers.push(resolve))

        return new Response(JSON.stringify(body), {
          status,
          headers: { 'Content-Type': 'application/json' },
        })
      })
      const store = await makeStoreWithUser()

      store.dispatch(updateBrowserConfig({ sortAlbums: 'year' }))
      store.dispatch(
        updateBrowserConfig({ onClickBehavior: SETTINGS_BROWSER_ONCLICK.add })
      )

      await vi.waitFor(() => expect(resolvers).toHaveLength(1))
      resolvers[0]()
      await vi.waitFor(() => expect(resolvers).toHaveLength(2))
      resolvers[1]()

      await vi.waitFor(() =>
        expect(
          Object.values(store.getState().graphqlApi.mutations).some(
            (mutation) => mutation?.status === 'fulfilled'
          )
        ).toBe(true)
      )
      const { browser } = selectUserConfig(store.getState())
      expect(browser.sortAlbums).toBe('year')
      expect(browser.onClickBehavior).toBe(SETTINGS_BROWSER_ONCLICK.add)
    })

    describe('when the user changes while a save is in flight', () => {
      const otherUser: User = { id: 2, name: 'other', roles: ['listener'] }

      const setup = async (firstSaveStatus: number) => {
        const requests: { id: number; data: string }[] = []
        const resolvers: (() => void)[] = []
        vi.spyOn(globalThis, 'fetch').mockImplementation(async (_url, init) => {
          const { variables } = JSON.parse(init?.body as string)
          const status = requests.length === 0 ? firstSaveStatus : 200
          requests.push({ id: variables.id, data: variables.input.data })
          await new Promise<void>((resolve) => resolvers.push(resolve))

          return new Response(
            JSON.stringify(
              status === 200
                ? { data: { updateUser: { id: variables.id } } }
                : { errors: [{ message: 'Server error' }] }
            ),
            { status, headers: { 'Content-Type': 'application/json' } }
          )
        })
        const store = await makeStoreWithUser()

        store.dispatch(updateBrowserConfig({ sortAlbums: 'year' }))
        // Queued behind the in-flight save.
        store.dispatch(updateBrowserConfig({ sortTracks: 'title' }))
        await vi.waitFor(() => expect(resolvers).toHaveLength(1))

        // The first user logs out and another one logs in.
        store.dispatch(userConfigApi.util.resetApiState())
        await store.dispatch(
          userConfigApi.util.upsertQueryData('getUser', undefined, otherUser)
        )
        store.dispatch(
          updateBrowserConfig({ onClickBehavior: SETTINGS_BROWSER_ONCLICK.add })
        )
        await vi.waitFor(() => expect(resolvers).toHaveLength(2))

        resolvers.forEach((resolve) => resolve())
        await vi.waitFor(() =>
          expect(
            Object.values(store.getState().graphqlApi.mutations).some(
              (mutation) => mutation?.status === 'fulfilled'
            )
          ).toBe(true)
        )
        // Let the first user's save loop settle.
        await new Promise((resolve) => setTimeout(resolve, 20))

        return { store, requests }
      }

      it('does not send the remaining changes of the previous user', async () => {
        const { requests } = await setup(200)

        expect(requests.map((request) => request.id)).toEqual([1, 2])
        expect(JSON.parse(requests[1].data).browser.onClickBehavior).toBe(
          SETTINGS_BROWSER_ONCLICK.add
        )
      })

      it('does not roll back the new user config when the previous save fails', async () => {
        const { store, requests } = await setup(500)

        expect(requests.map((request) => request.id)).toEqual([1, 2])
        expect(selectUserConfig(store.getState()).browser.onClickBehavior).toBe(
          SETTINGS_BROWSER_ONCLICK.add
        )
      })
    })
  })

  describe('updatePlayerConfig', () => {
    it('updates the player config and keeps the browser config', async () => {
      // Two saves are made: each needs its own response, as a body can only
      // be read once.
      const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(
        async () =>
          new Response(JSON.stringify({ data: { updateUser: { id: 1 } } }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
      )
      const store = await makeStoreWithUser()
      store.dispatch(updateBrowserConfig({ sortAlbums: 'year' }))
      await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
      await vi.waitFor(() =>
        expect(
          Object.values(store.getState().graphqlApi.mutations)[0]?.status
        ).toBe('fulfilled')
      )

      store.dispatch(
        updatePlayerConfig({
          timeDisplay: SETTINGS_PLAYER_TIME_DISPLAY.remaining,
        })
      )

      const config = selectUserConfig(store.getState())
      expect(config.player.timeDisplay).toBe(
        SETTINGS_PLAYER_TIME_DISPLAY.remaining
      )
      expect(config.browser.sortAlbums).toBe('year')

      await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
      await vi.waitFor(() =>
        Object.values(store.getState().graphqlApi.mutations).forEach(
          (mutation) => expect(mutation?.status).toBe('fulfilled')
        )
      )
    })
  })
})
