import { screen } from '@testing-library/react'
import {
  useCreateUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} from 'modules/user/api'
import type React from 'react'
import userEvent from '@testing-library/user-event'
import UserEditModal from 'modules/user/components/UserEditModal'
import type { Mock } from 'vitest'
import { renderWithProviders } from 'common/utils/testing/test-utils'

vi.mock('react-modal', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

vi.mock('common/utils/notifications', () => ({
  notify: vi.fn(),
}))

vi.mock('modules/user/api', () => ({
  useCreateUserMutation: vi.fn(),
  useUpdateUserMutation: vi.fn(),
  useGetUserQuery: vi.fn(),
}))
const useCreateUserMutationMock = useCreateUserMutation as Mock
const useUpdateUserMutationMock = useUpdateUserMutation as Mock
const mockCreateUser = vi.fn()
const mockUpdateUser = vi.fn()
const useGetUserQueryMock = useGetUserQuery as Mock

const mockOnClose = vi.fn()

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
    renderWithProviders(<UserEditModal isOpen onClose={mockOnClose} />)

    expect(screen.getByTestId('user-edit-form')).toBeInTheDocument()
  })

  it('submits user data with correct info for a user creation', async () => {
    renderWithProviders(<UserEditModal isOpen onClose={mockOnClose} />)

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

    renderWithProviders(
      <UserEditModal isOpen onClose={mockOnClose} user={mockTestUser} />
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

    renderWithProviders(
      <UserEditModal isOpen onClose={mockOnClose} user={mockTestUser} />
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
