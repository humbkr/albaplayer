import { useState } from 'react'
import Tabs from 'common/components/layout/Tabs'

export type Tab = {
  id: string
  label: string
}

export function useTabs(
  tabs: Tab[],
  defaultTabId?: string,
  hiddenTabs: string[] = []
) {
  const [currentTab, setCurrentTab] = useState(defaultTabId || tabs[0].id)

  const onSelectTab = (tabId: string) => {
    setCurrentTab(tabId)
  }

  const tabsWithOnClick = tabs
    .filter((tab) => !hiddenTabs?.includes(tab.id))
    .map((tab) => ({
      ...tab,
      onClick: onSelectTab,
    }))

  function TabsComponent() {
    return <Tabs tabs={tabsWithOnClick} activeTabId={currentTab} />
  }

  return { TabsComponent, currentTab }
}
