import Tabs from 'common/components/layout/Tabs'
import { render } from '@testing-library/react'

describe('Tabs', () => {
  it('displays correctly', () => {
    const mockOnClick = jest.fn()
    const tabs = [
      { id: 'tab1', label: 'Tab 1', onClick: mockOnClick },
      { id: 'tab2', label: 'Tab 2', onClick: mockOnClick },
    ]

    render(<Tabs activeTabId="test" tabs={tabs} />)
    // TODO code tests
  })
})
