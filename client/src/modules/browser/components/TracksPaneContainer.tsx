import type { Ref } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import VirtualList from 'common/components/virtualLists/VirtualList'
import { useTranslation } from 'react-i18next'
import KeyboardNavPlayModal from 'common/components/KeyboardNavPlayModal'
import { useTracksPanel } from 'modules/browser/hooks/useTracksPanel'
import { AlbumDetailsHeader } from 'modules/browser/components/AlbumDetailsHeader'
import AlbumDetailsListItem from 'modules/browser/components/AlbumDetailsListItem'
import DiscContextMenu from 'modules/browser/components/DiscContextMenu'
import LibraryBrowserPane from './LibraryBrowserPane'
import TrackContextMenu from './TrackContextMenu'
import LibraryBrowserListHeader from './LibraryBrowserListHeader'

type Props = {
  switchPaneHandler: (e: KeyboardEvent) => void
  ref: Ref<HTMLDivElement>
}

export default function TracksPaneContainer({ switchPaneHandler, ref }: Props) {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const { t } = useTranslation()

  const {
    items,
    orderBy,
    currentItem,
    orderByOptions,
    onSortChangeHandler,
    onItemClick,
    handlePlayNow,
    handleAddToQueue,
    isInAlbumMode,
  } = useTracksPanel()

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      setModalIsOpen(true)
    } else {
      switchPaneHandler(e)
    }
  }

  const currentIndex = items.findIndex((item) => item.id === currentItem)
  const currentPosition = currentIndex >= 0 ? currentIndex : 0

  return (
    <TracksPaneWrapper>
      <LibraryBrowserPane>
        {!isInAlbumMode && (
          <LibraryBrowserListHeader
            icon="audiotrack"
            title={t('browser.tracks.title')}
            orderBy={orderBy}
            orderByOptions={orderByOptions}
            onChange={onSortChangeHandler}
          />
        )}
        {items.length > 1 && (
          <VirtualList
            ref={ref}
            items={items}
            itemDisplay={AlbumDetailsListItem}
            currentPosition={currentPosition}
            onItemClick={onItemClick}
            onKeyDown={onKeyDown}
            Header={isInAlbumMode ? <AlbumDetailsHeader /> : undefined}
            fixedItemHeight={!isInAlbumMode}
          />
        )}
        {items.length === 1 && (
          <NoTracks>{t('browser.tracks.selectAnArtistOrAlbum')}</NoTracks>
        )}
        <TrackContextMenu />
        {isInAlbumMode && <DiscContextMenu />}
        <KeyboardNavPlayModal
          id="tracks-nav-modal"
          onClose={() => setModalIsOpen(false)}
          isOpen={modalIsOpen}
          itemId={currentItem}
          handlePlayNow={handlePlayNow}
          handleAddToQueue={handleAddToQueue}
        />
      </LibraryBrowserPane>
    </TracksPaneWrapper>
  )
}

const TracksPaneWrapper = styled.div`
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
  height: 100%;
`
const NoTracks = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  font-style: italic;
  color: ${(props) => props.theme.colors.textSecondary};
`
