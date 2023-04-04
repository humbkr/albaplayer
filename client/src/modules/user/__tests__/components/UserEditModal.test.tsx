import { render, screen } from '@testing-library/react'
import UserEditModal from 'modules/user/components/UserEditModal'
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from 'modules/user/store/api'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'
import React from 'react'

jest.mock('common/components/layout/Modal', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>test {children}</div>
  ),
}))

jest.mock('modules/user/store/api', () => ({
  useCreateUserMutation: jest.fn(),
  useUpdateUserMutation: jest.fn(),
}))

const useCreateUserMutationMock = useCreateUserMutation as jest.Mock
const useUpdateUserMutationMock = useUpdateUserMutation as jest.Mock

jest.mock(
  'modules/user/components/UserEditForm',
  () =>
    function () {
      return <div data-testid="UserEditForm" />
    }
)
const mockOnClose = jest.fn()

describe('UserEditModal', () => {
  beforeEach(() => {
    useCreateUserMutationMock.mockReturnValue([jest.fn(), { isLoading: false }])
    useUpdateUserMutationMock.mockReturnValue([jest.fn(), { isLoading: false }])
  })

  it('renders UserEditModal correctly', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <UserEditModal isOpen onClose={mockOnClose} />
      </ThemeProvider>
    )

    expect(screen.getByTestId('UserEditForm')).toBeInTheDocument()
  })
})
