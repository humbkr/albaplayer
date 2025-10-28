import { Route, Routes } from 'react-router'
import LibraryBrowser from 'modules/browser/scenes/LibraryBrowser'
import LibraryBrowserMobile from 'modules/browser/scenes/LibraryBrowser.mobile'
import NowPlaying from 'modules/now_playing/scenes/NowPlaying'
import LoadingScreen from 'common/components/layout/LoadingScreen'
import Preferences from 'modules/settings/scenes/Preferences'
import Playlists from 'modules/collections/scenes/Playlists'
import Dashboard from 'modules/dashboard/scenes/Dashboard'
import { useAppSelector } from 'store/hooks'
import type { Ref } from 'react'
import Administration from 'modules/settings/scenes/Administration'
import ROUTES from 'routing'
import { isMobileBrowser } from 'common/utils/isMobileBrowser'
import LibraryBrowserArtists from 'modules/browser/scenes/LibraryBrowserArtists.mobile'
import LibraryBrowserAlbums from 'modules/browser/scenes/LibraryBrowserAlbums.mobile'
import LibraryBrowserArtist from 'modules/browser/scenes/LibraryBrowserArtist.mobile'
import LibraryBrowserAlbum from 'modules/browser/scenes/LibraryBrowserAlbum.mobile'

type Props = {
  ref: Ref<HTMLElement>
}

export default function MainPanel({ ref }: Props) {
  const isMobile = isMobileBrowser()
  const { isFetching, isInitialized } = useAppSelector((state) => state.library)

  return (
    <>
      {(!isInitialized || isFetching) && <LoadingScreen />}
      {!isFetching && isInitialized && (
        <Routes>
          <Route
            path={ROUTES.home}
            element={
              isMobile ? <LibraryBrowserMobile /> : <LibraryBrowser ref={ref} />
            }
          />
          <Route path={ROUTES.nowPlaying} element={<NowPlaying />} />
          <Route path={ROUTES.dashboard} element={<Dashboard />} />
          <Route
            path={ROUTES.libraryBrowser}
            element={
              isMobile ? <LibraryBrowserMobile /> : <LibraryBrowser ref={ref} />
            }
          />
          {isMobile && (
            <>
              <Route
                path={ROUTES.libraryBrowserArtists}
                element={<LibraryBrowserArtists />}
              />
              <Route
                path={ROUTES.libraryBrowserArtist}
                element={<LibraryBrowserArtist />}
              />
              <Route
                path={ROUTES.libraryBrowserAlbums}
                element={<LibraryBrowserAlbums />}
              />
              <Route
                path={ROUTES.libraryBrowserAlbum}
                element={<LibraryBrowserAlbum />}
              />
            </>
          )}
          <Route path={ROUTES.playlists} element={<Playlists />} />
          <Route path={ROUTES.preferences} element={<Preferences />} />
          <Route path={ROUTES.administration} element={<Administration />} />
        </Routes>
      )}
    </>
  )
}
