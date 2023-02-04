import { Item, Menu as ContextMenu, Separator, Submenu } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import {
  addPlaylist,
  playPlaylist,
  playPlaylistAfterCurrent,
} from 'modules/player/store/store'
import { addPlaylist as addPlaylistToPlaylist } from 'modules/playlist/store'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import { EditPlaylistContext } from '../scenes/Playlists'

function PlaylistContextMenu() {
  const { t } = useTranslation()

  const playlists = useAppSelector((state) =>
    Object.values(state.playlist.playlists)
  )
  const dispatch = useAppDispatch()

  // @ts-ignore
  const playlistsItems = playlists.map((item: Playlist) => (
    <Item
      key={item.id}
      onClick={(menuItem: any) =>
        dispatch(
          addPlaylistToPlaylist({
            playlistId: item.id,
            playlistToAddId: menuItem.props.data.id,
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
        dispatch(
          addPlaylistToPlaylist({ playlistToAddId: menuItem.props.data.id })
        )
      }
    >
      {t('playlists.actions.duplicatePlaylist')}
    </Item>
  )

  return (
    <EditPlaylistContext.Consumer>
      {(value: () => void) => (
        <ContextMenu id="playlist-context-menu">
          <Item
            onClick={(menuItem: any) =>
              dispatch(playPlaylist(menuItem.props.data.id))
            }
          >
            {t('player.actions.playNow')}
          </Item>
          <Item
            onClick={(menuItem: any) =>
              dispatch(playPlaylistAfterCurrent(menuItem.props.data.id))
            }
          >
            {t('player.actions.playAfter')}
          </Item>
          <Item
            onClick={(menuItem: any) =>
              dispatch(addPlaylist(menuItem.props.data.id))
            }
          >
            {t('player.actions.addToQueue')}
          </Item>
          <Separator />
          <Submenu label={t('playlists.actions.addToPlaylist')}>
            {playlistsItems}
          </Submenu>
          <Separator />
          <Item onClick={value}>{t('playlists.actions.editPlaylist')}</Item>
        </ContextMenu>
      )}
    </EditPlaylistContext.Consumer>
  )
}

export default PlaylistContextMenu
