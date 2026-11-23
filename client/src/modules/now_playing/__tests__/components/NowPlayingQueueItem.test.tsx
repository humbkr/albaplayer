import { BrowserRouter } from 'react-router'
import { screen } from '@testing-library/react'
// Load the store before the component to avoid a circular import.
import { renderWithProviders } from 'common/utils/testing/test-utils'
import NowPlayingQueueItem from 'modules/now_playing/components/NowPlayingQueueItem'

// Jsdom doesn't implement window.matchMedia.
vi.mock('common/utils/useLayoutBreakpoints', () => ({
  default: () => ({ isMD: false, isXL: false }),
}))

const testItem: QueueItemDisplay = {
  id: 'queue-item-1',
  position: 1,
  track: {
    id: '1',
    title: 'Track title',
    src: '',
    duration: 205,
  },
}

describe('NowPlayingQueueItem', () => {
  it('displays the track duration', () => {
    renderWithProviders(
      <BrowserRouter>
        <NowPlayingQueueItem item={testItem} currentIndex={-1} />
      </BrowserRouter>
    )

    expect(screen.getByText('Track title')).toBeInTheDocument()
    expect(screen.getByText('03:25')).toBeInTheDocument()
  })

  it('does not display the duration when it is unknown', () => {
    renderWithProviders(
      <BrowserRouter>
        <NowPlayingQueueItem
          item={{ ...testItem, track: { ...testItem.track, duration: 0 } }}
          currentIndex={-1}
        />
      </BrowserRouter>
    )

    expect(screen.getByText('Track title')).toBeInTheDocument()
    expect(screen.queryByText('00:00')).not.toBeInTheDocument()
  })
})
