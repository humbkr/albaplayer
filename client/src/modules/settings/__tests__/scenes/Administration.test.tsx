import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'
import Administration from 'modules/settings/scenes/Administration'
import { useGetAppConfigQuery } from 'modules/settings/api'
import { useGetUserQuery } from 'modules/user/store/api'
import { USER_ROLE_ADMIN, USER_ROLE_LISTENER } from 'modules/user/constants'
import userEvent from '@testing-library/user-event'

jest.mock('modules/settings/api', () => ({
  useGetAppConfigQuery: jest.fn(),
}))
const useGetAppConfigQueryMock = useGetAppConfigQuery as jest.Mock

jest.mock('modules/user/store/api', () => ({
  useGetUserQuery: jest.fn(),
}))
const useGetUserQueryMock = useGetUserQuery as jest.Mock

jest.mock('store/hooks', () => ({
  useAppDispatch: () => jest.fn(),
}))

jest.mock('modules/settings/store', () => ({
  initSettings: jest.fn(),
}))

jest.mock('modules/user/utils', () => ({
  userHasRole: (user?: User, role?: Role) =>
    role && user?.roles?.includes(role),
}))

jest.mock(
  'modules/library/components/LibrarySettings',
  () =>
    function () {
      return <div data-testid="LibrarySettings" />
    }
)
jest.mock(
  'modules/user/scenes/UsersSettings',
  () =>
    function () {
      return <div data-testid="UsersSettings" />
    }
)

describe('Administration scene', () => {
  it('should not display if user has not access to the page (auth mode enabled)', () => {
    useGetAppConfigQueryMock.mockReturnValue({
      data: { authEnabled: true },
    })
    useGetUserQueryMock.mockReturnValue({
      data: { roles: [USER_ROLE_LISTENER] },
    })

    render(
      <ThemeProvider theme={themeDefault}>
        <Administration />
      </ThemeProvider>
    )

    expect(
      screen.queryByText('settings.administration.title')
    ).not.toBeInTheDocument()
  })

  it('should not display if user has not access to the page (auth mode disabled)', () => {
    useGetAppConfigQueryMock.mockReturnValue({
      data: { authEnabled: false },
    })
    useGetUserQueryMock.mockReturnValue({
      data: null,
    })

    render(
      <ThemeProvider theme={themeDefault}>
        <Administration />
      </ThemeProvider>
    )

    expect(
      screen.queryByText('settings.administration.title')
    ).not.toBeInTheDocument()
  })

  it('should display correctly if user has access to the page (auth mode enabled)', () => {
    useGetAppConfigQueryMock.mockReturnValue({
      data: { authEnabled: true },
    })
    useGetUserQueryMock.mockReturnValue({
      data: { roles: [USER_ROLE_ADMIN] },
    })

    render(
      <ThemeProvider theme={themeDefault}>
        <Administration />
      </ThemeProvider>
    )

    expect(
      screen.getByText('settings.administration.title')
    ).toBeInTheDocument()
    expect(screen.getByText('settings.library.title')).toBeInTheDocument()
    expect(screen.getByText('user.usersManagement.title')).toBeInTheDocument()
    expect(screen.getByText('settings.about.title')).toBeInTheDocument()
  })

  it('should display correctly if user has access to the page (auth mode disabled)', () => {
    useGetAppConfigQueryMock.mockReturnValue({
      data: { authEnabled: false },
    })
    useGetUserQueryMock.mockReturnValue({
      data: { id: '42', roles: [USER_ROLE_ADMIN] },
    })

    render(
      <ThemeProvider theme={themeDefault}>
        <Administration />
      </ThemeProvider>
    )

    expect(
      screen.getByText('settings.administration.title')
    ).toBeInTheDocument()
  })

  it('should display the version when the about tab is selected', async () => {
    useGetAppConfigQueryMock.mockReturnValue({
      data: { authEnabled: true },
    })
    useGetUserQueryMock.mockReturnValue({
      data: { roles: [USER_ROLE_ADMIN] },
    })

    render(
      <ThemeProvider theme={themeDefault}>
        <Administration />
      </ThemeProvider>
    )

    expect(
      screen.getByText('settings.administration.title')
    ).toBeInTheDocument()

    await userEvent.click(screen.getByText('settings.about.title'))

    expect(screen.getByTestId('settings-version')).toBeInTheDocument()
  })

  it('should display the users management page if corresponding tab is selected', async () => {
    useGetAppConfigQueryMock.mockReturnValue({
      data: { authEnabled: true },
    })
    useGetUserQueryMock.mockReturnValue({
      data: { roles: [USER_ROLE_ADMIN] },
    })

    render(
      <ThemeProvider theme={themeDefault}>
        <Administration />
      </ThemeProvider>
    )

    expect(
      screen.getByText('settings.administration.title')
    ).toBeInTheDocument()

    await userEvent.click(screen.getByText('user.usersManagement.title'))

    expect(screen.getByTestId('UsersSettings')).toBeInTheDocument()
  })
})
