import { Item, Menu as ContextMenu, Separator, Submenu } from 'react-contexify'
import { MenuItemEventHandler } from 'react-contexify/lib/types'
import 'react-contexify/dist/ReactContexify.min.css'
import { PLAYLIST_PANE, playlistChangePane } from 'modules/collections/store'
import { useAppDispatch } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import { useAddPlaylistToPlaylist, useDeletePlaylist } from 'modules/collections/services/services'
import { useGetCollectionsQuery } from 'modules/collections/services/api'
import { usePlayPlaylistAfterCurrent } from 'modules/player/services'
import { EditPlaylistContext } from '../scenes/Playlists'

interface MenuItemEventHandlerPlaylist extends MenuItemEventHandler {
  props: {
    playlist: Playlist
  }
}

function PlaylistActionsMoreContextMenu() {
  const { t } = useTranslation()

  const { data: { playlists = [] } = {} } = useGetCollectionsQuery()
  const addPlaylistToPlaylist = useAddPlaylistToPlaylist()
  const deletePlaylist = useDeletePlaylist()
  const playPlaylistAfterCurrent = usePlayPlaylistAfterCurrent()
  const dispatch = useAppDispatch()

  const playlistsItems = playlists.map((item) => (
    <Item
      key={item.id}
      onClick={(menuItem: any) =>
        addPlaylistToPlaylist({
          playlistId: item.id,
          playlistToAddId: menuItem.props.playlist.id,
        })
      }
    >
      {item.title}
    </Item>
  ))
  playlistsItems.push(
    <Item
      key="new"
      onClick={(menuItem: any) =>
        addPlaylistToPlaylist({ playlistToAddId: menuItem.props.playlist.id })
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
              playPlaylistAfterCurrent(menuItem.props.playlist.id)
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
                deletePlaylist(menuItem.props.playlist.id)
              }
            }}
          >
            {t('playlists.actions.deletePlaylist')}
          </Item>
          <Separator />
          <Item onClick={() => dispatch(playlistChangePane(PLAYLIST_PANE.fix))}>
            {t('playlists.care.fixDeadTracks')}
          </Item>
        </ContextMenu>
      )}
    </EditPlaylistContext.Consumer>
  )
}

export default PlaylistActionsMoreContextMenu
