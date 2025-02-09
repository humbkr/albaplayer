import { screen } from '@testing-library/react'
import Preferences from 'modules/settings/scenes/Preferences'
import userEvent from '@testing-library/user-event'
import { useGetAppConfigQuery } from 'modules/settings/api'
import type { Mock } from 'vitest'
import { renderWithProviders } from 'common/utils/testing/test-utils'

vi.mock('modules/settings/components/GlobalSettings', () => ({
  default: () => <div data-testid="GlobalSettings" />,
}))
vi.mock('modules/settings/components/LibraryBrowserSettings', () => ({
  default: () => <div data-testid="LibraryBrowserSettings" />,
}))
vi.mock('modules/user/components/ProfileSettingsForm', () => ({
  default: () => <div data-testid="ProfileSettingsForm" />,
}))

vi.mock('modules/settings/api', () => ({
  useGetAppConfigQuery: vi.fn(),
}))
const useGetAppConfigQueryMock = useGetAppConfigQuery as Mock

describe('Preferences scene', () => {
  describe('when auth is enabled', function () {
    beforeEach(() => {
      useGetAppConfigQueryMock.mockReturnValue({ data: { authEnabled: true } })
    })

    it('should display correctly', () => {
      renderWithProviders(<Preferences />)

      expect(screen.getByText('settings.preferences.title')).toBeInTheDocument()
      expect(screen.getByText('settings.global.title')).toBeInTheDocument()
      expect(screen.getByText('user.profile.title')).toBeInTheDocument()
      expect(screen.getByTestId('GlobalSettings')).toBeInTheDocument()
    })

    it('should display profile settings if corresponding tab is selected', async () => {
      renderWithProviders(<Preferences />)

      await userEvent.click(screen.getByText('user.profile.title'))

      expect(screen.getByTestId('ProfileSettingsForm')).toBeInTheDocument()
    })

    it('should display library browser settings if corresponding tab is selected', async () => {
      renderWithProviders(<Preferences />)

      await userEvent.click(screen.getByText('settings.libraryBrowser.title'))

      expect(screen.getByTestId('LibraryBrowserSettings')).toBeInTheDocument()
    })
  })

  describe('when auth is disabled', function () {
    beforeEach(() => {
      useGetAppConfigQueryMock.mockReturnValue({ data: { authEnabled: false } })
    })

    it('should display correctly', () => {
      renderWithProviders(<Preferences />)

      expect(screen.getByText('settings.preferences.title')).toBeInTheDocument()
      expect(screen.getByText('settings.global.title')).toBeInTheDocument()
      expect(screen.queryByText('user.profile.title')).not.toBeInTheDocument()
      expect(screen.getByTestId('GlobalSettings')).toBeInTheDocument()
    })
  })
})
