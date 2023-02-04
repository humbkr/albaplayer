import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod/dist/zod'
import { z } from 'zod'
import i18n from 'i18n/i18n'
import React, { useMemo } from 'react'
import TextField from 'common/components/forms/TextField'

export type PlaylistEditFormData = {
  title: string
}

type Props = {
  formRef?: React.RefObject<HTMLFormElement>
  playlist?: Playlist
  onSubmit: (data: PlaylistEditFormData) => void
}

function PlaylistEditForm({ formRef, playlist, onSubmit }: Props) {
  const { t } = useTranslation()

  const schema = useMemo(
    () =>
      z.object({
        title: z.string().min(1, i18n.t('common.forms.requiredField')),
      }),
    []
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlaylistEditFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: playlist?.title,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
      <TextField
        name="title"
        label={t('playlists.form.title')}
        required
        register={register}
        error={errors.title?.message}
        autoFocus
        autoComplete="0"
      />
    </form>
  )
}

export default PlaylistEditForm
