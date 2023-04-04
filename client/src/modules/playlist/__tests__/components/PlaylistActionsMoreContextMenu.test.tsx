import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { contextMenu } from 'react-contexify'
import userEvent from '@testing-library/user-event'
import PlaylistActionsMoreContextMenu from 'modules/playlist/components/PlaylistActionsMoreContextMenu'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { playPlaylistAfterCurrent } from 'modules/player/store/store'
import {
  addPlaylist as addPlaylistToPlaylist,
  playlistChangePane,
  playlistDeletePlaylist,
  PlaylistPane,
} from 'modules/playlist/store'

jest.mock('modules/player/store/store', () => ({
  playPlaylistAfterCurrent: jest.fn(),
}))

jest.mock('modules/playlist/store', () => ({
  playlistsSelector: jest.fn(),
  playlistDeletePlaylist: jest.fn(),
  addPlaylist: jest.fn(),
  playlistChangePane: jest.fn(),
  PlaylistPane: { Fix: 1 },
}))

jest.mock('common/components/layout/Modal', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>test {children}</div>
  ),
}))

jest.mock('store/hooks')
const useAppSelectorMock = useAppSelector as jest.Mock
const mockDispatch = jest.fn()
const useAppDispatchMock = useAppDispatch as jest.Mock

function MockComponent() {
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

describe('PlaylistActionsMoreContextMenu', () => {
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
        <PlaylistActionsMoreContextMenu />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistactionsmoremenu'))

    expect(screen.getByText('player.actions.playAfter')).toBeInTheDocument()
    expect(
      screen.getByText('playlists.actions.addToPlaylist')
    ).toBeInTheDocument()
    expect(
      screen.getByText('playlists.actions.editPlaylist')
    ).toBeInTheDocument()
    expect(
      screen.getByText('playlists.actions.deletePlaylist')
    ).toBeInTheDocument()
    expect(screen.getByText('playlists.care.fixDeadTracks')).toBeInTheDocument()
  })

  it('dispatches the correct actions when pressing "Play after current track"', async () => {
    render(
      <>
        <MockComponent />
        <PlaylistActionsMoreContextMenu />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistactionsmoremenu'))
    await userEvent.click(screen.getByText('player.actions.playAfter'))

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(playPlaylistAfterCurrent).toHaveBeenCalledWith('playlist1')
  })

  it('dispatches the correct actions when pressing on a playlist name', async () => {
    render(
      <>
        <MockComponent />
        <PlaylistActionsMoreContextMenu />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistactionsmoremenu'))
    await userEvent.click(screen.getByText('Playlist one'))

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(addPlaylistToPlaylist).toHaveBeenCalledWith({
      playlistId: 'playlist1',
      playlistToAddId: 'playlist1',
    })
  })

  it('dispatches the correct actions when pressing on Create new playlist', async () => {
    render(
      <>
        <MockComponent />
        <PlaylistActionsMoreContextMenu />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistactionsmoremenu'))
    await userEvent.click(
      screen.getByText('playlists.actions.duplicatePlaylist')
    )

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(addPlaylistToPlaylist).toHaveBeenCalledWith({
      playlistToAddId: 'playlist1',
    })
  })

  it('dispatches the correct actions when pressing on "Fix dead tracks..."', async () => {
    render(
      <>
        <MockComponent />
        <PlaylistActionsMoreContextMenu />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlistactionsmoremenu'))
    await userEvent.click(screen.getByText('playlists.care.fixDeadTracks'))

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(playlistChangePane).toHaveBeenCalledWith(PlaylistPane.Fix)
  })

  it('dispatches the correct actions when pressing on "Delete playlist"', async () => {
    render(
      <>
        <MockComponent />
        <PlaylistActionsMoreContextMenu />
      </>
    )

    window.confirm = jest.fn().mockImplementation(() => true)

    fireEvent.contextMenu(screen.getByTestId('test-playlistactionsmoremenu'))
    await userEvent.click(screen.getByText('playlists.actions.deletePlaylist'))

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(playlistDeletePlaylist).toHaveBeenCalledWith({ id: 'playlist1' })
  })
})
