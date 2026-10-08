import { makeStore } from 'store/store'
import libraryAPI from 'modules/library/api'
import { libraryInitialState } from 'modules/library/store'
import { playerInitialState } from 'modules/player/store/player.store'
import { queueInitialState } from 'modules/player/store/queue.store'
import { PlayerPlaybackMode } from 'modules/player/utils'
import {
  playItemFromQueue,
  playTrack,
  setNextTrack,
  setPreviousTrack,
} from 'modules/player/store/store'

vi.mock('modules/library/api', () => ({
  default: {
    getFullTrackInfo: vi.fn(),
  },
}))

const mockGetFullTrackInfo = vi.mocked(libraryAPI.getFullTrackInfo)

const track1: Track = {
  id: '1',
  title: 'Track 1',
  src: '/stream/1',
  number: 1,
  disc: '',
  duration: 123,
  cover: '',
  albumId: '1',
  artistId: '1',
}

const track2: Track = { ...track1, id: '2', title: 'Track 2', src: '/stream/2' }

function setupStore(queuePosition = 1) {
  return makeStore({
    library: {
      ...libraryInitialState,
      isInitialized: true,
      tracks: { 1: track1, 2: track2 },
    },
    player: { ...playerInitialState, track: track1 },
    queue: {
      ...queueInitialState,
      items: [{ track: track1 }, { track: track2 }],
      current: queuePosition,
    },
  })
}

describe('player thunks loading state', () => {
  beforeEach(() => {
    mockGetFullTrackInfo.mockReset()
  })

  it('clears loading and starts playback when the track loads', async () => {
    mockGetFullTrackInfo.mockResolvedValue({
      status: 200,
      data: { track: track1 },
    })
    const store = setupStore()

    await store.dispatch(playTrack('1'))

    expect(store.getState().player.loading).toBe(false)
    expect(store.getState().player.playing).toBe(true)
  })

  it('clears loading without playing when fetching the track rejects', async () => {
    mockGetFullTrackInfo.mockRejectedValue(new Error('network error'))
    const store = setupStore()

    await expect(store.dispatch(playTrack('1'))).rejects.toThrow()

    expect(store.getState().player.loading).toBe(false)
    expect(store.getState().player.playing).toBe(false)
  })

  it('clears loading when the API returns no data', async () => {
    mockGetFullTrackInfo.mockResolvedValue({ status: 500, data: undefined })
    const store = setupStore()

    await expect(store.dispatch(playTrack('1'))).rejects.toThrow()

    expect(store.getState().player.loading).toBe(false)
  })

  it('clears loading when fetching the next track rejects', async () => {
    mockGetFullTrackInfo.mockRejectedValue(new Error('network error'))
    const store = setupStore(0)

    await expect(store.dispatch(setNextTrack(false))).rejects.toThrow()

    expect(store.getState().player.loading).toBe(false)
  })

  it('clears loading when fetching the previous track rejects', async () => {
    mockGetFullTrackInfo.mockRejectedValue(new Error('network error'))
    const store = setupStore()

    await expect(store.dispatch(setPreviousTrack())).rejects.toThrow()

    expect(store.getState().player.loading).toBe(false)
  })
})

describe('player thunks overlapping loads', () => {
  const track3: Track = {
    ...track1,
    id: '3',
    title: 'Track 3',
    src: '/stream/3',
  }
  type TrackInfoResponse = Awaited<
    ReturnType<typeof libraryAPI.getFullTrackInfo>
  >

  // Lets each test decide when (and in which order) track requests resolve.
  let pendingRequests: Record<string, (response: TrackInfoResponse) => void>

  function resolveTrack(track: Track) {
    pendingRequests[track.id]({ status: 200, data: { track } })
  }

  // Queue [track1, track2, track3] with the item at `current` loaded.
  function setupNavigationStore(
    current: number,
    repeat = PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT
  ) {
    const items = [{ track: track1 }, { track: track2 }, { track: track3 }]

    return makeStore({
      player: { ...playerInitialState, track: items[current].track, repeat },
      queue: { ...queueInitialState, items, current },
    })
  }

  const requestedTrackIds = () =>
    mockGetFullTrackInfo.mock.calls.map(([trackId]) => trackId)

  function setupOverlapStore() {
    return makeStore({
      library: {
        ...libraryInitialState,
        isInitialized: true,
        tracks: { 1: track1, 2: track2, 3: track3 },
      },
      player: { ...playerInitialState, track: track1 },
      queue: { ...queueInitialState, items: [{ track: track1 }], current: 0 },
    })
  }

  beforeEach(() => {
    pendingRequests = {}
    mockGetFullTrackInfo.mockReset()
    mockGetFullTrackInfo.mockImplementation(
      (trackId: string) =>
        new Promise((resolve) => {
          pendingRequests[trackId] = resolve
        })
    )
  })

  it('keeps loading until the latest request finishes when an older one finishes first', async () => {
    const store = setupOverlapStore()
    const requestA = store.dispatch(playTrack('2'))
    const requestB = store.dispatch(playTrack('3'))

    resolveTrack(track2)
    await requestA

    // A was superseded by B: it neither applies its track nor ends loading.
    expect(store.getState().player.loading).toBe(true)
    expect(store.getState().player.track).toEqual(track1)
    expect(store.getState().player.playing).toBe(false)

    resolveTrack(track3)
    await requestB

    expect(store.getState().player.loading).toBe(false)
    expect(store.getState().player.track).toEqual(track3)
    expect(store.getState().player.playing).toBe(true)
  })

  it('does not let an older request override the latest one when it finishes last', async () => {
    const store = setupOverlapStore()
    const requestA = store.dispatch(playTrack('2'))
    const requestB = store.dispatch(playTrack('3'))

    resolveTrack(track3)
    await requestB
    resolveTrack(track2)
    await requestA

    expect(store.getState().player.loading).toBe(false)
    expect(store.getState().player.track).toEqual(track3)
    expect(store.getState().queue.items).toEqual([{ track: track3 }])
  })

  it('starts playing a queue item only once it is loaded', async () => {
    // Queue [track1, track2], track1 current and paused.
    const store = setupStore(0)
    const request = store.dispatch(playItemFromQueue(1))

    // The paused previous track must not resume while track2 is fetched.
    expect(store.getState().player.loading).toBe(true)
    expect(store.getState().player.playing).toBe(false)

    resolveTrack(track2)
    await request

    expect(store.getState().player.track).toEqual(track2)
    expect(store.getState().queue.current).toBe(1)
    expect(store.getState().player.playing).toBe(true)
  })

  it('does not play a queue item superseded by a newer load', async () => {
    const store = setupStore(0)
    const request = store.dispatch(playItemFromQueue(1))
    // Newer load of another queue item (track1), left pending.
    store.dispatch(playItemFromQueue(0))

    resolveTrack(track2)
    await request

    // The newer load still owns the player: nothing was applied or played.
    expect(store.getState().player.track).toEqual(track1)
    expect(store.getState().player.playing).toBe(false)
    expect(store.getState().player.loading).toBe(true)
  })

  it('chains a second next from the pending one instead of targeting the same track', async () => {
    const store = setupNavigationStore(0)
    const firstNext = store.dispatch(setNextTrack(false))
    const secondNext = store.dispatch(setNextTrack(false))

    expect(requestedTrackIds()).toEqual(['2', '3'])

    resolveTrack(track2)
    resolveTrack(track3)
    await Promise.all([firstNext, secondNext])

    expect(store.getState().player.track).toEqual(track3)
    expect(store.getState().queue.current).toBe(2)
  })

  it('goes back to the original track on next then previous', async () => {
    const store = setupNavigationStore(1)
    const next = store.dispatch(setNextTrack(false))
    const previous = store.dispatch(setPreviousTrack())

    expect(requestedTrackIds()).toEqual(['3', '2'])

    resolveTrack(track3)
    resolveTrack(track2)
    await Promise.all([next, previous])

    expect(store.getState().player.track).toEqual(track2)
    expect(store.getState().queue.current).toBe(1)
  })

  it('navigates from the last loaded track after a failed load', async () => {
    const store = setupNavigationStore(0)
    mockGetFullTrackInfo.mockRejectedValueOnce(new Error('network error'))

    await expect(store.dispatch(setNextTrack(false))).rejects.toThrow()
    const next = store.dispatch(setNextTrack(false))

    // The failed load never applied, so next targets track2 again.
    expect(requestedTrackIds()).toEqual(['2', '2'])

    resolveTrack(track2)
    await next

    expect(store.getState().player.track).toEqual(track2)
    expect(store.getState().queue.current).toBe(1)
  })

  it('loops to the first track from a pending load of the last one', async () => {
    const store = setupNavigationStore(
      1,
      PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ALL
    )
    const firstNext = store.dispatch(setNextTrack(false))
    const secondNext = store.dispatch(setNextTrack(false))

    expect(requestedTrackIds()).toEqual(['3', '1'])

    resolveTrack(track3)
    resolveTrack(track1)
    await Promise.all([firstNext, secondNext])

    expect(store.getState().player.track).toEqual(track1)
    expect(store.getState().queue.current).toBe(0)
  })
})
