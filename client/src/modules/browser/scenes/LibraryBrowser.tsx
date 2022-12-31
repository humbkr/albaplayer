import { useRef, useEffect } from 'react'
import styled from 'styled-components'
import TracksPaneContainer from 'modules/browser/components/TracksPaneContainer'
import ArtistsPaneContainer from 'modules/browser/components/ArtistsPaneContainer'
import AlbumsPaneContainer from 'modules/browser/components/AlbumsPaneContainer'
import LibraryBrowserSearchBar from 'modules/browser/components/LibraryBrowserSearchBar'
import { libraryBrowserInit } from 'modules/browser/store'
import { useAppDispatch } from 'store/hooks'

/**
 * Library browser screen.
 *
 * Handles the switch between artists / albums / tracks pane using
 * left and right arrows.
 */
function LibraryBrowser() {
  // Used to focus the search input at mount.
  const searchBar = useRef<HTMLInputElement>(null)
  // List components of each pane.
  const artistsPane = useRef<HTMLDivElement>(null)
  const albumsPane = useRef<HTMLDivElement>(null)
  const tracksPane = useRef<HTMLDivElement>(null)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(libraryBrowserInit())

    // Give focus to the search bar.
    // @ts-ignore
    searchBar.current.focus()
  }, [dispatch])

  const handleSwitchPaneArtists = (e: KeyboardEvent) => {
    if (e.code === 'ArrowRight') {
      // @ts-ignore
      albumsPane.current?.children[0].focus()
    }
  }

  const handleSwitchPaneAlbums = (e: KeyboardEvent) => {
    if (e.code === 'ArrowLeft') {
      // @ts-ignore
      artistsPane.current?.children[0].focus()
    } else if (e.code === 'ArrowRight' && tracksPane.current) {
      // @ts-ignore
      tracksPane.current.children[0].focus()
    }
  }

  const handleSwitchPaneTracks = (e: KeyboardEvent) => {
    if (e.code === 'ArrowLeft') {
      // @ts-ignore
      albumsPane.current?.children[0].focus()
    }
  }

  return (
    <LibraryBrowserWrapper>
      <LibraryBrowserSearchBar ref={searchBar} />
      <LibraryBrowserListsWrapper>
        <ArtistsPaneContainer
          switchPaneHandler={handleSwitchPaneArtists}
          ref={artistsPane}
        />
        <AlbumsPaneContainer
          switchPaneHandler={handleSwitchPaneAlbums}
          ref={albumsPane}
        />
        <TracksPaneContainer
          switchPaneHandler={handleSwitchPaneTracks}
          ref={tracksPane}
        />
      </LibraryBrowserListsWrapper>
    </LibraryBrowserWrapper>
  )
}

export default LibraryBrowser

const LibraryBrowserWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const LibraryBrowserListsWrapper = styled.div`
  flex: 1;
`
