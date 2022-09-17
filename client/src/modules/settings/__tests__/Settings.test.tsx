import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { render, fireEvent, screen } from '@testing-library/react'
// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from 'redux-thunk'
import { ThemeProvider } from 'styled-components'
import configureMockStore from 'redux-mock-store'
import themeDefault from 'themes/default'
import Settings from '../scenes/Settings'
import info from '../../../../package.json'
import { initialState } from '../store'

const mockStore = configureMockStore([thunk])
const makeMockStore = (customState: any = {}) =>
  mockStore({
    settings: initialState,
    ...customState,
  })

describe('Settings scene', () => {
  it('should display without error', () => {
    const store = makeMockStore({
      library: {
        isFetching: false,
        isUpdating: false,
        error: '',
        isInitialized: true,
        initHasFailed: false,
        lastScan: '',
        artists: {
          1: {},
          2: {},
        },
        albums: {
          1: {},
          2: {},
          3: {},
          4: {},
        },
        tracks: {
          1: {},
          2: {},
          3: {},
          4: {},
          5: {},
          6: {},
        },
      },
    })

    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <Settings />
        </ThemeProvider>
      </ReduxProvider>
    )

    expect(screen.getByTestId('settings-library')).not.toBeNull()
    expect(
      screen.getByText(
        'settings.library.stats {"nbArtists":2,"nbAlbums":4,"nbTracks":6}'
      )
    ).not.toBeNull()
    expect(screen.queryByTestId('settings-library-updating')).toBeNull()
    expect(screen.getByTestId('settings-theme')).not.toBeNull()
    expect(screen.getByTestId('settings-version')).not.toBeNull()

    const regex = new RegExp(`settings.version {"version":"${info.version}"}`)
    expect(screen.getByText(regex)).toBeInTheDocument()
  })

  it('should launch a library update when corresponding button is pressed', () => {
    const store = makeMockStore({
      library: {
        artists: {},
        albums: {},
        tracks: {},
      },
    })
    store.dispatch = jest.fn()

    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <Settings />
        </ThemeProvider>
      </ReduxProvider>
    )

    fireEvent.click(screen.getByTestId('settings-library-update'))
    expect(store.dispatch).toHaveBeenCalled()
  })

  it('should launch a library reset when corresponding button is pressed', () => {
    window.confirm = jest.fn().mockImplementation(() => true)

    const store = makeMockStore({
      library: {
        artists: {},
        albums: {},
        tracks: {},
      },
    })
    store.dispatch = jest.fn()

    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <Settings />
        </ThemeProvider>
      </ReduxProvider>
    )

    fireEvent.click(screen.getByTestId('settings-library-erase'))
    expect(store.dispatch).toHaveBeenCalled()
  })

  it('should change the theme when corresponding select is changed', () => {
    const store = makeMockStore({
      library: {
        artists: {},
        albums: {},
        tracks: {},
      },
    })
    store.dispatch = jest.fn()

    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <Settings />
        </ThemeProvider>
      </ReduxProvider>
    )

    fireEvent.change(screen.getByTestId('settings-theme-select'))
    expect(store.dispatch).toHaveBeenCalled()
  })

  it('should display a loader when library is updating', () => {
    const store = makeMockStore({
      settings: {
        library: {
          isUpdating: true,
          error: '',
          config: {},
        },
        theme: 'default',
      },
      library: {
        artists: {},
        albums: {},
        tracks: {},
      },
    })
    store.dispatch = jest.fn()

    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <Settings />
        </ThemeProvider>
      </ReduxProvider>
    )

    expect(screen.getByTestId('settings-library-updating')).not.toBeNull()
  })

  it('should display an error when library update has failed', () => {
    const store = makeMockStore({
      settings: {
        library: {
          isUpdating: false,
          error: 'It failed.',
          config: {},
        },
        theme: 'default',
      },
      library: {
        artists: {},
        albums: {},
        tracks: {},
      },
    })
    store.dispatch = jest.fn()

    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <Settings />
        </ThemeProvider>
      </ReduxProvider>
    )

    expect(screen.getByText('It failed.')).toBeInTheDocument()
  })
})
