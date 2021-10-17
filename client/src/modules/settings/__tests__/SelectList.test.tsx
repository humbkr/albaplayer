import React from 'react'
import { render, fireEvent } from '@testing-library/react'
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
    const { getByText, getByDisplayValue, queryByDisplayValue } = render(
      <ThemeProvider theme={themeDefault}>
        <SelectList
          value="opt3"
          options={mockOptions}
          onChangeHandler={() => null}
        />
      </ThemeProvider>
    )

    expect(getByText('Option 1')).not.toBeNull()
    expect(getByText('Option 2')).not.toBeNull()
    expect(getByText('Option 3')).not.toBeNull()
    expect(queryByDisplayValue('Option 1')).toBeNull()
    expect(queryByDisplayValue('Option 2')).toBeNull()
    expect(getByDisplayValue('Option 3')).not.toBeNull()
  })

  it('Executes a callback when value changes', async () => {
    const mockCallback = jest.fn()

    const { getByTestId } = render(
      <ThemeProvider theme={themeDefault}>
        <SelectList
          value="opt3"
          options={mockOptions}
          onChangeHandler={mockCallback}
        />
      </ThemeProvider>
    )

    fireEvent.change(getByTestId('select-list'), {
      target: { value: 'opt1' },
    })

    expect(mockCallback).toHaveBeenCalled()
  })
})
