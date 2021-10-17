import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import { contextMenu } from 'react-contexify'
import userEvent from '@testing-library/user-event'
import PlaylistContextMenu from '../components/PlaylistContextMenu'
import { makeMockStore } from '../../../../__tests__/test-utils/redux'

jest.mock('react-modal', () => {
  const TestReactModal = require('../../../../__mocks__/react-modal')
  return TestReactModal.default
})

const MockComponent: React.FC = () => {
  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    contextMenu.show({
      id: 'playlist-context-menu',
      event: e,
      props: {
        data: {
          id: 'playlist1',
        },
      },
    })
  }

  return (
    <div data-testid="test-playlistcontextmenu" onContextMenu={onRightClick} />
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
      id: 'playlist1',
      title: 'Playlist one',
      date: '2020-09-09',
      items: [],
    },
  },
})

describe('PlaylistContextMenu', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders correctly', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <PlaylistContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistcontextmenu'))

    expect(screen.getByText('Play now')).toBeInTheDocument()
    expect(screen.getByText('Play after current track')).toBeInTheDocument()
    expect(screen.getByText('Add to queue')).toBeInTheDocument()
    expect(screen.getByText('Add to playlist...')).toBeInTheDocument()
    expect(screen.getByText('Edit playlist')).toBeInTheDocument()
  })

  it('dispatches the correct actions when pressing "Play now"', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <PlaylistContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistcontextmenu'))
    userEvent.click(screen.getByText('Play now'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing "Play after current track"', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <PlaylistContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistcontextmenu'))
    userEvent.click(screen.getByText('Play after current track'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing "Add to queue"', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <PlaylistContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistcontextmenu'))
    userEvent.click(screen.getByText('Add to queue'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing on a playlist name', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <PlaylistContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistcontextmenu'))
    userEvent.click(screen.getByText('Playlist one'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing on Create new playlist', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <PlaylistContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistcontextmenu'))
    userEvent.click(screen.getByText('+ Duplicate playlist'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })
})
