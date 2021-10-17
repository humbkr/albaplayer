import dashboardSlice, {
  dashboardInitialState,
  getRandomAlbums,
  setRandomAlbums,
} from '../redux'
import { makeMockStore } from '../../../../__tests__/test-utils/redux'

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

const mockStore = makeMockStore(
  {
    dashboard: dashboardInitialState,
    library: mockLibrary,
  },
  false
)

describe('dashboard (redux)', () => {
  describe('reducer', () => {
    it('should handle setRandomAlbums action', () => {
      expect(
        dashboardSlice(dashboardInitialState, {
          type: setRandomAlbums.type,
          payload: mockLibrary.albums,
        })
      ).toEqual({
        randomAlbumsNumber: 8,
        randomAlbums: mockLibrary.albums,
      })
    })
  })

  describe('getRandomAlbums thunk', () => {
    it('should dispatch correct actions', () => {
      // @ts-ignore
      mockStore.dispatch(getRandomAlbums())
      const actual = mockStore.getActions()
      expect(actual[0].payload.length).toEqual(3)
    })

    it('should dispatch correct actions when there are less albums in library than the number asked for', () => {
      const mockStoreCustom = makeMockStore(
        {
          dashboard: {
            ...dashboardInitialState,
            randomAlbumsNumber: 2,
          },
          library: mockLibrary,
        },
        false
      )

      // @ts-ignore
      mockStoreCustom.dispatch(getRandomAlbums())
      const actual = mockStoreCustom.getActions()
      expect(actual[0].payload.length).toEqual(2)
    })
  })
})
