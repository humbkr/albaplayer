import Sidebar from 'common/components/layout/Sidebar'
import MainPanel from 'common/components/layout/MainPanel'
import styled from 'styled-components'
import ActionBar from 'common/components/layout/ActionBar'
import { useRef } from 'react'
import Login from 'modules/user/scenes/Login'
import LoaderPulseLogo from 'common/components/LoaderPulseLogo'
import usePlaybackKeys from 'modules/player/hooks/usePlaybackKeys'
import useInitApp from 'common/hooks/useInitApp'
import CreateRootUser from 'modules/user/scenes/CreateRootUser'

function Layout() {
  // Used to handle the search input focus.
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Capture app's global key events.
  usePlaybackKeys()

  const {
    isLoading,
    shouldDisplayLogin,
    shouldDisplayRootCreation,
    onLogin,
    onCreateRootUser,
  } = useInitApp()

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoaderPulseLogo />
      </LoadingContainer>
    )
  }

  return (
    <AppContainer>
      {shouldDisplayLogin && <Login onLogin={onLogin} />}
      {shouldDisplayRootCreation && (
        <CreateRootUser onCreateRootUser={onCreateRootUser} />
      )}
      {!shouldDisplayLogin && !shouldDisplayRootCreation && (
        <>
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
        </>
      )}
    </AppContainer>
  )
}

export default Layout

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`
const AppContainer = styled.div`
  display: flex;
  position: fixed;
  width: 100vw;
  height: 100vh;
  color: ${(props) => props.theme.colors.textPrimary};
`
const Left = styled.div`
  position: relative;
  top: 0;
  left: 0;
  width: ${(props) => props.theme.layout.sidebarWidth};
  height: 100vh;
  flex-shrink: 0;
`
const Right = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  flex-grow: 1;
`
const Top = styled.div`
  height: ${(props) => props.theme.layout.itemHeight};
  width: 100%;
  position: sticky;
  flex-shrink: 0;
  z-index: 23;
`
const Content = styled.div`
  flex-grow: 1;
  background-color: ${(props) => props.theme.colors.background};
  overflow: hidden;
`
