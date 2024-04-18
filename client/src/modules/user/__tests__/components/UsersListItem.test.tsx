import { render, screen } from '@testing-library/react'
import UsersListItem from 'modules/user/components/UsersListItem'
import { useDeleteUserMutation, useGetUserQuery } from 'modules/user/store/api'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'
import userEvent from '@testing-library/user-event'

jest.mock('modules/user/store/api', () => ({
  useGetUserQuery: jest.fn(),
  useDeleteUserMutation: jest.fn().mockReturnValue([jest.fn()]),
}))

const useGetUserQueryMock = useGetUserQuery as jest.Mock
const useDeleteUserMutationMock = useDeleteUserMutation as jest.Mock

const mockOnEditAction = jest.fn()

const mockDeleteUser = jest.fn()

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

    render(
      <ThemeProvider theme={themeDefault}>
        <UsersListItem user={mockUser} onEditAction={mockOnEditAction} />
      </ThemeProvider>
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

    render(
      <ThemeProvider theme={themeDefault}>
        <UsersListItem user={mockUser} onEditAction={mockOnEditAction} />
      </ThemeProvider>
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

    render(
      <ThemeProvider theme={themeDefault}>
        <UsersListItem user={mockUser} onEditAction={mockOnEditAction} />
      </ThemeProvider>
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

    render(
      <ThemeProvider theme={themeDefault}>
        <UsersListItem user={mockUser} onEditAction={mockOnEditAction} />
      </ThemeProvider>
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

    render(
      <ThemeProvider theme={themeDefault}>
        <UsersListItem user={mockUser} onEditAction={mockOnEditAction} />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByText('edit'))

    expect(mockOnEditAction).toHaveBeenCalledWith(mockUser)
  })
})
