import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'styled-components'
import { makeMockStore } from '../../../../__tests__/test-utils/redux'
import NowPlayingQueueActions from '../components/NowPlayingQueueActions'
import themeDefault from '../../../themes/default'

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
  queue: {
    items: [],
    current: undefined,
  },
})

describe('QueueActionsMoreContextMenu', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders correctly', () => {
    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <NowPlayingQueueActions />
        </ThemeProvider>
      </ReduxProvider>
    )

    expect(screen.getByTestId('queue-actions-more')).toBeInTheDocument()
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  it('dispatches correct actions when pressing Clear button', () => {
    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <NowPlayingQueueActions />
        </ThemeProvider>
      </ReduxProvider>
    )

    userEvent.click(screen.getByText('Clear'))
    expect(store.dispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: 'queue/queueClear',
    })
  })
})
