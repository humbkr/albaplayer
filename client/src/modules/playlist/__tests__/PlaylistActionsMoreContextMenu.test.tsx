import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import { contextMenu } from 'react-contexify'
import userEvent from '@testing-library/user-event'
import PlaylistActionsMoreContextMenu from '../components/PlaylistActionsMoreContextMenu'
import { makeMockStore } from '../../../../__tests__/test-utils/redux'

jest.mock('react-modal', () => {
  const TestReactModal = require('../../../../__mocks__/react-modal')
  return TestReactModal.default
})

const MockComponent: React.FC = () => {
  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    contextMenu.show({
      id: 'playlist-actions-more-menu',
      event: e,
      props: {
        playlist: {
          id: 'playlist1',
        },
      },
    })
  }

  return (
    <div
      data-testid="test-playlistactionsmoremenu"
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
      id: 'playlist1',
      title: 'Playlist one',
      date: '2020-09-09',
      items: [],
    },
  },
})

describe('PlaylistActionsMoreContextMenu', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders correctly', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <PlaylistActionsMoreContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistactionsmoremenu'))

    expect(screen.getByText('Play after current track')).toBeInTheDocument()
    expect(screen.getByText('Add to playlist...')).toBeInTheDocument()
    expect(screen.getByText('Edit playlist')).toBeInTheDocument()
    expect(screen.getByText('Delete playlist')).toBeInTheDocument()
    expect(screen.getByText('Fix dead tracks...')).toBeInTheDocument()
  })

  it('dispatches the correct actions when pressing "Play after current track"', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <PlaylistActionsMoreContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistactionsmoremenu'))
    userEvent.click(screen.getByText('Play after current track'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing on a playlist name', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <PlaylistActionsMoreContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistactionsmoremenu'))
    userEvent.click(screen.getByText('Playlist one'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing on Create new playlist', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <PlaylistActionsMoreContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistactionsmoremenu'))
    userEvent.click(screen.getByText('+ Duplicate playlist'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing on "Fix dead tracks..."', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <PlaylistActionsMoreContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistactionsmoremenu'))
    userEvent.click(screen.getByText('Fix dead tracks...'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith({
      payload: 1,
      type: 'playlist/playlistChangePane',
    })
  })

  it('dispatches the correct actions when pressing on "Delete playlist"', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <PlaylistActionsMoreContextMenu />
      </ReduxProvider>
    )

    window.confirm = jest.fn().mockImplementation(() => true)

    fireEvent.contextMenu(screen.getByTestId('test-playlistactionsmoremenu'))
    userEvent.click(screen.getByText('Delete playlist'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith({
      payload: { id: 'playlist1' },
      type: 'playlist/playlistDeletePlaylist',
    })
  })
})
