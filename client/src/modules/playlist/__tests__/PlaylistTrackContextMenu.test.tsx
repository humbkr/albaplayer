import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import { contextMenu } from 'react-contexify'
import userEvent from '@testing-library/user-event'
import PlaylistTrackContextMenu from '../components/PlaylistTrackContextMenu'
import { makeMockStore } from '../../../../__tests__/test-utils/redux'

const MockComponent: React.FC = () => {
  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    contextMenu.show({
      id: 'playlist-track-context-menu',
      event: e,
      props: {
        data: {
          track: {
            id: 'track1',
          },
        },
      },
    })
  }

  return (
    <div
      data-testid="test-playlisttrackcontextmenu"
      onContextMenu={onRightClick}
    />
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
    currentPlaylist: {
      playlist: {
        id: 'playlist1',
        title: 'Playlist one',
        date: '2020-09-09',
        items: [],
      },
    },
  },
})

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: jest.fn(),
  }),
}))

describe('PlaylistTrackContextMenu', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders correctly', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <PlaylistTrackContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlisttrackcontextmenu'))

    expect(screen.getByText('Play now')).toBeInTheDocument()
    expect(screen.getByText('Play after current track')).toBeInTheDocument()
    expect(screen.getByText('Add to queue')).toBeInTheDocument()
    expect(screen.getByText('Add to playlist...')).toBeInTheDocument()
  })

  it('dispatches the correct actions when pressing "Play now"', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <PlaylistTrackContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlisttrackcontextmenu'))
    userEvent.click(screen.getByText('Play now'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing "Play after current track"', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <PlaylistTrackContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlisttrackcontextmenu'))
    userEvent.click(screen.getByText('Play after current track'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing "Add to queue"', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <PlaylistTrackContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlisttrackcontextmenu'))
    userEvent.click(screen.getByText('Add to queue'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing on a playlist name', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <PlaylistTrackContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlisttrackcontextmenu'))
    userEvent.click(screen.getByText('Playlist one'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing on Create new playlist', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <PlaylistTrackContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlisttrackcontextmenu'))
    userEvent.click(screen.getByText('+ Create new playlist'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing on Remove from playlist', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <PlaylistTrackContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlisttrackcontextmenu'))
    userEvent.click(screen.getByText('Remove from playlist'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith({
      payload: {
        playlistId: 'playlist1',
        trackPosition: undefined,
      },
      type: 'playlist/playlistRemoveTrack',
    })
  })
})
