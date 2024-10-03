import React, { Ref, useState } from 'react'
import styled from 'styled-components'
import { addAlbum, playAlbum } from 'modules/player/store/store'
import VirtualList from 'common/components/virtualLists/VirtualList'
import AlbumTeaser from 'modules/browser/components/AlbumTeaser'
import {
  getAlbumsList,
  libraryBrowserSortAlbums,
  selectAlbum,
} from 'modules/browser/store'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import KeyboardNavPlayModal from 'common/components/KeyboardNavPlayModal'
import LibraryBrowserListHeader from './LibraryBrowserListHeader'
import LibraryBrowserPane from './LibraryBrowserPane'
import AlbumContextMenu from './AlbumContextMenu'

type Props = {
  switchPaneHandler: (e: KeyboardEvent) => void
}

type InternalProps = Props & {
  forwardedRef: Ref<HTMLDivElement>
}

function AlbumsPaneContainer({
  switchPaneHandler,
  forwardedRef,
}: InternalProps) {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const { t } = useTranslation()

  const albums = useAppSelector((state) => getAlbumsList(state))
  const orderBy = useAppSelector((state) => state.libraryBrowser.sortAlbums)
  const currentAlbum = useAppSelector(
    (state) => state.libraryBrowser.selectedAlbums
  )
  const dispatch = useAppDispatch()

  const orderByOptions: { value: AlbumsSortOptions; label: string }[] = [
    { value: 'title', label: t('browser.albums.sort.title') },
    { value: 'year', label: t('browser.albums.sort.year') },
    { value: 'artistName', label: t('browser.albums.sort.artist') },
  ]

  // Change event handler for LibraryBrowserListHeader.
  const onSortChangeHandler = (event: React.MouseEvent<HTMLSelectElement>) => {
    dispatch(
      libraryBrowserSortAlbums(event.currentTarget.value as AlbumsSortOptions)
    )
  }

  const onItemClick = (itemId: string) => {
    dispatch(selectAlbum({ albumId: itemId }))
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
          title={t('browser.albums.title')}
          orderBy={orderBy}
          orderByOptions={orderByOptions}
          onChange={onSortChangeHandler}
        />
        <VirtualList
          ref={forwardedRef}
          items={albums}
          itemDisplay={AlbumTeaser}
          currentPosition={
            albums.findIndex((album) => album.id === currentAlbum) || 0
          }
          onItemClick={onItemClick}
          onKeyDown={onKeyDown}
        />
        <AlbumContextMenu />
        <KeyboardNavPlayModal
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
  border-left: 1px solid ${(props) => props.theme.colors.separator};
  border-right: 1px solid ${(props) => props.theme.colors.separator};
`
