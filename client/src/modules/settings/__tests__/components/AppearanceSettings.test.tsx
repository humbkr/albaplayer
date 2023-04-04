import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/darkOrange'
import AppearanceSettings from 'modules/settings/components/AppearanceSettings'
import userEvent from '@testing-library/user-event'
import { setTheme } from 'modules/settings/store'
import { useAppDispatch, useAppSelector } from 'store/hooks'

jest.mock('modules/settings/store', () => ({
  setTheme: jest.fn(),
}))

jest.mock('store/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}))

const useAppSelectorMock = useAppSelector as jest.Mock
const useAppDispatchMock = useAppDispatch as jest.Mock

describe('AppearanceSettings', () => {
  beforeEach(() => {
    useAppSelectorMock.mockReturnValue('default')
    useAppDispatchMock.mockReturnValue(jest.fn())
  })

  it('renders correctly', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <AppearanceSettings />
      </ThemeProvider>
    )

    expect(screen.getByText('settings.appearance.theme')).toBeInTheDocument()
    expect(screen.getByTestId('settings-theme-select')).toBeInTheDocument()
    expect(screen.getByRole('listbox')).toHaveValue('default')
  })

  it('changes the theme correctly', async () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <AppearanceSettings />
      </ThemeProvider>
    )

    await userEvent.selectOptions(screen.getByRole('listbox'), 'darkOrange')

    expect(setTheme).toHaveBeenCalledWith('darkOrange')
  })
})
