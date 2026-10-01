import type { PropsWithChildren } from 'react'
import { act, renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import { makeStore } from 'store/store'
import usePlayer from 'modules/player/hooks/usePlayer'
import { playerInitialState } from 'modules/player/store/player.store'
import { playerSetTrack } from 'modules/player/store/store'
import { refreshToken } from 'modules/user/authApi'

vi.mock('modules/user/authApi', () => ({
  refreshToken: vi.fn(),
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
