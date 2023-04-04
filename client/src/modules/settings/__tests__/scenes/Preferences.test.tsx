import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'
import Preferences from 'modules/settings/scenes/Preferences'
import userEvent from '@testing-library/user-event'
import { useGetAppConfigQuery } from 'modules/settings/api'

jest.mock(
  'modules/settings/components/AppearanceSettings',
  () =>
    function () {
      return <div data-testid="AppearanceSettings" />
    }
)
jest.mock(
  'modules/user/components/ProfileSettingsForm',
  () =>
    function () {
      return <div data-testid="ProfileSettingsForm" />
    }
)

jest.mock('modules/settings/api', () => ({
  useGetAppConfigQuery: jest.fn(),
}))
const useGetAppConfigQueryMock = useGetAppConfigQuery as jest.Mock

describe('Preferences scene', () => {
  describe('when auth is enabled', function () {
    beforeEach(() => {
      useGetAppConfigQueryMock.mockReturnValue({ data: { authEnabled: true } })
    })

    it('should display correctly', () => {
      render(
        <ThemeProvider theme={themeDefault}>
          <Preferences />
        </ThemeProvider>
      )

      expect(screen.getByText('settings.preferences.title')).toBeInTheDocument()
      expect(screen.getByText('settings.appearance.title')).toBeInTheDocument()
      expect(screen.getByText('user.profile.title')).toBeInTheDocument()
      expect(screen.getByTestId('AppearanceSettings')).toBeInTheDocument()
    })

    it('should display profile settings if corresponding tab is selected', async () => {
      render(
        <ThemeProvider theme={themeDefault}>
          <Preferences />
        </ThemeProvider>
      )

      await userEvent.click(screen.getByText('user.profile.title'))

      expect(screen.getByTestId('ProfileSettingsForm')).toBeInTheDocument()
    })
  })

  describe('when auth is disabled', function () {
    beforeEach(() => {
      useGetAppConfigQueryMock.mockReturnValue({ data: { authEnabled: false } })
    })

    it('should display correctly', () => {
      render(
        <ThemeProvider theme={themeDefault}>
          <Preferences />
        </ThemeProvider>
      )

      expect(screen.getByText('settings.preferences.title')).toBeInTheDocument()
      expect(screen.getByText('settings.appearance.title')).toBeInTheDocument()
      expect(screen.queryByText('user.profile.title')).not.toBeInTheDocument()
      expect(screen.getByTestId('AppearanceSettings')).toBeInTheDocument()
    })
  })
})
