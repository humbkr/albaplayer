import { screen } from '@testing-library/react'
import { useNavigate } from 'react-router'
import ActionBar from 'common/components/layout/ActionBar'
import { renderWithProviders } from 'common/utils/testing/testUtils'

jest.mock(
  'modules/browser/components/SearchBar',
  () =>
    function () {
      return <div data-testid="search-bar"></div>
    }
)
jest.mock(
  'modules/user/components/UserActionsMenu',
  () =>
    function () {
      return <div data-testid="user-action-menu"></div>
    }
)

jest.mock('react-router')
const useNavigateMock = useNavigate as jest.Mock
const mockNavigate = jest.fn()

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
