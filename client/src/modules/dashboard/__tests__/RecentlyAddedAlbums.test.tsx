import { render, screen } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import { makeMockStore } from '../../../../__tests__/test-utils/redux'
import themeDefault from '../../../themes/default'
import { dashboardInitialState } from '../store'
import RecentlyAddedAlbums from '../components/RecentlyAddedAlbums'
import { libraryInitialState } from '../../library/store'

const mockLibrary = {
  artists: {
    1: {
      id: '1',
      name: 'Artist 1',
      dateAdded: 12324343249,
    },
    2: {
      id: '2',
      name: 'Artist 2',
      dateAdded: 12324343247,
    },
  },
  albums: {
    1: {
      id: '1',
      title: 'Album 1',
      year: '1986',
      artistId: '1',
      dateAdded: 12324343245,
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
      dateAdded: 12324343241,
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
})

describe('dashboard - RecentlyAddedAlbums', () => {
  it('should render correctly', () => {
    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <BrowserRouter>
            <RecentlyAddedAlbums />
          </BrowserRouter>
        </ThemeProvider>
      </ReduxProvider>
    )

    expect(screen.getByText('dashboard.recentlyAdded')).toBeInTheDocument()
  })

  it('should render correctly when no albums in the library', () => {
    const customStore = makeMockStore({
      library: libraryInitialState,
      dashboard: dashboardInitialState,
      playlist: mockPlaylist,
    })

    render(
      <ReduxProvider store={customStore}>
        <ThemeProvider theme={themeDefault}>
          <BrowserRouter>
            <RecentlyAddedAlbums />
          </BrowserRouter>
        </ThemeProvider>
      </ReduxProvider>
    )

    expect(screen.getByText('dashboard.noAlbumsFound')).toBeInTheDocument()
    expect(screen.getByText('dashboard.scanLibrary')).toBeInTheDocument()
  })
})
