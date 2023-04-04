import ActionButtonIcon from 'common/components/buttons/ActionButtonIcon'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'
import userEvent from '@testing-library/user-event'

describe('ActionButtonIcon', () => {
  it('should display correctly', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <ActionButtonIcon icon="add" />
      </ThemeProvider>
    )

    expect(screen.getByText('add')).toBeInTheDocument()
  })

  it('should be disabled if prop passed', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <ActionButtonIcon icon="add" testId="button" disabled />
      </ThemeProvider>
    )

    expect(screen.getByTestId('button')).toBeDisabled()
  })

  it('should trigger the onClick action when pressed', async () => {
    const mockOnClick = jest.fn()

    render(
      <ThemeProvider theme={themeDefault}>
        <ActionButtonIcon icon="add" onClick={mockOnClick} testId="button" />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByTestId('button'))

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})
