import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod/dist/zod'
import { z } from 'zod'
import i18n from 'i18n/i18n'
import { useState } from 'react'
import TextField from 'common/components/forms/TextField'
import ActionButton from 'common/components/buttons/ActionButton'
import {
  useGetUserQuery,
  UserToUpdate,
  useUpdateUserMutation,
} from 'modules/user/store/api'
import SettingsTabContent from 'modules/settings/components/SettingsTabContent'
import { notify } from 'common/utils/notifications'
import { USER_MIN_PASSWORD_LENGTH } from 'modules/user/constants'

type FormData = {
  username: string
  currentPassword: string
  newPassword: string
}

const schema = z
  .object({
    username: z.string().trim().min(1, i18n.t('common.forms.requiredField')),
    currentPassword: z.string(),
    newPassword: z
      .string()
      .min(
        USER_MIN_PASSWORD_LENGTH,
        i18n.t('user.profile.errors.passwordMinLength', {
          count: USER_MIN_PASSWORD_LENGTH,
        })
      )
      .optional(),
  })
  .refine((data) => !(data.newPassword && !data.currentPassword), {
    message: i18n.t('common.forms.requiredField'),
    path: ['currentPassword'],
  })
  .refine((data) => !/\s/g.test(data.username), {
    message: i18n.t('user.profile.errors.noWhitespace'),
    path: ['username'],
  })

function ProfileSettingsForm() {
  const { t } = useTranslation()

  const [changePassword, setChangePassword] = useState(false)

  const { data: user } = useGetUserQuery()
  const [updateUser, { isLoading }] = useUpdateUserMutation()

  const onSubmit = async (data: FormData) => {
    if (user) {
      const updatedUser: UserToUpdate = {
        ...user,
        name: data.username.trim(),
      }

      if (changePassword) {
        updatedUser.currentPassword = data.currentPassword
        updatedUser.newPassword = data.newPassword
      }

      const response = await updateUser(updatedUser)

      if ('error' in response) {
        // TODO handle username taken error
        if (response.error.errorCode === 'invalid_current_password') {
          setError('currentPassword', {
            message: t('user.profile.errors.currentPassword'),
          })
        } else {
          notify(t('common.errors.unknown'), 'error')
        }
      } else {
        notify(t('user.profile.profileUpdated'), 'success')
      }
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user?.name,
    },
  })

  return (
    <SettingsTabContent data-testid="settings-theme">
      <ProfileForm onSubmit={handleSubmit(onSubmit)}>
        <Info>
          <label>{t('user.profile.roles')}:</label>
          <p>{user?.roles.map((role) => role).join(', ')}</p>
        </Info>
        <TextField
          name="username"
          label={t('user.profile.username')}
          required
          register={register}
          error={errors.username?.message}
          autoComplete="off"
        />
        <ChangePasswordButton
          type="button"
          onClick={() => setChangePassword(!changePassword)}
        >
          {changePassword
            ? t('user.profile.keepPassword')
            : t('user.profile.changePassword')}
        </ChangePasswordButton>
        {changePassword && (
          <>
            <TextField
              type="password"
              name="currentPassword"
              label={t('user.profile.currentPassword')}
              register={register}
              error={errors.currentPassword?.message}
            />
            <TextField
              type="password"
              name="newPassword"
              label={t('user.profile.newPassword')}
              register={register}
              error={errors.newPassword?.message}
            />
          </>
        )}

        <Actions>
          <ActionButton raised type="submit" loading={isLoading}>
            {t('user.profile.submit')}
          </ActionButton>
        </Actions>
      </ProfileForm>
    </SettingsTabContent>
  )
}

export default ProfileSettingsForm

const ProfileForm = styled.form`
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
const Info = styled.div`
  display: flex;
  font-size: 0.9rem;
  gap: 10px;

  label {
    margin-bottom: 3px;
    font-size: 0.9rem;
  }
`
const ChangePasswordButton = styled.button`
  background: none;
  border: 0;
  text-align: left;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: bold;
  cursor: pointer;

  :hover {
    color: ${({ theme }) => theme.colors.elementHighlightFocus};
  }
`
const Actions = styled.div`
  margin-top: 20px;
`
