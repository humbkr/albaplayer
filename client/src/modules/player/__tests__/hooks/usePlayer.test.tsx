import type { PropsWithChildren } from 'react'
import { act, renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import { makeStore } from 'store/store'
import usePlayer from 'modules/player/hooks/usePlayer'
import { playerInitialState } from 'modules/player/store/player.store'
import { queueInitialState } from 'modules/player/store/queue.store'
import { playerSetTrack } from 'modules/player/store/store'
import { refreshToken } from 'modules/user/authApi'
import libraryAPI from 'modules/library/api'
import { PlayerPlaybackMode } from 'modules/player/utils'

vi.mock('modules/user/authApi', () => ({
  refreshToken: vi.fn(),
}))
vi.mock('modules/library/api', () => ({
  default: {
    getFullTrackInfo: vi.fn(),
  },
}))

type RefreshResult = Awaited<ReturnType<typeof refreshToken>>

const track1: Track = {
  id: '1',
  title: 'Track 1',
  src: '/stream/1',
  number: 1,
  disc: '',
  duration: 123,
  cover: '',
}
const track2: Track = { ...track1, id: '2', title: 'Track 2', src: '/stream/2' }

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

function setup() {
  const store = makeStore({
    player: { ...playerInitialState, track: track1, playing: true },
  })
  const wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  )
  renderHook(() => usePlayer(), { wrapper })

  // The hook's audio element is not attached to the DOM: grab it from load().
  const loadMock = vi.mocked(HTMLMediaElement.prototype.load)
  const audio = loadMock.mock.contexts[0] as HTMLAudioElement

  return { store, audio, loadMock }
}

describe('usePlayer auth retry', () => {
  const mockRefreshToken = vi.mocked(refreshToken)

  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {})
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('reloads the current track after refreshing the token', async () => {
    mockRefreshToken.mockResolvedValue({
      status: 200,
      data: undefined,
      error: undefined,
    })
    const { store, audio, loadMock } = setup()
    const loadCalls = loadMock.mock.calls.length

    await act(async () => {
      audio.dispatchEvent(new Event('error'))
    })

    expect(loadMock.mock.calls.length).toBe(loadCalls + 1)
    expect(audio.src).toContain('/stream/1')
    expect(store.getState().player.playing).toBe(true)
  })

  it('does not reload the previous track when the track changes during the refresh', async () => {
    const refresh = deferred<RefreshResult>()
    mockRefreshToken.mockReturnValue(refresh.promise)
    const { store, audio, loadMock } = setup()

    act(() => {
      audio.dispatchEvent(new Event('error'))
    })
    act(() => {
      store.dispatch(playerSetTrack(track2))
    })
    const loadCalls = loadMock.mock.calls.length

    await act(async () => {
      refresh.resolve({ status: 200, data: undefined, error: undefined })
    })

    expect(audio.src).toContain('/stream/2')
    expect(loadMock.mock.calls.length).toBe(loadCalls)
    expect(store.getState().player.playing).toBe(true)
  })

  it('does not pause the new track when the refresh fails after a track change', async () => {
    const refresh = deferred<RefreshResult>()
    mockRefreshToken.mockReturnValue(refresh.promise)
    const { store, audio } = setup()

    act(() => {
      audio.dispatchEvent(new Event('error'))
    })
    act(() => {
      store.dispatch(playerSetTrack(track2))
    })

    await act(async () => {
      refresh.resolve({ status: 401, data: undefined, error: 'expired' })
    })

    expect(store.getState().player.playing).toBe(true)
  })

  it('does not pause the new track when it interrupts the retry play()', async () => {
    mockRefreshToken.mockResolvedValue({
      status: 200,
      data: undefined,
      error: undefined,
    })
    const retryPlay = deferred<void>()
    const { store, audio } = setup()
    vi.mocked(HTMLMediaElement.prototype.play).mockReturnValueOnce(
      retryPlay.promise
    )

    await act(async () => {
      audio.dispatchEvent(new Event('error'))
    })
    act(() => {
      store.dispatch(playerSetTrack(track2))
    })

    await act(async () => {
      retryPlay.reject(new DOMException('Interrupted by load', 'AbortError'))
    })

    expect(store.getState().player.playing).toBe(true)
  })
})

describe('usePlayer stall recovery', () => {
  const mockRefreshToken = vi.mocked(refreshToken)
  const refreshed: RefreshResult = {
    status: 200,
    data: undefined,
    error: undefined,
  }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {})
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // Stalls a playing audio element and waits until the recovery is refreshing
  // the token. jsdom never plays, so `paused` is driven by the test.
  async function stallUntilRefreshing() {
    const refresh = deferred<RefreshResult>()
    mockRefreshToken.mockReturnValue(refresh.promise)
    const { store, audio } = setup()
    const paused = { value: false }
    Object.defineProperty(audio, 'paused', { get: () => paused.value })

    act(() => {
      audio.dispatchEvent(new Event('waiting'))
    })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_000)
    })
    expect(mockRefreshToken).toHaveBeenCalledTimes(1)

    return { store, audio, refresh, paused }
  }

  const playMock = () => vi.mocked(HTMLMediaElement.prototype.play)

  it('re-buffers and resumes after refreshing the token', async () => {
    const { store, refresh } = await stallUntilRefreshing()
    const playCalls = playMock().mock.calls.length

    await act(async () => {
      refresh.resolve(refreshed)
    })

    expect(playMock().mock.calls.length).toBe(playCalls + 1)
    expect(store.getState().player.playing).toBe(true)
  })

  it('does not touch the new track when the track changes during the refresh', async () => {
    const { store, refresh } = await stallUntilRefreshing()
    act(() => {
      store.dispatch(playerSetTrack(track2))
    })
    const playCalls = playMock().mock.calls.length

    await act(async () => {
      refresh.resolve(refreshed)
    })

    expect(playMock().mock.calls.length).toBe(playCalls)
    expect(store.getState().player.playing).toBe(true)
  })

  it('does not resume playback paused by the user during the refresh', async () => {
    const { refresh, paused } = await stallUntilRefreshing()
    paused.value = true
    const playCalls = playMock().mock.calls.length

    await act(async () => {
      refresh.resolve(refreshed)
    })

    expect(playMock().mock.calls.length).toBe(playCalls)
  })

  it('does not pause the new track when it interrupts the recovery play()', async () => {
    const { store, refresh } = await stallUntilRefreshing()
    const recoveryPlay = deferred<void>()
    playMock().mockReturnValueOnce(recoveryPlay.promise)

    await act(async () => {
      refresh.resolve(refreshed)
    })
    act(() => {
      store.dispatch(playerSetTrack(track2))
    })

    await act(async () => {
      recoveryPlay.reject(new DOMException('Interrupted by load', 'AbortError'))
    })

    expect(store.getState().player.playing).toBe(true)
  })
})

describe('usePlayer stream failure recovery position', () => {
  const mockRefreshToken = vi.mocked(refreshToken)
  const refreshed: RefreshResult = {
    status: 200,
    data: undefined,
    error: undefined,
  }

  beforeEach(() => {
    mockRefreshToken.mockResolvedValue(refreshed)
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {})
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // Jsdom does not play media: the test drives the state the hook reads, and
  // records the positions the hook seeks to.
  function setupWithMedia() {
    const { store, audio } = setup()
    const media = {
      readyState: HTMLMediaElement.HAVE_NOTHING as number,
      currentTime: 0,
      duration: NaN,
      error: null as MediaError | null,
    }
    const seeks: number[] = []
    Object.defineProperty(audio, 'readyState', { get: () => media.readyState })
    Object.defineProperty(audio, 'duration', { get: () => media.duration })
    Object.defineProperty(audio, 'error', { get: () => media.error })
    Object.defineProperty(audio, 'currentTime', {
      get: () => media.currentTime,
      set: (value: number) => {
        seeks.push(value)
        media.currentTime = value
      },
    })

    const fire = (type: string) =>
      act(() => {
        audio.dispatchEvent(new Event(type))
      })
    const loadMetadata = (duration: number) => {
      media.readyState = HTMLMediaElement.HAVE_METADATA
      media.duration = duration
      fire('loadedmetadata')
    }
    const playUntil = (position: number) => {
      media.readyState = HTMLMediaElement.HAVE_ENOUGH_DATA
      media.currentTime = position
      fire('timeupdate')
    }

    return { store, media, seeks, fire, loadMetadata, playUntil }
  }

  describe('on a stream error', () => {
    it('resumes at the last position played, not the failed element position', async () => {
      const { media, seeks, fire, loadMetadata, playUntil } = setupWithMedia()
      loadMetadata(200)
      playUntil(42)

      // Once failed, the element reports 0, including in its last timeupdate.
      media.currentTime = 0
      // Jsdom has no MediaError global: 2 is MEDIA_ERR_NETWORK.
      media.error = { code: 2 } as MediaError
      fire('timeupdate')
      await act(async () => {
        media.readyState = HTMLMediaElement.HAVE_NOTHING
        fire('error')
      })

      // The reloaded track seeks back to where playback was.
      media.error = null
      loadMetadata(200)
      expect(seeks).toEqual([42])
    })

    it('ignores positions reported while no media data is loaded', async () => {
      const { media, seeks, fire, loadMetadata, playUntil } = setupWithMedia()
      loadMetadata(200)
      playUntil(42)

      media.readyState = HTMLMediaElement.HAVE_NOTHING
      media.currentTime = 0
      fire('timeupdate')
      await act(async () => {
        fire('error')
      })

      loadMetadata(200)
      expect(seeks).toEqual([42])
    })
  })

  describe('on playback ending', () => {
    it('recovers instead of skipping when it ends well before the track duration', async () => {
      const { store, media, seeks, fire, loadMetadata, playUntil } =
        setupWithMedia()
      loadMetadata(200)
      playUntil(42)

      await act(async () => {
        fire('ended')
      })
      expect(mockRefreshToken).toHaveBeenCalledTimes(1)

      media.readyState = HTMLMediaElement.HAVE_NOTHING
      loadMetadata(200)
      expect(seeks).toEqual([42])
      // Not treated as the end of the queue.
      expect(store.getState().player.playing).toBe(true)
    })

    it('moves on when it reaches the end of the track', async () => {
      const { store, fire, loadMetadata, playUntil } = setupWithMedia()
      loadMetadata(200)
      playUntil(199.5)

      await act(async () => {
        fire('ended')
      })

      expect(mockRefreshToken).not.toHaveBeenCalled()
      // End of an empty queue: playback stops.
      expect(store.getState().player.playing).toBe(false)
    })

    it('accepts an early end at the same spot as the previous one', async () => {
      const { store, media, fire, loadMetadata, playUntil } = setupWithMedia()
      loadMetadata(200)
      playUntil(42)
      await act(async () => {
        fire('ended')
      })
      media.readyState = HTMLMediaElement.HAVE_NOTHING
      loadMetadata(200)
      playUntil(42)
      fire('playing')

      // A wrong metadata duration (e.g. VBR file) ends at the same spot again.
      await act(async () => {
        fire('ended')
      })

      expect(mockRefreshToken).toHaveBeenCalledTimes(1)
      expect(store.getState().player.playing).toBe(false)
    })
  })
})

describe('usePlayer duration', () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {})
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('resets the previous track duration when the track changes', () => {
    const { store, audio } = setup()
    Object.defineProperty(audio, 'duration', { get: () => 432 })
    act(() => {
      audio.dispatchEvent(new Event('loadedmetadata'))
    })
    expect(store.getState().player.duration).toBe(432)

    act(() => {
      store.dispatch(playerSetTrack(track2))
    })

    expect(store.getState().player.duration).toBe(0)
  })
})

describe('usePlayer end of track', () => {
  type TrackInfoResponse = Awaited<
    ReturnType<typeof libraryAPI.getFullTrackInfo>
  >
  const mockGetFullTrackInfo = vi.mocked(libraryAPI.getFullTrackInfo)
  const playMock = () => vi.mocked(HTMLMediaElement.prototype.play)

  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {})
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  function setupWithQueue(
    tracks: Track[],
    playerState: Partial<typeof playerInitialState> = {}
  ) {
    const store = makeStore({
      player: {
        ...playerInitialState,
        track: track1,
        playing: true,
        ...playerState,
      },
      queue: {
        ...queueInitialState,
        items: tracks.map((track) => ({ id: `item-${track.id}`, track })),
        current: 0,
      },
    })
    const wrapper = ({ children }: PropsWithChildren) => (
      <Provider store={store}>{children}</Provider>
    )
    renderHook(() => usePlayer(), { wrapper })

    const loadMock = vi.mocked(HTMLMediaElement.prototype.load)
    const audio = loadMock.mock.contexts[0] as HTMLAudioElement

    return { store, audio, loadMock }
  }

  it('starts the next track before its info is fetched', async () => {
    const trackInfo = deferred<TrackInfoResponse>()
    mockGetFullTrackInfo.mockReturnValue(trackInfo.promise)
    const { store, audio, loadMock } = setupWithQueue([track1, track2], {
      duration: 432,
    })
    const playCalls = playMock().mock.calls.length

    act(() => {
      audio.dispatchEvent(new Event('ended'))
    })

    expect(audio.src).toContain('/stream/2')
    expect(playMock().mock.calls.length).toBe(playCalls + 1)
    expect(store.getState().player.track?.id).toBe('1')
    // The previous track duration is not displayed for the new one.
    expect(store.getState().player.duration).toBe(0)

    // Locked IOS devices may load it before the track info is rendered.
    Object.defineProperty(audio, 'duration', { get: () => 185 })
    act(() => {
      audio.dispatchEvent(new Event('loadedmetadata'))
    })

    const loadCalls = loadMock.mock.calls.length
    await act(async () => {
      trackInfo.resolve({ status: 200, data: { track: track2 } })
    })

    expect(store.getState().player.track?.id).toBe('2')
    expect(store.getState().queue.current).toBe(1)
    expect(store.getState().player.playing).toBe(true)
    // The already started track is not reloaded.
    expect(loadMock.mock.calls.length).toBe(loadCalls)
    expect(store.getState().player.duration).toBe(185)
  })

  it('loads the same shuffled track it started', async () => {
    const track3: Track = { ...track1, id: '3', src: '/stream/3' }
    // Picks the last of the unplayed candidates (tracks 2 and 3), then the
    // first one if the thunk ever picked again.
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.99).mockReturnValue(0)
    mockGetFullTrackInfo.mockResolvedValue({
      status: 200,
      data: { track: track3 },
    })
    const { store, audio } = setupWithQueue([track1, track2, track3], {
      shuffle: true,
    })

    await act(async () => {
      audio.dispatchEvent(new Event('ended'))
    })

    expect(audio.src).toContain('/stream/3')
    expect(mockGetFullTrackInfo).toHaveBeenCalledWith('3')
    expect(store.getState().queue.shuffleHistory).toEqual(['item-1', 'item-3'])
  })

  it('stops playback at the end of the queue', () => {
    const { store, audio } = setupWithQueue([track1])

    act(() => {
      audio.dispatchEvent(new Event('ended'))
    })

    expect(audio.src).toContain('/stream/1')
    expect(mockGetFullTrackInfo).not.toHaveBeenCalled()
    expect(store.getState().player.playing).toBe(false)
  })

  it('replays the current track in repeat one mode', () => {
    const { audio } = setupWithQueue([track1, track2], {
      repeat: PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ONE,
    })

    act(() => {
      audio.dispatchEvent(new Event('ended'))
    })

    expect(audio.src).toContain('/stream/1')
    expect(mockGetFullTrackInfo).not.toHaveBeenCalled()
  })
})
