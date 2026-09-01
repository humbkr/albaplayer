import { useTranslation } from 'react-i18next'
import {
  useAddArtist,
  usePlayArtist,
  usePlayArtistAfterCurrent,
} from 'modules/browser/services'
import { notify } from 'common/utils/notifications'
import useAddToPlaylistsContextualAction from 'modules/collections/hooks/useAddToPlaylistsContextualAction'

export default function useArtistContextualActions(): ContextualActionsItem<Artist>[] {
  const { t } = useTranslation()

  const playArtist = usePlayArtist()
  const playArtistAfterCurrent = usePlayArtistAfterCurrent()
  const addArtist = useAddArtist()

  const handlePlayItem: ContextualAction<Artist> = ({ id, name }) => {
    playArtist(id)
    notify(t('notifications.nowPlaying', { itemName: name }))
  }
  const handlePlayItemAfterCurrent: ContextualAction<Artist> = ({ id, name }) => {
    playArtistAfterCurrent(id)
    notify(t('notifications.playingNext', { itemName: name }))
  }
  const handleAddItem: ContextualAction<Artist> = ({ id, name }) => {
    addArtist(id)
    notify(t('notifications.addedToQueue', { itemName: name }))
  }

  return [
    {
      id: 'artist-play-now',
      type: 'item',
      label: t('player.actions.playNow'),
      action: handlePlayItem,
    },
    {
      id: 'artist-play-after',
      type: 'item',
      label: t('player.actions.playAfter'),
      action: handlePlayItemAfterCurrent,
    },
    {
      id: 'artist-play-last',
      type: 'item',
      label: t('player.actions.addToQueue'),
      action: handleAddItem,
    },
    {
      type: 'separator',
    },
    useAddToPlaylistsContextualAction<Artist>('artist'),
  ]
}
