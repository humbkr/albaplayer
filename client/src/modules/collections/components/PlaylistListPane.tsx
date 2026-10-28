import type { Ref } from 'react'
import React, { useState } from 'react'
import styled from 'styled-components'
import PlaylistsListHeader from 'modules/collections/components/PlaylistListHeader'
import { playlistSelectPlaylist } from 'modules/collections/store'
import PlaylistContextMenu from 'modules/collections/components/PlaylistContextMenu'
import { useAppDispatch } from 'store/hooks'
import VirtualList from 'common/components/virtualLists/VirtualList'
import PlaylistTeaser from 'modules/collections/components/PlaylistTeaser'
import VirtualListItem from 'common/components/virtualLists/VirtualListItem'
import KeyboardNavPlayModal from 'common/components/KeyboardNavPlayModal'
import { useGetCollectionsQuery } from 'modules/collections/services/api'
import {
  useAddPlaylist,
  useGetCurrentPlaylist,
  usePlayPlaylist,
} from 'modules/collections/services/services'

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

  const currentPlaylist = useGetCurrentPlaylist()
  const { data: { playlists = [] } = {} } = useGetCollectionsQuery()
  const playPlaylist = usePlayPlaylist()
  const addPlaylist = useAddPlaylist()

  const dispatch = useAppDispatch()

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      setModalPlayerIsOpen(true)
    } else {
      switchPaneHandler(e)
    }
  }

  const currentPlaylistHasTracks = (currentPlaylist?.items?.length ?? 0) > 0

  const handlePlayNow = (playlistId: string) => {
    if (currentPlaylistHasTracks) {
      playPlaylist(playlistId)
    }
  }
  const handleAddToQueue = (playlistId: string) => {
    if (currentPlaylistHasTracks) {
      addPlaylist(playlistId)
    }
  }

  const onItemClick = (itemId: string) => {
    if (itemId) {
      dispatch(playlistSelectPlaylist(itemId))
    }
  }

  const currentIndex = playlists.findIndex(
    (item) => item.id === currentPlaylist?.id
  )
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
          itemId={currentPlaylist?.id ?? ''}
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

  &:focus-within {
    // Can't find a way to manage that directly in the
    // VirtualListItem component.
    ${VirtualListItem}.selected {
      ${(props) =>
        `background-color: ${props.theme.colors.elementHighlightFocus}`};
      ${(props) =>
        `color: ${props.theme.colors.elementHighlightFocusTextColor}`};
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
  min-height: 0;
`
