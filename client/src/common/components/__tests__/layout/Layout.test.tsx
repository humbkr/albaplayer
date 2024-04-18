import Layout from 'common/components/layout/Layout'
import { render, screen } from '@testing-library/react'
import useInitApp from 'common/hooks/useInitApp'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'

jest.mock('common/hooks/useInitApp', () => jest.fn())
const useInitAppMock = useInitApp as jest.Mock

jest.mock('modules/player/hooks/usePlaybackKeys', () => jest.fn())

jest.mock(
  'common/components/layout/Sidebar',
  () =>
    function () {
      return <div data-testid="sidebar" />
    }
)
jest.mock(
  'common/components/layout/ActionBar',
  () =>
    function () {
      return <div data-testid="action-bar" />
    }
)
jest.mock(
  'common/components/layout/MainPanel',
  () =>
    function () {
      return <div data-testid="main-panel" />
    }
)

jest.mock(
  'modules/user/scenes/CreateRootUser',
  () =>
    function () {
      return <div data-testid="create-root-user-page" />
    }
)

describe('Layout', () => {
  it('should display a loader if app is not initialised', () => {
    useInitAppMock.mockReturnValue({
      isLoading: true,
      shouldDisplayLogin: false,
      shouldDisplayRootCreation: false,
      onLogin: jest.fn(),
      onCreateRootUser: jest.fn(),
    })

    render(
      <ThemeProvider theme={themeDefault}>
        <Layout />
      </ThemeProvider>
    )

    expect(screen.getByTestId('app-loader')).toBeInTheDocument()
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('create-root-user-page')
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument()
    expect(screen.queryByTestId('action-bar')).not.toBeInTheDocument()
    expect(screen.queryByTestId('main-panel')).not.toBeInTheDocument()
  })

  it('should display the login page if app initialised, auth enabled, and no user logged in', () => {
    useInitAppMock.mockReturnValue({
      isLoading: false,
      shouldDisplayLogin: true,
      shouldDisplayRootCreation: false,
      onLogin: jest.fn(),
      onCreateRootUser: jest.fn(),
    })

    render(
      <ThemeProvider theme={themeDefault}>
        <Layout />
      </ThemeProvider>
    )

    expect(screen.queryByTestId('app-loader')).not.toBeInTheDocument()
    expect(screen.getByTestId('login-page')).toBeInTheDocument()
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument()
    expect(screen.queryByTestId('action-bar')).not.toBeInTheDocument()
    expect(screen.queryByTestId('main-panel')).not.toBeInTheDocument()
  })

  it('should display the root user creation page if no user configured yet', () => {
    useInitAppMock.mockReturnValue({
      isLoading: false,
      shouldDisplayLogin: false,
      shouldDisplayRootCreation: true,
      onLogin: jest.fn(),
      onCreateRootUser: jest.fn(),
    })

    render(
      <ThemeProvider theme={themeDefault}>
        <Layout />
      </ThemeProvider>
    )

    expect(screen.queryByTestId('app-loader')).not.toBeInTheDocument()
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument()
    expect(screen.getByTestId('create-root-user-page')).toBeInTheDocument()
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument()
    expect(screen.queryByTestId('action-bar')).not.toBeInTheDocument()
    expect(screen.queryByTestId('main-panel')).not.toBeInTheDocument()
  })

  it('should display the app if app initialised and user is logged in', () => {
    useInitAppMock.mockReturnValue({
      isLoading: false,
      shouldDisplayLogin: false,
      onLogin: jest.fn(),
      onCreateRootUser: jest.fn(),
    })

    render(
      <ThemeProvider theme={themeDefault}>
        <Layout />
      </ThemeProvider>
    )

    expect(screen.queryByTestId('app-loader')).not.toBeInTheDocument()
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument()
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('action-bar')).toBeInTheDocument()
    expect(screen.getByTestId('main-panel')).toBeInTheDocument()
  })
})
