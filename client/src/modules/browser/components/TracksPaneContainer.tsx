import React, { Ref, useState } from 'react'
import styled from 'styled-components'
import { addTrack, playTrack } from 'modules/player/store/store'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import VirtualList from 'common/components/virtualLists/VirtualList'
import { useTranslation } from 'react-i18next'
import KeyboardNavPlayModal from 'common/components/KeyboardNavPlayModal'
import {
  getTracksList,
  libraryBrowserSelectTrack,
  libraryBrowserSortTracks,
} from '../store'
import TrackTeaser from './TrackTeaser'
import LibraryBrowserListHeader from './LibraryBrowserListHeader'
import TrackContextMenu from './TrackContextMenu'
import LibraryBrowserPane from './LibraryBrowserPane'

type Props = {
  switchPaneHandler: (e: KeyboardEvent) => void
}

type InternalProps = Props & {
  forwardedRef: Ref<HTMLDivElement>
}

function TracksPaneContainer({
  switchPaneHandler,
  forwardedRef,
}: InternalProps) {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const { t } = useTranslation()

  const tracks = useAppSelector((state) => getTracksList(state))
  const orderBy = useAppSelector((state) => state.libraryBrowser.sortTracks)
  const currentPosition = useAppSelector(
    (state) => state.libraryBrowser.currentPositionTracks
  )
  const currentTrack = useAppSelector(
    (state) => state.libraryBrowser.selectedTracks
  )
  const dispatch = useAppDispatch()

  const orderByOptions: { value: TracksSortOptions; label: string }[] = [
    { value: 'title', label: t('browser.tracks.sort.title') },
    { value: 'number', label: t('browser.tracks.sort.number') },
    { value: 'album', label: t('browser.tracks.sort.album') },
    { value: 'artistId', label: t('browser.tracks.sort.artist') },
  ]

  // Change event handler for LibraryBrowserListHeader.
  const onSortChangeHandler = (event: React.MouseEvent<HTMLSelectElement>) => {
    dispatch(
      libraryBrowserSortTracks(event.currentTarget.value as TracksSortOptions)
    )
  }

  const onItemClick = (itemId: string, index: number) => {
    dispatch(libraryBrowserSelectTrack({ trackId: itemId, index }))
  }

  const handlePlayNow = (trackId: string) => {
    dispatch(playTrack(trackId))
  }

  const handleAddToQueue = (trackId: string) => {
    dispatch(addTrack(trackId))
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      setModalIsOpen(true)
    } else {
      switchPaneHandler(e)
    }
  }

  return (
    <TracksPaneWrapper>
      <LibraryBrowserPane>
        <LibraryBrowserListHeader
          title={t('browser.tracks.title')}
          orderBy={orderBy}
          orderByOptions={orderByOptions}
          onChange={onSortChangeHandler}
        />
        {tracks.length > 1 && (
          <VirtualList
            ref={forwardedRef}
            items={tracks}
            itemDisplay={TrackTeaser}
            currentPosition={currentPosition}
            onItemClick={onItemClick}
            onKeyDown={onKeyDown}
          />
        )}
        {tracks.length === 1 && (
          <NoTracks>{t('browser.tracks.selectAnArtistOrAlbum')}</NoTracks>
        )}
        <TrackContextMenu />
        <KeyboardNavPlayModal
          id="tracks-nav-modal"
          onClose={() => setModalIsOpen(false)}
          isOpen={modalIsOpen}
          itemId={currentTrack}
          handlePlayNow={handlePlayNow}
          handleAddToQueue={handleAddToQueue}
        />
      </LibraryBrowserPane>
    </TracksPaneWrapper>
  )
}

export default React.forwardRef<HTMLDivElement, Props>((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <TracksPaneContainer {...props} forwardedRef={ref} />
))

const TracksPaneWrapper = styled.div`
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
  width: 34%;
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
