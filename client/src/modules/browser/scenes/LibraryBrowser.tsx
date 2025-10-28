import type { Ref, RefObject } from 'react'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import TracksPaneContainer from 'modules/browser/components/TracksPaneContainer'
import ArtistsPaneContainer from 'modules/browser/components/ArtistsPaneContainer'
import AlbumsPaneContainer from 'modules/browser/components/AlbumsPaneContainer'
import { libraryBrowserInit } from 'modules/browser/store'
import { useAppDispatch } from 'store/hooks'

type Props = {
  ref: Ref<HTMLElement>
}

/**
 * Library browser screen.
 *
 * Handles the switch between artists / albums / tracks pane using
 * left and right arrows.
 */
export default function LibraryBrowser({ ref }: Props) {
  // List components of each pane.
  const artistsPaneRef = useRef<HTMLDivElement>(null)
  const albumsPaneRef = useRef<HTMLDivElement>(null)
  const tracksPaneRef = useRef<HTMLDivElement>(null)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(libraryBrowserInit())
    ;(ref as RefObject<HTMLElement>)?.current?.focus()
  }, [dispatch, ref])

  const handleSwitchPaneArtists = (e: KeyboardEvent) => {
    if (e.code === 'ArrowRight') {
      ;(albumsPaneRef.current?.children[0] as HTMLElement).focus()
    }
  }

  const handleSwitchPaneAlbums = (e: KeyboardEvent) => {
    if (e.code === 'ArrowLeft') {
      ;(artistsPaneRef.current?.children[0] as HTMLElement).focus()
    } else if (e.code === 'ArrowRight' && tracksPaneRef.current) {
      ;(tracksPaneRef.current.children[0] as HTMLElement).focus()
    }
  }

  const handleSwitchPaneTracks = (e: KeyboardEvent) => {
    if (e.code === 'ArrowLeft') {
      ;(albumsPaneRef.current?.children[0] as HTMLElement).focus()
    }
  }

  return (
    <Container>
      <ArtistsPaneContainer
        switchPaneHandler={handleSwitchPaneArtists}
        ref={artistsPaneRef}
      />
      <AlbumsPaneContainer
        switchPaneHandler={handleSwitchPaneAlbums}
        ref={albumsPaneRef}
      />
      <TracksPaneContainer
        switchPaneHandler={handleSwitchPaneTracks}
        ref={tracksPaneRef}
      />
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  height: 100%;
`
