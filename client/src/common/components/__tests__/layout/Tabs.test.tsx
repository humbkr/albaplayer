import Tabs from 'common/components/layout/Tabs'
import { screen } from '@testing-library/react'
import { renderWithProviders } from 'common/utils/testing/test-utils'

describe('Tabs', () => {
  it('displays correctly', () => {
    const mockOnClick = vi.fn()
    const tabs = [
      { id: 'tab1', label: 'Tab 1', onClick: mockOnClick },
      { id: 'tab2', label: 'Tab 2', onClick: mockOnClick },
    ]

    renderWithProviders(<Tabs activeTabId="test" tabs={tabs} />)

    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
  })
})
