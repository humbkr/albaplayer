import LoadingScreen from 'common/components/layout/LoadingScreen'
import { render, screen } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'
import { makeMockStore } from '../../../../../__tests__/test-utils/redux'

describe('LoadingScreen', () => {
  it('displays a loader when app is fetching data', () => {
    const store = makeMockStore({
      library: {
        isFetching: true,
        initHasFailed: false,
      },
    })

    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <LoadingScreen />
        </ThemeProvider>
      </ReduxProvider>
    )

    expect(screen.getByText('library.initializing')).toBeInTheDocument()
    expect(
      screen.queryByText('library.initialisationFailed')
    ).not.toBeInTheDocument()
  })

  it('displays an error when fetching failed', () => {
    const store = makeMockStore({
      library: {
        isFetching: false,
        initHasFailed: true,
      },
    })

    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <LoadingScreen />
        </ThemeProvider>
      </ReduxProvider>
    )

    expect(screen.queryByText('library.initializing')).not.toBeInTheDocument()
    expect(screen.getByText('library.initialisationFailed')).toBeInTheDocument()
  })
})
