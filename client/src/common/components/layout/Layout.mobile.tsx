import styled from 'styled-components'
import { useRef } from 'react'
import Login from 'modules/user/scenes/Login'
import usePlaybackKeys from 'modules/player/hooks/usePlaybackKeys'
import useInitApp from 'common/hooks/useInitApp'
import CreateRootUser from 'modules/user/scenes/CreateRootUser'
import MainMenu from 'common/components/layout/MainMenu.mobile'
import Player from 'modules/player/components/Player.mobile'
import MainPanel from 'common/components/layout/MainPanel'
import AppLoader from 'common/components/layout/AppLoader'
import ActionBar from 'common/components/layout/ActionBar.mobile'

function Layout() {
  // Used to handle the search input focus.
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Capture app's global key events.
  usePlaybackKeys()

  const {
    isLoading,
    isServerReachable,
    shouldDisplayLogin,
    shouldDisplayRootCreation,
    onLogin,
    onCreateRootUser,
  } = useInitApp()

  return (
    <AppLoader isLoading={isLoading} isServerReachable={isServerReachable}>
      <AppContainer>
        {shouldDisplayLogin && <Login onLogin={onLogin} />}
        {shouldDisplayRootCreation && (
          <CreateRootUser onCreateRootUser={onCreateRootUser} />
        )}
        {!shouldDisplayLogin && !shouldDisplayRootCreation && (
          <>
            <Content>
              <ActionBar ref={searchInputRef} />
              <MainPanel ref={searchInputRef} />
            </Content>
            <BottomBar>
              <Player />
              <MainMenu />
            </BottomBar>
          </>
        )}
      </AppContainer>
    </AppLoader>
  )
}

export default Layout

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  margin-bottom: 75px;
  color: ${(props) => props.theme.colors.textPrimary};
  overflow: hidden;
  background-color: #006666;
`
const Content = styled.div`
  flex-grow: 1;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.textPrimary};
  overflow-y: scroll;
`
const BottomBar = styled.div`
  background-color: ${(props) => props.theme.colors.sidebarBackground};
  display: flex;
  flex-direction: column;
  //position: fixed;
  //bottom: 0;
  z-index: 666;
`
