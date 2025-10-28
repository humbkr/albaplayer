import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VolumeContainer from 'modules/player/components/VolumeContainer'
import { renderWithProviders } from 'common/utils/testing/test-utils'

// Required to test components using react-slider.
// eslint-disable-next-line @typescript-eslint/no-require-imports
global.ResizeObserver = require('resize-observer-polyfill')

const mockSetVolume = vi.fn()

describe('VolumeContainer', () => {
  beforeEach(() => vi.clearAllMocks())

  it('displays a volume high icon when volume is over 0.5', () => {
    renderWithProviders(
      <VolumeContainer volume={0.6} setVolume={mockSetVolume} />
    )

    expect(screen.getAllByTestId('player-volume-high-icon')).toHaveLength(2)
    expect(
      screen.queryByTestId('player-volume-low-icon')
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('player-mute-icon')).not.toBeInTheDocument()
  })

  it('displays a volume low icon when volume is under 0.5', () => {
    renderWithProviders(
      <VolumeContainer volume={0.4} setVolume={mockSetVolume} />
    )

    expect(screen.getByTestId('player-volume-low-icon')).toBeInTheDocument()
  })

  it('displays a volume muted icon when volume is 0', () => {
    renderWithProviders(
      <VolumeContainer volume={0} setVolume={mockSetVolume} />
    )

    expect(screen.getByTestId('player-mute-icon')).toBeInTheDocument()
  })

  it('displays an overlay when user cursor hovers the element', async () => {
    renderWithProviders(
      <VolumeContainer volume={0.4} setVolume={mockSetVolume} />
    )

    expect(screen.getByTestId('volume-overlay')).not.toBeVisible()

    await userEvent.hover(screen.getByTestId('player-volume-low-icon'))

    expect(screen.getByTestId('volume-overlay')).toBeVisible()

    await userEvent.unhover(screen.getByTestId('player-volume-low-icon'))

    expect(screen.getByTestId('volume-overlay')).not.toBeVisible()
  })

  it('displays a low and a high volume icons when overlay is visible', () => {
    renderWithProviders(
      <VolumeContainer volume={0} setVolume={mockSetVolume} forceOverlay />
    )

    // Overlay should be visible.
    expect(screen.getByTestId('volume-overlay')).toBeVisible()
    // Volume icons should be visible event if the original icon
    // before the hover is high or mute.
    expect(screen.getByTestId('player-volume-low-icon')).toBeInTheDocument()
    expect(screen.getByTestId('player-volume-high-icon')).toBeInTheDocument()
  })

  it('mutes volume when button is pressed and volume is > 0', async () => {
    renderWithProviders(
      <VolumeContainer volume={0.4} setVolume={mockSetVolume} />
    )

    await userEvent.click(screen.getByTestId('player-volume-low-icon'))
    expect(mockSetVolume).toHaveBeenCalledWith(0)
  })

  it('sets volume to max when volume high button is pressed', async () => {
    renderWithProviders(
      <VolumeContainer volume={0.4} setVolume={mockSetVolume} forceOverlay />
    )

    await userEvent.click(screen.getByTestId('player-volume-high-icon'))
    expect(mockSetVolume).toHaveBeenCalledWith(1)
  })

  it('sets the volume when the bar is pressed', async () => {
    renderWithProviders(
      <VolumeContainer volume={0.4} setVolume={mockSetVolume} forceOverlay />
    )

    await userEvent.click(screen.getByRole('slider'))
    expect(mockSetVolume).toHaveBeenCalled()
  })

  it('keeps the original volume when muted and set it mack when unmuted', async () => {
    const { rerender } = renderWithProviders(
      <VolumeContainer volume={0.4} setVolume={mockSetVolume} />
    )

    await userEvent.click(screen.getByTestId('player-volume-low-icon'))
    expect(mockSetVolume).toHaveBeenCalledWith(0)

    rerender(<VolumeContainer volume={0} setVolume={mockSetVolume} />)

    await userEvent.click(screen.getByTestId('player-mute-icon'))
    expect(mockSetVolume).toHaveBeenCalledWith(0.4)
  })
})
