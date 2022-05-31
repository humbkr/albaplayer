import React from 'react'
import { Menu as ContextMenu, Item, Separator, Submenu } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import {
  setItemFromQueue,
  playerTogglePlayPause,
  queueRemoveTrack,
} from 'modules/player/store'
import {
  playlistsSelector,
  addTrack as addTrackToPlaylist,
} from 'modules/playlist/store'
import { useHistory } from 'react-router'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { search, setSearchFilter } from '../../browser/store'

const QueueItemContextMenu = () => {
  const playlists: Playlist[] = useAppSelector((state) =>
    playlistsSelector(state)
  )
  const dispatch = useAppDispatch()
  const history = useHistory()

  const findAllByArtist = (menuItem: any) => {
    dispatch(setSearchFilter('artist'))
    dispatch(search(menuItem.props.data.track?.artist?.name))
    history.push('/library')
  }

  const findAllByAlbum = (menuItem: any) => {
    dispatch(setSearchFilter('album'))
    dispatch(search(menuItem.props.data.track?.album?.title))
    history.push('/library')
  }

  const handlePlayTrack = (position: number) => {
    dispatch(setItemFromQueue(position))
    dispatch(playerTogglePlayPause(true))
  }

  const handleAddTrackToPlaylist = (
    menuItem: any,
    playlist: Playlist
  ) => {
    dispatch(
      addTrackToPlaylist({
        playlistId: playlist.id,
        trackId: menuItem.props.data.track?.id,
      })
    )
  }

  const playlistsItems = playlists.map((item: Playlist) => (
    <Item
      key={item.id}
      // @ts-ignore
      onClick={(menuItem) =>
        handleAddTrackToPlaylist(menuItem, item)
      }
    >
      {item.title}
    </Item>
  ))
  playlistsItems.push(
    <Item
      key="new"
      onClick={(menuItem: any) =>
        dispatch(addTrackToPlaylist({ trackId: menuItem.props.data.track.id }))
      }
    >
      + Create new playlist
    </Item>
  )

  return (
    <ContextMenu id="queue-item-context-menu">
      <Item
        // @ts-ignore
        onClick={(menuItem: any) =>
          handlePlayTrack(menuItem.props.data.position - 1)
        }
      >
        Play track
      </Item>
      <Item
        // @ts-ignore
        onClick={(menuItem: any) =>
          dispatch(queueRemoveTrack(menuItem.props.data.position - 1))
        }
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
