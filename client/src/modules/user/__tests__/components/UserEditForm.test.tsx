import { screen } from '@testing-library/react'
import UserEditForm from 'modules/user/components/UserEditForm'
import { useGetUserQuery } from 'modules/user/api'
import type { Mock } from 'vitest'
import { renderWithProviders } from 'common/utils/testing/test-utils'

vi.mock('modules/user/api', () => ({
  useGetUserQuery: vi.fn(),
}))
const useGetUserQueryMock = useGetUserQuery as Mock

const mockOnSubmit = vi.fn()

describe('UserEditForm', () => {
  describe('adding a new user', () => {
    it('renders correctly when current user is admin', () => {
      useGetUserQueryMock.mockReturnValue({
        data: {
          id: 23,
          name: 'Admin User',
          roles: ['admin', 'listener'],
        },
      })

      renderWithProviders(<UserEditForm onSubmit={mockOnSubmit} />)

      expect(
        screen.getByText('user.usersManagement.form.username')
      ).toBeInTheDocument()
      expect(
        screen.getByText('user.usersManagement.form.password')
      ).toBeInTheDocument()
      expect(
        screen.getByText('user.usersManagement.form.roles')
      ).toBeInTheDocument()

      expect(
        screen.getByLabelText('user.usersManagement.form.username')
      ).toHaveValue('')
      expect(
        screen.getByLabelText('user.usersManagement.form.password')
      ).toHaveValue('')
      expect(screen.getByLabelText('user.roles.owner.label')).not.toBeChecked()
      expect(screen.getByLabelText('user.roles.owner.label')).toBeDisabled()
      expect(screen.getByLabelText('user.roles.admin.label')).not.toBeChecked()
      expect(screen.getByLabelText('user.roles.listener.label')).toBeChecked()
    })

    it('renders correctly when current user is owner', () => {
      useGetUserQueryMock.mockReturnValue({
        data: {
          id: 1,
          name: 'Owner User',
          roles: ['root', 'admin', 'listener'],
        },
      })

      renderWithProviders(<UserEditForm onSubmit={mockOnSubmit} />)

      expect(
        screen.getByText('user.usersManagement.form.username')
      ).toBeInTheDocument()
      expect(
        screen.getByText('user.usersManagement.form.password')
      ).toBeInTheDocument()
      expect(
        screen.getByText('user.usersManagement.form.roles')
      ).toBeInTheDocument()

      expect(
        screen.getByLabelText('user.usersManagement.form.username')
      ).toHaveValue('')
      expect(
        screen.getByLabelText('user.usersManagement.form.password')
      ).toHaveValue('')
      expect(screen.getByLabelText('user.roles.owner.label')).not.toBeChecked()
      expect(screen.getByLabelText('user.roles.owner.label')).not.toBeDisabled()
      expect(screen.getByLabelText('user.roles.admin.label')).not.toBeChecked()
      expect(screen.getByLabelText('user.roles.listener.label')).toBeChecked()
    })
  })

  describe('updating an existing user', () => {
    it('renders correctly when current user is admin', () => {
      useGetUserQueryMock.mockReturnValue({
        data: {
          id: 23,
          name: 'Admin User',
          roles: ['admin', 'listener'],
        },
      })

      const testUser: User = {
        id: 2,
        name: 'Test User',
        roles: ['listener', 'admin'],
      }

      renderWithProviders(
        <UserEditForm onSubmit={mockOnSubmit} user={testUser} />
      )

      expect(
        screen.getByText('user.usersManagement.form.username')
      ).toBeInTheDocument()
      expect(
        screen.getByText('user.usersManagement.form.newPassword')
      ).toBeInTheDocument()
      expect(
        screen.getByText('user.usersManagement.form.roles')
      ).toBeInTheDocument()

      expect(
        screen.getByLabelText('user.usersManagement.form.username')
      ).toHaveValue('Test User')
      expect(
        screen.getByLabelText('user.usersManagement.form.newPassword')
      ).toHaveValue('')
      expect(screen.getByLabelText('user.roles.owner.label')).not.toBeChecked()
      expect(screen.getByLabelText('user.roles.owner.label')).toBeDisabled()
      expect(screen.getByLabelText('user.roles.admin.label')).toBeChecked()
      expect(screen.getByLabelText('user.roles.listener.label')).toBeChecked()
    })

    it('renders correctly when current user is owner', () => {
      useGetUserQueryMock.mockReturnValue({
        data: {
          id: 1,
          name: 'Owner User',
          roles: ['root', 'admin', 'listener'],
        },
      })

      const testUser: User = {
        id: 2,
        name: 'Test User',
        roles: ['listener', 'admin'],
      }

      renderWithProviders(
        <UserEditForm onSubmit={mockOnSubmit} user={testUser} />
      )

      expect(
        screen.getByText('user.usersManagement.form.username')
      ).toBeInTheDocument()
      expect(
        screen.getByText('user.usersManagement.form.newPassword')
      ).toBeInTheDocument()
      expect(
        screen.getByText('user.usersManagement.form.roles')
      ).toBeInTheDocument()

      expect(
        screen.getByLabelText('user.usersManagement.form.username')
      ).toHaveValue('Test User')
      expect(
        screen.getByLabelText('user.usersManagement.form.newPassword')
      ).toHaveValue('')
      expect(screen.getByLabelText('user.roles.owner.label')).not.toBeChecked()
      expect(screen.getByLabelText('user.roles.owner.label')).not.toBeDisabled()
      expect(screen.getByLabelText('user.roles.admin.label')).toBeChecked()
      expect(screen.getByLabelText('user.roles.listener.label')).toBeChecked()
    })
  })
})
