import { render, fireEvent, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import themeDefault from '../../../themes/default'
import SelectList from '../components/SelectList'

const mockOptions = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3' },
]

describe('SelectList', () => {
  it('Displays a select list', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <SelectList
          value="opt3"
          options={mockOptions}
          onChangeHandler={() => null}
        />
      </ThemeProvider>
    )

    expect(screen.getByText('Option 1')).not.toBeNull()
    expect(screen.getByText('Option 2')).not.toBeNull()
    expect(screen.getByText('Option 3')).not.toBeNull()
    expect(screen.queryByDisplayValue('Option 1')).toBeNull()
    expect(screen.queryByDisplayValue('Option 2')).toBeNull()
    expect(screen.getByDisplayValue('Option 3')).not.toBeNull()
  })

  it('Executes a callback when value changes', async () => {
    const mockCallback = jest.fn()

    render(
      <ThemeProvider theme={themeDefault}>
        <SelectList
          value="opt3"
          options={mockOptions}
          onChangeHandler={mockCallback}
        />
      </ThemeProvider>
    )

    fireEvent.change(screen.getByTestId('select-list'), {
      target: { value: 'opt1' },
    })

    expect(mockCallback).toHaveBeenCalled()
  })
})
