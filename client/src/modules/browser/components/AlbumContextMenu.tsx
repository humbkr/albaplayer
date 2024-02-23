import { Item, Menu as ContextMenu, Separator, Submenu } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import { addAlbum, playAlbum, playAlbumAfterCurrent } from 'modules/player/store/store'
import { useAppDispatch } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import { useGetCollectionsQuery } from 'modules/collections/services/api'
import { useAddAlbumToPlaylist } from 'modules/collections/services/services'
import { search, setSearchFilter } from '../store'

function AlbumContextMenu() {
  const { t } = useTranslation()
  const { data: { playlists = [] } = {} } = useGetCollectionsQuery()
  const addAlbumToPlaylist = useAddAlbumToPlaylist()
  const dispatch = useAppDispatch()

  const findAllByArtist = (menuItem: any) => {
    dispatch(setSearchFilter('artist'))
    dispatch(search(menuItem.props.data.artist?.name))
  }

  const playlistsItems = playlists.map((item: Playlist) => (
    <Item
      key={item.id}
      onClick={(menuItem: any) =>
        addAlbumToPlaylist({
          playlistId: item.id,
          albumId: menuItem.props.data.id,
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
        addAlbumToPlaylist({ albumId: menuItem.props.data.id })
      }
    >
      {t('playlists.actions.createNewPlaylist')}
    </Item>
  )

  return (
    <ContextMenu id="album-context-menu">
      <Item
        onClick={(menuItem: any) => dispatch(playAlbum(menuItem.props.data.id))}
      >
        {t('player.actions.playNow')}
      </Item>
      <Item
        onClick={(menuItem: any) =>
          dispatch(playAlbumAfterCurrent(menuItem.props.data.id))
        }
      >
        {t('player.actions.playAfter')}
      </Item>
      <Item
        onClick={(menuItem: any) => dispatch(addAlbum(menuItem.props.data.id))}
      >
        {t('player.actions.addToQueue')}
      </Item>
      <Separator />
      <Submenu label={t('playlists.actions.addToPlaylist')}>
        {playlistsItems}
      </Submenu>
      <Separator />
      <Item onClick={(menuItem: any) => findAllByArtist(menuItem)}>
        {t('browser.actions.findAllByArtist')}
      </Item>
    </ContextMenu>
  )
}

export default AlbumContextMenu
