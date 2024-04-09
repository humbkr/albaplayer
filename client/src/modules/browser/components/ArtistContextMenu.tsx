import { Item, Menu as ContextMenu, Separator, Submenu } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import { useTranslation } from 'react-i18next'
import { useGetCollectionsQuery } from 'modules/collections/services/api'
import { useAddArtistToPlaylist } from 'modules/collections/services/services'
import {
  useAddArtist,
  usePlayArtist,
  usePlayArtistAfterCurrent,
} from 'modules/browser/services'

function ArtistContextMenu() {
  const { t } = useTranslation()

  const { data: { playlists = [] } = {} } = useGetCollectionsQuery()
  const addArtistToPlaylist = useAddArtistToPlaylist()
  const playArtist = usePlayArtist()
  const playArtistAfterCurrent = usePlayArtistAfterCurrent()
  const addArtist = useAddArtist()

  const playNow = (menuItem: any) => {
    playArtist(menuItem.props.data.id)
  }
  const playAfter = (menuItem: any) => {
    playArtistAfterCurrent(menuItem.props.data.id)
  }
  const playLast = (menuItem: any) => {
    addArtist(menuItem.props.data.id)
  }

  const playlistsItems = playlists.map((item: Playlist) => (
    <Item
      key={item.id}
      onClick={(menuItem: any) =>
        addArtistToPlaylist({
          playlistId: item.id,
          artistId: menuItem.props.data.id,
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
        addArtistToPlaylist({ artistId: menuItem.props.data.id })
      }
    >
      {t('playlists.actions.createNewPlaylist')}
    </Item>
  )

  return (
    <ContextMenu id="artist-context-menu">
      <Item onClick={playNow}>{t('player.actions.playNow')}</Item>
      <Item onClick={playAfter}>{t('player.actions.playAfter')}</Item>
      <Item onClick={playLast}>{t('player.actions.addToQueue')}</Item>
      <Separator />
      <Submenu label={t('playlists.actions.addToPlaylist')}>
        {playlistsItems}
      </Submenu>
    </ContextMenu>
  )
}

export default ArtistContextMenu
