import SelectContainer from 'common/components/forms/SelectContainer'
import { render } from '@testing-library/react'

describe('SelectContainer', () => {
  it('should display correctly', () => {
    const mockOnChange = jest.fn()
    const options = [
      { value: 'test', label: 'Test' },
      { value: 'test2', label: 'Test 2' },
    ]

    render(
      <SelectContainer
        value="test"
        options={options}
        onChangeHandler={mockOnChange}
      />
    )
    // TODO code tests
  })
})
