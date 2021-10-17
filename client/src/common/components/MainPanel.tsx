import React from 'react'
import styled from 'styled-components'
import { Route, withRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LibraryBrowser from 'modules/browser/scenes/LibraryBrowser'
import NowPlaying from 'modules/now_playing/scenes/NowPlaying'
import LoadingScreen from 'common/components/LoadingScreen'
import Settings from 'modules/settings/scenes/Settings'
import Playlists from 'modules/playlist/scenes/Playlists'
import { RootState } from 'store/types'
import Dashboard from '../../modules/dashboard/scenes/Dashboard'

const MainPanel = () => {
  const isFetching = useSelector((state: RootState) => state.library.isFetching)
  const isInitialized = useSelector(
    (state: RootState) => state.library.isInitialized
  )

  return (
    <div>
      {!isInitialized && (
        <MainPanelWrapper>
          <LoadingScreen />
        </MainPanelWrapper>
      )}
      {!isFetching && isInitialized && (
        <MainPanelWrapper>
          <Route exact path="/" component={LibraryBrowser} />
          <Route path="/queue" component={NowPlaying} />
          <Route path="/inspiration" component={Dashboard} />
          <Route path="/library" component={LibraryBrowser} />
          <Route path="/playlists" component={Playlists} />
          <Route path="/settings" component={Settings} />
        </MainPanelWrapper>
      )}
    </div>
  )
}

// Need to use withRouter here or the views won't change.
export default withRouter(MainPanel)

const MainPanelWrapper = styled.div`
  margin-left: ${(props) => props.theme.sidebar.width};
  height: 100vh;
  background-color: ${(props) => props.theme.backgroundColor};
`
