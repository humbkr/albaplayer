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

  describe('inactive', () => {
    // Renders a button and returns the fill color applied to its icon.
    function renderIconFill(props: {
      disabled?: boolean
      inactive?: boolean
      noHoverEffect?: boolean
    }) {
      const { unmount } = renderWithProviders(
        <ControlButton onClick={mockOnClick} {...props}>
          <svg>
            <path data-testid="icon-path" />
          </svg>
        </ControlButton>
      )
      const fill = window.getComputedStyle(screen.getByTestId('icon-path')).fill
      unmount()

      return fill
    }

    it('is not clickable', async () => {
      renderWithProviders(
        <ControlButton onClick={mockOnClick} inactive>
          Test
        </ControlButton>
      )

      expect(screen.getByTestId('control-button')).toBeDisabled()
      await userEvent.click(screen.getByText('Test'))
      expect(mockOnClick).not.toHaveBeenCalled()
    })

    it('keeps the enabled look', () => {
      // Jsdom applies :hover rules to every element, so compare against an
      // enabled button without hover effect: an inactive one has none either.
      const enabledFill = renderIconFill({ noHoverEffect: true })

      expect(renderIconFill({ inactive: true })).toBe(enabledFill)
      expect(renderIconFill({ disabled: true })).not.toBe(enabledFill)
    })

    it('keeps the disabled look when also disabled', () => {
      expect(renderIconFill({ disabled: true, inactive: true })).toBe(
        renderIconFill({ disabled: true })
      )
    })
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
