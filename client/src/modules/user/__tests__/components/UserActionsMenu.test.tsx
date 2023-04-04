import { render, screen } from '@testing-library/react'
import UserActionsMenu from 'modules/user/components/UserActionsMenu'
import { useGetUserQuery } from 'modules/user/store/api'
import userEvent from '@testing-library/user-event'
import ROUTES from 'routing'
import { useNavigate } from 'react-router'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'

jest.mock('modules/user/store/api', () => ({
  useGetUserQuery: jest.fn(),
}))
const useGetUserQueryMock = useGetUserQuery as jest.Mock

jest.mock('react-router')
const useNavigateMock = useNavigate as jest.Mock
const mockNavigate = jest.fn()

describe('UserActionsMenu', () => {
  beforeEach(() => {
    useNavigateMock.mockReturnValue(mockNavigate)
  })

  it('does not render when user is not available', () => {
    useGetUserQueryMock.mockImplementation(() => ({
      data: undefined,
    }))

    render(
      <ThemeProvider theme={themeDefault}>
        <UserActionsMenu />
      </ThemeProvider>
    )

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
      render(
        <ThemeProvider theme={themeDefault}>
          <UserActionsMenu />
        </ThemeProvider>
      )

      expect(screen.getByTestId('user-actions-menu-noauth')).toBeInTheDocument()
      // Button icons.
      expect(screen.getByText('admin_panel_settings')).toBeInTheDocument()
      expect(screen.getByText('settings')).toBeInTheDocument()
    })

    it('navigate to the correct page when administration button is pressed', async () => {
      render(
        <ThemeProvider theme={themeDefault}>
          <UserActionsMenu />
        </ThemeProvider>
      )

      await userEvent.click(screen.getByText('admin_panel_settings'))

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.administration)
    })

    it('navigate to the correct page when settings button is pressed', async () => {
      render(
        <ThemeProvider theme={themeDefault}>
          <UserActionsMenu />
        </ThemeProvider>
      )

      await userEvent.click(screen.getByText('settings'))

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.preferences)
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

      render(
        <ThemeProvider theme={themeDefault}>
          <UserActionsMenu />
        </ThemeProvider>
      )

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
      render(
        <ThemeProvider theme={themeDefault}>
          <UserActionsMenu />
        </ThemeProvider>
      )

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

      render(
        <ThemeProvider theme={themeDefault}>
          <UserActionsMenu />
        </ThemeProvider>
      )

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

      render(
        <ThemeProvider theme={themeDefault}>
          <UserActionsMenu />
        </ThemeProvider>
      )

      await userEvent.click(screen.getByText('Test User'))
      await userEvent.click(screen.getByText('admin_panel_settings'))

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.administration)
    })

    it('navigate to the correct page when settings button is pressed', async () => {
      render(
        <ThemeProvider theme={themeDefault}>
          <UserActionsMenu />
        </ThemeProvider>
      )

      await userEvent.click(screen.getByText('Test User'))
      await userEvent.click(screen.getByText('settings'))

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.preferences)
    })
  })
})
