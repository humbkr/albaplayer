import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import TracksPaneContainer from 'modules/browser/components/TracksPaneContainer'
import ArtistsPaneContainer from 'modules/browser/components/ArtistsPaneContainer'
import AlbumsPaneContainer from 'modules/browser/components/AlbumsPaneContainer'
import LibraryBrowserSearchBar from 'modules/browser/components/LibraryBrowserSearchBar'
import { libraryBrowserInit } from 'modules/browser/redux'

/**
 * Library browser screen.
 *
 * Handles the switch between artists / albums / tracks pane using
 * left and right arrows.
 */
const LibraryBrowser: React.FC = () => {
  // Used to focus the search input at mount.
  const searchBar = useRef<HTMLInputElement>(null)
  // These refs are forwarded to the underlying react-virtualized
  // List components of each pane.
  const artistsPane = useRef<HTMLDivElement>(null)
  const albumsPane = useRef<HTMLDivElement>(null)
  const tracksPane = useRef<HTMLDivElement>(null)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(libraryBrowserInit())

    // Give focus to the search bar.
    // @ts-ignore
    searchBar.current.focus()
  }, [dispatch])

  const handleSwitchPaneArtists = (e: React.KeyboardEvent) => {
    if (e.keyCode === 39) {
      // @ts-ignore
      albumsPane.current.children[0].focus()
    }
  }

  const handleSwitchPaneAlbums = (e: React.KeyboardEvent) => {
    if (e.keyCode === 37) {
      // @ts-ignore
      artistsPane.current.children[0].focus()
    } else if (e.keyCode === 39 && tracksPane.current) {
      // @ts-ignore
      tracksPane.current.children[0].focus()
    }
  }

  const handleSwitchPaneTracks = (e: React.KeyboardEvent) => {
    if (e.keyCode === 37) {
      // @ts-ignore
      albumsPane.current.children[0].focus()
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
