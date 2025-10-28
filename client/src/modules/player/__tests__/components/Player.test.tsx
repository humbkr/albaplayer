import { screen } from '@testing-library/react'
import type { Mock } from 'vitest'
import userEvent from '@testing-library/user-event'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import Player from 'modules/player/components/Player'
import { PlayerPlaybackMode } from 'modules/player/utils'
import { playerSelector, queueSelector } from 'modules/player/store/selectors'
import { BrowserRouter } from 'react-router'
import {
  setNextTrack,
  setPreviousTrack,
  playerSetVolume,
  playerTogglePlayPause,
  playerToggleRepeat,
  playerToggleShuffle,
  playerSetProgress,
} from 'modules/player/store/store'
import { renderWithProviders } from 'common/utils/testing/test-utils'

// Required to test components using react-slider.
// eslint-disable-next-line @typescript-eslint/no-require-imports
global.ResizeObserver = require('resize-observer-polyfill')

// Mock audio element
window.HTMLMediaElement.prototype.load = vi.fn()
window.HTMLMediaElement.prototype.play = vi.fn()
window.HTMLMediaElement.prototype.pause = vi.fn()

// Mock mediaSession stuff.
global.MediaMetadata = vi.fn().mockImplementation(() => ({}))
Object.defineProperty(global.navigator, 'mediaSession', {
  value: {
    metadata: {},
    setActionHandler: vi.fn(),
  },
})

vi.mock('store/hooks')
const useAppDispatchMock = useAppDispatch as unknown as Mock
const useAppSelectorMock = useAppSelector as unknown as Mock

// @ts-ignore
vi.mock(import('modules/player/store/store'), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    playerTogglePlayPause: vi.fn(),
    playerToggleRepeat: vi.fn(),
    playerToggleShuffle: vi.fn(),
    playerSetProgress: vi.fn(),
    playerSetVolume: vi.fn(),
    setNextTrack: vi.fn(),
    setPreviousTrack: vi.fn(),
  }
})

vi.mock('modules/player/store/selectors')
const playerSelectorMock = playerSelector as Mock
const queueSelectorMock = queueSelector as Mock

vi.mock(import('api/helpers'), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    getAuthAssetURL: vi.fn(),
  }
})

describe('Player', () => {
  beforeEach(() => {
    useAppDispatchMock.mockImplementation(() => vi.fn())
    useAppSelectorMock.mockImplementation((selector) => selector())
  })

  it('displays correctly', () => {
    playerSelectorMock.mockReturnValue({
      playing: false,
      loading: false,
      duration: 100,
      progress: 0,
      repeat: PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT,
      shuffle: false,
      volume: 1,
      volumeMuted: 0.5,
      // Track currently loaded in audio.
      track: undefined,
    })
    queueSelectorMock.mockReturnValue({
      items: [],
      current: undefined,
    })

    renderWithProviders(
      <BrowserRouter>
        <Player />
      </BrowserRouter>
    )

    // Must display a track info, a progress bar, and a controls elements.
    expect(screen.getByTestId('player-track-info')).toBeInTheDocument()
    expect(screen.getByTestId('player-progress-bar')).toBeInTheDocument()
    expect(screen.getByTestId('player-controls')).toBeInTheDocument()
  })

  it('dispatches correct actions on toggle play / pause when not playing', async () => {
    playerSelectorMock.mockReturnValue({
      playing: false,
      loading: false,
      duration: 100,
      progress: 0,
      repeat: PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT,
      shuffle: false,
      volume: 1,
      volumeMuted: 0.5,
      // Track currently loaded in audio.
      track: {
        id: '1',
        title: 'title',
        src: '/stream/1',
        duration: 100,
        number: 1,
      },
    })
    queueSelectorMock.mockReturnValue({
      items: [],
      current: undefined,
    })

    renderWithProviders(
      <BrowserRouter>
        <Player />
      </BrowserRouter>
    )

    await userEvent.click(screen.getByTestId('play-pause-button'))

    expect(playerTogglePlayPause).toHaveBeenCalledWith(true)
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled()
  })

  it('dispatches correct actions on toggle play / pause when playing', async () => {
    playerSelectorMock.mockReturnValue({
      playing: true,
      loading: false,
      duration: 100,
      progress: 0,
      repeat: PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT,
      shuffle: false,
      volume: 1,
      volumeMuted: 0.5,
      // Track currently loaded in audio.
      track: {
        id: '1',
        title: 'title',
        src: '/stream/1',
        duration: 100,
        number: 1,
      },
    })
    queueSelectorMock.mockReturnValue({
      items: [],
      current: undefined,
    })

    renderWithProviders(
      <BrowserRouter>
        <Player />
      </BrowserRouter>
    )

    await userEvent.click(screen.getByTestId('play-pause-button'))

    expect(playerTogglePlayPause).toHaveBeenCalledWith(false)
    expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled()
  })

  it('dispatches correct actions on repeat button press', async () => {
    playerSelectorMock.mockReturnValue({
      playing: true,
      loading: false,
      duration: 100,
      progress: 0,
      repeat: PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT,
      shuffle: false,
      volume: 1,
      volumeMuted: 0.5,
      // Track currently loaded in audio.
      track: {
        id: '1',
        title: 'title',
        src: '/stream/1',
        duration: 100,
        number: 1,
      },
    })
    queueSelectorMock.mockReturnValue({
      items: [{}, {}, {}],
      current: undefined,
    })

    renderWithProviders(
      <BrowserRouter>
        <Player />
      </BrowserRouter>
    )

    await userEvent.click(screen.getByTestId('repeat-button-inactive'))

    expect(playerToggleRepeat).toHaveBeenCalled()
  })

  it('dispatches correct actions on shuffle button press', async () => {
    playerSelectorMock.mockReturnValue({
      playing: true,
      loading: false,
      duration: 100,
      progress: 0,
      repeat: PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT,
      shuffle: false,
      volume: 1,
      volumeMuted: 0.5,
      // Track currently loaded in audio.
      track: {
        id: '1',
        title: 'title',
        src: '/stream/1',
        duration: 100,
        number: 1,
      },
    })
    queueSelectorMock.mockReturnValue({
      items: [{}, {}, {}],
      current: undefined,
    })

    renderWithProviders(
      <BrowserRouter>
        <Player />
      </BrowserRouter>
    )

    await userEvent.click(screen.getByTestId('shuffle-button-inactive'))

    expect(playerToggleShuffle).toHaveBeenCalled()
  })

  it('dispatches correct actions on next button press', async () => {
    playerSelectorMock.mockReturnValue({
      playing: true,
      loading: false,
      duration: 100,
      progress: 0,
      repeat: PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT,
      shuffle: false,
      volume: 1,
      volumeMuted: 0.5,
      // Track currently loaded in audio.
      track: {
        id: '1',
        title: 'title',
        src: '/stream/1',
        duration: 100,
        number: 1,
      },
    })
    queueSelectorMock.mockReturnValue({
      items: [{}, {}, {}],
      current: 0,
    })

    renderWithProviders(
      <BrowserRouter>
        <Player />
      </BrowserRouter>
    )

    await userEvent.click(screen.getByTestId('next-button'))

    expect(setNextTrack).toHaveBeenCalledWith(false)
  })

  it('dispatches correct actions on previous button press', async () => {
    playerSelectorMock.mockReturnValue({
      playing: true,
      loading: false,
      duration: 100,
      progress: 0,
      repeat: PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT,
      shuffle: false,
      volume: 1,
      volumeMuted: 0.5,
      // Track currently loaded in audio.
      track: {
        id: '1',
        title: 'title',
        src: '/stream/1',
        duration: 100,
        number: 1,
      },
    })
    queueSelectorMock.mockReturnValue({
      items: [{}, {}, {}],
      current: 1,
    })

    renderWithProviders(
      <BrowserRouter>
        <Player />
      </BrowserRouter>
    )

    await userEvent.click(screen.getByTestId('previous-button'))

    expect(setPreviousTrack).toHaveBeenCalled()
  })

  it('dispatches correct actions on progress bar press', async () => {
    playerSelectorMock.mockReturnValue({
      playing: true,
      loading: false,
      duration: 100,
      progress: 40,
      repeat: PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT,
      shuffle: false,
      volume: 1,
      volumeMuted: 0.5,
      // Track currently loaded in audio.
      track: {
        id: '1',
        title: 'title',
        src: '/stream/1',
        duration: 100,
        number: 1,
      },
    })
    queueSelectorMock.mockReturnValue({
      items: [{}, {}, {}],
      current: 1,
    })

    renderWithProviders(
      <BrowserRouter>
        <Player />
      </BrowserRouter>
    )

    // There are 2 sliders: the progress bar and the volume, in that order.
    const sliders = screen.getAllByRole('slider')
    await userEvent.click(sliders[0])

    expect(playerSetProgress).toHaveBeenCalled()
  })

  it('dispatches correct actions on volume change', async () => {
    playerSelectorMock.mockReturnValue({
      playing: true,
      loading: false,
      duration: 100,
      progress: 40,
      repeat: PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT,
      shuffle: false,
      volume: 0.3,
      volumeMuted: 0.5,
      // Track currently loaded in audio.
      track: {
        id: '1',
        title: 'title',
        src: '/stream/1',
        duration: 100,
        number: 1,
      },
    })
    queueSelectorMock.mockReturnValue({
      items: [{}, {}, {}],
      current: 1,
    })

    renderWithProviders(
      <BrowserRouter>
        <Player />
      </BrowserRouter>
    )

    await userEvent.click(screen.getByTestId('player-volume-low-icon'))

    expect(playerSetVolume).toHaveBeenCalled()
  })
})
