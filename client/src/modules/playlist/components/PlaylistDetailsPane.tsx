import React, { FunctionComponent, Ref, useState } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { contextMenu } from 'react-contexify'
import ActionButtonIcon from 'common/components/ActionButtonIcon'
import KeyboardNavPlayPopup from 'common/components/KeyboardNavPlayPopup'
import {
  addTrack,
  playTrack,
  playPlaylist,
  addPlaylist,
} from 'modules/player/redux'
import ListItem from 'modules/playlist/components/ListItem'
import {
  playlistRemoveTrack,
  playlistSelectTrack,
  playlistUpdateItems,
} from 'modules/playlist/redux'
import { RootState } from 'store/types'
import PlaylistTrackList from './PlaylistTrackList'
import PlaylistTrackContextMenu from './PlaylistTrackContextMenu'
import PlaylistActionsMoreContextMenu from './PlaylistActionsMoreContextMenu'

interface Props {
  switchPaneHandler: (e: React.KeyboardEvent) => void
}

interface InternalProps extends Props {
  forwardedRef: Ref<HTMLDivElement>
}

/**
 * @return {null}
 */
const PlaylistDetailsPane: FunctionComponent<InternalProps> = ({
  switchPaneHandler,
  forwardedRef,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const playlist = useSelector(
    (state: RootState) => state.playlist.currentPlaylist.playlist
  )
  const currentPosition = useSelector(
    (state: RootState) => state.playlist.currentTrack.position
  )
  const currentTrackId = useSelector(
    (state: RootState) => state.playlist.currentTrack.id
  )

  const dispatch = useDispatch()

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      setModalIsOpen(true)
    } else {
      switchPaneHandler(e)
    }
  }

  const handleRemoveTrack = (trackPosition: number) => {
    dispatch(playlistRemoveTrack({ playlistId: playlist.id, trackPosition }))
  }

  const handlePlaylistSelectTrack = (trackId: string, trackIndex: number) => {
    dispatch(playlistSelectTrack({ trackId, trackIndex }))
  }

  const handlePlaylistUpdateTracklist = (
    playlistId: string,
    newItems: PlaylistItem[]
  ) => {
    dispatch(playlistUpdateItems({ playlistId, newItems }))
  }

  const handleTrackPlayNow = (trackId: string) => {
    dispatch(playTrack(trackId))
  }
  const handleTrackAddToQueue = (trackId: string) => {
    dispatch(addTrack(trackId))
  }

  const handlePlaylistPlayNow = (playlistToPlay: Playlist) => {
    if (playlistToPlay.items.length > 0) {
      dispatch(playPlaylist(playlistToPlay.id))
    }
  }
  const handlePlaylistAddToQueue = (playlistToAdd: Playlist) => {
    if (playlistToAdd.items.length > 0) {
      dispatch(addPlaylist(playlistToAdd.id))
    }
  }

  const handlePlaylistActionsMore = (e: React.MouseEvent) => {
    e.preventDefault()
    contextMenu.show({
      id: 'playlist-actions-more-menu',
      event: e,
      props: {
        playlist,
      },
    })
  }

  // If no playlist is selected, display nothing.
  if (!playlist) {
    return null
  }

  return (
    <Wrapper>
      <List>
        <Header>
          <Info>
            <Title>{playlist.title}</Title>
            <Subtitle>
              {playlist.date} - {playlist.items.length} track(s)
            </Subtitle>
          </Info>
          <Actions>
            <PlaylistActionButton
              icon="play_arrow"
              size={30}
              onClick={() => handlePlaylistPlayNow(playlist)}
            />
            <PlaylistActionButton
              icon="playlist_add"
              size={30}
              onClick={() => handlePlaylistAddToQueue(playlist)}
            />
            <PlaylistActionButton
              icon="more_horiz"
              size={25}
              onClick={handlePlaylistActionsMore}
            />
          </Actions>
          <PlaylistActionsMoreContextMenu />
        </Header>
        <PlaylistTrackList
          playlistId={playlist.id}
          items={playlist.items}
          currentPosition={currentPosition}
          onItemClick={handlePlaylistSelectTrack}
          handleRemoveTrack={handleRemoveTrack}
          onTrackListUpdate={handlePlaylistUpdateTracklist}
          onKeyDown={onKeyDown}
          ref={forwardedRef}
        />
        <KeyboardNavPlayPopup
          id="playlist-tracks-nav-modal"
          isOpen={modalIsOpen}
          onClose={() => setModalIsOpen(false)}
          itemId={currentTrackId}
          handlePlayNow={handleTrackPlayNow}
          handleAddToQueue={handleTrackAddToQueue}
        />
      </List>
      <PlaylistTrackContextMenu />
    </Wrapper>
  )
}

export default React.forwardRef<HTMLDivElement, Props>((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <PlaylistDetailsPane {...props} forwardedRef={ref} />
))

const Wrapper = styled.div`
  vertical-align: top;
  overflow: hidden;
  height: 100%;

  :focus-within {
    // Can't find a way to manage that directly in the
    // ListItem component.
    ${ListItem}.selected {
      ${(props) => `background-color: ${props.theme.highlightFocus}`};
    }
    ${ListItem} .selected {
      ${(props) => `color: ${props.theme.textHighlightFocusColor}`};
    }
  }
`
const List = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${(props) => props.theme.itemHeight};
  border-bottom: 1px solid ${(props) => props.theme.separatorColor};
`
const Actions = styled.div`
  display: inline-block;
`
const PlaylistActionButton = styled(ActionButtonIcon)`
  color: ${(props) => props.theme.buttons.color};

  :hover {
    color: ${(props) => props.theme.buttons.colorHover};
  }
`
const Info = styled.div`
  display: inline-block;
  padding-left: 15px;
`
const Title = styled.h1`
  font-size: 1.3em;
`
const Subtitle = styled.p`
  font-size: 0.8em;
  margin-top: 2px;
  font-weight: normal;
  color: ${(props) => props.theme.textSecondaryColor};
`
