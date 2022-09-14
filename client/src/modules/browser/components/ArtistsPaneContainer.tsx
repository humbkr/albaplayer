import React, { Ref, useState } from 'react'
import styled from 'styled-components'
import KeyboardNavPlayPopup from 'common/components/KeyboardNavPlayPopup'
import { playArtist, addArtist } from 'modules/player/store/store'
import VirtualList from 'common/components/virtualLists/VirtualList'
import ArtistContextMenu from 'modules/browser/components/ArtistContextMenu'
import {
  getArtistsList,
  libraryBrowserSortArtists,
  selectArtist,
} from 'modules/browser/store'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import ArtistTeaser from './ArtistTeaser'
import LibraryBrowserPane from './LibraryBrowserPane'
import LibraryBrowserListHeader from './LibraryBrowserListHeader'

type Props = {
  switchPaneHandler: (e: KeyboardEvent) => void
}

type InternalProps = Props & {
  forwardedRef: Ref<HTMLDivElement>
}

const ArtistsPaneContainer = ({
  switchPaneHandler,
  forwardedRef,
}: InternalProps) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const artists = useAppSelector((state) => getArtistsList(state))
  const orderBy = useAppSelector((state) => state.libraryBrowser.sortArtists)
  const currentPosition = useAppSelector(
    (state) => state.libraryBrowser.currentPositionArtists
  )
  const currentArtist = useAppSelector(
    (state) => state.libraryBrowser.selectedArtists
  )
  const dispatch = useAppDispatch()

  const orderByOptions: { value: ArtistsSortOptions; label: string }[] = [
    { value: 'name', label: 'name' },
  ]

  // Change event handler for LibraryBrowserListHeader.
  const onSortChangeHandler = (event: React.MouseEvent<HTMLSelectElement>) => {
    dispatch(
      libraryBrowserSortArtists(event.currentTarget.value as ArtistsSortOptions)
    )
  }

  const onItemClick = (itemId: string, index: number) => {
    dispatch(selectArtist({ artistId: itemId, index }))
  }

  const handlePlayNow = (artistId: string) => {
    dispatch(playArtist(artistId))
  }

  const handleAddToQueue = (artistId: string) => {
    dispatch(addArtist(artistId))
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      setModalIsOpen(true)
    } else {
      switchPaneHandler(e)
    }
  }

  return (
    <ArtistsPaneWrapper>
      <LibraryBrowserPane>
        <LibraryBrowserListHeader
          title="Artists"
          orderBy={orderBy}
          orderByOptions={orderByOptions}
          onChange={onSortChangeHandler}
        />
        <VirtualList
          ref={forwardedRef}
          items={artists}
          itemDisplay={ArtistTeaser}
          currentPosition={currentPosition}
          onItemClick={onItemClick}
          onKeyDown={onKeyDown}
        />
        <ArtistContextMenu />
        <KeyboardNavPlayPopup
          id="artists-nav-modal"
          onClose={() => setModalIsOpen(false)}
          isOpen={modalIsOpen}
          itemId={currentArtist}
          handlePlayNow={handlePlayNow}
          handleAddToQueue={handleAddToQueue}
        />
      </LibraryBrowserPane>
    </ArtistsPaneWrapper>
  )
}

export default React.forwardRef<HTMLDivElement, Props>((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <ArtistsPaneContainer {...props} forwardedRef={ref} />
))

const ArtistsPaneWrapper = styled.div`
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
  width: 33%;
  height: 100%;
`
