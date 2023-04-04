import Tab from 'common/components/layout/Tab'
import { render, screen } from '@testing-library/react'
import themeDefault from 'themes/lightGreen'
import { ThemeProvider } from 'styled-components'
import userEvent from '@testing-library/user-event'

describe('Tab', () => {
  it('displays correctly', async () => {
    const mockOnClick = jest.fn()

    render(
      <ThemeProvider theme={themeDefault}>
        <Tab id="test" label="Test" onClick={mockOnClick} />
      </ThemeProvider>
    )

    expect(screen.getByText('Test')).toBeInTheDocument()

    await userEvent.click(screen.getByText('Test'))

    expect(mockOnClick).toHaveBeenCalled()
  })
})
