import { BrowserRouter } from 'react-router'
import { screen } from '@testing-library/react'
// Load the store before the component to avoid a circular import.
import { renderWithProviders } from 'common/utils/testing/test-utils'
import PlaylistItemComponent from 'modules/collections/components/PlaylistItemComponent'

const testItem: PlaylistItem = {
  position: 1,
  track: {
    id: '1',
    title: 'Track title',
    src: '',
    duration: 3905,
    artist: { id: '1', name: 'Artist name' },
  },
}

describe('PlaylistItemComponent', () => {
  it('displays the track duration', () => {
    renderWithProviders(
      <BrowserRouter>
        <PlaylistItemComponent
          item={testItem}
          handleRemoveTrack={vi.fn()}
          onContextMenu={vi.fn()}
        />
      </BrowserRouter>
    )

    expect(screen.getByText('Track title')).toBeInTheDocument()
    expect(screen.getByText('1:05:05')).toBeInTheDocument()
  })

  it('does not display the duration when it is unknown', () => {
    renderWithProviders(
      <BrowserRouter>
        <PlaylistItemComponent
          item={{ ...testItem, track: { ...testItem.track, duration: 0 } }}
          handleRemoveTrack={vi.fn()}
          onContextMenu={vi.fn()}
        />
      </BrowserRouter>
    )

    expect(screen.getByText('Track title')).toBeInTheDocument()
    expect(screen.queryByText('00:00')).not.toBeInTheDocument()
  })
})
