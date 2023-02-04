import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod/dist/zod'
import { z } from 'zod'
import i18n from 'i18n/i18n'
import React, { useMemo } from 'react'
import TextField from 'common/components/forms/TextField'
import Checkboxes from 'common/components/forms/Checkboxes'
import apiConstants from 'api/constants'
import { USER_MIN_PASSWORD_LENGTH } from 'modules/user/constants'

export type UserEditFormData = {
  username: string
  newPassword: string
  roles: string[]
}

type Props = {
  formRef?: React.RefObject<HTMLFormElement>
  user?: User
  onSubmit: (data: UserEditFormData) => void
}

function UserEditForm({ formRef, user, onSubmit }: Props) {
  const { t } = useTranslation()

  const schema = useMemo(
    () =>
      z
        .object({
          username: z.string().min(1, i18n.t('common.forms.requiredField')),
          newPassword: z.string(),
          roles: z.array(z.string()),
        })
        .refine((data) => !/\s/g.test(data.username as string), {
          message: i18n.t('user.profile.errors.noWhitespace'),
          path: ['username'],
        })
        .refine((data) => user || (!user && data.newPassword), {
          message: i18n.t('common.forms.requiredField'),
          path: ['newPassword'],
        })
        .refine(
          (data) =>
            !data.newPassword ||
            (data.newPassword &&
              data.newPassword.length >= USER_MIN_PASSWORD_LENGTH),
          {
            message: i18n.t('user.usersManagement.errors.passwordMinLength', {
              count: USER_MIN_PASSWORD_LENGTH,
            }),
            path: ['newPassword'],
          }
        ),
    [user]
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserEditFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user?.name,
      roles: user?.roles.map((role) => `role_${role}`),
    },
  })

  const roles = [
    {
      label: t('user.roles.owner.label'),
      value: 'role_owner',
      description: t('user.roles.owner.description'),
    },
    {
      label: t('user.roles.admin.label'),
      value: 'role_admin',
      description: t('user.roles.admin.description'),
    },
    {
      label: t('user.roles.listener.label'),
      value: 'role_listener',
      description: t('user.roles.listener.description'),
    },
  ]

  const mandatoryOptions = ['role_listener']
  if (user?.id === apiConstants.USER_OWNER_ID) {
    mandatoryOptions.push('role_owner')
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
      <TextField
        name="username"
        label={t('user.usersManagement.form.username')}
        required
        register={register}
        error={errors.username?.message}
        autoFocus
        autoComplete="0"
      />
      <TextField
        type="password"
        name="newPassword"
        label={
          user
            ? t('user.usersManagement.form.newPassword')
            : t('user.usersManagement.form.password')
        }
        register={register}
        error={errors.newPassword?.message}
        autoComplete="0"
      />
      <Checkboxes
        name="roles"
        label={t('user.usersManagement.form.roles')}
        options={roles}
        mandatoryOptions={mandatoryOptions}
        register={register}
      />
    </Form>
  )
}

export default UserEditForm

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 310px;
`
