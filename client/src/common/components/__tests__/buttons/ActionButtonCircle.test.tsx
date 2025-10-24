import ActionButtonCircle from 'common/components/buttons/ActionButtonCircle'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from 'common/utils/testing/test-utils'

const mockOnClick = vi.fn()

describe('ActionButton', () => {
  it('should display correctly', () => {
    renderWithProviders(
      <ActionButtonCircle icon="play" onClick={mockOnClick} />
    )

    expect(screen.getByText('play')).toBeInTheDocument()
  })

  it('should display correctly when overlayMode is enabled', () => {
    renderWithProviders(
      <ActionButtonCircle icon="play" onClick={mockOnClick} overlayMode />
    )

    expect(screen.getByText('play')).toBeInTheDocument()
    expect(screen.getByText('play')).toHaveStyle(
      'background-color: rgba(0, 0, 0, 0.6);'
    )
  })

  it('should trigger the onClick action when pressed', async () => {
    const mockOnClick = vi.fn()

    renderWithProviders(
      <ActionButtonCircle icon="play" onClick={mockOnClick} />
    )

    await userEvent.hover(screen.getByText('play'))
    await userEvent.click(screen.getByText('play'))

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})
