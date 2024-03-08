import Checkboxes from 'common/components/forms/Checkboxes'
import { render } from '@testing-library/react'

describe('Checkboxes', () => {
  it('should display correctly', () => {
    const options = [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ]

    render(<Checkboxes options={options} name="test" />)
    // TODO code tests
  })
})
