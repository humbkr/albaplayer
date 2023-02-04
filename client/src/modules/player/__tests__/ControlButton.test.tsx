import { render, screen } from '@testing-library/react'
import ControlButton from 'modules/player/components/ControlButton'
import userEvent from '@testing-library/user-event'
import themeDefault from 'themes/lightGreen'
import { ThemeProvider } from 'styled-components'

const mockOnClick = jest.fn()

describe('ControlButton', () => {
  beforeEach(() => jest.clearAllMocks())

  it('displays correctly', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <ControlButton onClick={mockOnClick}>Test</ControlButton>
      </ThemeProvider>
    )

    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('calls callback function on click', async () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <ControlButton onClick={mockOnClick}>Test</ControlButton>
      </ThemeProvider>
    )

    await userEvent.click(screen.getByText('Test'))

    expect(mockOnClick).toHaveBeenCalled()
  })

  it('is disabled if disabled = true', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <ControlButton onClick={mockOnClick} disabled>
          Test
        </ControlButton>
      </ThemeProvider>
    )

    expect(screen.getByTestId('control-button')).toBeDisabled()
  })

  it('sets a custom size for the button icon if specified', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <ControlButton onClick={mockOnClick} size={20}>
          <svg data-testid="icon" />
        </ControlButton>
      </ThemeProvider>
    )

    expect(screen.getByTestId('icon')).toHaveStyle('width: 20px; height: 20px')
  })

  it('sets a default size for the button icon if size not specified', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <ControlButton onClick={mockOnClick}>
          <svg data-testid="icon" />
        </ControlButton>
      </ThemeProvider>
    )

    expect(screen.getByTestId('icon')).toHaveStyle('width: 24px; height: 24px')
  })
})
