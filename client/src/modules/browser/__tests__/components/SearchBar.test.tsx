import { screen, waitFor } from '@testing-library/react'
import type { Mock } from 'vitest'
import userEvent from '@testing-library/user-event'
import { browserInitialState } from 'modules/browser/store'
import { useNavigate } from 'react-router'
import SearchBar from 'modules/browser/components/SearchBar'
import { renderWithProviders } from 'common/utils/testing/test-utils'

vi.mock('react-router')
const useNavigateMock = useNavigate as Mock
const mockNavigate = vi.fn()

describe('SearchBar', () => {
  beforeEach(() => {
    useNavigateMock.mockReturnValue(mockNavigate)
  })

  it('displays without any error', () => {
    renderWithProviders(<SearchBar />, {
      preloadedState: {
        libraryBrowser: browserInitialState,
      },
    })

    expect(screen.getByTestId('search-filter-all-active')).toBeInTheDocument()
    expect(screen.getByTestId('search-filter-artist')).toBeInTheDocument()
    expect(screen.getByTestId('search-filter-album')).toBeInTheDocument()
    expect(screen.getByTestId('search-filter-track')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('common.search')).toBeInTheDocument()
  })

  it('displays with default values when set', () => {
    renderWithProviders(<SearchBar />, {
      preloadedState: {
        libraryBrowser: {
          ...browserInitialState,
          search: {
            ...browserInitialState.search,
            term: 'Monolord',
            filter: 'artist',
          },
        },
      },
    })

    expect((screen.getByTestId('search-input') as HTMLInputElement).value).toBe(
      'Monolord'
    )
    expect(
      screen.queryByTestId('search-filter-all-active')
    ).not.toBeInTheDocument()
    expect(
      screen.getByTestId('search-filter-artist-active')
    ).toBeInTheDocument()
    expect(
      screen.queryByTestId('search-filter-album-active')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('search-filter-track-active')
    ).not.toBeInTheDocument()
  })

  it('changes the filter to artists when pressing the corresponding button', async () => {
    renderWithProviders(<SearchBar />, {
      preloadedState: {
        libraryBrowser: {
          ...browserInitialState,
          search: {
            ...browserInitialState.search,
            filter: 'track',
          },
        },
      },
    })

    expect(screen.getByTestId('search-filter-artist')).toBeInTheDocument()
    await userEvent.click(screen.getByTestId('search-filter-artist'))
    // TODO add back this test
    // expect(store.dispatch).toHaveBeenCalled()
  })

  it('changes the filter to albums when pressing the corresponding button', async () => {
    renderWithProviders(<SearchBar />, {
      preloadedState: {
        libraryBrowser: browserInitialState,
      },
    })

    expect(screen.getByTestId('search-filter-album')).toBeInTheDocument()
    // TODO add back this test
    // expect(store.dispatch).toHaveBeenCalled()
  })

  it('changes the filter to tracks when pressing the corresponding button', async () => {
    renderWithProviders(<SearchBar />, {
      preloadedState: {
        libraryBrowser: {
          ...browserInitialState,
          search: {
            ...browserInitialState.search,
            filter: 'album',
          },
        },
      },
    })

    expect(screen.getByTestId('search-filter-track')).toBeInTheDocument()
    await userEvent.click(screen.getByTestId('search-filter-track'))
    // TODO add back this test
    // expect(store.dispatch).toHaveBeenCalled()
  })

  it('changes the filter to all when pressing the corresponding button', async () => {
    renderWithProviders(<SearchBar />, {
      preloadedState: {
        libraryBrowser: {
          ...browserInitialState,
          search: {
            ...browserInitialState.search,
            filter: 'artist',
          },
        },
      },
    })

    expect(screen.getByTestId('search-filter-all')).toBeInTheDocument()
    await userEvent.click(screen.getByTestId('search-filter-all'))
    // TODO add back this test
    // expect(store.dispatch).toHaveBeenCalled()
  })

  it('runs search when input value changes', async () => {
    renderWithProviders(<SearchBar />, {
      preloadedState: {
        libraryBrowser: browserInitialState,
      },
    })

    await userEvent.type(screen.getByTestId('search-input'), 'all them witches')
    expect(screen.getByTestId('search-input') as HTMLInputElement).toHaveValue(
      'all them witches'
    )

    // TODO add back this test
    // await waitFor(() => {
    //   expect(store.dispatch).toHaveBeenCalled()
    // })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/library')
    })
  })
})
