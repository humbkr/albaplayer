import { render, screen, waitFor } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'

import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'
import userEvent from '@testing-library/user-event'
import { browserInitialState } from 'modules/browser/store'
import { useNavigate } from 'react-router'
import SearchBar from 'modules/browser/components/SearchBar'
import { makeMockStore } from '../../../../../__tests__/test-utils/redux'

jest.mock('react-router')
const useNavigateMock = useNavigate as jest.Mock
const mockNavigate = jest.fn()

describe('SearchBar', () => {
  beforeEach(() => {
    useNavigateMock.mockReturnValue(mockNavigate)
  })

  it('displays without any error', () => {
    const store = makeMockStore({
      libraryBrowser: browserInitialState,
    })

    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <SearchBar />
        </ThemeProvider>
      </ReduxProvider>
    )

    expect(screen.getByTestId('search-filter-all-active')).toBeInTheDocument()
    expect(screen.getByTestId('search-filter-artist')).toBeInTheDocument()
    expect(screen.getByTestId('search-filter-album')).toBeInTheDocument()
    expect(screen.getByTestId('search-filter-track')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('common.search')).toBeInTheDocument()
  })

  it('displays with default values when set', () => {
    const store = makeMockStore({
      libraryBrowser: {
        ...browserInitialState,
        search: {
          ...browserInitialState.search,
          term: 'Monolord',
          filter: 'artist',
        },
      },
    })

    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <SearchBar />
        </ThemeProvider>
      </ReduxProvider>
    )

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
    const store = makeMockStore({
      libraryBrowser: browserInitialState,
      search: {
        ...browserInitialState.search,
        filter: 'track',
      },
    })

    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <SearchBar />
        </ThemeProvider>
      </ReduxProvider>
    )

    expect(screen.getByTestId('search-filter-artist')).toBeInTheDocument()
    await userEvent.click(screen.getByTestId('search-filter-artist'))
    expect(store.dispatch).toHaveBeenCalled()
  })

  it('changes the filter to albums when pressing the corresponding button', async () => {
    const store = makeMockStore({
      libraryBrowser: browserInitialState,
    })

    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <SearchBar />
        </ThemeProvider>
      </ReduxProvider>
    )

    expect(screen.getByTestId('search-filter-album')).toBeInTheDocument()
    await userEvent.click(screen.getByTestId('search-filter-album'))
    expect(store.dispatch).toHaveBeenCalled()
  })

  it('changes the filter to tracks when pressing the corresponding button', async () => {
    const store = makeMockStore({
      libraryBrowser: browserInitialState,
      search: {
        ...browserInitialState.search,
        filter: 'album',
      },
    })

    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <SearchBar />
        </ThemeProvider>
      </ReduxProvider>
    )

    expect(screen.getByTestId('search-filter-track')).toBeInTheDocument()
    await userEvent.click(screen.getByTestId('search-filter-track'))
    expect(store.dispatch).toHaveBeenCalled()
  })

  it('changes the filter to all when pressing the corresponding button', async () => {
    const store = makeMockStore({
      libraryBrowser: {
        ...browserInitialState,
        search: {
          ...browserInitialState.search,
          filter: 'artist',
        },
      },
    })

    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <SearchBar />
        </ThemeProvider>
      </ReduxProvider>
    )

    expect(screen.getByTestId('search-filter-all')).toBeInTheDocument()
    await userEvent.click(screen.getByTestId('search-filter-all'))
    expect(store.dispatch).toHaveBeenCalled()
  })

  it('runs search when input value changes', async () => {
    const store = makeMockStore({
      libraryBrowser: browserInitialState,
    })

    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <SearchBar />
        </ThemeProvider>
      </ReduxProvider>
    )

    await userEvent.type(screen.getByTestId('search-input'), 'all them witches')
    expect(screen.getByTestId('search-input') as HTMLInputElement).toHaveValue(
      'all them witches'
    )

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/library')
    })
  })
})
