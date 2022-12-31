import { ThemeProvider } from 'styled-components'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import theme from 'themes/default'
import VolumeContainer from 'modules/player/components/VolumeContainer'

// Required to test components using react-slider.
global.ResizeObserver = require('resize-observer-polyfill')

const mockSetVolume = jest.fn()

describe('VolumeContainer', () => {
  beforeEach(() => jest.clearAllMocks())

  it('displays a volume high icon when volume is over 0.5', () => {
    render(
      <ThemeProvider theme={theme}>
        <VolumeContainer volume={0.6} setVolume={mockSetVolume} />
      </ThemeProvider>
    )

    expect(screen.getAllByText('volume_high.svg')).toHaveLength(2)
    expect(screen.queryByText('volume_low.svg')).not.toBeInTheDocument()
    expect(screen.queryByText('mute.svg')).not.toBeInTheDocument()
  })

  it('displays a volume low icon when volume is under 0.5', () => {
    render(
      <ThemeProvider theme={theme}>
        <VolumeContainer volume={0.4} setVolume={mockSetVolume} />
      </ThemeProvider>
    )

    expect(screen.getByText('volume_low.svg')).toBeInTheDocument()
  })

  it('displays a volume muted icon when volume is 0', () => {
    render(
      <ThemeProvider theme={theme}>
        <VolumeContainer volume={0} setVolume={mockSetVolume} />
      </ThemeProvider>
    )

    expect(screen.getByText('mute.svg')).toBeInTheDocument()
  })

  it('displays an overlay when user cursor hovers the element', async () => {
    render(
      <ThemeProvider theme={theme}>
        <VolumeContainer volume={0.4} setVolume={mockSetVolume} />
      </ThemeProvider>
    )

    expect(screen.getByTestId('volume-overlay')).not.toBeVisible()

    await userEvent.hover(screen.getByText('volume_low.svg'))

    expect(screen.getByTestId('volume-overlay')).toBeVisible()

    await userEvent.unhover(screen.getByText('volume_low.svg'))

    expect(screen.getByTestId('volume-overlay')).not.toBeVisible()
  })

  it('displays a low and a high volume icons when overlay is visible', () => {
    render(
      <ThemeProvider theme={theme}>
        <VolumeContainer volume={0} setVolume={mockSetVolume} forceOverlay />
      </ThemeProvider>
    )

    // Overlay should be visible.
    expect(screen.getByTestId('volume-overlay')).toBeVisible()
    // Volume icons should be visible event if the original icon
    // before the hover is high or mute.
    expect(screen.getByText('volume_low.svg')).toBeInTheDocument()
    expect(screen.getByText('volume_high.svg')).toBeInTheDocument()
  })

  it('mutes volume when button is pressed and volume is > 0', async () => {
    render(
      <ThemeProvider theme={theme}>
        <VolumeContainer volume={0.4} setVolume={mockSetVolume} />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByText('volume_low.svg'))
    expect(mockSetVolume).toHaveBeenCalledWith(0)
  })

  it('sets volume to max when volume high button is pressed', async () => {
    render(
      <ThemeProvider theme={theme}>
        <VolumeContainer volume={0.4} setVolume={mockSetVolume} forceOverlay />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByText('volume_high.svg'))
    expect(mockSetVolume).toHaveBeenCalledWith(1)
  })

  it('sets the volume when the bar is pressed', async () => {
    render(
      <ThemeProvider theme={theme}>
        <VolumeContainer volume={0.4} setVolume={mockSetVolume} forceOverlay />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByRole('slider'))
    expect(mockSetVolume).toHaveBeenCalled()
  })

  it('keeps the original volume when muted and set it mack when unmuted', async () => {
    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <VolumeContainer volume={0.4} setVolume={mockSetVolume} />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByText('volume_low.svg'))
    expect(mockSetVolume).toHaveBeenCalledWith(0)

    rerender(
      <ThemeProvider theme={theme}>
        <VolumeContainer volume={0} setVolume={mockSetVolume} />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByText('mute.svg'))
    expect(mockSetVolume).toHaveBeenCalledWith(0.4)
  })
})
