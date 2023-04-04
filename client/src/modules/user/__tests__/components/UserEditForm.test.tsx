import { render, screen } from '@testing-library/react'
import UserEditForm from 'modules/user/components/UserEditForm'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'
import { useGetUserQuery } from 'modules/user/store/api'

jest.mock('modules/user/store/api', () => ({
  useGetUserQuery: jest.fn(),
}))
const useGetUserQueryMock = useGetUserQuery as jest.Mock

const mockOnSubmit = jest.fn()

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

      render(
        <ThemeProvider theme={themeDefault}>
          <UserEditForm onSubmit={mockOnSubmit} />
        </ThemeProvider>
      )

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
          roles: ['owner', 'admin', 'listener'],
        },
      })

      render(
        <ThemeProvider theme={themeDefault}>
          <UserEditForm onSubmit={mockOnSubmit} />
        </ThemeProvider>
      )

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

      render(
        <ThemeProvider theme={themeDefault}>
          <UserEditForm onSubmit={mockOnSubmit} user={testUser} />
        </ThemeProvider>
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
          roles: ['owner', 'admin', 'listener'],
        },
      })

      const testUser: User = {
        id: 2,
        name: 'Test User',
        roles: ['listener', 'admin'],
      }

      render(
        <ThemeProvider theme={themeDefault}>
          <UserEditForm onSubmit={mockOnSubmit} user={testUser} />
        </ThemeProvider>
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
