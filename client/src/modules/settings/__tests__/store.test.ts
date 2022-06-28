import configureMockStore from 'redux-mock-store'
// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from 'redux-thunk'
import { api, apolloClient } from 'api'
import { ApolloQueryResult } from '@apollo/client'
import settingsSlice, {
  initialState,
  setTheme,
  initSettings,
  updateLibrary,
  eraseLibrary,
  SettingsStateType,
} from '../store'
import { fetchLibrary, initLibrary } from '../../library/store'

jest.mock('api')

api.scanLibrary = jest
  .fn()
  .mockImplementation(() => new Promise<void>((resolve) => resolve()))

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
        api.processApiError = jest
          .fn()
          .mockImplementationOnce((resp) => resp.message)

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
        api.processApiError = jest
          .fn()
          .mockImplementationOnce((resp) => resp.message)

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
        api.processApiError = jest
          .fn()
          .mockImplementationOnce((resp) => resp.message)

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
      api.processApiError = jest
        .fn()
        .mockImplementationOnce((resp) => resp.message)

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

      api.scanLibrary = jest.fn().mockImplementationOnce(
        () =>
          new Promise<ApolloQueryResult<{ scanLibrary: null }>>((resolve) => {
            resolve({
              data: {
                scanLibrary: null,
              },
              loading: false,
              networkStatus: 7,
            })
          })
      )
      apolloClient.resetStore = jest.fn().mockImplementationOnce(
        () =>
          new Promise<void>((resolve) => {
            resolve()
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
      api.scanLibrary = jest.fn().mockImplementationOnce(
        () =>
          new Promise((resolve, reject) => {
            reject(response)
          })
      )
      api.processApiError = jest
        .fn()
        .mockImplementationOnce((resp) => resp.message)

      // @ts-ignore
      await store.dispatch(updateLibrary())

      const actual = store.getActions()

      expect(actual[0].type).toEqual(updateLibrary.pending.type)
      expect(actual[1].type).toEqual(updateLibrary.rejected.type)
    })
  })

  describe('eraseLibrary thunk', () => {
    it('should dispatch correct actions on success', async () => {
      api.emptyLibrary = jest.fn().mockImplementationOnce(
        () =>
          new Promise<ApolloQueryResult<{ eraseLibrary: null }>>((resolve) => {
            resolve({
              data: {
                eraseLibrary: null,
              },
              loading: false,
              networkStatus: 7,
            })
          })
      )
      apolloClient.resetStore = jest.fn().mockImplementationOnce(
        () =>
          new Promise<void>((resolve) => {
            resolve()
          })
      )

      const store = makeMockStore()

      // @ts-ignore
      await store.dispatch(eraseLibrary())

      const actual = store.getActions()

      expect(api.emptyLibrary).toHaveBeenCalled()
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
      api.emptyLibrary = jest.fn().mockImplementationOnce(
        () =>
          new Promise((resolve, reject) => {
            reject(response)
          })
      )
      api.processApiError = jest
        .fn()
        .mockImplementationOnce((resp) => resp.message)

      // @ts-ignore
      await store.dispatch(eraseLibrary())

      const actual = store.getActions()

      expect(actual[0].type).toEqual(eraseLibrary.pending.type)
      expect(actual[1].type).toEqual(eraseLibrary.rejected.type)
    })
  })
})
