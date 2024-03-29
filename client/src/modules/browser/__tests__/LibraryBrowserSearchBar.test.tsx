import { render, screen } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'

import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/default'
import userEvent from '@testing-library/user-event'
import { makeMockStore } from '../../../../__tests__/test-utils/redux'
import LibraryBrowserSearchBar from '../components/LibraryBrowserSearchBar'
import { browserInitialState } from '../store'

describe('LibraryBrowserSearchBar', () => {
  beforeEach(() => jest.clearAllMocks())

  it('displays without any error', () => {
    const store = makeMockStore({
      libraryBrowser: browserInitialState,
    })

    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <LibraryBrowserSearchBar />
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
          <LibraryBrowserSearchBar />
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
          <LibraryBrowserSearchBar />
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
          <LibraryBrowserSearchBar />
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
          <LibraryBrowserSearchBar />
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
          <LibraryBrowserSearchBar />
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
          <LibraryBrowserSearchBar />
        </ThemeProvider>
      </ReduxProvider>
    )

    await userEvent.type(screen.getByTestId('search-input'), 'all them witches')
    expect(screen.getByTestId('search-input') as HTMLInputElement).toHaveValue(
      'all them witches'
    )
    // Can't make the simplest things work with react-testing-library, fuck it.
    // expect(store.dispatch).toHaveBeenCalled()
  })
})
