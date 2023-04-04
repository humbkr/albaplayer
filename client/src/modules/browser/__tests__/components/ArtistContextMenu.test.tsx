import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import { contextMenu } from 'react-contexify'
import userEvent from '@testing-library/user-event'
import ArtistContextMenu from 'modules/browser/components/ArtistContextMenu'
import {
  addArtist,
  playArtist,
  playArtistAfterCurrent,
} from 'modules/player/store/store'
import { makeMockStore } from '../../../../../__tests__/test-utils/redux'

jest.mock('modules/player/store/store', () => ({
  addArtist: jest.fn(),
  playArtist: jest.fn(),
  playArtistAfterCurrent: jest.fn(),
}))

function MockComponent() {
  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    contextMenu.show({
      id: 'artist-context-menu',
      event: e,
      props: {
        data: {
          id: 'track1',
        },
      },
    })
  }

  return (
    <div data-testid="test-artistcontextmenu" onContextMenu={onRightClick} />
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

describe('ArtistContextMenu', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders correctly', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <ArtistContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-artistcontextmenu'))

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
        <ArtistContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-artistcontextmenu'))
    await userEvent.click(screen.getByText('player.actions.playNow'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(playArtist).toHaveBeenCalled()
  })

  it('dispatches the correct actions when pressing "Play after current track"', async () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <ArtistContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-artistcontextmenu'))
    await userEvent.click(screen.getByText('player.actions.playAfter'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(playArtistAfterCurrent).toHaveBeenCalled()
  })

  it('dispatches the correct actions when pressing "Add to queue"', async () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <ArtistContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-artistcontextmenu'))
    await userEvent.click(screen.getByText('player.actions.addToQueue'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(addArtist).toHaveBeenCalled()
  })

  it('dispatches the correct actions when pressing on a playlist name', async () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <ArtistContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-artistcontextmenu'))
    await userEvent.click(screen.getByText('Playlist one'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing on Create new playlist', async () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <ArtistContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-artistcontextmenu'))
    await userEvent.click(
      screen.getByText('playlists.actions.createNewPlaylist')
    )

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })
})
