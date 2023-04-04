import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import { contextMenu } from 'react-contexify'
import userEvent from '@testing-library/user-event'
import QueueActionsMoreContextMenu from 'modules/now_playing/components/QueueActionsMoreContextMenu'
import { makeMockStore } from '../../../../../__tests__/test-utils/redux'

jest.mock('modules/player/store/store', () => ({
  addCurrentQueue: jest.fn(),
  playlistsSelector: jest.fn(),
}))

function MockComponent() {
  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    contextMenu.show({
      id: 'queue-actions-more-menu',
      event: e,
      props: {
        data: {},
      },
    })
  }

  return (
    <div data-testid="test-queueactionsmoremenu" onContextMenu={onRightClick} />
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

describe('QueueActionsMoreContextMenu', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders correctly', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <QueueActionsMoreContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-queueactionsmoremenu'))
    expect(
      screen.getByText('playlists.actions.addToPlaylist')
    ).toBeInTheDocument()
  })

  it('dispatches the correct actions when pressing on a playlist name', async () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <QueueActionsMoreContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-queueactionsmoremenu'))
    await userEvent.click(screen.getByText('Playlist one'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing Create new playlist', async () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <QueueActionsMoreContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-queueactionsmoremenu'))
    await userEvent.click(
      screen.getByText('playlists.actions.createNewPlaylist')
    )

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })
})
