import configureMockStore from 'redux-mock-store'
// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from 'redux-thunk'
import { api, apolloClient } from 'api'
import settingsSlice, {
  initialState,
  init,
  libraryUpdateStart,
  libraryUpdateSuccess,
  libraryUpdateFailure,
  libraryEraseStart,
  libraryEraseSuccess,
  libraryEraseFailure,
  setTheme,
  initSettings,
  updateLibrary,
  eraseLibrary,
} from '../redux'

jest.mock('api')
// Needed to mock the initLibrary() calls from library module.
// TODO: Find out why it is producing console errors.
jest.mock('modules/library/redux')

const mockStore = configureMockStore([thunk])
const makeMockStore = (customState: any = {}) => mockStore({
  ...initialState,
  ...customState,
})

describe('settings (redux)', () => {
  describe('reducer', () => {
    it('should handle initial state', () => {
      // @ts-ignore
      expect(settingsSlice(undefined, {})).toEqual(initialState)
    })

    it('should handle init action', () => {
      expect(
        settingsSlice(initialState, {
          type: init.type,
          payload: {
            libraryPath: '/fake/path/',
            coversPreferredSource: 'cover',
            disableLibrarySettings: true,
          },
        })
      ).toEqual({
        library: {
          isUpdating: false,
          error: '',
          config: {
            libraryPath: '/fake/path/',
            coversPreferredSource: 'cover',
            disableLibrarySettings: true,
          },
        },
        theme: 'default',
      })
    })

    it('should handle libraryUpdateStart action', () => {
      expect(
        settingsSlice(initialState, {
          type: libraryUpdateStart.type,
        })
      ).toEqual({
        library: {
          isUpdating: true,
          error: '',
          config: {},
        },
        theme: 'default',
      })
    })

    it('should handle libraryUpdateSuccess action', () => {
      const currentlyUpdatingState = {
        library: {
          isUpdating: true,
          error: '',
          config: {},
        },
        theme: 'default',
      }

      expect(
        settingsSlice(currentlyUpdatingState, {
          type: libraryUpdateSuccess.type,
        })
      ).toEqual({
        library: {
          isUpdating: false,
          error: '',
          config: {},
        },
        theme: 'default',
      })
    })

    it('should handle libraryUpdateFailure action', () => {
      const currentlyUpdatingState = {
        library: {
          isUpdating: true,
          error: '',
          config: {},
        },
        theme: 'default',
      }

      expect(
        settingsSlice(currentlyUpdatingState, {
          type: libraryUpdateFailure.type,
          payload: 'Unknown error',
        })
      ).toEqual({
        library: {
          isUpdating: false,
          error: 'Unknown error',
          config: {},
        },
        theme: 'default',
      })
    })

    it('should handle libraryEraseStart action', () => {
      expect(
        settingsSlice(initialState, {
          type: libraryEraseStart.type,
        })
      ).toEqual({
        library: {
          isUpdating: true,
          error: '',
          config: {},
        },
        theme: 'default',
      })
    })

    it('should handle libraryEraseSuccess action', () => {
      const currentlyUpdatingState = {
        library: {
          isUpdating: true,
          error: '',
          config: {},
        },
        theme: 'default',
      }

      expect(
        settingsSlice(currentlyUpdatingState, {
          type: libraryEraseSuccess.type,
        })
      ).toEqual({
        library: {
          isUpdating: false,
          error: '',
          config: {},
        },
        theme: 'default',
      })
    })

    it('should handle libraryEraseFailure action', () => {
      const currentlyUpdatingState = {
        library: {
          isUpdating: true,
          error: '',
          config: {},
        },
        theme: 'default',
      }

      expect(
        settingsSlice(currentlyUpdatingState, {
          type: libraryEraseFailure.type,
          payload: 'Unknown error',
        })
      ).toEqual({
        library: {
          isUpdating: false,
          error: 'Unknown error',
          config: {},
        },
        theme: 'default',
      })
    })

    it('should handle setTheme action', () => {
      expect(
        settingsSlice(initialState, {
          type: setTheme.type,
          payload: 'dark',
        })
      ).toEqual({
        library: {
          isUpdating: false,
          error: '',
          config: {},
        },
        theme: 'dark',
      })
    })
  })

  describe('initLibrary thunk', () => {
    it('should dispatch correct actions on success', () => {
      const store = makeMockStore()

      const response = {
        data: {
          settings: {
            libraryPath: '/remote/lib/path',
            coversPreferredSource: 'folder',
            disableLibrarySettings: false,
            version: '1.2.3',
          },
        },
      }
      api.getSettings = jest.fn().mockImplementationOnce(
        () => new Promise((resolve) => {
          resolve(response)
        })
      )

      const expected = [init(response.data.settings)]

      // @ts-ignore
      store.dispatch(initSettings()).then(() => {
        const actual = store.getActions()
        expect(actual).toEqual(expected)
      })
    })

    it('should dispatch correct actions on failure', () => {
      const store = makeMockStore()

      const response = {
        message: 'It failed.',
      }
      api.getSettings = jest.fn().mockImplementationOnce(
        () => new Promise((resolve, reject) => {
          reject(response)
        })
      )
      api.processApiError = jest
        .fn()
        .mockImplementationOnce((resp) => resp.message)

      const expected = [libraryUpdateFailure(response.message)]

      // @ts-ignore
      store.dispatch(initSettings()).then(() => {
        const actual = store.getActions()
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('updateLibrary thunk', () => {
    it('should dispatch correct actions on success', () => {
      const store = makeMockStore()

      api.scanLibrary = jest.fn().mockImplementationOnce(
        () => new Promise<void>((resolve) => {
          resolve()
        })
      )
      apolloClient.resetStore = jest.fn().mockImplementationOnce(
        () => new Promise<void>((resolve) => {
          resolve()
        })
      )

      const expected = [libraryUpdateStart(), libraryUpdateSuccess()]

      // @ts-ignore
      store.dispatch(updateLibrary()).then(() => {
        const actual = store.getActions()
        expect(actual).toEqual(expected)
      })
    })

    it('should dispatch correct actions on failure', () => {
      const store = makeMockStore()

      const response = {
        message: 'It failed.',
      }
      api.scanLibrary = jest.fn().mockImplementationOnce(
        () => new Promise((resolve, reject) => {
          reject(response)
        })
      )
      api.processApiError = jest
        .fn()
        .mockImplementationOnce((resp) => resp.message)

      const expected = [
        libraryUpdateStart(),
        libraryUpdateFailure(response.message),
      ]

      // @ts-ignore
      store.dispatch(updateLibrary()).then(() => {
        const actual = store.getActions()
        expect(actual).toEqual(expected)
      })
    })
  })

  describe('eraseLibrary thunk', () => {
    it('should dispatch correct actions on success', () => {
      const store = makeMockStore()

      api.emptyLibrary = jest.fn().mockImplementationOnce(
        () => new Promise<void>((resolve) => {
          resolve()
        })
      )
      apolloClient.resetStore = jest.fn().mockImplementationOnce(
        () => new Promise<void>((resolve) => {
          resolve()
        })
      )

      const expected = [libraryEraseStart(), libraryEraseSuccess()]

      // @ts-ignore
      store.dispatch(eraseLibrary()).then(() => {
        const actual = store.getActions()
        expect(actual).toEqual(expected)
      })
    })

    it('should dispatch correct actions on failure', () => {
      const store = makeMockStore()

      const response = {
        message: 'It failed.',
      }
      api.emptyLibrary = jest.fn().mockImplementationOnce(
        () => new Promise((resolve, reject) => {
          reject(response)
        })
      )
      api.processApiError = jest
        .fn()
        .mockImplementationOnce((resp) => resp.message)

      const expected = [
        libraryEraseStart(),
        libraryEraseFailure(response.message),
      ]

      // @ts-ignore
      store.dispatch(eraseLibrary()).then(() => {
        const actual = store.getActions()
        expect(actual).toEqual(expected)
      })
    })
  })
})
