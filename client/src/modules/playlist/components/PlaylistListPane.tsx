import React, { Ref, useState } from 'react'
import styled from 'styled-components'
import { addTrack, playTrack } from 'modules/player/store/store'
import PlaylistsListHeader from 'modules/playlist/components/PlaylistListHeader'
import {
  playlistSelectPlaylist,
  playlistsSelector,
} from 'modules/playlist/store'
import PlaylistContextMenu from 'modules/playlist/components/PlaylistContextMenu'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import VirtualList from 'common/components/virtualLists/VirtualList'
import PlaylistTeaser from 'modules/playlist/components/PlaylistTeaser'
import VirtualListItem from 'common/components/virtualLists/VirtualListItem'
import KeyboardNavPlayModal from 'common/components/KeyboardNavPlayModal'

type Props = {
  switchPaneHandler: (e: KeyboardEvent) => void
  openPlaylistModal: () => void
}

type InternalProps = Props & {
  forwardedRef: Ref<HTMLDivElement>
}

function PlaylistListPane({
  switchPaneHandler,
  openPlaylistModal,
  forwardedRef,
}: InternalProps) {
  const [modalPlayerIsOpen, setModalPlayerIsOpen] = useState(false)

  const selected = useAppSelector((state) => state.playlist.currentPlaylist)
  const playlists = useAppSelector((state) => playlistsSelector(state))

  const dispatch = useAppDispatch()

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
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

  const onItemClick = (itemId: string) => {
    const selectedPlaylist = playlists.find((item) => item.id === itemId)
    if (selectedPlaylist) {
      dispatch(playlistSelectPlaylist(selectedPlaylist))
    }
  }

  const currentIndex = playlists.findIndex((item) => item.id === selected?.id)
  const currentPosition = currentIndex === -1 ? 0 : currentIndex

  return (
    <Wrapper>
      <List>
        <PlaylistsListHeader onAddClick={openPlaylistModal} />
        <VirtualList
          ref={forwardedRef}
          items={playlists}
          itemDisplay={PlaylistTeaser}
          currentPosition={currentPosition}
          onItemClick={onItemClick}
          onKeyDown={onKeyDown}
        />
        <KeyboardNavPlayModal
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
  <PlaylistListPane {...props} forwardedRef={ref} />
))

const Wrapper = styled.div`
  vertical-align: top;
  overflow: hidden;
  height: 100%;
  border-right: 1px solid ${(props) => props.theme.colors.separator};

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
