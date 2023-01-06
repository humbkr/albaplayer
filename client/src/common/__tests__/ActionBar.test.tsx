import { render, screen } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import themeDefault from 'themes/default'
import { ThemeProvider } from 'styled-components'
import { useNavigate } from 'react-router'
import { browserInitialState } from 'modules/browser/store'
import { makeMockStore } from '../../../__tests__/test-utils/redux'
import ActionBar from '../components/ActionBar'

jest.mock('react-router')
const useNavigateMock = useNavigate as jest.Mock
const mockNavigate = jest.fn()

describe('ActionBar', () => {
  beforeEach(() => {
    useNavigateMock.mockReturnValue(mockNavigate)
  })

  it('display correctly', () => {
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
  })
})
