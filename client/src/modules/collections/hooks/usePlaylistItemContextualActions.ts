import { useTranslation } from 'react-i18next'
import {
  useGetCurrentPlaylist,
  useRemoveTrackFromPlaylist,
} from 'modules/collections/services/services'
import {
  useAddTrack,
  useFindAllByArtist,
  useFindAllOnAlbum,
  usePlayTrack,
  usePlayTrackAfterCurrent,
} from 'modules/browser/services'
import { notify } from 'common/utils/notifications'
import useAddToPlaylistsContextualAction from 'modules/collections/hooks/useAddToPlaylistsContextualAction'

export default function usePlaylistItemContextualActions(): ContextualActionsItem<PlaylistItem>[] {
  const { t } = useTranslation()

  const playlist = useGetCurrentPlaylist()

  const playTrack = usePlayTrack()
  const playTrackAfterCurrent = usePlayTrackAfterCurrent()
  const addTrack = useAddTrack()
  const findAllByArtist = useFindAllByArtist()
  const findAllOnAlbum = useFindAllOnAlbum()
  const removeTrackFromPlaylist = useRemoveTrackFromPlaylist()

  const handlePlayItem: ContextualAction<PlaylistItem> = ({ track }) => {
    playTrack(track.id)
    notify(t('notifications.nowPlaying', { itemName: track.title }))
  }
  const handlePlayItemAfterCurrent: ContextualAction<PlaylistItem> = ({
    track,
  }) => {
    playTrackAfterCurrent(track.id)
    notify(t('notifications.playingNext', { itemName: track.title }))
  }
  const handleAddItem: ContextualAction<PlaylistItem> = ({ track }) => {
    addTrack(track.id)
    notify(t('notifications.addedToQueue', { itemName: track.title }))
  }
  const handleFindAllByArtist: ContextualAction<PlaylistItem> = ({ track }) => {
    findAllByArtist(track.artist?.id as string)
  }
  const handleFindAllOnAlbum: ContextualAction<PlaylistItem> = ({ track }) => {
    findAllOnAlbum(track.album?.id as string)
  }
  const handleRemoveFromPlaylist: ContextualAction<PlaylistItem> = ({
    position,
    track,
  }) => {
    if (playlist) {
      removeTrackFromPlaylist(position, playlist.id)
      notify(t('notifications.removedFromPlaylist', { itemName: track.title }))
    }
  }

  return [
    {
      id: 'track-play-now',
      type: 'item',
      label: t('player.actions.playNow'),
      action: handlePlayItem,
    },
    {
      id: 'track-play-after',
      type: 'item',
      label: t('player.actions.playAfter'),
      action: handlePlayItemAfterCurrent,
    },
    {
      id: 'track-play-last',
      type: 'item',
      label: t('player.actions.addToQueue'),
      action: handleAddItem,
    },
    {
      type: 'separator',
    },
    useAddToPlaylistsContextualAction<PlaylistItem>('playlistItem'),
    { type: 'separator' },
    {
      id: 'track-find-all-by-artist',
      type: 'item',
      label: t('browser.actions.findAllByArtist'),
      action: handleFindAllByArtist,
    },
    {
      id: 'track-find-all-on-album',
      type: 'item',
      label: t('browser.actions.findAllOnAlbum'),
      action: handleFindAllOnAlbum,
    },
    {
      type: 'separator' as ContextualActionsItem['type'],
    },
    {
      id: 'remove-from-playlist',
      type: 'item' as ContextualActionsItem['type'],
      label: t('collections.playlists.actions.removeFromPlaylist'),
      action: handleRemoveFromPlaylist,
    },
  ]
}
