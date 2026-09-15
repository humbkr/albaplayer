import { useTranslation } from 'react-i18next'
import {
  useAddPlaylist,
  usePlayPlaylist,
  usePlayPlaylistAfterCurrent,
} from 'modules/collections/services/services'
import { notify } from 'common/utils/notifications'
import useAddToPlaylistsContextualAction from 'modules/collections/hooks/useAddToPlaylistsContextualAction'

export default function usePlaylistContextualActions(): ContextualActionsItem<Playlist>[] {
  const { t } = useTranslation()

  const playPlaylist = usePlayPlaylist()
  const playPlaylistAfterCurrent = usePlayPlaylistAfterCurrent()
  const addPlaylist = useAddPlaylist()

  const handlePlayItem: ContextualAction<Playlist> = ({ id, title }) => {
    playPlaylist(id)
    notify(t('notifications.nowPlaying', { itemName: title }))
  }
  const handlePlayItemAfterCurrent: ContextualAction<Playlist> = ({
    id,
    title,
  }) => {
    playPlaylistAfterCurrent(id)
    notify(t('notifications.playingNext', { itemName: title }))
  }
  const handleAddItem: ContextualAction<Playlist> = ({ id, title }) => {
    addPlaylist(id)
    notify(t('notifications.addedToQueue', { itemName: title }))
  }
  // Const handleEditPlaylist: ContextualAction<Playlist> = ({ track }) => {
  //   findAllByArtist(track.artist?.id as string)
  // }
  // const handleDeletePlaylist: ContextualAction<Playlist> = ({ track }) => {
  //   findAllOnAlbum(track.album?.id as string)
  // }

  return [
    {
      id: 'playlist-play-now',
      type: 'item',
      label: t('player.actions.playNow'),
      action: handlePlayItem,
    },
    {
      id: 'playlist-play-after',
      type: 'item',
      label: t('player.actions.playAfter'),
      action: handlePlayItemAfterCurrent,
    },
    {
      id: 'playlist-play-last',
      type: 'item',
      label: t('player.actions.addToQueue'),
      action: handleAddItem,
    },
    {
      type: 'separator',
    },
    useAddToPlaylistsContextualAction<Playlist>('playlist'),
    {
      type: 'separator',
    },
    // {
    //   id: 'playlist-edit',
    //   type: 'item',
    //   label: t('collections.playlists.actions.editPlaylist'),
    //   action: handleEditPlaylist,
    // },
    // {
    //   id: 'playlist-edit',
    //   type: 'item',
    //   label: t('collections.playlists.actions.editPlaylist'),
    //   action: handleDeletePlaylist,
    // },
  ]
}
