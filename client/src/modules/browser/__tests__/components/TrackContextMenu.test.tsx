import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import { contextMenu } from 'react-contexify'
import userEvent from '@testing-library/user-event'
import TrackContextMenu from 'modules/browser/components/TrackContextMenu'
import {
  addTrack,
  playTrack,
  playTrackAfterCurrent,
} from 'modules/player/store/store'
import { addTrack as addTrackToPlaylist } from 'modules/playlist/store'
import { makeMockStore } from '../../../../../__tests__/test-utils/redux'

jest.mock('modules/player/store/store', () => ({
  addTrack: jest.fn(),
  playTrack: jest.fn(),
  playTrackAfterCurrent: jest.fn(),
}))

jest.mock('modules/playlist/store', () => ({
  ...jest.requireActual('modules/playlist/store'),
  addTrack: jest.fn(),
}))

function MockComponent() {
  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    contextMenu.show({
      id: 'track-context-menu',
      event: e,
      props: {
        data: {
          id: 'track1',
        },
      },
    })
  }

  return (
    <div data-testid="test-trackcontextmenu" onContextMenu={onRightClick} />
  )
}

const store = makeMockStore({
  playlist: {
    playlists: {
      playlist1: {
        id: 'playlist1',
        title: 'Playlist one',
        date: '2020-09-09',
        items: [],
      },
    },
  },
})

describe('TrackContextMenu', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders correctly', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <TrackContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-trackcontextmenu'))

    expect(screen.getByText('player.actions.playNow')).toBeInTheDocument()
    expect(screen.getByText('player.actions.playAfter')).toBeInTheDocument()
    expect(screen.getByText('player.actions.addToQueue')).toBeInTheDocument()
    expect(
      screen.getByText('playlists.actions.addToPlaylist')
    ).toBeInTheDocument()
  })

  it('dispatches the correct actions when pressing "Play now"', async () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <TrackContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-trackcontextmenu'))
    await userEvent.click(screen.getByText('player.actions.playNow'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(playTrack).toHaveBeenCalled()
  })

  it('dispatches the correct actions when pressing "Play after current track"', async () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <TrackContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-trackcontextmenu'))
    await userEvent.click(screen.getByText('player.actions.playAfter'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(playTrackAfterCurrent).toHaveBeenCalled()
  })

  it('dispatches the correct actions when pressing "Add to queue"', async () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <TrackContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-trackcontextmenu'))
    await userEvent.click(screen.getByText('player.actions.addToQueue'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(addTrack).toHaveBeenCalled()
  })

  it('dispatches the correct actions when pressing on a playlist name', async () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <TrackContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-trackcontextmenu'))
    await userEvent.click(screen.getByText('Playlist one'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(addTrackToPlaylist).toHaveBeenCalled()
  })

  it('dispatches the correct actions when pressing on Create new playlist', async () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <TrackContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-trackcontextmenu'))
    await userEvent.click(
      screen.getByText('playlists.actions.createNewPlaylist')
    )

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(addTrackToPlaylist).toHaveBeenCalled()
  })
})
