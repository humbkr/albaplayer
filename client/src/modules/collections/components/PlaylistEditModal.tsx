import Modal from 'common/components/layout/Modal'
import { useTranslation } from 'react-i18next'
import { useRef } from 'react'
import PlaylistEditForm, {
  PlaylistEditFormData,
} from 'modules/collections/components/PlaylistEditForm'
import {
  useCreatePlaylist,
  useGetCurrentPlaylist,
  useUpdatePlaylistInfo,
} from 'modules/collections/services/services'

type Props = {
  addMode: boolean
  isOpen: boolean
  onClose: () => void
}

function PlaylistEditModal({ addMode, isOpen, onClose }: Props) {
  const { t } = useTranslation()
  const createPlaylist = useCreatePlaylist()
  const updateInfo = useUpdatePlaylistInfo()

  const playlist = useGetCurrentPlaylist()

  const formRef = useRef<HTMLFormElement | null>(null)

  const onValidate = () => {
    formRef.current?.dispatchEvent(
      new Event('submit', { cancelable: true, bubbles: true })
    )
  }

  const onSubmit = async (data: PlaylistEditFormData) => {
    if (!addMode && playlist) {
      updateInfo({
        ...playlist,
        title: data.title,
      })
    } else {
      createPlaylist({ title: data.title, tracks: [] })
    }

    onClose()
  }

  const title =
    playlist && !addMode
      ? t('playlists.actions.editPlaylist')
      : t('playlists.actions.createANewPlaylist')
  const actionLabel = playlist ? t('common.edit') : t('common.create')

  return (
    <Modal
      id="playlist-edit-modal"
      isOpen={isOpen}
      onClose={onClose}
      onValidate={onValidate}
      title={title}
      cancelActionLabel={t('playlists.actions.cancel')}
      mainActionLabel={actionLabel}
    >
      <PlaylistEditForm
        formRef={formRef}
        playlist={addMode ? undefined : playlist}
        onSubmit={onSubmit}
      />
    </Modal>
  )
}

export default PlaylistEditModal
