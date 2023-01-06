import Sidebar from 'common/components/Sidebar'
import MainPanel from 'common/components/MainPanel'
import styled from 'styled-components'
import ActionBar from 'common/components/ActionBar'
import { useRef } from 'react'

function Layout() {
  // Used to handle the search input focus.
  const searchInputRef = useRef<HTMLInputElement>(null)

  return (
    <AppContainer>
      <Left>
        <Sidebar />
      </Left>
      <Right>
        <Top>
          <ActionBar ref={searchInputRef} />
        </Top>
        <Content>
          <MainPanel ref={searchInputRef} />
        </Content>
      </Right>
    </AppContainer>
  )
}

export default Layout

const AppContainer = styled.div`
  display: flex;
  position: fixed;
  width: 100vw;
  height: 100vh;
  color: ${(props) => props.theme.textPrimaryColor};
`
const Left = styled.div`
  position: relative;
  top: 0;
  left: 0;
  width: ${(props) => props.theme.sidebar.width};
  height: 100vh;
`
const Right = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  flex-grow: 1;
`
const Top = styled.div`
  height: ${(props) => props.theme.itemHeight};
  width: 100%;
  position: sticky;
  flex-shrink: 0;
`
const Content = styled.div`
  flex-grow: 1;
  background-color: ${(props) => props.theme.backgroundColor};
  overflow: hidden;
`
