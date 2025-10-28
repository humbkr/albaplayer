import { screen } from '@testing-library/react'
import Login from 'modules/user/scenes/Login'
import { login } from 'modules/user/authApi'
import userEvent from '@testing-library/user-event'
import type { Mock } from 'vitest'
import { renderWithProviders } from 'common/utils/testing/test-utils'

vi.mock('modules/user/authApi', () => ({
  login: vi.fn(),
}))
const loginMock = login as Mock

const mockOnLogin = vi.fn()

describe('User - Login screen', () => {
  beforeEach(() => {
    loginMock.mockReturnValue(Promise.resolve({ id: 1, name: 'User 1' }))
  })

  it('renders correctly', () => {
    renderWithProviders(<Login onLogin={mockOnLogin} />)

    expect(screen.getByAltText('Logo')).toBeInTheDocument()
    expect(screen.getByText('user.login.username')).toBeInTheDocument()
    expect(screen.getByText('user.login.password')).toBeInTheDocument()
    expect(screen.getByText('user.login.login')).toBeInTheDocument()
  })

  it('logs in the user when submitted with correct info', async () => {
    renderWithProviders(<Login onLogin={mockOnLogin} />)

    await userEvent.type(screen.getByLabelText('user.login.username'), 'user')
    await userEvent.type(
      screen.getByLabelText('user.login.password'),
      'password'
    )
    await userEvent.click(screen.getByText('user.login.login'))

    expect(loginMock).toHaveBeenCalledWith('user', 'password')
  })

  it('displays an error when submitted with empty info', async () => {
    renderWithProviders(<Login onLogin={mockOnLogin} />)

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

    renderWithProviders(<Login onLogin={mockOnLogin} />)

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
