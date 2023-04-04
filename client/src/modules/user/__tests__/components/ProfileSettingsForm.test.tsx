import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/darkGreen'
import { render, screen } from '@testing-library/react'
import ProfileSettingsForm from 'modules/user/components/ProfileSettingsForm'
import { useGetUserQuery } from 'modules/user/store/api'
import userEvent from '@testing-library/user-event'

const mockUpdateUser = jest.fn()
jest.mock('modules/user/store/api', () => ({
  useGetUserQuery: jest.fn(),
  useUpdateUserMutation: () => [mockUpdateUser, { isLoading: false }],
}))

describe('ProfileSettingsForm', () => {
  beforeEach(() => {
    ;(useGetUserQuery as jest.Mock).mockReturnValue({
      data: {
        id: '1',
        username: 'test',
        roles: ['admin', 'listener'],
      },
    })
  })

  it('displays correctly', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <ProfileSettingsForm />
      </ThemeProvider>
    )

    expect(
      screen.getByText('user.profile.roles', { exact: false })
    ).toBeInTheDocument()
    expect(screen.getByText('user.profile.username')).toBeInTheDocument()
    expect(screen.getByText('user.profile.changePassword')).toBeInTheDocument()
    expect(screen.getByText('user.profile.submit')).toBeInTheDocument()

    expect(
      screen.queryByText('user.profile.currentPassword')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText('user.profile.newPassword')
    ).not.toBeInTheDocument()
  })

  it('displays password fields when user choose to update their password', async () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <ProfileSettingsForm />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByText('user.profile.changePassword'))

    expect(
      screen.getByText('user.profile.roles', { exact: false })
    ).toBeInTheDocument()
    expect(screen.getByText('user.profile.username')).toBeInTheDocument()
    expect(screen.getByText('user.profile.keepPassword')).toBeInTheDocument()
    expect(screen.getByText('user.profile.submit')).toBeInTheDocument()

    expect(screen.getByText('user.profile.currentPassword')).toBeInTheDocument()
    expect(screen.getByText('user.profile.newPassword')).toBeInTheDocument()
  })
})
