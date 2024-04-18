import { render, screen } from '@testing-library/react'
import {
  useCreateUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} from 'modules/user/store/api'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'
import React from 'react'
import userEvent from '@testing-library/user-event'
import UserEditModal from 'modules/user/components/UserEditModal'

jest.mock('react-modal', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

jest.mock('common/utils/notifications', () => ({
  notify: jest.fn(),
}))

jest.mock('modules/user/store/api', () => ({
  useCreateUserMutation: jest.fn(),
  useUpdateUserMutation: jest.fn(),
  useGetUserQuery: jest.fn(),
}))
const useCreateUserMutationMock = useCreateUserMutation as jest.Mock
const useUpdateUserMutationMock = useUpdateUserMutation as jest.Mock
const mockCreateUser = jest.fn()
const mockUpdateUser = jest.fn()
const useGetUserQueryMock = useGetUserQuery as jest.Mock

const mockOnClose = jest.fn()

describe('UserEditModal', () => {
  beforeEach(() => {
    useCreateUserMutationMock.mockReturnValue([
      mockCreateUser,
      { isLoading: false },
    ])
    useUpdateUserMutationMock.mockReturnValue([
      mockUpdateUser,
      { isLoading: false },
    ])
    useGetUserQueryMock.mockReturnValue({
      data: {
        id: 1,
        name: 'Owner User',
        roles: ['root', 'admin', 'listener'],
      },
    })
  })

  it('renders UserEditModal correctly', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <UserEditModal isOpen onClose={mockOnClose} />
      </ThemeProvider>
    )

    expect(screen.getByTestId('user-edit-form')).toBeInTheDocument()
  })

  it('submits user data with correct info for a user creation', async () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <UserEditModal isOpen onClose={mockOnClose} />
      </ThemeProvider>
    )

    await userEvent.type(screen.getByTestId('input-username'), 'testUser')
    await userEvent.type(screen.getByTestId('input-password'), 'testPassword')

    await userEvent.click(screen.getByTestId('modal-validate'))

    expect(mockCreateUser).toHaveBeenCalledWith({
      name: 'testUser',
      newPassword: 'testPassword',
      roles: ['listener'],
    })
  })

  it('submits user data with correct info for a user edition', async () => {
    const mockTestUser: User = {
      id: 2,
      name: 'testUser',
      roles: ['listener', 'admin'],
    }

    render(
      <ThemeProvider theme={themeDefault}>
        <UserEditModal isOpen onClose={mockOnClose} user={mockTestUser} />
      </ThemeProvider>
    )

    await userEvent.type(screen.getByTestId('input-username'), 'Mod')

    await userEvent.click(screen.getByTestId('modal-validate'))

    expect(mockUpdateUser).toHaveBeenCalledWith({
      id: 2,
      name: 'testUserMod',
      roles: ['admin', 'listener'],
    })
  })

  it('submits user data with correct info for a user edition with password', async () => {
    const mockTestUser: User = {
      id: 2,
      name: 'testUser',
      roles: ['listener', 'admin'],
    }

    render(
      <ThemeProvider theme={themeDefault}>
        <UserEditModal isOpen onClose={mockOnClose} user={mockTestUser} />
      </ThemeProvider>
    )

    await userEvent.type(screen.getByTestId('input-username'), 'Mod')
    await userEvent.type(screen.getByTestId('input-password'), 'newPasswordMod')

    await userEvent.click(screen.getByTestId('modal-validate'))

    expect(mockUpdateUser).toHaveBeenCalledWith({
      id: 2,
      name: 'testUserMod',
      newPassword: 'newPasswordMod',
      roles: ['admin', 'listener'],
    })
  })
})
