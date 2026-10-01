import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Controls from 'modules/player/components/Controls'
import { PlayerPlaybackMode } from 'modules/player/utils'
import { renderWithProviders } from 'common/utils/testing/test-utils'

// We don't need the VolumeContainer for this test.
vi.mock('modules/player/components/VolumeContainer', () => ({
  default: () => <div data-testid="volume-container" />,
}))

const mockSetVolume = vi.fn()
const mockSkipToNext = vi.fn()
const mockSkipToPrevious = vi.fn()
const mockTogglePlayPause = vi.fn()
const mockToggleRepeat = vi.fn()
const mockToggleShuffle = vi.fn()

describe('Controls', () => {
  it('displays correctly when paused / no repeat / no shuffle / no track', () => {
    renderWithProviders(
      <Controls
        loading={false}
        showLoader={false}
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
    )

    // The play icon is displayed.
    expect(screen.getByTestId('player-play-icon')).toBeInTheDocument()
    // The play button is disabled.
    expect(screen.getByTestId('play-pause-button')).toBeDisabled()
    // The previous button is disabled.
    expect(screen.getByTestId('previous-button')).toBeDisabled()
    // The next button is disabled.
    expect(screen.getByTestId('next-button')).toBeDisabled()
    // The repeat icon is displayed.
    expect(screen.getByTestId('player-repeat-icon')).toBeInTheDocument()
    // The repeat button is inactive.
    expect(screen.getByTestId('repeat-button-inactive')).toBeInTheDocument()
    // The shuffle button is inactive.
    expect(screen.getByTestId('shuffle-button-inactive')).toBeInTheDocument()
  })

  it('displays correctly when paused / no repeat / no shuffle / track / no previous track / no next track', () => {
    renderWithProviders(
      <Controls
        loading={false}
        showLoader={false}
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
    )

    // The play icon is displayed.
    expect(screen.getByTestId('player-play-icon')).toBeInTheDocument()
    // The play button is disabled.
    expect(screen.getByTestId('play-pause-button')).toBeEnabled()
    // The previous button is disabled.
    expect(screen.getByTestId('previous-button')).toBeDisabled()
    // The next button is disabled.
    expect(screen.getByTestId('next-button')).toBeDisabled()
    // The repeat icon is displayed.
    expect(screen.getByTestId('player-repeat-icon')).toBeInTheDocument()
    // The repeat button is inactive.
    expect(screen.getByTestId('repeat-button-inactive')).toBeInTheDocument()
    // The shuffle button is inactive.
    expect(screen.getByTestId('shuffle-button-inactive')).toBeInTheDocument()
  })

  it('displays correctly when paused / no repeat / no shuffle / track / previous track / no next track', () => {
    renderWithProviders(
      <Controls
        loading={false}
        showLoader={false}
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
    )

    // The play icon is displayed.
    expect(screen.getByTestId('player-play-icon')).toBeInTheDocument()
    // The play button is disabled.
    expect(screen.getByTestId('play-pause-button')).toBeEnabled()
    // The previous button is disabled.
    expect(screen.getByTestId('previous-button')).toBeEnabled()
    // The next button is disabled.
    expect(screen.getByTestId('next-button')).toBeDisabled()
    // The repeat icon is displayed.
    expect(screen.getByTestId('player-repeat-icon')).toBeInTheDocument()
    // The repeat button is inactive.
    expect(screen.getByTestId('repeat-button-inactive')).toBeInTheDocument()
    // The shuffle button is inactive.
    expect(screen.getByTestId('shuffle-button-inactive')).toBeInTheDocument()
  })

  it('displays correctly when paused / no repeat / no shuffle / track / no previous track / next track', () => {
    renderWithProviders(
      <Controls
        loading={false}
        showLoader={false}
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
    )

    // The play icon is displayed.
    expect(screen.getByTestId('player-play-icon')).toBeInTheDocument()
    // The play button is disabled.
    expect(screen.getByTestId('play-pause-button')).toBeEnabled()
    // The previous button is disabled.
    expect(screen.getByTestId('previous-button')).toBeDisabled()
    // The next button is disabled.
    expect(screen.getByTestId('next-button')).toBeEnabled()
    // The repeat icon is displayed.
    expect(screen.getByTestId('player-repeat-icon')).toBeInTheDocument()
    // The repeat button is inactive.
    expect(screen.getByTestId('repeat-button-inactive')).toBeInTheDocument()
    // The shuffle button is inactive.
    expect(screen.getByTestId('shuffle-button-inactive')).toBeInTheDocument()
  })

  it('displays correctly when paused / no repeat / no shuffle / track / previous track / next track', () => {
    renderWithProviders(
      <Controls
        loading={false}
        showLoader={false}
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
    )

    // The play icon is displayed.
    expect(screen.getByTestId('player-play-icon')).toBeInTheDocument()
    // The play button is disabled.
    expect(screen.getByTestId('play-pause-button')).toBeEnabled()
    // The previous button is disabled.
    expect(screen.getByTestId('previous-button')).toBeEnabled()
    // The next button is disabled.
    expect(screen.getByTestId('next-button')).toBeEnabled()
    // The repeat icon is displayed.
    expect(screen.getByTestId('player-repeat-icon')).toBeInTheDocument()
    // The repeat button is inactive.
    expect(screen.getByTestId('repeat-button-inactive')).toBeInTheDocument()
    // The shuffle button is inactive.
    expect(screen.getByTestId('shuffle-button-inactive')).toBeInTheDocument()
  })

  it('displays correctly when playing / no repeat / no shuffle / track / previous track / next track', () => {
    renderWithProviders(
      <Controls
        loading={false}
        showLoader={false}
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
    )

    // The play icon is displayed.
    expect(screen.getByTestId('player-pause-icon')).toBeInTheDocument()
    // The play button is disabled.
    expect(screen.getByTestId('play-pause-button')).toBeEnabled()
    // The previous button is disabled.
    expect(screen.getByTestId('previous-button')).toBeEnabled()
    // The next button is disabled.
    expect(screen.getByTestId('next-button')).toBeEnabled()
    // The repeat icon is displayed.
    expect(screen.getByTestId('player-repeat-icon')).toBeInTheDocument()
    // The repeat button is inactive.
    expect(screen.getByTestId('repeat-button-inactive')).toBeInTheDocument()
    // The shuffle button is inactive.
    expect(screen.getByTestId('shuffle-button-inactive')).toBeInTheDocument()
  })

  it('displays correctly when playing / no repeat / shuffle / track / previous track / next track', () => {
    renderWithProviders(
      <Controls
        loading={false}
        showLoader={false}
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
    )

    // The play icon is displayed.
    expect(screen.getByTestId('player-pause-icon')).toBeInTheDocument()
    // The play button is disabled.
    expect(screen.getByTestId('play-pause-button')).toBeEnabled()
    // The previous button is disabled.
    expect(screen.getByTestId('previous-button')).toBeEnabled()
    // The next button is disabled.
    expect(screen.getByTestId('next-button')).toBeEnabled()
    // The repeat icon is displayed.
    expect(screen.getByTestId('player-repeat-icon')).toBeInTheDocument()
    // The repeat button is inactive.
    expect(screen.getByTestId('repeat-button-inactive')).toBeInTheDocument()
    // The shuffle button is active.
    expect(screen.getByTestId('shuffle-button-active')).toBeInTheDocument()
  })

  it('displays correctly when playing / repeat all / shuffle / track / previous track / next track', () => {
    renderWithProviders(
      <Controls
        loading={false}
        showLoader={false}
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
    )

    // The play icon is displayed.
    expect(screen.getByTestId('player-pause-icon')).toBeInTheDocument()
    // The play button is disabled.
    expect(screen.getByTestId('play-pause-button')).toBeEnabled()
    // The previous button is disabled.
    expect(screen.getByTestId('previous-button')).toBeEnabled()
    // The next button is disabled.
    expect(screen.getByTestId('next-button')).toBeEnabled()
    // The repeat icon is displayed.
    expect(screen.getByTestId('player-repeat-icon')).toBeInTheDocument()
    // The repeat button is active.
    expect(screen.getByTestId('repeat-button-active')).toBeInTheDocument()
    // The shuffle button is active.
    expect(screen.getByTestId('shuffle-button-active')).toBeInTheDocument()
  })

  it('displays correctly when playing / repeat one / shuffle / track / previous track / next track', () => {
    renderWithProviders(
      <Controls
        loading={false}
        showLoader={false}
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
    )

    // The play icon is displayed.
    expect(screen.getByTestId('player-pause-icon')).toBeInTheDocument()
    // The play button is disabled.
    expect(screen.getByTestId('play-pause-button')).toBeEnabled()
    // The previous button is disabled.
    expect(screen.getByTestId('previous-button')).toBeEnabled()
    // The next button is disabled.
    expect(screen.getByTestId('next-button')).toBeEnabled()
    // The repeat icon is displayed.
    expect(screen.getByTestId('player-repeatone-icon')).toBeInTheDocument()
    // The repeat button is active.
    expect(screen.getByTestId('repeat-button-active')).toBeInTheDocument()
    // The shuffle button is active.
    expect(screen.getByTestId('shuffle-button-active')).toBeInTheDocument()
  })

  it('triggers the right changes when play / pause button is clicked', async () => {
    renderWithProviders(
      <Controls
        loading={false}
        showLoader={false}
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
    )

    await userEvent.click(screen.getByTestId('play-pause-button'))
    expect(mockTogglePlayPause).toHaveBeenCalledTimes(1)
  })

  it('keeps the play / pause icon but locks it while a load has just started', async () => {
    renderWithProviders(
      <Controls
        loading
        showLoader={false}
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
    )

    // No loader yet: the icon stays, so fast loads cause no visual change.
    expect(screen.getByTestId('player-pause-icon')).toBeInTheDocument()
    expect(
      screen.queryByTestId('player-loading-spinner')
    ).not.toBeInTheDocument()
    // Playback is locked anyway.
    expect(screen.getByTestId('play-pause-button')).toBeDisabled()

    await userEvent.click(screen.getByTestId('play-pause-button'))
    expect(mockTogglePlayPause).not.toHaveBeenCalled()
  })

  it('displays a spinner and locks play / pause while a track is slow to load', async () => {
    renderWithProviders(
      <Controls
        loading
        showLoader
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
    )

    // The spinner replaces the play / pause icon, at the icon's size.
    expect(screen.getByTestId('player-loading-spinner')).toHaveStyle({
      width: '50px',
      height: '50px',
    })
    expect(screen.queryByTestId('player-pause-icon')).not.toBeInTheDocument()
    expect(screen.queryByTestId('player-play-icon')).not.toBeInTheDocument()
    // The play / pause button is disabled even though a track is loaded.
    expect(screen.getByTestId('play-pause-button')).toBeDisabled()

    await userEvent.click(screen.getByTestId('play-pause-button'))
    expect(mockTogglePlayPause).not.toHaveBeenCalled()
  })

  it('triggers the right changes when previous / next buttons are clicked', async () => {
    renderWithProviders(
      <Controls
        loading={false}
        showLoader={false}
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
    )

    await userEvent.click(screen.getByTestId('previous-button'))
    expect(mockSkipToPrevious).toHaveBeenCalledTimes(1)

    await userEvent.click(screen.getByTestId('next-button'))
    expect(mockSkipToNext).toHaveBeenCalledTimes(1)
  })

  it('triggers the right changes when repeat button is clicked', async () => {
    renderWithProviders(
      <Controls
        loading={false}
        showLoader={false}
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
    )

    await userEvent.click(screen.getByTestId('repeat-button-inactive'))
    expect(mockToggleRepeat).toHaveBeenCalledTimes(1)
  })

  it('triggers the right changes when shuffle button is clicked', async () => {
    renderWithProviders(
      <Controls
        loading={false}
        showLoader={false}
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
    )

    await userEvent.click(screen.getByTestId('shuffle-button-inactive'))
    expect(mockToggleShuffle).toHaveBeenCalledTimes(1)
  })
})
