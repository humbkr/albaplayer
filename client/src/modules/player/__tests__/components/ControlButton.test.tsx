import { screen } from '@testing-library/react'
import ControlButton from 'modules/player/components/ControlButton'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from 'common/utils/testing/test-utils'

const mockOnClick = vi.fn()

describe('ControlButton', () => {
  it('displays correctly', () => {
    renderWithProviders(
      <ControlButton onClick={mockOnClick}>Test</ControlButton>
    )

    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('calls callback function on click', async () => {
    renderWithProviders(
      <ControlButton onClick={mockOnClick}>Test</ControlButton>
    )

    await userEvent.click(screen.getByText('Test'))

    expect(mockOnClick).toHaveBeenCalled()
  })

  it('is disabled if disabled = true', () => {
    renderWithProviders(
      <ControlButton onClick={mockOnClick} disabled>
        Test
      </ControlButton>
    )

    expect(screen.getByTestId('control-button')).toBeDisabled()
  })

  it('sets a custom size for the button icon if specified', () => {
    renderWithProviders(
      <ControlButton onClick={mockOnClick} size={20}>
        <svg data-testid="icon" />
      </ControlButton>
    )

    expect(screen.getByTestId('icon')).toHaveStyle('width: 20px; height: 20px')
  })

  it('sets a default size for the button icon if size not specified', () => {
    renderWithProviders(
      <ControlButton onClick={mockOnClick}>
        <svg data-testid="icon" />
      </ControlButton>
    )

    expect(screen.getByTestId('icon')).toHaveStyle('width: 24px; height: 24px')
  })
})
