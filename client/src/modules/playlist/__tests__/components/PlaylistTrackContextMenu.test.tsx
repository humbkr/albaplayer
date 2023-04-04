import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { contextMenu } from 'react-contexify'
import userEvent from '@testing-library/user-event'
import PlaylistTrackContextMenu from 'modules/playlist/components/PlaylistTrackContextMenu'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import {
  addTrack,
  playTrack,
  playTrackAfterCurrent,
} from 'modules/player/store/store'
import {
  addTrack as addTrackToPlaylist,
  playlistRemoveTrack,
} from 'modules/playlist/store'

jest.mock('modules/player/store/store', () => ({
  addTrack: jest.fn(),
  playTrack: jest.fn(),
  playTrackAfterCurrent: jest.fn(),
}))

jest.mock('modules/playlist/store', () => ({
  addTrack: jest.fn(),
  playlistRemoveTrack: jest.fn(),
  playlistsSelector: jest.fn(),
  playlistAddTracks: jest.fn(),
}))

function MockComponent() {
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

jest.mock('store/hooks')
const useAppSelectorMock = useAppSelector as jest.Mock
const mockDispatch = jest.fn()
const useAppDispatchMock = useAppDispatch as jest.Mock

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}))

describe('PlaylistTrackContextMenu', () => {
  beforeEach(() => {
    useAppSelectorMock.mockReturnValueOnce([
      {
        id: 'playlist1',
        title: 'Playlist one',
        date: '2020-09-09',
        items: [],
      },
    ])
    useAppSelectorMock.mockReturnValueOnce({
      id: 'playlist2',
      title: 'Playlist two',
      date: '2020-09-09',
      items: [],
    })
    useAppDispatchMock.mockReturnValue(mockDispatch)
  })

  it('renders correctly', () => {
    render(
      <>
        <MockComponent />
        <PlaylistTrackContextMenu />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlisttrackcontextmenu'))

    expect(screen.getByText('player.actions.playNow')).toBeInTheDocument()
    expect(screen.getByText('player.actions.playAfter')).toBeInTheDocument()
    expect(screen.getByText('player.actions.addToQueue')).toBeInTheDocument()
    expect(
      screen.getByText('playlists.actions.addToPlaylist')
    ).toBeInTheDocument()
  })

  it('dispatches the correct actions when pressing "Play now"', async () => {
    render(
      <>
        <MockComponent />
        <PlaylistTrackContextMenu />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlisttrackcontextmenu'))
    await userEvent.click(screen.getByText('player.actions.playNow'))

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(playTrack).toHaveBeenCalledWith('track1')
  })

  it('dispatches the correct actions when pressing "Play after current track"', async () => {
    render(
      <>
        <MockComponent />
        <PlaylistTrackContextMenu />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlisttrackcontextmenu'))
    await userEvent.click(screen.getByText('player.actions.playAfter'))

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(playTrackAfterCurrent).toHaveBeenCalledWith('track1')
  })

  it('dispatches the correct actions when pressing "Add to queue"', async () => {
    render(
      <>
        <MockComponent />
        <PlaylistTrackContextMenu />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlisttrackcontextmenu'))
    await userEvent.click(screen.getByText('player.actions.addToQueue'))

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(addTrack).toHaveBeenCalledWith('track1')
  })

  it('dispatches the correct actions when pressing on a playlist name', async () => {
    render(
      <>
        <MockComponent />
        <PlaylistTrackContextMenu />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlisttrackcontextmenu'))
    await userEvent.click(screen.getByText('Playlist one'))

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(addTrackToPlaylist).toHaveBeenCalledWith({
      playlistId: 'playlist1',
      trackId: 'track1',
    })
  })

  it('dispatches the correct actions when pressing on Create new playlist', async () => {
    render(
      <>
        <MockComponent />
        <PlaylistTrackContextMenu />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlisttrackcontextmenu'))
    await userEvent.click(
      screen.getByText('playlists.actions.createNewPlaylist')
    )

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(addTrackToPlaylist).toHaveBeenCalledWith({ trackId: 'track1' })
  })

  it('dispatches the correct actions when pressing on Remove from playlist', async () => {
    render(
      <>
        <MockComponent />
        <PlaylistTrackContextMenu />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-playlisttrackcontextmenu'))
    await userEvent.click(
      screen.getByText('playlists.actions.removeFromPlaylist')
    )

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    // Note: trackPosition is added by the menu context lib.
    expect(playlistRemoveTrack).toHaveBeenCalledWith({
      playlistId: 'playlist2',
      trackPosition: undefined,
    })
  })
})
