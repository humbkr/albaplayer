import { useTranslation } from 'react-i18next'
import {
  useAddTrack,
  useFindAllByArtist,
  useFindAllOnAlbum,
  usePlayTrack,
  usePlayTrackAfterCurrent,
} from 'modules/browser/services'
import { notify } from 'common/utils/notifications'
import useAddToPlaylistsContextualAction from 'modules/collections/hooks/useAddToPlaylistsContextualAction'

export default function useTrackContextualActions(): ContextualActionsItem<Track>[] {
  const { t } = useTranslation()

  const playTrack = usePlayTrack()
  const playTrackAfterCurrent = usePlayTrackAfterCurrent()
  const addTrack = useAddTrack()
  const findAllByArtist = useFindAllByArtist()
  const findAllOnAlbum = useFindAllOnAlbum()

  const handlePlayItem: ContextualAction<Track> = ({ id, title }) => {
    playTrack(id)
    notify(t('notifications.nowPlaying', { itemName: title }))
  }
  const handlePlayItemAfterCurrent: ContextualAction<Track> = ({ id, title }) => {
    playTrackAfterCurrent(id)
    notify(t('notifications.playingNext', { itemName: title }))
  }
  const handleAddItem: ContextualAction<Track> = ({ id, title }) => {
    addTrack(id)
    notify(t('notifications.addedToQueue', { itemName: title }))
  }
  const handleFindAllByArtist: ContextualAction<Track> = ({ artist }) => {
    findAllByArtist(artist?.id as string)
  }
  const handleFindAllOnAlbum: ContextualAction<Track> = ({ album }) => {
    findAllOnAlbum(album?.id as string)
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
    useAddToPlaylistsContextualAction<Track>('track'),
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
  ]
}
