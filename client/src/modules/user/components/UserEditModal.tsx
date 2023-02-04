import Modal from 'common/components/layout/Modal'
import UserEditForm, {
  UserEditFormData,
} from 'modules/user/components/UserEditForm'
import { useTranslation } from 'react-i18next'
import {
  useCreateUserMutation,
  UserToUpdate,
  useUpdateUserMutation,
} from 'modules/user/store/api'
import { notify } from 'common/utils/notifications'
import { useRef } from 'react'
import { USER_ROLE_LISTENER } from 'modules/user/constants'

type Props = {
  user?: User
  isOpen: boolean
  onClose: () => void
}

function UserEditModal({ user, isOpen, onClose }: Props) {
  const { t } = useTranslation()

  const [createUser, { isLoading: isLoadingCreate }] = useCreateUserMutation()
  const [updateUser, { isLoading: isLoadingUpdate }] = useUpdateUserMutation()

  const formRef = useRef<HTMLFormElement | null>(null)

  const onValidate = () => {
    formRef.current?.dispatchEvent(
      new Event('submit', { cancelable: true, bubbles: true })
    )
  }

  const onSubmit = async (data: UserEditFormData) => {
    let response

    const roles = data.roles.map((role) => role.replace(`role_`, '') as Role)
    // Everyone has the "listener" role.
    roles.push(USER_ROLE_LISTENER)

    if (user) {
      const updatedUser: UserToUpdate = {
        ...user,
        name: data.username.trim(),
        roles,
      }

      if (data.newPassword) {
        updatedUser.newPassword = data.newPassword
      }

      response = await updateUser(updatedUser)
    } else {
      response = await createUser({
        name: data.username.trim(),
        newPassword: data.newPassword,
        roles,
      })
    }

    if ('error' in response) {
      // TODO handle username taken error
      notify(t('common.errors.unknown'), 'error')
    } else {
      notify(
        user
          ? t('user.usersManagement.userUpdated')
          : t('user.usersManagement.userCreated'),
        'success'
      )
      onClose()
    }
  }

  const title = user
    ? t('user.usersManagement.form.editUser')
    : t('user.usersManagement.form.addUser')
  const actionLabel = user ? t('common.edit') : t('common.create')
  const isLoading = user ? isLoadingUpdate : isLoadingCreate

  return (
    <Modal
      id="user-edit-modal"
      isOpen={isOpen}
      onClose={onClose}
      onValidate={onValidate}
      title={title}
      cancelActionLabel={t('user.usersManagement.form.editUserCancel')}
      mainActionLabel={actionLabel}
      mainActionLoading={isLoading}
    >
      <UserEditForm formRef={formRef} user={user} onSubmit={onSubmit} />
    </Modal>
  )
}

export default UserEditModal
