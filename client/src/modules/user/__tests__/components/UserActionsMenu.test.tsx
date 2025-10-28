import { screen } from '@testing-library/react'
import UserActionsMenu from 'modules/user/components/UserActionsMenu'
import { useGetUserQuery } from 'modules/user/api'
import userEvent from '@testing-library/user-event'
import ROUTES from 'routing'
import { useNavigate } from 'react-router'
import { refreshData } from 'modules/settings/services'
import { logoutUser } from 'modules/user/services'
import type { Mock } from 'vitest'
import { renderWithProviders } from 'common/utils/testing/test-utils'

vi.mock('modules/user/api', () => ({
  useGetUserQuery: vi.fn(),
}))
const useGetUserQueryMock = useGetUserQuery as Mock

vi.mock('react-router')
const useNavigateMock = useNavigate as Mock
const mockNavigate = vi.fn()

vi.mock('modules/user/services', () => ({
  logoutUser: vi.fn(),
}))

vi.mock('modules/settings/services', () => ({
  refreshData: vi.fn(),
}))

describe('UserActionsMenu', () => {
  beforeEach(() => {
    useNavigateMock.mockReturnValue(mockNavigate)
  })

  it('does not render when user is not available', () => {
    useGetUserQueryMock.mockImplementation(() => ({
      data: undefined,
    }))

    renderWithProviders(<UserActionsMenu />)

    expect(
      screen.queryByTestId('user-actions-menu-noauth')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('user-actions-menu-auth')
    ).not.toBeInTheDocument()
  })

  describe('when auth is disabled', () => {
    beforeEach(() => {
      useGetUserQueryMock.mockImplementation(() => ({
        data: {
          id: '1',
          name: 'Test User',
          isDefaultUser: true,
          roles: ['listener', 'admin'],
        },
      }))
    })

    it('renders correctly', () => {
      renderWithProviders(<UserActionsMenu />)

      expect(screen.getByTestId('user-actions-menu-noauth')).toBeInTheDocument()
      // Button icons.
      expect(screen.getByText('admin_panel_settings')).toBeInTheDocument()
      expect(screen.getByText('settings')).toBeInTheDocument()
      expect(screen.getByText('refresh')).toBeInTheDocument()
    })

    it('navigate to the correct page when administration button is pressed', async () => {
      renderWithProviders(<UserActionsMenu />)

      await userEvent.click(screen.getByText('admin_panel_settings'))

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.administration)
    })

    it('navigate to the correct page when settings button is pressed', async () => {
      renderWithProviders(<UserActionsMenu />)

      await userEvent.click(screen.getByText('settings'))

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.preferences)
    })

    it('calls correct action when refresh is pressed', async () => {
      renderWithProviders(<UserActionsMenu />)

      await userEvent.click(screen.getByText('refresh'))

      expect(refreshData).toHaveBeenCalled()
    })

    it('renders correctly when user has role listener only', () => {
      useGetUserQueryMock.mockImplementation(() => ({
        data: {
          id: '1',
          name: 'Test User',
          isDefaultUser: true,
          roles: ['listener'],
        },
      }))

      renderWithProviders(<UserActionsMenu />)

      expect(screen.getByTestId('user-actions-menu-noauth')).toBeInTheDocument()
      expect(screen.getByText('settings')).toBeInTheDocument()
      expect(screen.queryByText('admin_panel_settings')).not.toBeInTheDocument()
    })
  })

  describe('when auth is enabled', () => {
    beforeEach(() => {
      useGetUserQueryMock.mockImplementation(() => ({
        data: {
          id: '1',
          name: 'Test User',
          roles: ['listener'],
        },
      }))
    })

    it('renders correctly when user has role listener only', () => {
      renderWithProviders(<UserActionsMenu />)

      expect(screen.getByTestId('user-actions-menu-auth')).toBeInTheDocument()
      expect(screen.getByText('Test User')).toBeInTheDocument()
      expect(screen.getByText('settings')).toBeInTheDocument()
      expect(screen.queryByText('admin_panel_settings')).not.toBeInTheDocument()
    })

    it('renders correctly when user has role admin', () => {
      useGetUserQueryMock.mockImplementation(() => ({
        data: {
          id: '1',
          name: 'Test User',
          roles: ['listener', 'admin'],
        },
      }))

      renderWithProviders(<UserActionsMenu />)

      expect(screen.getByTestId('user-actions-menu-auth')).toBeInTheDocument()
      expect(screen.getByText('Test User')).toBeInTheDocument()
      expect(screen.getByText('settings')).toBeInTheDocument()
      expect(screen.getByText('admin_panel_settings')).toBeInTheDocument()
    })

    it('navigate to the correct page when administration button is pressed', async () => {
      useGetUserQueryMock.mockImplementation(() => ({
        data: {
          id: '1',
          name: 'Test User',
          roles: ['listener', 'admin'],
        },
      }))

      renderWithProviders(<UserActionsMenu />)

      await userEvent.click(screen.getByText('Test User'))
      await userEvent.click(screen.getByText('admin_panel_settings'))

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.administration)
    })

    it('navigate to the correct page when settings button is pressed', async () => {
      renderWithProviders(<UserActionsMenu />)

      await userEvent.click(screen.getByText('Test User'))
      await userEvent.click(screen.getByText('settings'))

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.preferences)
    })

    it('calls correct action when refresh is pressed', async () => {
      renderWithProviders(<UserActionsMenu />)

      await userEvent.click(screen.getByText('refresh'))

      expect(refreshData).toHaveBeenCalled()
    })

    it('calls correct action when log out is pressed', async () => {
      renderWithProviders(<UserActionsMenu />)

      await userEvent.click(screen.getByText('logout'))

      expect(logoutUser).toHaveBeenCalled()
    })
  })
})
