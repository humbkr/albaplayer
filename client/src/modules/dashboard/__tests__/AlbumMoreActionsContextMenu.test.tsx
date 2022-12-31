import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import { contextMenu } from 'react-contexify'
import userEvent from '@testing-library/user-event'
import { makeMockStore } from '../../../../__tests__/test-utils/redux'
import AlbumMoreActionsContextMenu from '../components/AlbumMoreActionsContextMenu'

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

describe('dashboard - AlbumMoreActionsContextMenu', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders correctly', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <AlbumMoreActionsContextMenu
          menuId="album-more-actions-context-menu"
          onHidden={() => {}}
        />
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

  it('renders without all the options if displayAllActions is false', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponentLimited />
        <AlbumMoreActionsContextMenu
          menuId="album-more-actions-context-menu"
          onHidden={() => {}}
        />
      </ReduxProvider>
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
      <ReduxProvider store={store}>
        <MockComponent />
        <AlbumMoreActionsContextMenu
          menuId="album-more-actions-context-menu"
          onHidden={() => {}}
        />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-albumcontextmenu'))
    await userEvent.click(screen.getByText('player.actions.playNow'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing "Play after current track"', async () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <AlbumMoreActionsContextMenu
          menuId="album-more-actions-context-menu"
          onHidden={() => {}}
        />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-albumcontextmenu'))
    await userEvent.click(screen.getByText('player.actions.playAfter'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing "Add to queue"', async () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <AlbumMoreActionsContextMenu
          menuId="album-more-actions-context-menu"
          onHidden={() => {}}
        />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-albumcontextmenu'))
    await userEvent.click(screen.getByText('player.actions.addToQueue'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing on a playlist name', async () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <AlbumMoreActionsContextMenu
          menuId="album-more-actions-context-menu"
          onHidden={() => {}}
        />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-albumcontextmenu'))
    await userEvent.click(screen.getByText('Playlist one'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing Create new playlist', async () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <AlbumMoreActionsContextMenu
          menuId="album-more-actions-context-menu"
          onHidden={() => {}}
        />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-albumcontextmenu'))
    await userEvent.click(
      screen.getByText('playlists.actions.createNewPlaylist')
    )

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })
})
