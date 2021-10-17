import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { render, fireEvent } from '@testing-library/react'
// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from 'redux-thunk'
import { ThemeProvider } from 'styled-components'
import configureMockStore from 'redux-mock-store'
import themeDefault from 'themes/default'
import Settings from '../scenes/Settings'
import info from '../../../../package.json'
import { initialState } from '../redux'

const mockStore = configureMockStore([thunk])
const makeMockStore = (customState: any = {}) => mockStore({
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

    const { queryByTestId, getByText } = render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <Settings />
        </ThemeProvider>
      </ReduxProvider>
    )

    expect(queryByTestId('settings-library')).not.toBeNull()
    expect(
      getByText(
        'There are currently 2 artists, 4 albums and 6 tracks in the library.'
      )
    )
    expect(queryByTestId('settings-library-updating')).toBeNull()
    expect(queryByTestId('settings-theme')).not.toBeNull()
    expect(queryByTestId('settings-version')).not.toBeNull()

    const regex = new RegExp(`Version: \\w+ \\(UI version: ${info.version}\\)`)
    expect(getByText(regex))
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

    const { getByTestId } = render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <Settings />
        </ThemeProvider>
      </ReduxProvider>
    )

    fireEvent.click(getByTestId('settings-library-update'))
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

    const { getByTestId } = render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <Settings />
        </ThemeProvider>
      </ReduxProvider>
    )

    fireEvent.click(getByTestId('settings-library-erase'))
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

    const { getByTestId } = render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <Settings />
        </ThemeProvider>
      </ReduxProvider>
    )

    fireEvent.change(getByTestId('settings-theme-select'))
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

    const { getByTestId } = render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <Settings />
        </ThemeProvider>
      </ReduxProvider>
    )

    expect(getByTestId('settings-library-updating'))
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

    const { getByText } = render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <Settings />
        </ThemeProvider>
      </ReduxProvider>
    )

    expect(getByText('It failed.'))
  })
})
