import React, { FunctionComponent, Ref, useState } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import KeyboardNavPlayPopup from 'common/components/KeyboardNavPlayPopup'
import { addAlbum, playAlbum } from 'modules/player/redux'
import LibraryBrowserList from 'modules/browser/components/LibraryBrowserList'
import AlbumTeaser from 'modules/browser/components/AlbumTeaser'
import {
  getAlbumsList,
  libraryBrowserSortAlbums,
  selectAlbum,
} from 'modules/browser/redux'
import LibraryBrowserListHeader from './LibraryBrowserListHeader'
import LibraryBrowserPane from './LibraryBrowserPane'
import AlbumContextMenu from './AlbumContextMenu'
import { RootState } from '../../../store/types'

interface Props {
  switchPaneHandler: (e: React.KeyboardEvent) => void
}

interface InternalProps extends Props {
  forwardedRef: Ref<HTMLDivElement>
}

const AlbumsPaneContainer: FunctionComponent<InternalProps> = ({
  switchPaneHandler,
  forwardedRef,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const albums = useSelector((state: RootState) => getAlbumsList(state))
  const orderBy = useSelector(
    (state: RootState) => state.libraryBrowser.sortAlbums
  )
  const currentPosition = useSelector(
    (state: RootState) => state.libraryBrowser.currentPositionAlbums
  )
  const currentAlbum = useSelector(
    (state: RootState) => state.libraryBrowser.selectedAlbums
  )
  const dispatch = useDispatch()

  const orderByOptions: { value: AlbumsSortOptions; label: string }[] = [
    { value: 'title', label: 'title' },
    { value: 'year', label: 'year' },
    { value: 'artistName', label: 'artist' },
  ]

  // Change event handler for LibraryBrowserListHeader.
  const onSortChangeHandler = (event: React.MouseEvent<HTMLSelectElement>) => {
    dispatch(
      libraryBrowserSortAlbums(event.currentTarget.value as AlbumsSortOptions)
    )
  }

  const onItemClick = (itemId: string, index: number) => {
    dispatch(selectAlbum({ albumId: itemId, index }))
  }

  const handlePlayNow = (albumId: string) => {
    dispatch(playAlbum(albumId))
  }

  const handleAddToQueue = (albumId: string) => {
    dispatch(addAlbum(albumId))
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      setModalIsOpen(true)
    } else {
      switchPaneHandler(e)
    }
  }

  return (
    <AlbumsPaneWrapper>
      <LibraryBrowserPane>
        <LibraryBrowserListHeader
          title="Albums"
          orderBy={orderBy}
          orderByOptions={orderByOptions}
          onChange={onSortChangeHandler}
        />
        <LibraryBrowserList
          ref={forwardedRef}
          items={albums}
          itemDisplay={AlbumTeaser}
          currentPosition={currentPosition}
          onItemClick={onItemClick}
          onKeyDown={onKeyDown}
        />
        <AlbumContextMenu />
        <KeyboardNavPlayPopup
          id="albums-nav-modal"
          onClose={() => setModalIsOpen(false)}
          isOpen={modalIsOpen}
          itemId={currentAlbum}
          handlePlayNow={handlePlayNow}
          handleAddToQueue={handleAddToQueue}
        />
      </LibraryBrowserPane>
    </AlbumsPaneWrapper>
  )
}

export default React.forwardRef<HTMLDivElement, Props>((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <AlbumsPaneContainer {...props} forwardedRef={ref} />
))

const AlbumsPaneWrapper = styled.div`
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
  width: 33%;
  height: 100%;
  border-left: 1px solid ${(props) => props.theme.separatorColor};
  border-right: 1px solid ${(props) => props.theme.separatorColor};
`
