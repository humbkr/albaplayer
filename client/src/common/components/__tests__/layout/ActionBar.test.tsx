import { screen } from '@testing-library/react'
import type { Mock } from 'vitest'
import { useNavigate } from 'react-router'
import ActionBar from 'common/components/layout/ActionBar'
import { renderWithProviders } from 'common/utils/testing/test-utils'

vi.mock('modules/browser/components/SearchBar', () => ({
  default: () => <div data-testid="search-bar" />,
}))
vi.mock('modules/user/components/UserActionsMenu', () => ({
  default: () => <div data-testid="user-action-menu" />,
}))

vi.mock('react-router')
const useNavigateMock = useNavigate as Mock
const mockNavigate = vi.fn()

describe('ActionBar', () => {
  beforeEach(() => {
    useNavigateMock.mockReturnValue(mockNavigate)
  })

  it('should contain all the required elements', () => {
    renderWithProviders(<ActionBar />)

    expect(screen.getByTestId('search-bar')).toBeInTheDocument()
    expect(screen.getByTestId('user-action-menu')).toBeInTheDocument()
  })
})
