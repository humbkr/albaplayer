import type { Ref } from 'react'
import React, { useState } from 'react'
import styled from 'styled-components'
import VirtualList from 'common/components/virtualLists/VirtualList'
import ArtistContextMenu from 'modules/browser/components/ArtistContextMenu'
import { useTranslation } from 'react-i18next'
import KeyboardNavPlayModal from 'common/components/KeyboardNavPlayModal'
import { useArtistsPanel } from 'modules/browser/hooks/useArtistsPanel'
import ArtistTeaser from './ArtistTeaser'
import LibraryBrowserPane from './LibraryBrowserPane'
import LibraryBrowserListHeader from './LibraryBrowserListHeader'

type Props = {
  switchPaneHandler: (e: KeyboardEvent) => void
}

type InternalProps = Props & {
  forwardedRef: Ref<HTMLDivElement>
}

function ArtistsPaneContainer({
  switchPaneHandler,
  forwardedRef,
}: InternalProps) {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const { t } = useTranslation()

  const {
    artists,
    currentArtist,
    onItemClick,
    handlePlayNow,
    handleAddToQueue,
  } = useArtistsPanel()

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
          icon="person"
          title={t('browser.artists.title')}
        />
        <VirtualList
          ref={forwardedRef}
          items={artists}
          itemDisplay={ArtistTeaser}
          currentPosition={
            artists.findIndex((artist) => artist.id === currentArtist) || 0
          }
          onItemClick={onItemClick}
          onKeyDown={onKeyDown}
        />
        <ArtistContextMenu />
        <KeyboardNavPlayModal
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
  <ArtistsPaneContainer {...props} forwardedRef={ref} />
))

const ArtistsPaneWrapper = styled.div`
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
  height: 100%;
`
