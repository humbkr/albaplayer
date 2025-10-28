import type { Ref } from 'react'
import React, { useState } from 'react'
import styled from 'styled-components'
import VirtualList from 'common/components/virtualLists/VirtualList'
import AlbumTeaser from 'modules/browser/components/AlbumTeaser'
import { useTranslation } from 'react-i18next'
import KeyboardNavPlayModal from 'common/components/KeyboardNavPlayModal'
import { useAlbumsPanel } from 'modules/browser/hooks/useAlbumsPanel'
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

  const {
    albums,
    orderBy,
    currentAlbum,
    orderByOptions,
    onSortChangeHandler,
    onItemClick,
    handlePlayNow,
    handleAddToQueue,
  } = useAlbumsPanel()

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
          icon="album"
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
  <AlbumsPaneContainer {...props} forwardedRef={ref} />
))

const AlbumsPaneWrapper = styled.div`
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
  height: 100%;
  border-left: 1px solid ${(props) => props.theme.colors.separator};
  border-right: 1px solid ${(props) => props.theme.colors.separator};
`
