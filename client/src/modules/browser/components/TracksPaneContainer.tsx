import React, { FunctionComponent, Ref, useState } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import KeyboardNavPlayPopup from 'common/components/KeyboardNavPlayPopup'
import { addTrack, playTrack } from 'modules/player/redux'
import LibraryBrowserList from './LibraryBrowserList'
import TrackTeaser from './TrackTeaser'
import LibraryBrowserListHeader from './LibraryBrowserListHeader'
import TrackContextMenu from './TrackContextMenu'
import LibraryBrowserPane from './LibraryBrowserPane'
import {
  getTracksList,
  libraryBrowserSortTracks,
  libraryBrowserSelectTrack,
} from '../redux'
import { RootState } from '../../../store/types'

interface Props {
  switchPaneHandler: (e: React.KeyboardEvent) => void
}

interface InternalProps extends Props {
  forwardedRef: Ref<HTMLDivElement>
}

const TracksPaneContainer: FunctionComponent<InternalProps> = ({
  switchPaneHandler,
  forwardedRef,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const tracks = useSelector((state: RootState) => getTracksList(state))
  const orderBy = useSelector(
    (state: RootState) => state.libraryBrowser.sortTracks
  )
  const currentPosition = useSelector(
    (state: RootState) => state.libraryBrowser.currentPositionTracks
  )
  const currentTrack = useSelector(
    (state: RootState) => state.libraryBrowser.selectedTracks
  )
  const dispatch = useDispatch()

  const orderByOptions: { value: TracksSortOptions; label: string }[] = [
    { value: 'title', label: 'title' },
    { value: 'number', label: 'track number' },
    { value: 'album', label: 'album' },
    { value: 'artistId', label: 'artist' },
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

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      setModalIsOpen(true)
    } else {
      switchPaneHandler(e)
    }
  }

  return (
    <TracksPaneWrapper>
      <LibraryBrowserPane>
        <LibraryBrowserListHeader
          title="Tracks"
          orderBy={orderBy}
          orderByOptions={orderByOptions}
          onChange={onSortChangeHandler}
        />
        {tracks.length > 1 && (
          <LibraryBrowserList
            ref={forwardedRef}
            items={tracks}
            itemDisplay={TrackTeaser}
            currentPosition={currentPosition}
            onItemClick={onItemClick}
            onKeyDown={onKeyDown}
          />
        )}
        {tracks.length === 1 && <NoTracks>Select an artist or album</NoTracks>}
        <TrackContextMenu />
        <KeyboardNavPlayPopup
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
  color: ${(props) => props.theme.textSecondaryColor};
`
