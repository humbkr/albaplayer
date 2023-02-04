import { render, renderHook, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'
import userEvent from '@testing-library/user-event'
import { useTabs } from './useTabs'

describe('HOOK: useTabs', () => {
  it('should handle default current tab', () => {
    const tabs = [
      { id: 'tab1', label: 'Tab 1' },
      { id: 'tab2', label: 'Tab 2' },
    ]

    const { result } = renderHook(() => useTabs(tabs))

    expect(result.current.currentTab).toBe('tab1')
  })

  it('should handle specified current tab', () => {
    const tabs = [
      { id: 'tab1', label: 'Tab 1' },
      { id: 'tab2', label: 'Tab 2' },
    ]

    const { result } = renderHook(() => useTabs(tabs, 'tab2'))

    expect(result.current.currentTab).toBe('tab2')
  })

  it('should render tabs correctly', () => {
    const tabs = [
      { id: 'tab1', label: 'Tab 1' },
      { id: 'tab2', label: 'Tab 2' },
    ]

    const { result } = renderHook(() => useTabs(tabs))
    const { TabsComponent } = result.current

    render(
      <ThemeProvider theme={themeDefault}>
        <TabsComponent />
      </ThemeProvider>
    )

    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
  })

  it('should change tabs if another tab is selected', async () => {
    const tabs = [
      { id: 'tab1', label: 'Tab 1' },
      { id: 'tab2', label: 'Tab 2' },
    ]

    const { result } = renderHook(() => useTabs(tabs))
    const { TabsComponent } = result.current

    render(
      <ThemeProvider theme={themeDefault}>
        <TabsComponent />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByText('Tab 2'))

    expect(result.current.currentTab).toBe('tab2')
  })
})
