import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'
import NowPlayingQueueActions from 'modules/now_playing/components/NowPlayingQueueActions'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { queueClear } from 'modules/player/store/store'

jest.mock(
  '../../components/QueueActionsMoreContextMenu',
  () =>
    function () {
      return <div>QueueActionsMoreContextMenu</div>
    }
)

jest.mock('modules/player/store/store', () => ({
  queueClear: jest.fn(),
}))

jest.mock('store/hooks')
const useAppSelectorMock = useAppSelector as jest.Mock
const mockDispatch = jest.fn()
const useAppDispatchMock = useAppDispatch as jest.Mock

describe('NowPlayingQueueActions', () => {
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
      <ThemeProvider theme={themeDefault}>
        <NowPlayingQueueActions />
      </ThemeProvider>
    )

    expect(screen.getByTestId('queue-actions-more')).toBeInTheDocument()
    expect(screen.getByText('common.clear')).toBeInTheDocument()
  })

  it('dispatches correct actions when pressing Clear button', async () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <NowPlayingQueueActions />
      </ThemeProvider>
    )

    await userEvent.click(screen.getByText('common.clear'))
    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(queueClear).toHaveBeenCalled()
  })
})
