import { Route, Routes } from 'react-router-dom'
import LibraryBrowser from 'modules/browser/scenes/LibraryBrowser'
import NowPlaying from 'modules/now_playing/scenes/NowPlaying'
import LoadingScreen from 'common/components/LoadingScreen'
import Settings from 'modules/settings/scenes/Settings'
import Playlists from 'modules/playlist/scenes/Playlists'
import Dashboard from 'modules/dashboard/scenes/Dashboard'
import { useAppSelector } from 'store/hooks'
import React, { forwardRef, Ref } from 'react'

type Props = {
  forwardedRef: Ref<HTMLElement>
}

function MainPanel({ forwardedRef }: Props) {
  const isFetching = useAppSelector((state) => state.library.isFetching)
  const isInitialized = useAppSelector((state) => state.library.isInitialized)

  return (
    <>
      {!isInitialized && <LoadingScreen />}
      {!isFetching && isInitialized && (
        <Routes>
          <Route path="/" element={<LibraryBrowser ref={forwardedRef} />} />
          <Route path="/queue" element={<NowPlaying />} />
          <Route path="/inspiration" element={<Dashboard />} />
          <Route
            path="/library"
            element={<LibraryBrowser ref={forwardedRef} />}
          />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      )}
    </>
  )
}

export default forwardRef<HTMLElement>((props, ref) => (
  // @ts-ignore
  <MainPanel {...props} forwardedRef={ref} />
))
