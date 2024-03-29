import { render, screen } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/default'
import { makeMockStore } from '../../../../__tests__/test-utils/redux'
import NowPlayingQueueActions from '../components/NowPlayingQueueActions'

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
    expect(screen.getByText('common.clear')).toBeInTheDocument()
  })

  it('dispatches correct actions when pressing Clear button', async () => {
    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <NowPlayingQueueActions />
        </ThemeProvider>
      </ReduxProvider>
    )

    await userEvent.click(screen.getByText('common.clear'))
    expect(store.dispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: 'queue/queueClear',
    })
  })
})
