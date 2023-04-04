import ActionButton from 'common/components/buttons/ActionButton'
import { render, screen } from '@testing-library/react'
import themeDefault from 'themes/lightGreen'
import { ThemeProvider } from 'styled-components'
import userEvent from '@testing-library/user-event'

describe('ActionButton', () => {
  it('should display children correctly', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <ActionButton>test</ActionButton>
      </ThemeProvider>
    )

    expect(screen.getByText('test')).toBeInTheDocument()
  })

  it('should display a loader if loading prop is true', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <ActionButton loading>test</ActionButton>
      </ThemeProvider>
    )

    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('should display an icon if icon props is passed', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <ActionButton icon="add">test</ActionButton>
      </ThemeProvider>
    )

    expect(screen.getByText('add')).toBeInTheDocument()
  })

  it('should display the loader instead of the icon if icon props is passed and loading', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <ActionButton raised icon="add" loading>
          test
        </ActionButton>
      </ThemeProvider>
    )

    expect(screen.queryByText('add')).not.toBeInTheDocument()
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('should be disabled if prop passed', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <ActionButton disabled testId="button">
          test
        </ActionButton>
      </ThemeProvider>
    )

    expect(screen.getByTestId('button')).toBeDisabled()
  })

  it('should trigger the onClick action when pressed', async () => {
    const mockOnClick = jest.fn()

    render(
      <ThemeProvider theme={themeDefault}>
        <ActionButton onClick={mockOnClick}>test</ActionButton>
      </ThemeProvider>
    )

    await userEvent.hover(screen.getByText('test'))
    await userEvent.click(screen.getByText('test'))

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})
