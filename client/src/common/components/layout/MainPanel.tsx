import { Route, Routes } from 'react-router-dom'
import LibraryBrowser from 'modules/browser/scenes/LibraryBrowser'
import NowPlaying from 'modules/now_playing/scenes/NowPlaying'
import LoadingScreen from 'common/components/layout/LoadingScreen'
import Preferences from 'modules/settings/scenes/Preferences'
import Playlists from 'modules/collections/scenes/Playlists'
import Dashboard from 'modules/dashboard/scenes/Dashboard'
import { useAppSelector } from 'store/hooks'
import React, { forwardRef, Ref } from 'react'
import Administration from 'modules/settings/scenes/Administration'
import ROUTES from 'routing'

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
          <Route
            path={ROUTES.home}
            element={<LibraryBrowser ref={forwardedRef} />}
          />
          <Route path={ROUTES.nowPlaying} element={<NowPlaying />} />
          <Route path={ROUTES.dashboard} element={<Dashboard />} />
          <Route
            path={ROUTES.libraryBrowser}
            element={<LibraryBrowser ref={forwardedRef} />}
          />
          <Route path={ROUTES.playlists} element={<Playlists />} />
          <Route path={ROUTES.preferences} element={<Preferences />} />
          <Route path={ROUTES.administration} element={<Administration />} />
        </Routes>
      )}
    </>
  )
}

export default forwardRef<HTMLElement>((props, ref) => (
  // @ts-ignore
  <MainPanel {...props} forwardedRef={ref} />
))
