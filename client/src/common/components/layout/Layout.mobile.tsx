import styled from 'styled-components'
import { useRef } from 'react'
import Login from 'modules/user/scenes/Login'
import LoaderPulseLogo from 'common/components/LoaderPulseLogo'
import usePlaybackKeys from 'modules/player/hooks/usePlaybackKeys'
import useInitApp from 'common/hooks/useInitApp'
import CreateRootUser from 'modules/user/scenes/CreateRootUser'
import MainMenu from 'common/components/layout/MainMenu.mobile'
import Player from 'modules/player/components/Player.mobile'
import MainPanel from 'common/components/layout/MainPanel'

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
    <Container>
      {/*<Top>*/}
      {/*  <ActionBar ref={searchInputRef} />*/}
      {/*</Top>*/}
      <Content>
        <MainPanel ref={searchInputRef} />
      </Content>
      <BottomBar>
        <Player />
        <MainMenu />
      </BottomBar>
    </Container>
  )

  return (
    <AppContainer>
      {shouldDisplayLogin && <Login onLogin={onLogin} />}
      {shouldDisplayRootCreation && (
        <CreateRootUser onCreateRootUser={onCreateRootUser} />
      )}
      {!shouldDisplayLogin && !shouldDisplayRootCreation && (
        <Container>
          <Content></Content>
          <BottomBar>
            <MainMenu />
          </BottomBar>
        </Container>
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
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  //min-height: -webkit-fill-available;
  margin-bottom: 110px;
`
const Content = styled.div`
  flex-grow: 1;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.textPrimary};
`
const BottomBar = styled.div`
  background-color: ${(props) => props.theme.colors.sidebarBackground};
  display: flex;
  flex-direction: column;

  position: fixed;
  bottom: 0;
  z-index: 666;
`
