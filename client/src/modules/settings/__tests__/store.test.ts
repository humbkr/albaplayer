import configureMockStore from 'redux-mock-store'
// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from 'redux-thunk'
import libraryAPI from 'modules/library/api'
import { processApiError } from 'api/helpers'
import api from 'api/api'
import { fetchLibrary, initLibrary } from 'modules/library/store'
import settingsSlice, {
  eraseLibrary,
  initialState,
  initSettings,
  setTheme,
  SettingsStateType,
  updateLibrary,
} from '../store'

jest.mock('api/helpers')
const processApiErrorMock = processApiError as jest.Mock

jest.mock('modules/library/api', () => ({}))
jest.mock('api/api', () => ({}))

const mockStore = configureMockStore([thunk])
const makeMockStore = (customState: any = {}) =>
  mockStore({
    ...initialState,
    ...customState,
  })

describe('settings (redux)', () => {
  describe('reducers', () => {
    it('should handle initial state', () => {
      // @ts-ignore
      expect(settingsSlice(undefined, {})).toEqual(initialState)
    })

    it('should handle setTheme action', () => {
      expect(
        settingsSlice(initialState, {
          type: setTheme.type,
          payload: 'dark',
        })
      ).toEqual({
        ...initialState,
        library: {
          isUpdating: false,
          error: '',
          config: {},
        },
        theme: 'dark',
      })
    })
  })

  describe('extra reducers', () => {
    describe('initSettings', () => {
      it('updates state correctly for the pending action', () => {
        const mockState: SettingsStateType = { ...initialState }

        expect(
          settingsSlice(mockState, {
            type: initSettings.pending.type,
            payload: null,
          })
        ).toEqual({
          ...mockState,
          library: {
            ...mockState.library,
            error: '',
            isUpdating: true,
          },
        })
      })

      it('updates state correctly for the fulfilled action', () => {
        const mockState: SettingsStateType = {
          ...initialState,
          library: {
            ...initialState.library,
            isUpdating: true,
          },
        }

        expect(
          settingsSlice(mockState, {
            type: initSettings.fulfilled.type,
            payload: {
              libraryPath: '/fake/path/',
              coversPreferredSource: 'cover',
              disableLibrarySettings: true,
              version: '2022-03-04',
            },
          })
        ).toEqual({
          ...mockState,
          library: {
            ...mockState.library,
            error: '',
            isUpdating: false,
            config: {
              libraryPath: '/fake/path/',
              coversPreferredSource: 'cover',
              disableLibrarySettings: true,
              version: '2022-03-04',
            },
          },
        })
      })

      it('updates state correctly for the rejected action', () => {
        processApiErrorMock.mockImplementationOnce((resp) => resp.message)

        const mockState: SettingsStateType = {
          ...initialState,
          library: {
            ...initialState.library,
            isUpdating: true,
          },
        }

        expect(
          settingsSlice(mockState, {
            type: initSettings.rejected.type,
            payload: {
              message: 'An error occurred',
            },
          })
        ).toEqual({
          ...mockState,
          library: {
            ...mockState.library,
            error: 'An error occurred',
            isUpdating: false,
          },
        })
      })
    })

    describe('updateLibrary', () => {
      it('updates state correctly for the pending action', () => {
        const mockState: SettingsStateType = { ...initialState }

        expect(
          settingsSlice(mockState, {
            type: updateLibrary.pending.type,
            payload: null,
          })
        ).toEqual({
          ...mockState,
          library: {
            ...mockState.library,
            error: '',
            isUpdating: true,
          },
        })
      })

      it('updates state correctly for the fulfilled action', () => {
        const mockState: SettingsStateType = {
          ...initialState,
          library: {
            ...initialState.library,
            isUpdating: true,
          },
        }

        expect(
          settingsSlice(mockState, {
            type: updateLibrary.fulfilled.type,
            payload: null,
          })
        ).toEqual({
          ...mockState,
          library: {
            ...mockState.library,
            error: '',
            isUpdating: false,
          },
        })
      })

      it('updates state correctly for the rejected action', () => {
        processApiErrorMock.mockImplementationOnce((resp) => resp.message)

        const mockState: SettingsStateType = {
          ...initialState,
          library: {
            ...initialState.library,
            isUpdating: true,
          },
        }

        expect(
          settingsSlice(mockState, {
            type: updateLibrary.rejected.type,
            payload: {
              message: 'An error occurred',
            },
          })
        ).toEqual({
          ...mockState,
          library: {
            ...mockState.library,
            error: 'An error occurred',
            isUpdating: false,
          },
        })
      })
    })

    describe('eraseLibrary', () => {
      it('updates state correctly for the pending action', () => {
        const mockState: SettingsStateType = { ...initialState }

        expect(
          settingsSlice(mockState, {
            type: eraseLibrary.pending.type,
            payload: null,
          })
        ).toEqual({
          ...mockState,
          library: {
            ...mockState.library,
            error: '',
            isUpdating: true,
          },
        })
      })

      it('updates state correctly for the fulfilled action', () => {
        const mockState: SettingsStateType = {
          ...initialState,
          library: {
            ...initialState.library,
            isUpdating: true,
          },
        }

        expect(
          settingsSlice(mockState, {
            type: eraseLibrary.fulfilled.type,
            payload: null,
          })
        ).toEqual({
          ...mockState,
          library: {
            ...mockState.library,
            error: '',
            isUpdating: false,
          },
        })
      })

      it('updates state correctly for the rejected action', () => {
        processApiErrorMock.mockImplementationOnce((resp) => resp.message)

        const mockState: SettingsStateType = {
          ...initialState,
          library: {
            ...initialState.library,
            isUpdating: true,
          },
        }

        expect(
          settingsSlice(mockState, {
            type: eraseLibrary.rejected.type,
            payload: {
              message: 'An error occurred',
            },
          })
        ).toEqual({
          ...mockState,
          library: {
            ...mockState.library,
            error: 'An error occurred',
            isUpdating: false,
          },
        })
      })
    })
  })

  describe('initSettings thunk', () => {
    it('should dispatch correct actions on success', async () => {
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
        () =>
          new Promise((resolve) => {
            resolve(response)
          })
      )

      // @ts-ignore
      await store.dispatch(initSettings())

      const actual = store.getActions()

      expect(actual[0].type).toEqual(initSettings.pending.type)
      expect(actual[1].type).toEqual(initSettings.fulfilled.type)
    })

    it('should dispatch correct actions on failure', async () => {
      const store = makeMockStore()

      const response = {
        message: 'It failed.',
      }
      api.getSettings = jest.fn().mockImplementationOnce(
        () =>
          new Promise((resolve, reject) => {
            reject(response)
          })
      )
      processApiErrorMock.mockImplementationOnce((resp) => resp.message)

      // @ts-ignore
      await store.dispatch(initSettings())

      const actual = store.getActions()

      expect(actual[0].type).toEqual(initSettings.pending.type)
      expect(actual[1].type).toEqual(initSettings.rejected.type)
    })
  })

  describe('updateLibrary thunk', () => {
    it('should dispatch correct actions on success', async () => {
      const store = makeMockStore()

      libraryAPI.scanLibrary = jest.fn().mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolve({
              data: {},
            })
          })
      )
      libraryAPI.getLibrary = jest.fn().mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolve({
              data: {},
            })
          })
      )

      // @ts-ignore
      await store.dispatch(updateLibrary())

      const actual = store.getActions()

      expect(actual[0].type).toEqual(updateLibrary.pending.type)
      expect(actual[1].type).toEqual(initLibrary.pending.type)
      expect(actual[2].type).toEqual(fetchLibrary.pending.type)
      expect(actual[3].type).toEqual(updateLibrary.fulfilled.type)
    })

    it('should dispatch correct actions on failure', async () => {
      const store = makeMockStore()

      const response = {
        message: 'It failed.',
      }
      libraryAPI.scanLibrary = jest.fn().mockImplementationOnce(
        () =>
          new Promise((resolve, reject) => {
            reject(response)
          })
      )
      processApiErrorMock.mockImplementationOnce((resp) => resp.message)

      // @ts-ignore
      await store.dispatch(updateLibrary())

      const actual = store.getActions()

      expect(actual[0].type).toEqual(updateLibrary.pending.type)
      expect(actual[1].type).toEqual(updateLibrary.rejected.type)
    })
  })

  describe('eraseLibrary thunk', () => {
    it('should dispatch correct actions on success', async () => {
      libraryAPI.emptyLibrary = jest.fn().mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolve({
              data: {},
            })
          })
      )

      const store = makeMockStore()

      // @ts-ignore
      await store.dispatch(eraseLibrary())

      const actual = store.getActions()

      expect(libraryAPI.emptyLibrary).toHaveBeenCalled()
      expect(actual[0].type).toEqual(eraseLibrary.pending.type)
      expect(actual[1].type).toEqual(initLibrary.pending.type)
      expect(actual[2].type).toEqual(fetchLibrary.pending.type)
      expect(actual[3].type).toEqual(eraseLibrary.fulfilled.type)
    })

    it('should dispatch correct actions on failure', async () => {
      const store = makeMockStore()

      const response = {
        message: 'It failed.',
      }
      libraryAPI.emptyLibrary = jest.fn().mockImplementationOnce(
        () =>
          new Promise((resolve, reject) => {
            reject(response)
          })
      )
      processApiErrorMock.mockImplementationOnce((resp) => resp.message)

      // @ts-ignore
      await store.dispatch(eraseLibrary())

      const actual = store.getActions()

      expect(actual[0].type).toEqual(eraseLibrary.pending.type)
      expect(actual[1].type).toEqual(eraseLibrary.rejected.type)
    })
  })
})
