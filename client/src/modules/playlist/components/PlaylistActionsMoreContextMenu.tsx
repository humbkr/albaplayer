import { Item, Menu as ContextMenu, Separator, Submenu } from 'react-contexify'
import { MenuItemEventHandler } from 'react-contexify/lib/types'
import 'react-contexify/dist/ReactContexify.min.css'
import {
  addPlaylist as addPlaylistToPlaylist,
  playlistChangePane,
  playlistDeletePlaylist,
  PlaylistPane,
  playlistsSelector,
} from 'modules/playlist/store'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { playPlaylistAfterCurrent } from 'modules/player/store/store'
import { useTranslation } from 'react-i18next'
import { EditPlaylistContext } from '../scenes/Playlists'

interface MenuItemEventHandlerPlaylist extends MenuItemEventHandler {
  props: {
    playlist: Playlist
  }
}

function PlaylistActionsMoreContextMenu() {
  const { t } = useTranslation()

  const playlists = useAppSelector((state) => playlistsSelector(state))

  const dispatch = useAppDispatch()

  const playlistsItems = playlists.map((item) => (
    <Item
      key={item.id}
      onClick={(menuItem: any) =>
        dispatch(
          addPlaylistToPlaylist({
            playlistId: item.id,
            playlistToAddId: menuItem.props.playlist.id,
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
          addPlaylistToPlaylist({ playlistToAddId: menuItem.props.playlist.id })
        )
      }
    >
      {t('playlists.actions.duplicatePlaylist')}
    </Item>
  )

  return (
    <EditPlaylistContext.Consumer>
      {(value: any) => (
        <ContextMenu id="playlist-actions-more-menu">
          <Item
            onClick={(menuItem: any) =>
              dispatch(playPlaylistAfterCurrent(menuItem.props.playlist.id))
            }
          >
            {t('player.actions.playAfter')}
          </Item>
          <Separator />
          <Submenu label={t('playlists.actions.addToPlaylist')}>
            {playlistsItems}
          </Submenu>
          <Separator />
          <Item onClick={() => value('edit')}>
            {t('playlists.actions.editPlaylist')}
          </Item>
          <Item
            // @ts-ignore
            onClick={(menuItem: MenuItemEventHandlerPlaylist) => {
              if (
                // eslint-disable-next-line no-alert
                window.confirm(t('playlists.deleteConfirm'))
              ) {
                dispatch(playlistDeletePlaylist(menuItem.props.playlist))
              }
            }}
          >
            {t('playlists.actions.deletePlaylist')}
          </Item>
          <Separator />
          <Item onClick={() => dispatch(playlistChangePane(PlaylistPane.Fix))}>
            {t('playlists.care.fixDeadTracks')}
          </Item>
        </ContextMenu>
      )}
    </EditPlaylistContext.Consumer>
  )
}

export default PlaylistActionsMoreContextMenu
