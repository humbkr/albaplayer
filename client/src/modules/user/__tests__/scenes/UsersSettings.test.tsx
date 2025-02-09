import { screen } from '@testing-library/react'
import UsersSettings from 'modules/user/scenes/UsersSettings'
import { useGetUsersQuery } from 'modules/user/api'
import { useGetAppConfigQuery } from 'modules/settings/api'
import type { Mock } from 'vitest'
import { renderWithProviders } from 'common/utils/testing/test-utils'

vi.mock('modules/user/components/UserEditModal', () => ({
  default: () => <div data-testid="UserEditModal"></div>,
}))
vi.mock('modules/user/components/UsersListItem', () => ({
  default: () => <div data-testid="UsersListItem"></div>,
}))

vi.mock('modules/settings/api', () => ({
  useGetAppConfigQuery: vi.fn(),
}))
vi.mock('modules/user/api', () => ({
  useGetUsersQuery: vi.fn(),
}))

const useGetUsersQueryMock = useGetUsersQuery as Mock
const getAppConfigQueryMock = useGetAppConfigQuery as Mock

describe('Users settings screen', () => {
  beforeEach(() => {
    useGetUsersQueryMock.mockReturnValue({
      data: [
        { id: 1, name: 'User 1', roles: ['owner', 'admin', 'listener'] },
        { id: 2, name: 'User 2', roles: ['admin', 'listener'] },
        { id: 3, name: 'User 3', roles: ['listener'] },
      ],
    })
  })

  it('renders correctly when auth is enabled', () => {
    getAppConfigQueryMock.mockReturnValue({ data: { authEnabled: true } })

    renderWithProviders(<UsersSettings />)

    expect(screen.getByText('user.usersManagement.title')).toBeInTheDocument()

    expect(
      screen.getByText('user.usersManagement.columns.id')
    ).toBeInTheDocument()
    expect(
      screen.getByText('user.usersManagement.columns.name')
    ).toBeInTheDocument()
    expect(
      screen.getByText('user.usersManagement.columns.roles')
    ).toBeInTheDocument()
    expect(
      screen.getByText('user.usersManagement.columns.created')
    ).toBeInTheDocument()

    expect(screen.getAllByTestId('UsersListItem').length).toBe(3)
  })

  it('renders correctly when auth is disabled', () => {
    getAppConfigQueryMock.mockReturnValue({ data: { authEnabled: false } })

    renderWithProviders(<UsersSettings />)

    expect(
      screen.queryByText('user.usersManagement.title')
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText('user.usersManagement.columns.id')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText('user.usersManagement.columns.name')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText('user.usersManagement.columns.roles')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText('user.usersManagement.columns.created')
    ).not.toBeInTheDocument()
  })
})
