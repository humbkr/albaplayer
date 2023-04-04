import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import { contextMenu } from 'react-contexify'
import userEvent from '@testing-library/user-event'
import AlbumContextMenu from 'modules/browser/components/AlbumContextMenu'
import {
  addAlbum,
  playAlbum,
  playAlbumAfterCurrent,
} from 'modules/player/store/store'
import { addAlbum as addAlbumToPlaylist } from 'modules/playlist/store'
import { makeMockStore } from '../../../../../__tests__/test-utils/redux'

jest.mock('modules/player/store/store', () => ({
  addAlbum: jest.fn(),
  playAlbum: jest.fn(),
  playAlbumAfterCurrent: jest.fn(),
}))

jest.mock('modules/playlist/store', () => ({
  ...jest.requireActual('modules/playlist/store'),
  addAlbum: jest.fn(),
}))

function MockComponent() {
  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    contextMenu.show({
      id: 'album-context-menu',
      event: e,
      props: {
        data: {
          id: 'album1',
        },
      },
    })
  }

  return (
    <div data-testid="test-albumcontextmenu" onContextMenu={onRightClick} />
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

describe('AlbumContextMenu', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders correctly', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <AlbumContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-albumcontextmenu'))

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
        <AlbumContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-albumcontextmenu'))
    await userEvent.click(screen.getByText('player.actions.playNow'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(playAlbum).toHaveBeenCalled()
  })

  it('dispatches the correct actions when pressing "Play after current track"', async () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <AlbumContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-albumcontextmenu'))
    await userEvent.click(screen.getByText('player.actions.playAfter'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(playAlbumAfterCurrent).toHaveBeenCalled()
  })

  it('dispatches the correct actions when pressing "Add to queue"', async () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <AlbumContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-albumcontextmenu'))
    await userEvent.click(screen.getByText('player.actions.addToQueue'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(addAlbum).toHaveBeenCalled()
  })

  it('dispatches the correct actions when pressing on a playlist name', async () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <AlbumContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-albumcontextmenu'))
    await userEvent.click(screen.getByText('Playlist one'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(addAlbumToPlaylist).toHaveBeenCalled()
  })

  it('dispatches the correct actions when pressing Create new playlist', async () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <AlbumContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-albumcontextmenu'))
    await userEvent.click(
      screen.getByText('playlists.actions.createNewPlaylist')
    )

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(addAlbumToPlaylist).toHaveBeenCalled()
  })
})
