import Tabs from 'common/components/layout/Tabs'
import { render, screen } from '@testing-library/react'
import themeDefault from 'themes/lightGreen'
import { ThemeProvider } from 'styled-components'

describe('Tabs', () => {
  it('displays correctly', () => {
    const mockOnClick = jest.fn()
    const tabs = [
      { id: 'tab1', label: 'Tab 1', onClick: mockOnClick },
      { id: 'tab2', label: 'Tab 2', onClick: mockOnClick },
    ]

    render(
      <ThemeProvider theme={themeDefault}>
        <Tabs activeTabId="test" tabs={tabs} />
      </ThemeProvider>
    )

    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
  })
})
