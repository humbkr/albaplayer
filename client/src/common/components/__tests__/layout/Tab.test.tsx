import Tab from 'common/components/layout/Tab'
import { render } from '@testing-library/react'

describe('Tab', () => {
  it('displays correctly', () => {
    const mockOnClick = jest.fn()

    render(<Tab id="test" label="Test" onClick={mockOnClick} />)
    // TODO code tests
  })
})
