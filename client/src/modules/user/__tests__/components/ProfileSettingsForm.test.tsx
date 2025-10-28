import { screen } from '@testing-library/react'
import ProfileSettingsForm from 'modules/user/components/ProfileSettingsForm'
import { useGetUserQuery } from 'modules/user/api'
import userEvent from '@testing-library/user-event'
import type { Mock } from 'vitest'
import { renderWithProviders } from 'common/utils/testing/test-utils'

const mockUpdateUser = vi.fn()
vi.mock('modules/user/api', () => ({
  useGetUserQuery: vi.fn(),
  useUpdateUserMutation: () => [mockUpdateUser, { isLoading: false }],
}))

describe('ProfileSettingsForm', () => {
  beforeEach(() => {
    ;(useGetUserQuery as Mock).mockReturnValue({
      data: {
        id: '1',
        username: 'test',
        roles: ['admin', 'listener'],
      },
    })
  })

  it('displays correctly', () => {
    renderWithProviders(<ProfileSettingsForm />)

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
    renderWithProviders(<ProfileSettingsForm />)

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
