import SelectContainer from 'common/components/forms/SelectContainer'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'

describe('SelectContainer', () => {
  it('should display correctly', () => {
    const mockOnChange = jest.fn()
    const options = [
      { value: 'test', label: 'Test' },
      { value: 'test2', label: 'Test 2' },
    ]

    render(
      <ThemeProvider theme={themeDefault}>
        <SelectContainer
          value="test"
          options={options}
          onChangeHandler={mockOnChange}
        />
      </ThemeProvider>
    )

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('Test 2')).toBeInTheDocument()
  })
})
