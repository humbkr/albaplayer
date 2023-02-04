import SettingsTabContent from 'modules/settings/components/SettingsTabContent'
import styled from 'styled-components'
import { useGetUsersQuery } from 'modules/user/store/api'
import React, { useState } from 'react'
import UsersListItem from 'modules/user/components/UsersListItem'
import ActionButton from 'common/components/buttons/ActionButton'
import UserEditModal from 'modules/user/components/UserEditModal'

function UsersSettings() {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<User | undefined>()

  const { data: users } = useGetUsersQuery()

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

  return (
    <SettingsTabContent>
      <Header>
        <h2>Users</h2>
        <ActionButton raised icon="add" onClick={onAddUser}>
          New user
        </ActionButton>
      </Header>
      <UsersListHeader>
        <div>ID</div>
        <div>Name</div>
        <div>Roles</div>
        <div>Created</div>
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
