import { ThemeProvider } from 'styled-components'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import theme from 'themes/lightGreen'
import ProgressBar from '../components/ProgressBar'

// Required to test components using react-slider.
global.ResizeObserver = require('resize-observer-polyfill')

const mockSeek = jest.fn()

describe('ProgressBar', () => {
  beforeEach(() => jest.clearAllMocks())

  it('displays a progression of the right percentage base on time elapsed / total duration', () => {
    render(
      <ThemeProvider theme={theme}>
        <ProgressBar position={45} duration={100} seek={mockSeek} />
      </ThemeProvider>
    )

    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '45')
  })

  it('calls the seek function when clicked', async () => {
    render(
      <ThemeProvider theme={theme}>
        <ProgressBar position={45} duration={100} seek={mockSeek} />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByRole('slider'))
    expect(mockSeek).toHaveBeenCalledTimes(1)
  })

  it('displays a visible slider thumb only on hover', async () => {
    render(
      <ThemeProvider theme={theme}>
        <ProgressBar position={45} duration={100} seek={mockSeek} />
      </ThemeProvider>
    )

    expect(screen.getByRole('slider')).toHaveStyle(
      'background-color: transparent'
    )

    await userEvent.hover(screen.getByRole('slider'))

    expect(screen.getByRole('slider')).toHaveStyle(
      `background-color: ${theme.player.timeline.colorElapsed}`
    )

    await userEvent.unhover(screen.getByRole('slider'))

    expect(screen.getByRole('slider')).toHaveStyle(
      'background-color: transparent'
    )
  })
})
