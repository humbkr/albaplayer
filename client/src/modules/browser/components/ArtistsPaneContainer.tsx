import React, { FunctionComponent, Ref, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import KeyboardNavPlayPopup from 'common/components/KeyboardNavPlayPopup'
import { playArtist, addArtist } from 'modules/player/redux'
import LibraryBrowserList from 'modules/browser/components/LibraryBrowserList'
import ArtistContextMenu from 'modules/browser/components/ArtistContextMenu'
import {
  getArtistsList,
  libraryBrowserSortArtists,
  selectArtist,
} from 'modules/browser/redux'
import ArtistTeaser from './ArtistTeaser'
import LibraryBrowserPane from './LibraryBrowserPane'
import LibraryBrowserListHeader from './LibraryBrowserListHeader'
import { RootState } from '../../../store/types'

interface Props {
  switchPaneHandler: (e: React.KeyboardEvent) => void
}

interface InternalProps extends Props {
  forwardedRef: Ref<HTMLDivElement>
}

const ArtistsPaneContainer: FunctionComponent<InternalProps> = ({
  switchPaneHandler,
  forwardedRef,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const artists = useSelector((state: RootState) => getArtistsList(state))
  const orderBy = useSelector(
    (state: RootState) => state.libraryBrowser.sortArtists
  )
  const currentPosition = useSelector(
    (state: RootState) => state.libraryBrowser.currentPositionArtists
  )
  const currentArtist = useSelector(
    (state: RootState) => state.libraryBrowser.selectedArtists
  )
  const dispatch = useDispatch()

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

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
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
        <LibraryBrowserList
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
