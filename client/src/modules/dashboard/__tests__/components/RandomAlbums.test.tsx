import { BrowserRouter } from 'react-router-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'
import RandomAlbums from 'modules/dashboard/components/RandomAlbums'
import { dashboardInitialState } from 'modules/dashboard/store'
import { makeMockStore } from '../../../../../__tests__/test-utils/redux'

jest.mock('modules/player/store/store', () => ({
  playAlbum: jest.fn(),
}))

const mockLibrary = {
  artists: {
    1: {
      id: '1',
      name: 'Artist 1',
      dateAdded: 12324343243,
    },
    2: {
      id: '2',
      name: 'Artist 2',
      dateAdded: 12324343243,
    },
  },
  albums: {
    1: {
      id: '1',
      title: 'Album 1',
      year: '1986',
      artistId: '1',
      dateAdded: 12324343243,
    },
    2: {
      id: '2',
      title: 'Album 2',
      year: '2002',
      artistId: '2',
      dateAdded: 12324343243,
    },
    3: {
      id: '3',
      title: 'Album 3',
      year: '1992',
      artistId: '1',
      dateAdded: 12324343243,
    },
  },
}

const mockPlaylist = {
  playlists: {
    playlist1: {
      id: 'playlist1',
      title: 'Playlist one',
      date: '2020-09-09',
      items: [],
    },
  },
}

const store = makeMockStore({
  library: mockLibrary,
  playlist: mockPlaylist,
  dashboard: {
    randomAlbumsNumber: 8,
    randomAlbums: [
      {
        id: '1',
        title: 'Album 1',
        year: '1986',
        artistId: '2',
        dateAdded: 1039343423,
      },
      {
        id: '2',
        title: 'Album 2',
        year: '2002',
        artistId: '3',
        dateAdded: 1039343423,
      },
      {
        id: '3',
        title: 'Album 3',
        year: '1992',
        artistId: '2',
        dateAdded: 1039343423,
      },
      {
        id: '4',
        title: 'Compilation',
        year: '2018',
        artistId: '1',
        dateAdded: 1039343423,
      },
    ],
  },
})

describe('dashboard - RandomAlbums', () => {
  it('should render correctly', () => {
    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <BrowserRouter>
            <RandomAlbums />
          </BrowserRouter>
        </ThemeProvider>
      </ReduxProvider>
    )

    expect(screen.getByText('dashboard.randomAlbums')).toBeInTheDocument()
    expect(screen.getAllByTestId('album-teaser')).toBeArrayOfSize(4)
  })

  it('should fetch other albums where pressing "refresh" button', () => {
    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <BrowserRouter>
            <RandomAlbums />
          </BrowserRouter>
        </ThemeProvider>
      </ReduxProvider>
    )

    fireEvent.click(screen.getByTestId('random-albums-refresh-button'))
    expect(store.dispatch).toHaveBeenCalledTimes(1)
  })

  it('should render correctly when no albums in the library', () => {
    const customStore = makeMockStore({
      dashboard: dashboardInitialState,
      playlist: mockPlaylist,
    })

    render(
      <ReduxProvider store={customStore}>
        <ThemeProvider theme={themeDefault}>
          <BrowserRouter>
            <RandomAlbums />
          </BrowserRouter>
        </ThemeProvider>
      </ReduxProvider>
    )

    expect(screen.getByText('dashboard.noAlbumsFound')).toBeInTheDocument()
    expect(screen.getByText('dashboard.scanLibrary')).toBeInTheDocument()
  })
})