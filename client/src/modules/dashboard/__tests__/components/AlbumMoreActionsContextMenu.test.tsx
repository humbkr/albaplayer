import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { contextMenu } from 'react-contexify'
import userEvent from '@testing-library/user-event'
import AlbumMoreActionsContextMenu from 'modules/dashboard/components/AlbumMoreActionsContextMenu'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import {
  addAlbum,
  playAlbum,
  playAlbumAfterCurrent,
} from 'modules/player/store/store'
import { addAlbum as addAlbumToPlaylist } from 'modules/playlist/store'

jest.mock('modules/player/store/store', () => ({
  addAlbum: jest.fn(),
  playAlbum: jest.fn(),
  playAlbumAfterCurrent: jest.fn(),
}))

jest.mock('modules/playlist/store', () => ({
  addAlbum: jest.fn(),
  playlistsSelector: jest.fn(),
  playlistAddTracks: jest.fn(),
}))

jest.mock('store/hooks')
const useAppSelectorMock = useAppSelector as jest.Mock
const mockDispatch = jest.fn()
const useAppDispatchMock = useAppDispatch as jest.Mock

function MockComponent() {
  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    contextMenu.show({
      id: 'album-more-actions-context-menu',
      event: e,
      props: {
        displayAllActions: true,
        album: {
          id: 'album1',
        },
      },
    })
  }

  return (
    <div data-testid="test-albumcontextmenu" onContextMenu={onRightClick} />
  )
}

function MockComponentLimited() {
  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    contextMenu.show({
      id: 'album-more-actions-context-menu',
      event: e,
      props: {
        displayAllActions: false,
        album: {
          id: 'album1',
        },
      },
    })
  }

  return (
    <div data-testid="test-albumcontextmenu" onContextMenu={onRightClick} />
  )
}

describe('dashboard - AlbumMoreActionsContextMenu', () => {
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
        <AlbumMoreActionsContextMenu
          menuId="album-more-actions-context-menu"
          onHidden={() => {}}
        />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-albumcontextmenu'))

    expect(screen.getByText('player.actions.playNow')).toBeInTheDocument()
    expect(screen.getByText('player.actions.playAfter')).toBeInTheDocument()
    expect(screen.getByText('player.actions.addToQueue')).toBeInTheDocument()
    expect(
      screen.getByText('playlists.actions.addToPlaylist')
    ).toBeInTheDocument()
  })

  it('renders without all the options if displayAllActions is false', () => {
    render(
      <>
        <MockComponentLimited />
        <AlbumMoreActionsContextMenu
          menuId="album-more-actions-context-menu"
          onHidden={() => {}}
        />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-albumcontextmenu'))

    expect(screen.queryByText('player.actions.playNow')).not.toBeInTheDocument()
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
        <AlbumMoreActionsContextMenu
          menuId="album-more-actions-context-menu"
          onHidden={() => {}}
        />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-albumcontextmenu'))
    await userEvent.click(screen.getByText('player.actions.playNow'))

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(playAlbum).toHaveBeenCalledWith('album1')
  })

  it('dispatches the correct actions when pressing "Play after current track"', async () => {
    render(
      <>
        <MockComponent />
        <AlbumMoreActionsContextMenu
          menuId="album-more-actions-context-menu"
          onHidden={() => {}}
        />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-albumcontextmenu'))
    await userEvent.click(screen.getByText('player.actions.playAfter'))

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(playAlbumAfterCurrent).toHaveBeenCalledWith('album1')
  })

  it('dispatches the correct actions when pressing "Add to queue"', async () => {
    render(
      <>
        <MockComponent />
        <AlbumMoreActionsContextMenu
          menuId="album-more-actions-context-menu"
          onHidden={() => {}}
        />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-albumcontextmenu'))
    await userEvent.click(screen.getByText('player.actions.addToQueue'))

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(addAlbum).toHaveBeenCalledWith('album1')
  })

  it('dispatches the correct actions when pressing on a playlist name', async () => {
    render(
      <>
        <MockComponent />
        <AlbumMoreActionsContextMenu
          menuId="album-more-actions-context-menu"
          onHidden={() => {}}
        />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-albumcontextmenu'))
    await userEvent.click(screen.getByText('Playlist one'))

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(addAlbumToPlaylist).toHaveBeenCalledWith({
      albumId: 'album1',
      playlistId: 'playlist1',
    })
  })

  it('dispatches the correct actions when pressing Create new playlist', async () => {
    render(
      <>
        <MockComponent />
        <AlbumMoreActionsContextMenu
          menuId="album-more-actions-context-menu"
          onHidden={() => {}}
        />
      </>
    )

    fireEvent.contextMenu(screen.getByTestId('test-albumcontextmenu'))
    await userEvent.click(
      screen.getByText('playlists.actions.createNewPlaylist')
    )

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(addAlbumToPlaylist).toHaveBeenCalledWith({ albumId: 'album1' })
  })
})
