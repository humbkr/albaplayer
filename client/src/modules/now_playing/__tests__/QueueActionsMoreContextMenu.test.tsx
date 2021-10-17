import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import { contextMenu } from 'react-contexify'
import userEvent from '@testing-library/user-event'
import { makeMockStore } from '../../../../__tests__/test-utils/redux'
import QueueActionsMoreContextMenu from '../components/QueueActionsMoreContextMenu'

const MockComponent: React.FC = () => {
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
    expect(screen.getByText('Add to playlist...')).toBeInTheDocument()
  })

  it('dispatches the correct actions when pressing on a playlist name', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <QueueActionsMoreContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-queueactionsmoremenu'))
    userEvent.click(screen.getByText('Playlist one'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })

  it('dispatches the correct actions when pressing Create new playlist', () => {
    render(
      <ReduxProvider store={store}>
        <MockComponent />
        <QueueActionsMoreContextMenu />
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('test-queueactionsmoremenu'))
    userEvent.click(screen.getByText('+ Create new playlist'))

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
  })
})
