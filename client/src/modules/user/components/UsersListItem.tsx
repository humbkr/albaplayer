import styled from 'styled-components'
import dayjs from 'dayjs'
import ActionButtonIcon from 'common/components/buttons/ActionButtonIcon'
import React from 'react'
import { constants } from 'api'
import { useDeleteUserMutation, useGetUserQuery } from 'modules/user/store/api'
import { notify } from 'common/utils/notifications'
import { useTranslation } from 'react-i18next'

type Props = {
  user: User
  onEditAction: (user: User) => void
}

function UsersListItem({ user, onEditAction }: Props) {
  const { t } = useTranslation()

  const { data: currentUser } = useGetUserQuery()
  const [deleteUser] = useDeleteUserMutation()

  const handleDeleteUser = async () => {
    if (window.confirm(t('user.usersManagement.confirmDeleteUser'))) {
      const response = await deleteUser(user.id)
      if ('error' in response) {
        notify(t('common.errors.unknown'), 'error')
      } else {
        notify(t('user.usersManagement.userDeleted'), 'success')
      }
    }
  }

  const canDeleteUser =
    user.id !== constants.USER_OWNER_ID && user.id !== currentUser?.id

  return (
    <div>
      <Line>
        <div>{user.id}</div>
        <div>
          {user.name}
          {user.id === currentUser?.id && ` (${t('user.usersManagement.you')})`}
        </div>
        <div>{user.roles.join(', ')}</div>
        <div>{dayjs(user.dateAdded).format('YYYY-MM-DD HH:mm:ss')}</div>
        <Actions>
          {user.id !== currentUser?.id && (
            <Action icon="edit" onClick={() => onEditAction(user)} />
          )}
          {canDeleteUser ? (
            <Action icon="delete" onClick={handleDeleteUser} />
          ) : (
            <ActionPlaceholder />
          )}
        </Actions>
      </Line>
    </div>
  )
}

export default UsersListItem

const Line = styled.div`
  display: grid;
  grid-template-columns: 40px 2fr 1fr 1fr 1fr;
  align-items: center;
  padding: 0 10px;
  min-height: ${(props) => props.theme.layout.itemHeight};
  border-radius: 3px;

  :hover {
    background-color: ${(props) => props.theme.colors.elementHighlight};
  }
`
const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`
const Action = styled(ActionButtonIcon)`
  color: ${(props) => props.theme.colors.textSecondary};

  :hover {
    color: ${(props) => props.theme.colors.textPrimary};
  }
`
const ActionPlaceholder = styled.div`
  width: 44px;
  height: 44px;
`
