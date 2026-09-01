import { useGetCollectionsQuery } from 'modules/collections/services/api'
import {
  useAddAlbumDiscToPlaylist,
  useAddAlbumToPlaylist,
  useAddArtistToPlaylist,
  useAddTrackToPlaylist,
} from 'modules/collections/services/services'
import { notify } from 'common/utils/notifications'
import { useTranslation } from 'react-i18next'

type DiscItem = { albumId: string; disc: string }

export default function useAddToPlaylistsContextualAction<
  T = ContextualActionItem,
>(
  type:
    | 'artist'
    | 'album'
    | 'track'
    | 'playlist'
    | 'playlistItem'
    | 'queueItem'
    | 'disc'
): ContextualActionsItem<T> {
  const { t } = useTranslation()
  const { data: { playlists = [] } = {} } = useGetCollectionsQuery()

  const addArtistToPlaylist = useAddArtistToPlaylist()
  const addAlbumToPlaylist = useAddAlbumToPlaylist()
  const addTrackToPlaylist = useAddTrackToPlaylist()
  const addAlbumDiscToPlaylist = useAddAlbumDiscToPlaylist()

  // Selects the correct action to call based on the type of item.
  const getAddItemToPlaylistFunction = (
    playlistId: string | null
  ): ((item: T) => void) => {
    switch (type) {
      case 'artist':
        return (item: T) =>
          addArtistToPlaylist({ playlistId, artistId: (item as Artist).id })
      case 'album':
        return (item: T) =>
          addAlbumToPlaylist({ playlistId, albumId: (item as Album).id })
      case 'track':
        return (item: T) =>
          addTrackToPlaylist({ playlistId, trackId: (item as Track).id })
      case 'playlistItem':
        return (item: T) =>
          addTrackToPlaylist({
            playlistId,
            trackId: (item as PlaylistItem).track.id,
          })
      case 'queueItem':
        return (item: T) =>
          addTrackToPlaylist({
            playlistId,
            trackId: (item as QueueItemDisplay).track.id,
          })
      case 'disc':
        return (item: T) =>
          addAlbumDiscToPlaylist({
            playlistId,
            albumId: (item as unknown as DiscItem).albumId,
            disc: (item as unknown as DiscItem).disc,
          })
      default:
        return () => null
    }
  }

  const getItemName = (item: T): string => {
    switch (type) {
      case 'artist':
        return (item as Artist).name
      case 'album':
        return (item as Album).title
      case 'track':
        return (item as Track).title
      case 'playlistItem':
        return (item as PlaylistItem).track.title
      case 'queueItem':
        return (item as QueueItemDisplay).track.title
      case 'disc':
        return t('browser.album.disc', {
          disc: (item as unknown as DiscItem).disc,
        })
      default:
        return ''
    }
  }

  const handleAddItemToPlaylist = (
    playlistId: string | null,
    playlistName: string | null,
    item: T
  ) => {
    const addItemToPlaylist = getAddItemToPlaylistFunction(playlistId)
    addItemToPlaylist(item)
    const itemName = getItemName(item)
    if (playlistName) {
      notify(
        t('notifications.addedToPlaylist', { itemName, playlistName })
      )
    } else {
      notify(t('notifications.addedToNewPlaylist', { itemName }))
    }
  }

  return {
    id: `${type}-add-to-playlist`,
    type: 'subMenu',
    label: t('collections.playlists.actions.addToPlaylist'),
    subActions: [
      ...playlists.map((playlist: Playlist) => ({
        id: playlist.id,
        type: 'item' as ContextualActionsItem['type'],
        label: playlist.title,
        action: (item: T) =>
          handleAddItemToPlaylist(playlist.id, playlist.title, item),
      })),
      {
        id: 'create-new-playlist',
        type: 'item' as ContextualActionsItem['type'],
        label: t('collections.playlists.actions.createNewPlaylist'),
        action: (item: T) => handleAddItemToPlaylist(null, null, item),
      },
    ],
  }
}
