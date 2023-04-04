import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'
import { render, screen } from '@testing-library/react'
import Login from 'modules/user/scenes/Login'
import { login } from 'modules/user/authApi'
import userEvent from '@testing-library/user-event'

jest.mock('modules/user/authApi', () => ({
  login: jest.fn(),
}))
const loginMock = login as jest.Mock

const mockOnLogin = jest.fn()

describe('Login screen', () => {
  beforeEach(() => {
    loginMock.mockReturnValue(Promise.resolve({ id: 1, name: 'User 1' }))
  })

  it('renders correctly', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <Login onLogin={mockOnLogin} />
      </ThemeProvider>
    )

    expect(screen.getByAltText('Logo')).toBeInTheDocument()
    expect(screen.getByText('user.login.username')).toBeInTheDocument()
    expect(screen.getByText('user.login.password')).toBeInTheDocument()
    expect(screen.getByText('user.login.login')).toBeInTheDocument()
  })

  it('logs in the user when submitted with correct info', async () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <Login onLogin={mockOnLogin} />
      </ThemeProvider>
    )

    await userEvent.type(screen.getByLabelText('user.login.username'), 'user')
    await userEvent.type(
      screen.getByLabelText('user.login.password'),
      'password'
    )
    await userEvent.click(screen.getByText('user.login.login'))

    expect(loginMock).toHaveBeenCalledWith('user', 'password')
  })

  it('displays an error when submitted with empty info', async () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <Login onLogin={mockOnLogin} />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByText('user.login.login'))

    expect(loginMock).not.toHaveBeenCalled()

    expect(
      await screen.findAllByText('common.forms.requiredField')
    ).toHaveLength(2)
  })

  it('displays an error when submitted with invalid info', async () => {
    loginMock.mockReturnValue(
      Promise.resolve({ error: 'Invalid username or password' })
    )

    render(
      <ThemeProvider theme={themeDefault}>
        <Login onLogin={mockOnLogin} />
      </ThemeProvider>
    )

    await userEvent.type(screen.getByLabelText('user.login.username'), 'user')
    await userEvent.type(
      screen.getByLabelText('user.login.password'),
      'wrongPassword'
    )
    await userEvent.click(screen.getByText('user.login.login'))

    expect(loginMock).toHaveBeenCalledWith('user', 'wrongPassword')

    expect(await screen.findAllByRole('alert')).toHaveLength(2)
    expect(
      await screen.findAllByText('user.login.errors.invalidCredentials')
    ).toHaveLength(2)
  })
})
