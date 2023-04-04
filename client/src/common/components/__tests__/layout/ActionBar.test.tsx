import { render, screen } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import themeDefault from 'themes/lightGreen'
import { ThemeProvider } from 'styled-components'
import { useNavigate } from 'react-router'
import { browserInitialState } from 'modules/browser/store'
import ActionBar from 'common/components/layout/ActionBar'
import { makeMockStore } from '../../../../../__tests__/test-utils/redux'

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
    const store = makeMockStore({
      libraryBrowser: browserInitialState,
    })

    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <ActionBar />
        </ThemeProvider>
      </ReduxProvider>
    )

    expect(screen.getByTestId('search-bar')).toBeInTheDocument()
    expect(screen.getByTestId('user-action-menu')).toBeInTheDocument()
  })
})
