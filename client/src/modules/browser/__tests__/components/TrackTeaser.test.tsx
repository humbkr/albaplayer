import { BrowserRouter } from 'react-router'
import { screen } from '@testing-library/react'
// Load the store before the component to avoid a circular import.
import { renderWithProviders } from 'common/utils/testing/test-utils'
import TrackTeaser from 'modules/browser/components/TrackTeaser'

const testTrack: Track = {
  id: '1',
  title: 'Track title',
  src: '',
  number: 3,
  duration: 205,
}

describe('TrackTeaser', () => {
  it('displays the track duration', () => {
    renderWithProviders(
      <BrowserRouter>
        <TrackTeaser item={testTrack} index={0} onContextMenu={vi.fn()} />
      </BrowserRouter>
    )

    expect(screen.getByText('Track title')).toBeInTheDocument()
    expect(screen.getByText('03:25')).toBeInTheDocument()
  })

  it('does not display the duration when it is unknown', () => {
    renderWithProviders(
      <BrowserRouter>
        <TrackTeaser
          item={{ ...testTrack, duration: 0 }}
          index={0}
          onContextMenu={vi.fn()}
        />
      </BrowserRouter>
    )

    expect(screen.getByText('Track title')).toBeInTheDocument()
    expect(screen.queryByText('00:00')).not.toBeInTheDocument()
  })
})
