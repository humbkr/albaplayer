import { renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from 'common/utils/testing/test-utils'
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

    renderWithProviders(<TabsComponent />)

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

    renderWithProviders(<TabsComponent />)

    await userEvent.click(screen.getByText('Tab 2'))

    expect(result.current.currentTab).toBe('tab2')
  })

  it('should not return hidden tabs', async () => {
    const tabs = [
      { id: 'tab1', label: 'Tab 1' },
      { id: 'tab2', label: 'Tab 2' },
      { id: 'tab3', label: 'Tab 3' },
    ]

    const { result } = renderHook(() => useTabs(tabs, undefined, ['tab2']))
    const { TabsComponent } = result.current

    renderWithProviders(<TabsComponent />)

    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 3')).toBeInTheDocument()
    expect(screen.queryByText('Tab 2')).not.toBeInTheDocument()
  })
})
