import React from 'react'
import { Menu as ContextMenu, Item, Submenu, Separator } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import {
  addAlbum,
  playAlbum,
  playAlbumAfterCurrent,
} from 'modules/player/store'
import {
  playlistsSelector,
  addAlbum as addAlbumToPlaylist,
} from 'modules/playlist/store'
import { useAppDispatch, useAppSelector } from 'store/hooks'

const ConditionalItem: React.FC<any> = ({ children, ...props }) => {
  if (!props.propsFromTrigger.displayAllActions) {
    return null
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Item {...props}>{children}</Item>
}

const AlbumMoreActionsContextMenu: React.FC<{
  menuId: string
  onHidden: () => void
}> = ({ menuId, onHidden }) => {
  const playlists = useAppSelector((state) => playlistsSelector(state))
  const dispatch = useAppDispatch()

  const playlistsItems = playlists.map((item) => (
    <Item
      key={item.id}
      onClick={(menuItem: any) =>
        dispatch(
          addAlbumToPlaylist({
            playlistId: item.id,
            albumId: menuItem.props.album.id,
          })
        )
      }
    >
      {item.title}
    </Item>
  ))
  playlistsItems.push(
    <Item
      key="new"
      onClick={(menuItem: any) =>
        dispatch(addAlbumToPlaylist({ albumId: menuItem.props.album.id }))
      }
    >
      + Create new playlist
    </Item>
  )

  return (
    <ContextMenu id={menuId} onHidden={onHidden}>
      <ConditionalItem
        onClick={(menuItem: any) =>
          dispatch(playAlbum(menuItem.props.album.id))
        }
      >
        Play now
      </ConditionalItem>
      <Item
        onClick={(menuItem: any) =>
          dispatch(playAlbumAfterCurrent(menuItem.props.album.id))
        }
      >
        Play after current track
      </Item>
      <Item
        onClick={(menuItem: any) => dispatch(addAlbum(menuItem.props.album.id))}
      >
        Add to queue
      </Item>
      <Separator />
      <Submenu label="Add to playlist...">{playlistsItems}</Submenu>
    </ContextMenu>
  )
}

export default AlbumMoreActionsContextMenu
