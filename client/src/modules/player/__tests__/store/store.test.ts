import { makeStore } from 'store/store'
import libraryAPI from 'modules/library/api'
import { libraryInitialState } from 'modules/library/store'
import { playerInitialState } from 'modules/player/store/player.store'
import { queueInitialState } from 'modules/player/store/queue.store'
import {
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
