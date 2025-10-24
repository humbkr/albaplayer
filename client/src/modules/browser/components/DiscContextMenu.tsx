import { Item, Menu as ContextMenu, Separator, Submenu } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import { useTranslation } from 'react-i18next'
import { useGetCollectionsQuery } from 'modules/collections/services/api'
import { useAddAlbumDiscToPlaylist } from 'modules/collections/services/services'
import {
  useAddAlbumDisc,
  usePlayAlbumDisc,
  usePlayAlbumDiscAfterCurrent,
} from 'modules/browser/services'

export default function DiscContextMenu() {
  const { t } = useTranslation()

  const { data: { playlists = [] } = {} } = useGetCollectionsQuery()
  const addAlbumDiscToPlaylist = useAddAlbumDiscToPlaylist()

  const playAlbumDisc = usePlayAlbumDisc()
  const addAlbumDisc = useAddAlbumDisc()
  const playAlbumDiscAfterCurrent = usePlayAlbumDiscAfterCurrent()

  const playNow = (menuItem: any) => {
    playAlbumDisc(menuItem.props.data.albumId, menuItem.props.data.disc)
  }
  const playAfter = (menuItem: any) => {
    playAlbumDiscAfterCurrent(
      menuItem.props.data.albumId,
      menuItem.props.data.disc
    )
  }
  const playLast = (menuItem: any) => {
    addAlbumDisc(menuItem.props.data.albumId, menuItem.props.data.disc)
  }

  const playlistsItems = playlists.map((item: Playlist) => (
    <Item
      key={item.id}
      onClick={(menuItem: any) =>
        addAlbumDiscToPlaylist({
          playlistId: item.id,
          albumId: menuItem.props.data.albumId,
          disc: menuItem.props.data.disc,
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
        addAlbumDiscToPlaylist({
          albumId: menuItem.props.data.albumId,
          disc: menuItem.props.data.disc,
        })
      }
    >
      {t('collections.playlists.actions.createNewPlaylist')}
    </Item>
  )

  return (
    <ContextMenu id="disc-context-menu">
      <Item onClick={playNow}>{t('player.actions.playNow')}</Item>
      <Item onClick={playAfter}>{t('player.actions.playAfter')}</Item>
      <Item onClick={playLast}>{t('player.actions.addToQueue')}</Item>
      <Separator />
      <Submenu label={t('collections.playlists.actions.addToPlaylist')}>
        {playlistsItems}
      </Submenu>
    </ContextMenu>
  )
}
