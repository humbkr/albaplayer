import React from 'react'
import styled from 'styled-components'
import { Route, Routes } from 'react-router-dom'
import LibraryBrowser from 'modules/browser/scenes/LibraryBrowser'
import NowPlaying from 'modules/now_playing/scenes/NowPlaying'
import LoadingScreen from 'common/components/LoadingScreen'
import Settings from 'modules/settings/scenes/Settings'
import Playlists from 'modules/playlist/scenes/Playlists'
import Dashboard from 'modules/dashboard/scenes/Dashboard'
import { useAppSelector } from 'store/hooks'

const MainPanel = () => {
  const isFetching = useAppSelector((state) => state.library.isFetching)
  const isInitialized = useAppSelector((state) => state.library.isInitialized)

  return (
    <div>
      {!isInitialized && (
        <MainPanelWrapper>
          <LoadingScreen />
        </MainPanelWrapper>
      )}
      {!isFetching && isInitialized && (
        <MainPanelWrapper>
          <Routes>
            <Route path="/" element={<LibraryBrowser />} />
            <Route path="/queue" element={<NowPlaying />} />
            <Route path="/inspiration" element={<Dashboard />} />
            <Route path="/library" element={<LibraryBrowser />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </MainPanelWrapper>
      )}
    </div>
  )
}

export default MainPanel

const MainPanelWrapper = styled.div`
  margin-left: ${(props) => props.theme.sidebar.width};
  height: 100vh;
  background-color: ${(props) => props.theme.backgroundColor};
`
