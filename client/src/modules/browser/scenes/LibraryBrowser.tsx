import React, { useRef, useEffect, Ref, forwardRef, RefObject } from 'react'
import styled from 'styled-components'
import TracksPaneContainer from 'modules/browser/components/TracksPaneContainer'
import ArtistsPaneContainer from 'modules/browser/components/ArtistsPaneContainer'
import AlbumsPaneContainer from 'modules/browser/components/AlbumsPaneContainer'
import { libraryBrowserInit } from 'modules/browser/store'
import { useAppDispatch } from 'store/hooks'

type Props = {
  forwardedRef: Ref<HTMLElement>
}

/**
 * Library browser screen.
 *
 * Handles the switch between artists / albums / tracks pane using
 * left and right arrows.
 */
function LibraryBrowser({ forwardedRef }: Props) {
  // List components of each pane.
  const artistsPane = useRef<HTMLDivElement>(null)
  const albumsPane = useRef<HTMLDivElement>(null)
  const tracksPane = useRef<HTMLDivElement>(null)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(libraryBrowserInit())
    ;(forwardedRef as RefObject<HTMLElement>)?.current?.focus()
  }, [dispatch, forwardedRef])

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
    <Container>
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
    </Container>
  )
}

export default forwardRef<HTMLElement>((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <LibraryBrowser {...props} forwardedRef={ref} />
))

const Container = styled.div`
  display: flex;
  height: 100%;
`
