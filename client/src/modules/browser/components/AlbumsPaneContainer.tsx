import React, { Ref, useState } from 'react'
import styled from 'styled-components'
import KeyboardNavPlayPopup from 'common/components/KeyboardNavPlayPopup'
import { addAlbum, playAlbum } from 'modules/player/store/store'
import VirtualList from 'common/components/virtualLists/VirtualList'
import AlbumTeaser from 'modules/browser/components/AlbumTeaser'
import {
  getAlbumsList,
  libraryBrowserSortAlbums,
  selectAlbum,
} from 'modules/browser/store'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import LibraryBrowserListHeader from './LibraryBrowserListHeader'
import LibraryBrowserPane from './LibraryBrowserPane'
import AlbumContextMenu from './AlbumContextMenu'

type Props = {
  switchPaneHandler: (e: KeyboardEvent) => void
}

type InternalProps = Props & {
  forwardedRef: Ref<HTMLDivElement>
}

const AlbumsPaneContainer = ({
  switchPaneHandler,
  forwardedRef,
}: InternalProps) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const albums = useAppSelector((state) => getAlbumsList(state))
  const orderBy = useAppSelector((state) => state.libraryBrowser.sortAlbums)
  const currentPosition = useAppSelector(
    (state) => state.libraryBrowser.currentPositionAlbums
  )
  const currentAlbum = useAppSelector(
    (state) => state.libraryBrowser.selectedAlbums
  )
  const dispatch = useAppDispatch()

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

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
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
        <VirtualList
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
