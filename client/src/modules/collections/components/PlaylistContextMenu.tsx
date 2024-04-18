import { Item, Menu as ContextMenu, Separator, Submenu } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import { useTranslation } from 'react-i18next'
import { useAddPlaylistToPlaylist } from 'modules/collections/services/services'
import { useGetCollectionsQuery } from 'modules/collections/services/api'
import {
  useAddPlaylist,
  usePlayPlaylist,
  usePlayPlaylistAfterCurrent,
} from 'modules/player/services'
import { EditPlaylistContext } from '../scenes/Playlists'

function PlaylistContextMenu() {
  const { t } = useTranslation()
  const addPlaylistToPlaylist = useAddPlaylistToPlaylist()
  const playPlaylist = usePlayPlaylist()
  const playPlaylistAfterCurrent = usePlayPlaylistAfterCurrent()
  const addPlaylist = useAddPlaylist()

  const { data: { playlists = [] } = {} } = useGetCollectionsQuery()

  // @ts-ignore
  const playlistsItems = playlists.map((item: Playlist) => (
    <Item
      key={item.id}
      onClick={(menuItem: any) =>
        addPlaylistToPlaylist({
          playlistId: item.id,
          playlistToAddId: menuItem.props.data.id,
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
        addPlaylistToPlaylist({ playlistToAddId: menuItem.props.data.id })
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
            onClick={(menuItem: any) => playPlaylist(menuItem.props.data.id)}
          >
            {t('player.actions.playNow')}
          </Item>
          <Item
            onClick={(menuItem: any) =>
              playPlaylistAfterCurrent(menuItem.props.data.id)
            }
          >
            {t('player.actions.playAfter')}
          </Item>
          <Item
            onClick={(menuItem: any) => addPlaylist(menuItem.props.data.id)}
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
