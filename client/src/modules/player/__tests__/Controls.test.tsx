import { ThemeProvider } from 'styled-components'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import theme from 'themes/default'
import Controls from 'modules/player/components/Controls'
import { PlayerPlaybackMode } from 'modules/player/utils'

// We don't need the VolumeContainer for this test.
jest.mock(
  'modules/player/components/VolumeContainer',
  () =>
    function () {
      return <div data-testid="volume-container" />
    }
)

const mockSetVolume = jest.fn()
const mockSkipToNext = jest.fn()
const mockSkipToPrevious = jest.fn()
const mockTogglePlayPause = jest.fn()
const mockToggleRepeat = jest.fn()
const mockToggleShuffle = jest.fn()

describe('Controls', () => {
  beforeEach(() => jest.clearAllMocks())

  it('displays correctly when paused / no repeat / no shuffle / no track', () => {
    render(
      <ThemeProvider theme={theme}>
        <Controls
          hasNextTrack={false}
          hasPreviousTrack={false}
          hasTrack={false}
          playing={false}
          repeat={PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT}
          setVolume={mockSetVolume}
          shuffle={false}
          skipToNext={mockSkipToNext}
          skipToPrevious={mockSkipToPrevious}
          togglePlayPause={mockTogglePlayPause}
          toggleRepeat={mockToggleRepeat}
          toggleShuffle={mockToggleShuffle}
          volume={1}
        />
      </ThemeProvider>
    )

    // The play icon is displayed.
    expect(screen.getByText('play.svg')).toBeInTheDocument()
    // The play button is disabled.
    expect(screen.getByTestId('play-pause-button')).toBeDisabled()
    // The previous button is disabled.
    expect(screen.getByTestId('previous-button')).toBeDisabled()
    // The next button is disabled.
    expect(screen.getByTestId('next-button')).toBeDisabled()
    // The repeat icon is displayed.
    expect(screen.getByText('repeat.svg')).toBeInTheDocument()
    // The repeat button is inactive.
    expect(screen.getByTestId('repeat-button-inactive')).toBeInTheDocument()
    // The shuffle button is inactive.
    expect(screen.getByTestId('shuffle-button-inactive')).toBeInTheDocument()
  })

  it('displays correctly when paused / no repeat / no shuffle / track / no previous track / no next track', () => {
    render(
      <ThemeProvider theme={theme}>
        <Controls
          hasNextTrack={false}
          hasPreviousTrack={false}
          hasTrack
          playing={false}
          repeat={PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT}
          setVolume={mockSetVolume}
          shuffle={false}
          skipToNext={mockSkipToNext}
          skipToPrevious={mockSkipToPrevious}
          togglePlayPause={mockTogglePlayPause}
          toggleRepeat={mockToggleRepeat}
          toggleShuffle={mockToggleShuffle}
          volume={1}
        />
      </ThemeProvider>
    )

    // The play icon is displayed.
    expect(screen.getByText('play.svg')).toBeInTheDocument()
    // The play button is disabled.
    expect(screen.getByTestId('play-pause-button')).toBeEnabled()
    // The previous button is disabled.
    expect(screen.getByTestId('previous-button')).toBeDisabled()
    // The next button is disabled.
    expect(screen.getByTestId('next-button')).toBeDisabled()
    // The repeat icon is displayed.
    expect(screen.getByText('repeat.svg')).toBeInTheDocument()
    // The repeat button is inactive.
    expect(screen.getByTestId('repeat-button-inactive')).toBeInTheDocument()
    // The shuffle button is inactive.
    expect(screen.getByTestId('shuffle-button-inactive')).toBeInTheDocument()
  })

  it('displays correctly when paused / no repeat / no shuffle / track / previous track / no next track', () => {
    render(
      <ThemeProvider theme={theme}>
        <Controls
          hasNextTrack={false}
          hasPreviousTrack
          hasTrack
          playing={false}
          repeat={PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT}
          setVolume={mockSetVolume}
          shuffle={false}
          skipToNext={mockSkipToNext}
          skipToPrevious={mockSkipToPrevious}
          togglePlayPause={mockTogglePlayPause}
          toggleRepeat={mockToggleRepeat}
          toggleShuffle={mockToggleShuffle}
          volume={1}
        />
      </ThemeProvider>
    )

    // The play icon is displayed.
    expect(screen.getByText('play.svg')).toBeInTheDocument()
    // The play button is disabled.
    expect(screen.getByTestId('play-pause-button')).toBeEnabled()
    // The previous button is disabled.
    expect(screen.getByTestId('previous-button')).toBeEnabled()
    // The next button is disabled.
    expect(screen.getByTestId('next-button')).toBeDisabled()
    // The repeat icon is displayed.
    expect(screen.getByText('repeat.svg')).toBeInTheDocument()
    // The repeat button is inactive.
    expect(screen.getByTestId('repeat-button-inactive')).toBeInTheDocument()
    // The shuffle button is inactive.
    expect(screen.getByTestId('shuffle-button-inactive')).toBeInTheDocument()
  })

  it('displays correctly when paused / no repeat / no shuffle / track / no previous track / next track', () => {
    render(
      <ThemeProvider theme={theme}>
        <Controls
          hasNextTrack
          hasPreviousTrack={false}
          hasTrack
          playing={false}
          repeat={PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT}
          setVolume={mockSetVolume}
          shuffle={false}
          skipToNext={mockSkipToNext}
          skipToPrevious={mockSkipToPrevious}
          togglePlayPause={mockTogglePlayPause}
          toggleRepeat={mockToggleRepeat}
          toggleShuffle={mockToggleShuffle}
          volume={1}
        />
      </ThemeProvider>
    )

    // The play icon is displayed.
    expect(screen.getByText('play.svg')).toBeInTheDocument()
    // The play button is disabled.
    expect(screen.getByTestId('play-pause-button')).toBeEnabled()
    // The previous button is disabled.
    expect(screen.getByTestId('previous-button')).toBeDisabled()
    // The next button is disabled.
    expect(screen.getByTestId('next-button')).toBeEnabled()
    // The repeat icon is displayed.
    expect(screen.getByText('repeat.svg')).toBeInTheDocument()
    // The repeat button is inactive.
    expect(screen.getByTestId('repeat-button-inactive')).toBeInTheDocument()
    // The shuffle button is inactive.
    expect(screen.getByTestId('shuffle-button-inactive')).toBeInTheDocument()
  })

  it('displays correctly when paused / no repeat / no shuffle / track / previous track / next track', () => {
    render(
      <ThemeProvider theme={theme}>
        <Controls
          hasNextTrack
          hasPreviousTrack
          hasTrack
          playing={false}
          repeat={PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT}
          setVolume={mockSetVolume}
          shuffle={false}
          skipToNext={mockSkipToNext}
          skipToPrevious={mockSkipToPrevious}
          togglePlayPause={mockTogglePlayPause}
          toggleRepeat={mockToggleRepeat}
          toggleShuffle={mockToggleShuffle}
          volume={1}
        />
      </ThemeProvider>
    )

    // The play icon is displayed.
    expect(screen.getByText('play.svg')).toBeInTheDocument()
    // The play button is disabled.
    expect(screen.getByTestId('play-pause-button')).toBeEnabled()
    // The previous button is disabled.
    expect(screen.getByTestId('previous-button')).toBeEnabled()
    // The next button is disabled.
    expect(screen.getByTestId('next-button')).toBeEnabled()
    // The repeat icon is displayed.
    expect(screen.getByText('repeat.svg')).toBeInTheDocument()
    // The repeat button is inactive.
    expect(screen.getByTestId('repeat-button-inactive')).toBeInTheDocument()
    // The shuffle button is inactive.
    expect(screen.getByTestId('shuffle-button-inactive')).toBeInTheDocument()
  })

  it('displays correctly when playing / no repeat / no shuffle / track / previous track / next track', () => {
    render(
      <ThemeProvider theme={theme}>
        <Controls
          hasNextTrack
          hasPreviousTrack
          hasTrack
          playing
          repeat={PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT}
          setVolume={mockSetVolume}
          shuffle={false}
          skipToNext={mockSkipToNext}
          skipToPrevious={mockSkipToPrevious}
          togglePlayPause={mockTogglePlayPause}
          toggleRepeat={mockToggleRepeat}
          toggleShuffle={mockToggleShuffle}
          volume={1}
        />
      </ThemeProvider>
    )

    // The play icon is displayed.
    expect(screen.getByText('pause.svg')).toBeInTheDocument()
    // The play button is disabled.
    expect(screen.getByTestId('play-pause-button')).toBeEnabled()
    // The previous button is disabled.
    expect(screen.getByTestId('previous-button')).toBeEnabled()
    // The next button is disabled.
    expect(screen.getByTestId('next-button')).toBeEnabled()
    // The repeat icon is displayed.
    expect(screen.getByText('repeat.svg')).toBeInTheDocument()
    // The repeat button is inactive.
    expect(screen.getByTestId('repeat-button-inactive')).toBeInTheDocument()
    // The shuffle button is inactive.
    expect(screen.getByTestId('shuffle-button-inactive')).toBeInTheDocument()
  })

  it('displays correctly when playing / no repeat / shuffle / track / previous track / next track', () => {
    render(
      <ThemeProvider theme={theme}>
        <Controls
          hasNextTrack
          hasPreviousTrack
          hasTrack
          playing
          repeat={PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT}
          setVolume={mockSetVolume}
          shuffle
          skipToNext={mockSkipToNext}
          skipToPrevious={mockSkipToPrevious}
          togglePlayPause={mockTogglePlayPause}
          toggleRepeat={mockToggleRepeat}
          toggleShuffle={mockToggleShuffle}
          volume={1}
        />
      </ThemeProvider>
    )

    // The play icon is displayed.
    expect(screen.getByText('pause.svg')).toBeInTheDocument()
    // The play button is disabled.
    expect(screen.getByTestId('play-pause-button')).toBeEnabled()
    // The previous button is disabled.
    expect(screen.getByTestId('previous-button')).toBeEnabled()
    // The next button is disabled.
    expect(screen.getByTestId('next-button')).toBeEnabled()
    // The repeat icon is displayed.
    expect(screen.getByText('repeat.svg')).toBeInTheDocument()
    // The repeat button is inactive.
    expect(screen.getByTestId('repeat-button-inactive')).toBeInTheDocument()
    // The shuffle button is active.
    expect(screen.getByTestId('shuffle-button-active')).toBeInTheDocument()
  })

  it('displays correctly when playing / repeat all / shuffle / track / previous track / next track', () => {
    render(
      <ThemeProvider theme={theme}>
        <Controls
          hasNextTrack
          hasPreviousTrack
          hasTrack
          playing
          repeat={PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ALL}
          setVolume={mockSetVolume}
          shuffle
          skipToNext={mockSkipToNext}
          skipToPrevious={mockSkipToPrevious}
          togglePlayPause={mockTogglePlayPause}
          toggleRepeat={mockToggleRepeat}
          toggleShuffle={mockToggleShuffle}
          volume={1}
        />
      </ThemeProvider>
    )

    // The play icon is displayed.
    expect(screen.getByText('pause.svg')).toBeInTheDocument()
    // The play button is disabled.
    expect(screen.getByTestId('play-pause-button')).toBeEnabled()
    // The previous button is disabled.
    expect(screen.getByTestId('previous-button')).toBeEnabled()
    // The next button is disabled.
    expect(screen.getByTestId('next-button')).toBeEnabled()
    // The repeat icon is displayed.
    expect(screen.getByText('repeat.svg')).toBeInTheDocument()
    // The repeat button is active.
    expect(screen.getByTestId('repeat-button-active')).toBeInTheDocument()
    // The shuffle button is active.
    expect(screen.getByTestId('shuffle-button-active')).toBeInTheDocument()
  })

  it('displays correctly when playing / repeat one / shuffle / track / previous track / next track', () => {
    render(
      <ThemeProvider theme={theme}>
        <Controls
          hasNextTrack
          hasPreviousTrack
          hasTrack
          playing
          repeat={PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ONE}
          setVolume={mockSetVolume}
          shuffle
          skipToNext={mockSkipToNext}
          skipToPrevious={mockSkipToPrevious}
          togglePlayPause={mockTogglePlayPause}
          toggleRepeat={mockToggleRepeat}
          toggleShuffle={mockToggleShuffle}
          volume={1}
        />
      </ThemeProvider>
    )

    // The play icon is displayed.
    expect(screen.getByText('pause.svg')).toBeInTheDocument()
    // The play button is disabled.
    expect(screen.getByTestId('play-pause-button')).toBeEnabled()
    // The previous button is disabled.
    expect(screen.getByTestId('previous-button')).toBeEnabled()
    // The next button is disabled.
    expect(screen.getByTestId('next-button')).toBeEnabled()
    // The repeat icon is displayed.
    expect(screen.getByText('repeat_one.svg')).toBeInTheDocument()
    // The repeat button is active.
    expect(screen.getByTestId('repeat-button-active')).toBeInTheDocument()
    // The shuffle button is active.
    expect(screen.getByTestId('shuffle-button-active')).toBeInTheDocument()
  })

  it('triggers the right changes when play / pause button is clicked', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Controls
          hasNextTrack
          hasPreviousTrack
          hasTrack
          playing={false}
          repeat={PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT}
          setVolume={mockSetVolume}
          shuffle={false}
          skipToNext={mockSkipToNext}
          skipToPrevious={mockSkipToPrevious}
          togglePlayPause={mockTogglePlayPause}
          toggleRepeat={mockToggleRepeat}
          toggleShuffle={mockToggleShuffle}
          volume={1}
        />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByTestId('play-pause-button'))
    expect(mockTogglePlayPause).toHaveBeenCalledTimes(1)
  })

  it('triggers the right changes when previous / next buttons are clicked', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Controls
          hasNextTrack
          hasPreviousTrack
          hasTrack
          playing={false}
          repeat={PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT}
          setVolume={mockSetVolume}
          shuffle={false}
          skipToNext={mockSkipToNext}
          skipToPrevious={mockSkipToPrevious}
          togglePlayPause={mockTogglePlayPause}
          toggleRepeat={mockToggleRepeat}
          toggleShuffle={mockToggleShuffle}
          volume={1}
        />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByTestId('previous-button'))
    expect(mockSkipToPrevious).toHaveBeenCalledTimes(1)

    await userEvent.click(screen.getByTestId('next-button'))
    expect(mockSkipToNext).toHaveBeenCalledTimes(1)
  })

  it('triggers the right changes when repeat button is clicked', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Controls
          hasNextTrack
          hasPreviousTrack
          hasTrack
          playing={false}
          repeat={PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT}
          setVolume={mockSetVolume}
          shuffle={false}
          skipToNext={mockSkipToNext}
          skipToPrevious={mockSkipToPrevious}
          togglePlayPause={mockTogglePlayPause}
          toggleRepeat={mockToggleRepeat}
          toggleShuffle={mockToggleShuffle}
          volume={1}
        />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByTestId('repeat-button-inactive'))
    expect(mockToggleRepeat).toHaveBeenCalledTimes(1)
  })

  it('triggers the right changes when shuffle button is clicked', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Controls
          hasNextTrack
          hasPreviousTrack
          hasTrack
          playing={false}
          repeat={PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT}
          setVolume={mockSetVolume}
          shuffle={false}
          skipToNext={mockSkipToNext}
          skipToPrevious={mockSkipToPrevious}
          togglePlayPause={mockTogglePlayPause}
          toggleRepeat={mockToggleRepeat}
          toggleShuffle={mockToggleShuffle}
          volume={1}
        />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByTestId('shuffle-button-inactive'))
    expect(mockToggleShuffle).toHaveBeenCalledTimes(1)
  })
})
