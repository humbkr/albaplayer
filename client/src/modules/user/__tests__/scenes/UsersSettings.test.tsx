import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'
import { render, screen } from '@testing-library/react'
import UsersSettings from 'modules/user/scenes/UsersSettings'
import { useGetUsersQuery } from 'modules/user/store/api'
import { useGetAppConfigQuery } from 'modules/settings/api'

jest.mock(
  'modules/user/components/UserEditModal',
  () =>
    function () {
      return <div data-testid="UserEditModal"></div>
    }
)
jest.mock(
  'modules/user/components/UsersListItem',
  () =>
    function () {
      return <div data-testid="UsersListItem"></div>
    }
)

jest.mock('modules/settings/api', () => ({
  useGetAppConfigQuery: jest.fn(),
}))
jest.mock('modules/user/store/api', () => ({
  useGetUsersQuery: jest.fn(),
}))

const useGetUsersQueryMock = useGetUsersQuery as jest.Mock
const getAppConfigQueryMock = useGetAppConfigQuery as jest.Mock

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

    render(
      <ThemeProvider theme={themeDefault}>
        <UsersSettings />
      </ThemeProvider>
    )

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

    render(
      <ThemeProvider theme={themeDefault}>
        <UsersSettings />
      </ThemeProvider>
    )

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
