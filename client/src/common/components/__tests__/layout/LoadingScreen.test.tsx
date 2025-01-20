import LoadingScreen from 'common/components/layout/LoadingScreen'
import { screen } from '@testing-library/react'
import { renderWithProviders } from 'common/utils/testing/testUtils'

describe('LoadingScreen', () => {
  it('displays a loader when app is fetching data', () => {
    renderWithProviders(<LoadingScreen />, {
      preloadedState: {
        library: {
          isFetching: true,
          initHasFailed: false,
        },
      },
    })

    expect(screen.getByText('library.initializing')).toBeInTheDocument()
    expect(
      screen.queryByText('library.initialisationFailed')
    ).not.toBeInTheDocument()
  })

  it('displays an error when fetching failed', () => {
    renderWithProviders(<LoadingScreen />, {
      preloadedState: {
        library: {
          isFetching: false,
          initHasFailed: true,
        },
      },
    })

    expect(screen.queryByText('library.initializing')).not.toBeInTheDocument()
    expect(screen.getByText('library.initialisationFailed')).toBeInTheDocument()
  })
})
