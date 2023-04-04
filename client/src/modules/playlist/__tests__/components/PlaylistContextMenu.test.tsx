import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { contextMenu } from 'react-contexify'
import userEvent from '@testing-library/user-event'
import PlaylistContextMenu from 'modules/playlist/components/PlaylistContextMenu'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import {
  addPlaylist,
  playPlaylist,
  playPlaylistAfterCurrent,
} from 'modules/player/store/store'
import { addPlaylist as addPlaylistToPlaylist } from 'modules/playlist/store'

jest.mock('modules/player/store/store', () => ({
  addPlaylist: jest.fn(),
  playPlaylist: jest.fn(),
  playPlaylistAfterCurrent: jest.fn(),
}))

jest.mock('modules/playlist/store', () => ({
  addPlaylist: jest.fn(),
  playlistChangePane: jest.fn(),
  PlaylistPane: { Fix: 1 },
}))

jest.mock('store/hooks')
const useAppSelectorMock = useAppSelector as jest.Mock
const mockDispatch = jest.fn()
const useAppDispatchMock = useAppDispatch as jest.Mock

jest.mock('common/components/layout/Modal', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>test {children}</div>
  ),
}))

function MockComponent() {
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

describe('PlaylistContextMenu', () => {
  beforeEach(() => {
    useAppSelectorMock.mockReturnValue([
      {
        id: 'playlist1',
        title: 'Playlist one',
        date: '2020-09-09',
        items: [],
      },
    ])
    useAppDispatchMock.mockReturnValue(mockDispatch)
  })

  it('renders correctly', () => {
    render(
      <>
        <MockComponent />
        <PlaylistContextMenu />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistcontextmenu'))

    expect(screen.getByText('player.actions.playNow')).toBeInTheDocument()
    expect(screen.getByText('player.actions.playAfter')).toBeInTheDocument()
    expect(screen.getByText('player.actions.addToQueue')).toBeInTheDocument()
    expect(
      screen.getByText('playlists.actions.addToPlaylist')
    ).toBeInTheDocument()
    expect(
      screen.getByText('playlists.actions.editPlaylist')
    ).toBeInTheDocument()
  })

  it('dispatches the correct actions when pressing "Play now"', async () => {
    render(
      <>
        <MockComponent />
        <PlaylistContextMenu />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistcontextmenu'))
    await userEvent.click(screen.getByText('player.actions.playNow'))

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(playPlaylist).toHaveBeenCalledWith('playlist1')
  })

  it('dispatches the correct actions when pressing "Play after current track"', async () => {
    render(
      <>
        <MockComponent />
        <PlaylistContextMenu />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistcontextmenu'))
    await userEvent.click(screen.getByText('player.actions.playAfter'))

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(playPlaylistAfterCurrent).toHaveBeenCalledWith('playlist1')
  })

  it('dispatches the correct actions when pressing "Add to queue"', async () => {
    render(
      <>
        <MockComponent />
        <PlaylistContextMenu />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistcontextmenu'))
    await userEvent.click(screen.getByText('player.actions.addToQueue'))

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(addPlaylist).toHaveBeenCalledWith('playlist1')
  })

  it('dispatches the correct actions when pressing on Duplicate playlist', async () => {
    render(
      <>
        <MockComponent />
        <PlaylistContextMenu />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistcontextmenu'))
    await userEvent.click(
      screen.getByText('playlists.actions.duplicatePlaylist')
    )

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(addPlaylistToPlaylist).toHaveBeenCalledWith({
      playlistToAddId: 'playlist1',
    })
  })

  it('dispatches the correct actions when pressing on a playlist name', async () => {
    render(
      <>
        <MockComponent />
        <PlaylistContextMenu />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistcontextmenu'))
    await userEvent.click(screen.getByText('Playlist one'))

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(addPlaylistToPlaylist).toHaveBeenCalledWith({
      playlistId: 'playlist1',
      playlistToAddId: 'playlist1',
    })
  })
})
