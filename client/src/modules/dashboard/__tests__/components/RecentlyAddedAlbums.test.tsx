import { screen } from '@testing-library/react'
import type { Mock } from 'vitest'
import { BrowserRouter } from 'react-router'
import { dashboardInitialState } from 'modules/dashboard/store'
import RecentlyAddedAlbums from 'modules/dashboard/components/RecentlyAddedAlbums'
import { libraryInitialState } from 'modules/library/store'
import { useGetUserQuery } from 'modules/user/api'
import { USER_ROLE_ADMIN, USER_ROLE_LISTENER } from 'modules/user/constants'
import { renderWithProviders } from 'common/utils/testing/test-utils'

vi.mock('modules/library/api', () => ({
  default: {
    getLibrary: vi.fn(),
  },
}))

vi.mock('modules/dashboard/components/AlbumTeaserHorizontal', () => ({
  default: () => <div data-testid="AlbumTeaserHorizontal" />,
}))

vi.mock('modules/dashboard/components/AlbumMoreActionsContextMenu', () => ({
  default: () => <div data-testid="AlbumMoreActionsContextMenu" />,
}))

vi.mock('modules/user/api', () => ({
  useGetUserQuery: vi.fn(),
}))
const useGetUserQueryMock = useGetUserQuery as Mock

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
  currentPlaylist: '',
}

const mockState = {
  library: mockLibrary,
  playlist: mockPlaylist,
}

describe('dashboard - RecentlyAddedAlbums', () => {
  beforeEach(() => {
    useGetUserQueryMock.mockReturnValue({
      data: { roles: [USER_ROLE_LISTENER] },
    })
  })

  it('should render correctly when albums available', () => {
    renderWithProviders(
      <BrowserRouter>
        <RecentlyAddedAlbums />
      </BrowserRouter>,
      { preloadedState: mockState }
    )

    expect(screen.getByText('dashboard.recentlyAdded')).toBeInTheDocument()
    expect(screen.getAllByTestId('AlbumTeaserHorizontal').length).toBe(3)
  })

  it('should render correctly when no albums in the library and user cannot scan', () => {
    renderWithProviders(
      <BrowserRouter>
        <RecentlyAddedAlbums />
      </BrowserRouter>,
      {
        preloadedState: {
          library: libraryInitialState,
          dashboard: dashboardInitialState,
          playlist: mockPlaylist,
        },
      }
    )

    expect(screen.getByText('dashboard.noAlbumsFound')).toBeInTheDocument()
    expect(screen.queryByText('dashboard.scanLibrary')).not.toBeInTheDocument()
  })

  it('should render correctly when no albums in the library ans user can scan', () => {
    useGetUserQueryMock.mockReturnValue({ data: { roles: [USER_ROLE_ADMIN] } })

    renderWithProviders(
      <BrowserRouter>
        <RecentlyAddedAlbums />
      </BrowserRouter>,
      {
        preloadedState: {
          library: libraryInitialState,
          dashboard: dashboardInitialState,
          playlist: mockPlaylist,
        },
      }
    )

    expect(screen.getByText('dashboard.noAlbumsFound')).toBeInTheDocument()
    expect(screen.getByText('dashboard.scanLibrary')).toBeInTheDocument()
  })
})
