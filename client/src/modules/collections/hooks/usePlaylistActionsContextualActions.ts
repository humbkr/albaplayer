import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'store/hooks'
import { PLAYLIST_PANE, playlistChangePane } from 'modules/collections/store'
import {
  useAddPlaylistToPlaylist,
  useDeletePlaylist,
  usePlayPlaylistAfterCurrent,
} from 'modules/collections/services/services'
import { useGetCollectionsQuery } from 'modules/collections/services/api'
import { notify } from 'common/utils/notifications'
import { EditPlaylistContext } from 'modules/collections/PlaylistEditContext'

export default function usePlaylistActionsContextualActions(): ContextualActionsItem<Playlist>[] {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const { data: { playlists = [] } = {} } = useGetCollectionsQuery()
  const addPlaylistToPlaylist = useAddPlaylistToPlaylist()
  const deletePlaylist = useDeletePlaylist()
  const playPlaylistAfterCurrent = usePlayPlaylistAfterCurrent()
  const handleEditPlaylist = useContext(EditPlaylistContext)

  const handlePlayAfter: ContextualAction<Playlist> = ({ id, title }) => {
    playPlaylistAfterCurrent(id)
    notify(t('notifications.playingNext', { itemName: title }))
  }

  const handleDelete: ContextualAction<Playlist> = ({ id }) => {
    if (window.confirm(t('collections.playlists.deleteConfirm'))) {
      deletePlaylist(id)
      notify(t('notifications.playlistDeleted'))
    }
  }

  return [
    {
      id: 'playlist-actions-play-after',
      type: 'item',
      label: t('player.actions.playAfter'),
      action: handlePlayAfter,
    },
    { type: 'separator' },
    {
      id: 'playlist-actions-add-to-playlist',
      type: 'subMenu',
      label: t('collections.playlists.actions.addToPlaylist'),
      subActions: [
        ...playlists.map((playlist: Playlist) => ({
          id: playlist.id,
          type: 'item' as ContextualActionsItem['type'],
          label: playlist.title,
          action: (item: Playlist) => {
            addPlaylistToPlaylist({
              playlistId: playlist.id,
              playlistToAddId: item.id,
            })
            notify(
              t('notifications.addedToPlaylist', {
                itemName: item.title,
                playlistName: playlist.title,
              })
            )
          },
        })),
        {
          id: 'duplicate-playlist',
          type: 'item' as ContextualActionsItem['type'],
          label: t('collections.playlists.actions.duplicatePlaylist'),
          action: (item: Playlist) => {
            addPlaylistToPlaylist({
              playlistId: null,
              playlistToAddId: item.id,
            })
            notify(t('notifications.playlistDuplicated'))
          },
        },
      ],
    },
    { type: 'separator' },
    {
      id: 'playlist-actions-edit',
      type: 'item',
      label: t('collections.playlists.actions.editPlaylist'),
      action: () => handleEditPlaylist(),
    },
    {
      id: 'playlist-actions-delete',
      type: 'item',
      label: t('collections.playlists.actions.deletePlaylist'),
      action: handleDelete,
    },
    { type: 'separator' },
    {
      id: 'playlist-actions-fix',
      type: 'item',
      label: t('collections.playlists.care.fixDeadTracks'),
      action: () => dispatch(playlistChangePane(PLAYLIST_PANE.fix)),
    },
  ]
}
