import styled from 'styled-components'
import Tab from 'common/components/layout/Tab'

type Props = {
  activeTabId: string
  tabs: { id: string; label: string; onClick: (tabId: string) => void }[]
}

function Tabs({ activeTabId, tabs }: Props) {
  return (
    <Container>
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          id={tab.id}
          label={tab.label}
          onClick={tab.onClick}
          active={activeTabId === tab.id}
        />
      ))}
    </Container>
  )
}

export default Tabs

const Container = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.colors.textPrimary};
`
