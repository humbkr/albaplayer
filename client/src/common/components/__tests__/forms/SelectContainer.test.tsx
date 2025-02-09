import SelectContainer from 'common/components/forms/SelectContainer'
import { screen } from '@testing-library/react'
import { renderWithProviders } from 'common/utils/testing/test-utils'

describe('SelectContainer', () => {
  it('should display correctly', () => {
    const mockOnChange = vi.fn()
    const options = [
      { value: 'test', label: 'Test' },
      { value: 'test2', label: 'Test 2' },
    ]

    renderWithProviders(
      <SelectContainer
        value="test"
        options={options}
        onChangeHandler={mockOnChange}
      />
    )

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('Test 2')).toBeInTheDocument()
  })
})
