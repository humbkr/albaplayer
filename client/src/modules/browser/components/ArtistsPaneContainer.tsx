import React, { Ref, useState } from 'react'
import styled from 'styled-components'
import { addArtist, playArtist } from 'modules/player/store/store'
import VirtualList from 'common/components/virtualLists/VirtualList'
import ArtistContextMenu from 'modules/browser/components/ArtistContextMenu'
import { getArtistsList, selectArtist } from 'modules/browser/store'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import KeyboardNavPlayModal from 'common/components/KeyboardNavPlayModal'
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

  const artists = useAppSelector((state) => getArtistsList(state))
  const currentArtist = useAppSelector(
    (state) => state.libraryBrowser.selectedArtists
  )
  const dispatch = useAppDispatch()

  const onItemClick = (itemId: string) => {
    dispatch(selectArtist({ artistId: itemId }))
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
        <LibraryBrowserListHeader title={t('browser.artists.title')} />
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
