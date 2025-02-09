import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import theme from 'themes/lightGreen'
import ProgressBar from 'modules/player/components/ProgressBar'
import { renderWithProviders } from 'common/utils/testing/test-utils'

// Required to test components using react-slider.
// eslint-disable-next-line @typescript-eslint/no-require-imports
global.ResizeObserver = require('resize-observer-polyfill')

const mockSeek = vi.fn()

describe('ProgressBar', () => {
  it('displays a progression of the right percentage base on time elapsed / total duration', () => {
    renderWithProviders(
      <ProgressBar position={45} duration={100} seek={mockSeek} />
    )

    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '45')
  })

  it('calls the seek function when clicked', async () => {
    renderWithProviders(
      <ProgressBar position={45} duration={100} seek={mockSeek} />
    )

    await userEvent.click(screen.getByRole('slider'))
    expect(mockSeek).toHaveBeenCalledTimes(1)
  })

  it('displays a visible slider thumb only on hover', async () => {
    renderWithProviders(
      <ProgressBar position={45} duration={100} seek={mockSeek} />
    )

    expect(screen.getByRole('slider')).toHaveStyle(
      'background-color: rgba(0, 0, 0, 0)'
    )

    await userEvent.hover(screen.getByRole('slider'))

    expect(screen.getByRole('slider')).toHaveStyle(
      `background-color: ${theme.player.timeline.colorElapsed}`
    )

    await userEvent.unhover(screen.getByRole('slider'))

    expect(screen.getByRole('slider')).toHaveStyle(
      'background-color: rgba(0, 0, 0, 0)'
    )
  })
})
