import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateRootUser from 'modules/user/scenes/CreateRootUser'
import { createRootUser } from 'modules/user/authApi'
import { useGetAppConfigQuery } from 'modules/settings/api'

jest.mock('modules/settings/api', () => ({
  useGetAppConfigQuery: jest.fn(),
}))
const useGetAppConfigQueryMock = useGetAppConfigQuery as jest.Mock

jest.mock('modules/user/authApi', () => ({
  createRootUser: jest.fn(),
}))
const createRootUserMock = createRootUser as jest.Mock

const mockOnCreateRootUser = jest.fn()

describe('User - Create root user screen', () => {
  beforeEach(() => {
    useGetAppConfigQueryMock.mockReturnValue({ data: { authEnabled: true } })
    createRootUserMock.mockReturnValue(Promise.resolve({ status: 200 }))
  })

  it('renders correctly', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <CreateRootUser onCreateRootUser={mockOnCreateRootUser} />
      </ThemeProvider>
    )

    expect(screen.getByAltText('Logo')).toBeInTheDocument()
    expect(screen.getByText('user.createRoot.title')).toBeInTheDocument()
    expect(screen.getByText('user.createRoot.description')).toBeInTheDocument()
    expect(
      screen.queryByText('user.createRoot.description_noauth')
    ).not.toBeInTheDocument()
    expect(screen.getByText('user.createRoot.username')).toBeInTheDocument()
    expect(screen.getByText('user.createRoot.password')).toBeInTheDocument()
    expect(
      screen.getByText('user.createRoot.confirmPassword')
    ).toBeInTheDocument()
    expect(screen.getByText('user.createRoot.create')).toBeInTheDocument()
  })

  it('renders correctly when auth is disabled', () => {
    useGetAppConfigQueryMock.mockReturnValue({ data: { authEnabled: false } })

    render(
      <ThemeProvider theme={themeDefault}>
        <CreateRootUser onCreateRootUser={mockOnCreateRootUser} />
      </ThemeProvider>
    )

    expect(screen.getByAltText('Logo')).toBeInTheDocument()
    expect(screen.getByText('user.createRoot.title')).toBeInTheDocument()
    expect(screen.getByText('user.createRoot.description')).toBeInTheDocument()
    expect(
      screen.getByText('user.createRoot.description_noauth')
    ).toBeInTheDocument()
    expect(screen.getByText('user.createRoot.username')).toBeInTheDocument()
    expect(screen.getByText('user.createRoot.password')).toBeInTheDocument()
    expect(
      screen.getByText('user.createRoot.confirmPassword')
    ).toBeInTheDocument()
    expect(screen.getByText('user.createRoot.create')).toBeInTheDocument()
  })

  it('creates a root user when submitted with correct info', async () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <CreateRootUser onCreateRootUser={mockOnCreateRootUser} />
      </ThemeProvider>
    )

    await userEvent.type(
      screen.getByLabelText('user.createRoot.username'),
      'user'
    )
    await userEvent.type(
      screen.getByLabelText('user.createRoot.password'),
      'password'
    )
    await userEvent.type(
      screen.getByLabelText('user.createRoot.confirmPassword'),
      'password'
    )
    await userEvent.click(screen.getByText('user.createRoot.create'))

    expect(createRootUser).toHaveBeenCalledWith('user', 'password')
    expect(mockOnCreateRootUser).toHaveBeenCalled()
  })

  it('displays an error when submitted with empty info', async () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <CreateRootUser onCreateRootUser={mockOnCreateRootUser} />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByText('user.createRoot.create'))

    expect(createRootUser).not.toHaveBeenCalled()
    expect(mockOnCreateRootUser).not.toHaveBeenCalled()

    expect(
      await screen.findAllByText('common.forms.requiredField')
    ).toHaveLength(3)
  })

  it('displays an error when submitted with invalid username', async () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <CreateRootUser onCreateRootUser={mockOnCreateRootUser} />
      </ThemeProvider>
    )

    // Username should not have white space.
    await userEvent.type(
      screen.getByLabelText('user.createRoot.username'),
      'user name'
    )
    await userEvent.type(
      screen.getByLabelText('user.createRoot.password'),
      'password'
    )
    await userEvent.type(
      screen.getByLabelText('user.createRoot.confirmPassword'),
      'password'
    )
    await userEvent.click(screen.getByText('user.createRoot.create'))

    await waitFor(() => {
      expect(
        screen.getByText('user.createRoot.errors.noWhitespace')
      ).toBeInTheDocument()
    })

    expect(createRootUser).not.toHaveBeenCalled()
    expect(mockOnCreateRootUser).not.toHaveBeenCalled()
  })

  it('displays an error when submitted with invalid confirm password', async () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <CreateRootUser onCreateRootUser={mockOnCreateRootUser} />
      </ThemeProvider>
    )

    await userEvent.type(
      screen.getByLabelText('user.createRoot.username'),
      'user'
    )
    await userEvent.type(
      screen.getByLabelText('user.createRoot.password'),
      'password'
    )
    await userEvent.type(
      screen.getByLabelText('user.createRoot.confirmPassword'),
      'not same password'
    )
    await userEvent.click(screen.getByText('user.createRoot.create'))

    await waitFor(() => {
      expect(
        screen.getByText('user.createRoot.errors.passwordConfirm')
      ).toBeInTheDocument()
    })

    expect(createRootUser).not.toHaveBeenCalled()
    expect(mockOnCreateRootUser).not.toHaveBeenCalled()
  })

  it('displays an error if a backend error occurs', async () => {
    createRootUserMock.mockReturnValue(Promise.resolve({ error: 'Woops' }))

    render(
      <ThemeProvider theme={themeDefault}>
        <CreateRootUser onCreateRootUser={mockOnCreateRootUser} />
      </ThemeProvider>
    )

    await userEvent.type(
      screen.getByLabelText('user.createRoot.username'),
      'user'
    )
    await userEvent.type(
      screen.getByLabelText('user.createRoot.password'),
      'password'
    )
    await userEvent.type(
      screen.getByLabelText('user.createRoot.confirmPassword'),
      'password'
    )
    await userEvent.click(screen.getByText('user.createRoot.create'))

    expect(createRootUser).toHaveBeenCalled()
    expect(mockOnCreateRootUser).not.toHaveBeenCalled()

    expect(await screen.findAllByRole('alert')).toHaveLength(1)
    expect(
      screen.getByText('user.createRoot.errors.generic')
    ).toBeInTheDocument()
  })
})
