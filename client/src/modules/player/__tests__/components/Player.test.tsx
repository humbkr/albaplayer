import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import userEvent from '@testing-library/user-event'
import theme from 'themes/lightGreen'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import Player from 'modules/player/components/Player'
import { PlayerPlaybackMode } from 'modules/player/utils'
import { playerSelector, queueSelector } from 'modules/player/store/selectors'
import { BrowserRouter } from 'react-router-dom'
import {
  playerSetProgress,
  playerSetVolume,
  playerTogglePlayPause,
  playerToggleRepeat,
  playerToggleShuffle,
  setNextTrack,
  setPreviousTrack,
} from 'modules/player/store/store'
import resetAllMocks = jest.resetAllMocks
import clearAllMocks = jest.clearAllMocks

// Required to test components using react-slider.
global.ResizeObserver = require('resize-observer-polyfill')

// Mock audio element
window.HTMLMediaElement.prototype.load = jest.fn()
window.HTMLMediaElement.prototype.play = jest.fn()
window.HTMLMediaElement.prototype.pause = jest.fn()

// Mock mediaSession stuff.
global.MediaMetadata = jest.fn().mockImplementation(() => ({}))
Object.defineProperty(global.navigator, 'mediaSession', {
  value: {
    metadata: {},
    setActionHandler: jest.fn(),
  },
})

jest.mock('store/hooks')
const useAppDispatchMock = useAppDispatch as jest.Mock
const useAppSelectorMock = useAppSelector as jest.Mock

jest.mock('modules/player/store/store', () => ({
  playerTogglePlayPause: jest.fn(),
  setNextTrack: jest.fn(),
  setPreviousTrack: jest.fn(),
  playerToggleRepeat: jest.fn(),
  playerToggleShuffle: jest.fn(),
  playerSetProgress: jest.fn(),
  playerSetVolume: jest.fn(),
}))

jest.mock('modules/player/store/selectors')
const playerSelectorMock = playerSelector as jest.Mock
const queueSelectorMock = queueSelector as jest.Mock

jest.mock('api/api', () => ({
  getAuthAssetURL: jest.fn(),
}))

describe('Player', () => {
  beforeEach(() => {
    resetAllMocks()
    clearAllMocks()
    useAppDispatchMock.mockImplementation(() => jest.fn())
    useAppSelectorMock.mockImplementation((selector) => selector())
  })

  afterEach(() => jest.clearAllMocks())

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

    render(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Player />
        </BrowserRouter>
      </ThemeProvider>
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

    render(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Player />
        </BrowserRouter>
      </ThemeProvider>
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

    render(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Player />
        </BrowserRouter>
      </ThemeProvider>
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

    render(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Player />
        </BrowserRouter>
      </ThemeProvider>
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

    render(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Player />
        </BrowserRouter>
      </ThemeProvider>
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

    render(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Player />
        </BrowserRouter>
      </ThemeProvider>
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

    render(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Player />
        </BrowserRouter>
      </ThemeProvider>
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

    render(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Player />
        </BrowserRouter>
      </ThemeProvider>
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

    render(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Player />
        </BrowserRouter>
      </ThemeProvider>
    )

    await userEvent.click(screen.getByText('volume_low.svg'))

    expect(playerSetVolume).toHaveBeenCalled()
  })
})
