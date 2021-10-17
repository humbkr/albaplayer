import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import { contextMenu } from 'react-contexify'
import userEvent from '@testing-library/user-event'
import ArtistContextMenu from '../components/ArtistContextMenu'
import { makeMockStore } from '../../../../__tests__/test-utils/redux'

const MockComponent: React.FC = () => {
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

    expect(screen.getByText('Play now')).toBeInTheDocument()
    expect(screen.getByText('Play after current track')).toBeInTheDocument()
    expect(screen.getByText('Add to queue')).toBeInTheDocument()
    expect(screen.getByText('Add to playlist...')).toBeInTheDocument()
  })

  it('dispatches the correct actions when pressing "Play now"', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <ArtistContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-artistcontextmenu'))
    userEvent.click(screen.getByText('Play now'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing "Play after current track"', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <ArtistContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-artistcontextmenu'))
    userEvent.click(screen.getByText('Play after current track'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing "Add to queue"', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <ArtistContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-artistcontextmenu'))
    userEvent.click(screen.getByText('Add to queue'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing on a playlist name', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <ArtistContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-artistcontextmenu'))
    userEvent.click(screen.getByText('Playlist one'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing on Create new playlist', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <ArtistContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-artistcontextmenu'))
    userEvent.click(screen.getByText('+ Create new playlist'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })
})
