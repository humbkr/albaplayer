import configureMockStore from 'redux-mock-store'
// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from 'redux-thunk'
import librarySlice, {
  libraryInitialState,
  LibraryStateType,
  initLibrary,
  fetchLibrary,
  initStart,
  initFailure,
  initSuccess,
  setLastScan,
  shouldFetchLibrary,
} from '../redux'
import { api } from '../../../api'

jest.mock('api')
const mockStore = configureMockStore([thunk])
const makeMockStore = (customState: any = {}) => mockStore({
  ...customState,
})

const mockLibraryState: LibraryStateType = {
  ...libraryInitialState,
  isInitialized: true,
  artists: {
    1: {
      id: '1',
      name: 'Various artists',
    },
    2: {
      id: '2',
      name: 'Zote the mighty',
    },
    3: {
      id: '3',
      name: 'Cornifer',
    },
  },
  albums: {
    1: {
      id: '1',
      title: 'Album 1',
      year: '1986',
      artistId: '2',
      dateAdded: 1614682652,
    },
    2: {
      id: '2',
      title: 'Album 2',
      year: '2002',
      artistId: '3',
      dateAdded: 1614682652,
    },
    3: {
      id: '3',
      title: 'Album 3',
      year: '1992',
      artistId: '2',
      dateAdded: 1614682652,
    },
    4: {
      id: '4',
      title: 'Compilation',
      year: '2018',
      artistId: '1',
      dateAdded: 1614682652,
    },
  },
  tracks: {
    1: {
      id: '1',
      title: 'Track 1',
      number: 1,
      disc: '',
      duration: 123,
      cover: '',
      albumId: '1',
      artistId: '2',
    },
    2: {
      id: '2',
      title: 'I draw a map',
      number: 2,
      disc: '',
      duration: 124,
      cover: '',
      albumId: '2',
      artistId: '3',
    },
    3: {
      id: '3',
      title: 'Track 3',
      number: 2,
      disc: '',
      duration: 124,
      cover: '',
      albumId: '1',
      artistId: '2',
    },
    4: {
      id: '4',
      title: 'Track 4',
      number: 1,
      disc: '',
      duration: 124,
      cover: '',
      albumId: '3',
      artistId: '2',
    },
    5: {
      id: '5',
      title: 'Track 5',
      number: 1,
      disc: '',
      duration: 164,
      cover: '',
      albumId: '4',
      artistId: '1',
    },
  },
}

describe('library (redux)', () => {
  describe('reducer', () => {
    it('should handle librarySlice initial state', () => {
      // @ts-ignore
      expect(librarySlice(undefined, {})).toEqual(libraryInitialState)
    })
  })

  it('should handle initStart action', () => {
    const testState: LibraryStateType = {
      ...libraryInitialState,
    }

    expect(
      librarySlice(testState, {
        type: initStart.type,
      })
    ).toEqual({
      ...testState,
      isFetching: true,
    })
  })

  it('should handle initSuccess action', () => {
    const testState: LibraryStateType = {
      ...libraryInitialState,
    }

    const expectedAlbums: { [id: string]: Album } = {}
    Object.values(mockLibraryState.albums)
      .map((item) => ({
        ...item,
        artistName: item.artistId
          ? mockLibraryState.artists[item.artistId].name
          : '',
      }))
      .forEach((item) => {
        expectedAlbums[item.id] = item
      })

    expect(
      librarySlice(testState, {
        type: initSuccess.type,
        payload: {
          artists: Object.values(mockLibraryState.artists),
          albums: Object.values(mockLibraryState.albums),
          tracks: Object.values(mockLibraryState.tracks),
        },
      })
    ).toEqual({
      ...testState,
      isFetching: false,
      isInitialized: true,
      artists: mockLibraryState.artists,
      // Need to add artist name.
      albums: expectedAlbums,
      tracks: mockLibraryState.tracks,
    })
  })

  it('should handle initFailure action', () => {
    const testState: LibraryStateType = {
      ...libraryInitialState,
      isFetching: true,
      isInitialized: true,
    }

    expect(
      librarySlice(testState, {
        type: initFailure.type,
      })
    ).toEqual({
      ...testState,
      isFetching: false,
      isInitialized: false,
      initHasFailed: true,
    })
  })

  it('should handle setLastScan action', () => {
    const testState: LibraryStateType = {
      ...libraryInitialState,
    }

    expect(
      librarySlice(testState, {
        type: setLastScan.type,
        payload: '20200417143543',
      })
    ).toEqual({
      ...testState,
      lastScan: '20200417143543',
    })
  })

  describe('initLibrary thunk', () => {
    it('should bypass shouldFetchLibrary() when force parameter is set', async () => {
      const store = makeMockStore({
        library: {
          ...libraryInitialState,
          isFetching: true,
        },
      })
      const dispatch = jest.fn()

      // @ts-ignore
      await initLibrary(true)(dispatch, store.getState)
      expect(dispatch).toHaveBeenCalled()
    })

    it('should do nothing when shouldFetchLibrary() returns false and force is not set', async () => {
      const store = makeMockStore({
        library: {
          ...libraryInitialState,
          isFetching: true,
        },
      })
      const dispatch = jest.fn()

      // @ts-ignore
      await initLibrary()(dispatch, store.getState)
      expect(dispatch).not.toHaveBeenCalled()
    })
  })

  describe('fetchLibrary thunk', () => {
    it('should dispatch correct actions when api call is successful', () => {
      const store = makeMockStore()

      const response = {
        data: {
          artists: Object.values(mockLibraryState.artists),
          albums: Object.values(mockLibraryState.albums),
          tracks: Object.values(mockLibraryState.tracks),
          variable: {
            value: '20200417145741',
          },
        },
      }

      api.getLibrary = jest.fn().mockImplementationOnce(
        () => new Promise((resolve) => {
          resolve(response)
        })
      )

      const expected = [
        initStart(),
        initSuccess(response.data),
        setLastScan(response.data.variable.value),
      ]

      // @ts-ignore
      store.dispatch(fetchLibrary()).then(() => {
        const actual = store.getActions()
        expect(actual).toEqual(expected)
      })
    })

    it('should dispatch correct actions when api call is unsuccessful', () => {
      const store = makeMockStore()

      api.getLibrary = jest.fn().mockImplementationOnce(
        () => new Promise((resolve, reject) => {
          reject()
        })
      )

      const expected = [initStart(), initFailure()]

      // @ts-ignore
      store.dispatch(fetchLibrary()).then(() => {
        const actual = store.getActions()
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('shouldFetchLibrary utility function', () => {
    it('should return false if library is already fetching', async () => {
      const testState: LibraryStateType = {
        ...libraryInitialState,
        isFetching: true,
      }

      expect(await shouldFetchLibrary(testState)).toBeFalse()
    })

    it('should return true if there is no previous scan date stored', async () => {
      const testState: LibraryStateType = {
        ...libraryInitialState,
      }

      expect(await shouldFetchLibrary(testState)).toBeTrue()
    })

    it('should return false if remote scan date is before or the same as the local one', async () => {
      const testState: LibraryStateType = {
        ...libraryInitialState,
        lastScan: '20200417130000',
      }

      api.getVariable = jest.fn().mockImplementationOnce(
        () => new Promise((resolve) => {
          resolve({
            data: { variable: { value: '20200417130000' } },
          })
        })
      )

      expect(await shouldFetchLibrary(testState)).toBeFalse()
    })

    it('should return true if remote scan date is after the local one', async () => {
      const testState: LibraryStateType = {
        ...libraryInitialState,
        lastScan: '20200417130000',
      }

      api.getVariable = jest.fn().mockImplementationOnce(
        () => new Promise((resolve) => {
          resolve({
            data: { variable: { value: '20200417130001' } },
          })
        })
      )

      expect(await shouldFetchLibrary(testState)).toBeTrue()
    })

    it('should return true if impossible to get the last remote scan date', async () => {
      const testState: LibraryStateType = {
        ...libraryInitialState,
        lastScan: '20200417130000',
      }

      api.getVariable = jest.fn().mockImplementationOnce(
        () => new Promise((resolve, reject) => {
          reject()
        })
      )

      expect(await shouldFetchLibrary(testState)).toBeTrue()
    })
  })
})
