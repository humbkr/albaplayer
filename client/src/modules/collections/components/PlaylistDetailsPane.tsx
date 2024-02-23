import React, { Ref, useState } from 'react'
import styled from 'styled-components'
import { contextMenu } from 'react-contexify'
import ActionButtonIcon from 'common/components/buttons/ActionButtonIcon'
import { addTrack, playTrack } from 'modules/player/store/store'
import VirtualListItem from 'common/components/virtualLists/VirtualListItem'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import KeyboardNavPlayModal from 'common/components/KeyboardNavPlayModal'
import {
  useGetCurrentPlaylist,
  useRemoveTrackFromPlaylist,
  useUpdatePlaylistItems,
} from 'modules/collections/services/services'
import { playlistSelectTrack } from 'modules/collections/store'
import { useAddPlaylist, usePlayPlaylist } from 'modules/player/services'
import dayjs from 'dayjs'
import PlaylistTrackList from './PlaylistTrackList'
import PlaylistTrackContextMenu from './PlaylistTrackContextMenu'
import PlaylistActionsMoreContextMenu from './PlaylistActionsMoreContextMenu'

type Props = {
  switchPaneHandler: (e: KeyboardEvent) => void
}

type InternalProps = Props & {
  forwardedRef: Ref<HTMLDivElement>
}

function PlaylistDetailsPane({
  switchPaneHandler,
  forwardedRef,
}: InternalProps) {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const removeTrack = useRemoveTrackFromPlaylist()
  const updatePlaylist = useUpdatePlaylistItems()

  const playlist = useGetCurrentPlaylist()
  const currentPosition = useAppSelector(
    (state) => state.playlist.currentTrack.position
  )
  const currentTrackId = useAppSelector(
    (state) => state.playlist.currentTrack.id
  )

  const playPlaylist = usePlayPlaylist()
  const addPlaylist = useAddPlaylist()

  const dispatch = useAppDispatch()

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      setModalIsOpen(true)
    } else {
      switchPaneHandler(e)
    }
  }

  const handleRemoveTrack = (trackPosition: number) => {
    removeTrack(trackPosition, playlist!.id)
  }

  const handlePlaylistSelectTrack = (trackId: string, trackIndex: number) => {
    // We have to explicitly give the focus on click, I don't know exactly why.
    // Probably because of the drag'n'drop lib.
    // @ts-ignore
    forwardedRef.current.children[0].focus()
    dispatch(playlistSelectTrack({ trackId, trackIndex }))
  }

  const handlePlaylistUpdateTracklist = (
    playlistId: string,
    newItems: PlaylistItem[]
  ) => {
    updatePlaylist(newItems, playlistId)
  }

  const handleTrackPlayNow = (trackId: string) => {
    dispatch(playTrack(trackId))
  }
  const handleTrackAddToQueue = (trackId: string) => {
    dispatch(addTrack(trackId))
  }

  const handlePlaylistPlayNow = (playlistToPlay: Playlist) => {
    if (playlistToPlay.items.length > 0) {
      playPlaylist(playlistToPlay.id)
    }
  }
  const handlePlaylistAddToQueue = (playlistToAdd: Playlist) => {
    if (playlistToAdd.items.length > 0) {
      addPlaylist(playlistToAdd.id)
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

  const playlistDate = dayjs.unix(playlist.dateCreated).format('YYYY-MM-DD')

  return (
    <Wrapper>
      <List>
        <Header>
          <Info>
            <Title>{playlist.title}</Title>
            <Subtitle>
              {playlistDate} - {playlist.items?.length || 0} track(s)
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
        <KeyboardNavPlayModal
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
    // VirtualListItem component.
    ${VirtualListItem}.selected {
      ${(props) =>
        `background-color: ${props.theme.colors.elementHighlightFocus}`};
    }
    ${VirtualListItem} .selected {
      ${(props) =>
        `color: ${props.theme.colors.elementHighlightFocusTextColor}`};
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
  height: ${(props) => props.theme.layout.itemHeight};
  border-bottom: 1px solid ${(props) => props.theme.colors.separator};
`
const Actions = styled.div`
  display: inline-block;
`
const PlaylistActionButton = styled(ActionButtonIcon)`
  color: ${(props) => props.theme.buttons.backgroundColor};

  :hover {
    color: ${(props) => props.theme.buttons.backgroundColorHover};
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
  color: ${(props) => props.theme.colors.textSecondary};
`
