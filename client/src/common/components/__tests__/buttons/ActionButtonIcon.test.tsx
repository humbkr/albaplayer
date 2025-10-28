import ActionButtonIcon from 'common/components/buttons/ActionButtonIcon'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from 'common/utils/testing/test-utils'

describe('ActionButtonIcon', () => {
  it('should display correctly', () => {
    renderWithProviders(<ActionButtonIcon icon="add" />)

    expect(screen.getByText('add')).toBeInTheDocument()
  })

  it('should be disabled if prop passed', () => {
    renderWithProviders(
      <ActionButtonIcon icon="add" testId="button" disabled />
    )

    expect(screen.getByTestId('button')).toBeDisabled()
  })

  it('should trigger the onClick action when pressed', async () => {
    const mockOnClick = vi.fn()

    renderWithProviders(
      <ActionButtonIcon icon="add" onClick={mockOnClick} testId="button" />
    )

    await userEvent.click(screen.getByTestId('button'))

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})
