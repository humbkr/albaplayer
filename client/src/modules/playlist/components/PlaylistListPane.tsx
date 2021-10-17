import React, { FunctionComponent, Ref, useState } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import KeyboardNavPlayPopup from 'common/components/KeyboardNavPlayPopup'
import { addTrack, playTrack } from 'modules/player/redux'
import PlaylistsListHeader from 'modules/playlist/components/PlaylistListHeader'
import PlaylistList from 'modules/playlist/components/PlaylistList'
import {
  playlistsSelector,
  playlistSelectPlaylist,
} from 'modules/playlist/redux'
// eslint-disable-next-line import/no-cycle
import PlaylistContextMenu from 'modules/playlist/components/PlaylistContextMenu'
import ListItem from 'modules/playlist/components/ListItem'
import { RootState } from 'store/types'

interface Props {
  switchPaneHandler: (e: React.KeyboardEvent) => void
  openPlaylistModal: () => void
}

interface InternalProps extends Props {
  forwardedRef: Ref<HTMLDivElement>
}

const PlaylistListPane: FunctionComponent<InternalProps> = ({
  switchPaneHandler,
  openPlaylistModal,
  forwardedRef,
}) => {
  const [modalPlayerIsOpen, setModalPlayerIsOpen] = useState(false)

  const selected = useSelector(
    (state: RootState) => state.playlist.currentPlaylist.playlist
  )
  const currentPosition = useSelector(
    (state: RootState) => state.playlist.currentPlaylist.position
  )
  const playlists = useSelector((state: RootState) => playlistsSelector(state))

  const dispatch = useDispatch()

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      setModalPlayerIsOpen(true)
    } else {
      switchPaneHandler(e)
    }
  }

  const handlePlayNow = (trackId: string) => {
    dispatch(playTrack(trackId))
  }
  const handleAddToQueue = (trackId: string) => {
    dispatch(addTrack(trackId))
  }

  const handleSelectPlaylist = (playlist: Playlist, playlistIndex: number) => {
    dispatch(
      playlistSelectPlaylist({ selectedPlaylist: playlist, playlistIndex })
    )
  }

  return (
    <Wrapper>
      <List>
        <PlaylistsListHeader onAddClick={openPlaylistModal} />
        <PlaylistList
          items={playlists}
          currentPosition={currentPosition}
          onItemClick={handleSelectPlaylist}
          onKeyDown={onKeyDown}
          ref={forwardedRef}
        />
        <KeyboardNavPlayPopup
          id="playlists-nav-modal"
          isOpen={modalPlayerIsOpen}
          onClose={() => setModalPlayerIsOpen(false)}
          itemId={selected ? selected.id : null}
          handlePlayNow={handlePlayNow}
          handleAddToQueue={handleAddToQueue}
        />
      </List>
      <PlaylistContextMenu />
    </Wrapper>
  )
}

export default React.forwardRef<HTMLDivElement, Props>((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <PlaylistListPane {...props} forwardedRef={ref} />
))

const Wrapper = styled.div`
  vertical-align: top;
  overflow: hidden;
  height: 100%;
  border-right: 1px solid ${(props) => props.theme.separatorColor};

  :focus-within {
    // Can't find a way to manage that directly in the
    // ListItem component.
    ${ListItem}.selected {
      ${(props) => `background-color: ${props.theme.highlightFocus}`};
    }
  }
`
const List = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
