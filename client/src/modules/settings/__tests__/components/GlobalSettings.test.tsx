import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/darkOrange'
import GlobalSettings from 'modules/settings/components/GlobalSettings'
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
        <GlobalSettings />
      </ThemeProvider>
    )

    expect(screen.getByText('settings.global.theme')).toBeInTheDocument()
    expect(screen.getByTestId('settings-theme-select')).toBeInTheDocument()
    expect(screen.getByRole('listbox')).toHaveValue('default')
  })

  it('changes the theme correctly', async () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <GlobalSettings />
      </ThemeProvider>
    )

    await userEvent.selectOptions(screen.getByRole('listbox'), 'darkOrange')

    expect(setTheme).toHaveBeenCalledWith('darkOrange')
  })
})
