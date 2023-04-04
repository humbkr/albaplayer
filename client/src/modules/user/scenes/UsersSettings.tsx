import SettingsTabContent from 'modules/settings/components/SettingsTabContent'
import styled from 'styled-components'
import { useGetUsersQuery } from 'modules/user/store/api'
import React, { useState } from 'react'
import UsersListItem from 'modules/user/components/UsersListItem'
import ActionButton from 'common/components/buttons/ActionButton'
import UserEditModal from 'modules/user/components/UserEditModal'
import { useTranslation } from 'react-i18next'
import { useGetAppConfigQuery } from 'modules/settings/api'

function UsersSettings() {
  const { t } = useTranslation()

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<User | undefined>()

  const { data: appConfig } = useGetAppConfigQuery()
  const { data: users } = useGetUsersQuery(undefined, {
    skip: appConfig?.authEnabled === false,
  })

  const onAddUser = () => {
    setUserToEdit(undefined)
    setEditModalOpen(true)
  }

  const onEditUser = (user: User) => {
    setUserToEdit(user)
    setEditModalOpen(true)
  }

  const onEditModalClose = () => {
    setEditModalOpen(false)
  }

  if (appConfig?.authEnabled === false) {
    return null
  }

  return (
    <SettingsTabContent>
      <Header>
        <h2>{t('user.usersManagement.title')}</h2>
        <ActionButton raised icon="add" onClick={onAddUser}>
          {t('user.usersManagement.newUser')}
        </ActionButton>
      </Header>
      <UsersListHeader>
        <div>{t('user.usersManagement.columns.id')}</div>
        <div>{t('user.usersManagement.columns.name')}</div>
        <div>{t('user.usersManagement.columns.roles')}</div>
        <div>{t('user.usersManagement.columns.created')}</div>
        <div />
      </UsersListHeader>
      <UsersList>
        {users &&
          [...users]
            ?.sort((a, b) => a.id - b.id)
            .map((user) => (
              <UsersListItem
                key={user.id}
                user={user}
                onEditAction={onEditUser}
              />
            ))}
      </UsersList>
      <UserEditModal
        isOpen={editModalOpen}
        onClose={onEditModalClose}
        user={userToEdit}
      />
    </SettingsTabContent>
  )
}

export default UsersSettings

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const UsersListHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 2fr 1fr 1fr 1fr;
  align-items: center;
  font-weight: bold;
  padding: 0 10px;
  height: ${(props) => props.theme.layout.itemHeight};
`
const UsersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`
