import Layout from 'common/components/layout/Layout'
import type { Mock } from 'vitest'
import { screen } from '@testing-library/react'
import useInitApp from 'common/hooks/useInitApp'
import { renderWithProviders } from 'common/utils/testing/test-utils'

vi.mock('common/hooks/useInitApp', () => ({
  default: vi.fn(),
}))
const useInitAppMock = useInitApp as Mock

vi.mock('modules/player/hooks/usePlaybackKeys', () => ({
  default: vi.fn(),
}))

vi.mock('common/components/layout/Sidebar', () => ({
  default: () => <div data-testid="sidebar" />,
}))
vi.mock('common/components/layout/ActionBar', () => ({
  default: () => <div data-testid="action-bar" />,
}))
vi.mock('common/components/layout/MainPanel', () => ({
  default: () => <div data-testid="main-panel" />,
}))

vi.mock('modules/user/scenes/CreateRootUser', () => ({
  default: () => <div data-testid="create-root-user-page" />,
}))

describe('Layout', () => {
  it('should display a loader if app is not initialised', () => {
    useInitAppMock.mockReturnValue({
      isServerReachable: true,
      isLoading: true,
      shouldDisplayLogin: false,
      shouldDisplayRootCreation: false,
      onLogin: vi.fn(),
      onCreateRootUser: vi.fn(),
    })

    renderWithProviders(<Layout />)

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
      isServerReachable: true,
      isLoading: false,
      shouldDisplayLogin: true,
      shouldDisplayRootCreation: false,
      onLogin: vi.fn(),
      onCreateRootUser: vi.fn(),
    })

    renderWithProviders(<Layout />)

    expect(screen.queryByTestId('app-loader')).not.toBeInTheDocument()
    expect(screen.getByTestId('login-page')).toBeInTheDocument()
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument()
    expect(screen.queryByTestId('action-bar')).not.toBeInTheDocument()
    expect(screen.queryByTestId('main-panel')).not.toBeInTheDocument()
  })

  it('should display the root user creation page if no user configured yet', () => {
    useInitAppMock.mockReturnValue({
      isServerReachable: true,
      isLoading: false,
      shouldDisplayLogin: false,
      shouldDisplayRootCreation: true,
      onLogin: vi.fn(),
      onCreateRootUser: vi.fn(),
    })

    renderWithProviders(<Layout />)

    expect(screen.queryByTestId('app-loader')).not.toBeInTheDocument()
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument()
    expect(screen.getByTestId('create-root-user-page')).toBeInTheDocument()
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument()
    expect(screen.queryByTestId('action-bar')).not.toBeInTheDocument()
    expect(screen.queryByTestId('main-panel')).not.toBeInTheDocument()
  })

  it('should display the app if app initialised and user is logged in', () => {
    useInitAppMock.mockReturnValue({
      isServerReachable: true,
      isLoading: false,
      shouldDisplayLogin: false,
      onLogin: vi.fn(),
      onCreateRootUser: vi.fn(),
    })

    renderWithProviders(<Layout />)

    expect(screen.queryByTestId('app-loader')).not.toBeInTheDocument()
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument()
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('action-bar')).toBeInTheDocument()
    expect(screen.getByTestId('main-panel')).toBeInTheDocument()
  })
})
