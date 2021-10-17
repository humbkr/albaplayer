import React, { FunctionComponent } from 'react'
import {
  Menu as ContextMenu, Item, Separator, Submenu,
} from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import { MenuItemEventHandler } from 'react-contexify/lib/types'
import { useDispatch, useSelector } from 'react-redux'
import {
  setItemFromQueue,
  playerTogglePlayPause,
  queueRemoveTrack,
} from 'modules/player/redux'
import {
  playlistsSelector,
  addTrack as addTrackToPlaylist,
} from 'modules/playlist/redux'
import { RootState } from 'store/types'
import { useHistory } from 'react-router'
import { search, setSearchFilter } from '../../browser/redux'

interface MenuItemEventHandlerTrack extends MenuItemEventHandler {
  props: {
    position: number
    track: Track
  }
}

const QueueItemContextMenu: FunctionComponent = () => {
  const playlists: Playlist[] = useSelector((state: RootState) => playlistsSelector(state))
  const dispatch = useDispatch()
  const history = useHistory()

  const findAllByArtist = (menuItem: any) => {
    dispatch(setSearchFilter('artist'))
    dispatch(search(menuItem.props.track?.artist?.name))
    history.push('/library')
  }

  const findAllByAlbum = (menuItem: any) => {
    dispatch(setSearchFilter('album'))
    dispatch(search(menuItem.props.track?.album?.title))
    history.push('/library')
  }

  const handlePlayTrack = (position: number) => {
    dispatch(setItemFromQueue(position))
    dispatch(playerTogglePlayPause(true))
  }

  const handleAddTrackToPlaylist = (
    menuItem: MenuItemEventHandlerTrack,
    playlist: Playlist
  ) => {
    dispatch(
      addTrackToPlaylist({
        playlistId: playlist.id,
        trackId: menuItem.props?.track?.id,
      })
    )
  }

  const playlistsItems = playlists.map((item: Playlist) => (
    <Item
      key={item.id}
      // @ts-ignore
      onClick={(menuItem: MenuItemEventHandlerTrack) => handleAddTrackToPlaylist(menuItem, item)}
    >
      {item.title}
    </Item>
  ))

  return (
    <ContextMenu id="queue-item-context-menu">
      <Item
        // @ts-ignore
        onClick={(menuItem: MenuItemEventHandlerTrack) => handlePlayTrack(menuItem.props?.position - 1)}
      >
        Play track
      </Item>
      <Item
        // @ts-ignore
        onClick={(menuItem: MenuItemEventHandlerTrack) => dispatch(queueRemoveTrack(menuItem.props?.position - 1))}
      >
        Remove track from queue
      </Item>
      <Separator />
      <Submenu label="Add to playlist...">{playlistsItems}</Submenu>
      <Separator />
      <Item onClick={(menuItem: any) => findAllByArtist(menuItem)}>
        Find all by the artist
      </Item>
      <Item onClick={(menuItem: any) => findAllByAlbum(menuItem)}>
        Find all on album
      </Item>
    </ContextMenu>
  )
}

export default QueueItemContextMenu
