import { createSelector } from '@reduxjs/toolkit'
import {
  SETTINGS_BROWSER_ONCLICK,
  SETTINGS_BROWSER_TRACKS_PANE_DISPLAY,
} from 'modules/settings/constants'
import { selectCurrentUser, userConfigApi } from 'modules/user/api'

/*
 * User settings stored in the backend, as JSON in the user `data` field, so
 * that they are shared between the user's devices.
 */
export type UserConfig = {
  browser: {
    onClickBehavior: SETTINGS_BROWSER_ONCLICK
    tracksPaneDisplay: SETTINGS_BROWSER_TRACKS_PANE_DISPLAY
    sortArtists: ArtistsSortOptions
    sortAlbums: AlbumsSortOptions
    sortTracks: TracksSortOptions
  }
}

export const defaultUserConfig: UserConfig = {
  browser: {
    onClickBehavior: SETTINGS_BROWSER_ONCLICK.play,
    tracksPaneDisplay: SETTINGS_BROWSER_TRACKS_PANE_DISPLAY.albumInfo,
    sortArtists: 'name',
    sortAlbums: 'title',
    sortTracks: 'number',
  },
}

type BrowserConfig = UserConfig['browser']

const browserOptions: {
  [K in keyof BrowserConfig]: readonly BrowserConfig[K][]
} = {
  onClickBehavior: Object.values(SETTINGS_BROWSER_ONCLICK),
  tracksPaneDisplay: Object.values(SETTINGS_BROWSER_TRACKS_PANE_DISPLAY),
  sortArtists: ['name'],
  sortAlbums: ['title', 'year', 'artistName'],
  sortTracks: ['title', 'number', 'album', 'artistId'],
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

// Stored values are not trusted: they may come from an older version of the
// app or have been written by another client.
const getBrowserOption = <K extends keyof BrowserConfig>(
  stored: Record<string, unknown>,
  key: K
): BrowserConfig[K] => {
  const value = stored[key]

  return (browserOptions[key] as readonly unknown[]).includes(value)
    ? (value as BrowserConfig[K])
    : defaultUserConfig.browser[key]
}

export function parseUserConfig(data?: string): UserConfig {
  if (!data) {
    return defaultUserConfig
  }

  let stored: unknown
  try {
    stored = JSON.parse(data)
  } catch {
    return defaultUserConfig
  }

  const storedBrowser =
    isRecord(stored) && isRecord(stored.browser) ? stored.browser : {}

  return {
    browser: {
      onClickBehavior: getBrowserOption(storedBrowser, 'onClickBehavior'),
      tracksPaneDisplay: getBrowserOption(storedBrowser, 'tracksPaneDisplay'),
      sortArtists: getBrowserOption(storedBrowser, 'sortArtists'),
      sortAlbums: getBrowserOption(storedBrowser, 'sortAlbums'),
      sortTracks: getBrowserOption(storedBrowser, 'sortTracks'),
    },
  }
}

export const selectUserConfig = createSelector(
  [(state: RootState) => selectCurrentUser(state).data?.data],
  parseUserConfig
)

// Saves run one at a time so that the server always ends up with the latest
// config: changes made while a save is in flight are sent together afterwards.
// A queue belongs to the user who made the changes: once the current user
// changes (logout, login as someone else), it is dropped and its remaining
// changes are neither sent nor rolled back.
type SaveQueue = {
  userId: number
  hasPendingChanges: boolean
  // User data as last confirmed by the server, restored when a save fails.
  confirmedData?: string
}

let activeQueue: SaveQueue | undefined

const isQueueCurrent = (queue: SaveQueue, state: RootState) =>
  activeQueue === queue && selectCurrentUser(state).data?.id === queue.userId

const setCachedUserData = (data?: string) =>
  userConfigApi.util.updateQueryData('getUser', undefined, (user) => {
    user.data = data
  })

const saveUserConfig =
  (queue: SaveQueue): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    try {
      do {
        queue.hasPendingChanges = false
        const data = selectCurrentUser(getState()).data?.data ?? ''

        try {
          await dispatch(
            userConfigApi.endpoints.updateUserConfig.initiate({
              userId: queue.userId,
              data,
            })
          ).unwrap()
          queue.confirmedData = data
        } catch {
          // A pending save carries the failed changes along with the newer
          // ones, so only roll back when nothing else is queued.
          if (isQueueCurrent(queue, getState()) && !queue.hasPendingChanges) {
            dispatch(setCachedUserData(queue.confirmedData))
          }
        }
      } while (queue.hasPendingChanges && isQueueCurrent(queue, getState()))
    } finally {
      if (activeQueue === queue) {
        activeQueue = undefined
      }
    }
  }

export const updateBrowserConfig =
  (changes: Partial<UserConfig['browser']>): AppThunk =>
  (dispatch, getState) => {
    const state = getState()
    const user = selectCurrentUser(state).data

    if (!user) {
      return
    }

    const config = selectUserConfig(state)
    dispatch(
      setCachedUserData(
        JSON.stringify({
          ...config,
          browser: { ...config.browser, ...changes },
        })
      )
    )

    if (activeQueue?.userId === user.id) {
      activeQueue.hasPendingChanges = true

      return
    }

    activeQueue = {
      userId: user.id,
      hasPendingChanges: false,
      confirmedData: user.data,
    }
    void dispatch(saveUserConfig(activeQueue))
  }
