import { screen } from '@testing-library/react'
import UsersListItem from 'modules/user/components/UsersListItem'
import { useDeleteUserMutation, useGetUserQuery } from 'modules/user/api'
import userEvent from '@testing-library/user-event'
import type { Mock } from 'vitest'
import { renderWithProviders } from 'common/utils/testing/test-utils'

vi.mock('modules/user/api', () => ({
  useGetUserQuery: vi.fn(),
  useDeleteUserMutation: vi.fn().mockReturnValue([vi.fn()]),
}))

const useGetUserQueryMock = useGetUserQuery as Mock
const useDeleteUserMutationMock = useDeleteUserMutation as Mock

const mockOnEditAction = vi.fn()

const mockDeleteUser = vi.fn()

describe('UsersListItem', () => {
  beforeEach(() => {
    useDeleteUserMutationMock.mockReturnValue([mockDeleteUser])
  })

  it('renders correctly when current user has all the rights on the user displayed', () => {
    useGetUserQueryMock.mockReturnValue({
      data: {
        id: 23,
        name: 'Current User',
        roles: ['listener', 'admin'],
      },
    })

    const mockUser: User = {
      id: 12,
      name: 'User 12',
      roles: ['listener', 'admin'],
      dateAdded: 1680100956,
    }

    renderWithProviders(
      <UsersListItem user={mockUser} onEditAction={mockOnEditAction} />
    )

    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('User 12')).toBeInTheDocument()
    expect(screen.getByText('listener, admin')).toBeInTheDocument()
    expect(screen.getByText('edit')).toBeInTheDocument()
    expect(screen.getByText('delete')).toBeInTheDocument()
  })

  it('renders correctly when current user is the same as user displayed', () => {
    useGetUserQueryMock.mockReturnValue({
      data: {
        id: 23,
        name: 'User 23',
        roles: ['listener', 'admin'],
      },
    })

    const mockUser: User = {
      id: 23,
      name: 'User 23',
      roles: ['listener', 'admin'],
      dateAdded: 1680100956,
    }

    renderWithProviders(
      <UsersListItem user={mockUser} onEditAction={mockOnEditAction} />
    )

    expect(screen.getByText('23')).toBeInTheDocument()
    expect(
      screen.getByText('User 23 (user.usersManagement.you)')
    ).toBeInTheDocument()
    expect(screen.getByText('listener, admin')).toBeInTheDocument()
    expect(screen.queryByText('edit')).not.toBeInTheDocument()
    expect(screen.queryByText('delete')).not.toBeInTheDocument()
  })

  it('renders correctly when current user is not owner and user displayed has owner role', () => {
    useGetUserQueryMock.mockReturnValue({
      data: {
        id: 23,
        name: 'User 23',
        roles: ['listener', 'admin'],
      },
    })

    const mockUser: User = {
      id: 42,
      name: 'User 42',
      roles: ['listener', 'admin', 'root'],
      dateAdded: 1680100956,
    }

    renderWithProviders(
      <UsersListItem user={mockUser} onEditAction={mockOnEditAction} />
    )

    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('User 42')).toBeInTheDocument()
    expect(screen.getByText('listener, admin, root')).toBeInTheDocument()
    expect(screen.queryByText('edit')).not.toBeInTheDocument()
    expect(screen.queryByText('delete')).not.toBeInTheDocument()
  })

  it('renders correctly when current user displayed is original owner', () => {
    useGetUserQueryMock.mockReturnValue({
      data: {
        id: 23,
        name: 'User 23',
        roles: ['listener', 'admin', 'root'],
      },
    })

    const mockUser: User = {
      id: 1,
      name: 'User 1',
      roles: ['listener', 'admin', 'root'],
      dateAdded: 1680100956,
    }

    renderWithProviders(
      <UsersListItem user={mockUser} onEditAction={mockOnEditAction} />
    )

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('User 1')).toBeInTheDocument()
    expect(screen.getByText('listener, admin, root')).toBeInTheDocument()
    expect(screen.queryByText('edit')).not.toBeInTheDocument()
    expect(screen.queryByText('delete')).not.toBeInTheDocument()
  })

  it('calls correct function on edit button press', async () => {
    useGetUserQueryMock.mockReturnValue({
      data: {
        id: 23,
        name: 'Current User',
        roles: ['listener', 'admin'],
      },
    })

    const mockUser: User = {
      id: 12,
      name: 'User 12',
      roles: ['listener', 'admin'],
      dateAdded: 1680100956,
    }

    renderWithProviders(
      <UsersListItem user={mockUser} onEditAction={mockOnEditAction} />
    )

    await userEvent.click(screen.getByText('edit'))

    expect(mockOnEditAction).toHaveBeenCalledWith(mockUser)
  })
})
