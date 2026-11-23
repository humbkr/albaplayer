import { BrowserRouter } from 'react-router'
import { screen } from '@testing-library/react'
import type { Mock } from 'vitest'
import userEvent from '@testing-library/user-event'
// Load the store before the component to avoid a circular import.
import { renderWithProviders } from 'common/utils/testing/test-utils'
import TrackInfo from 'modules/player/components/TrackInfo'
import { getAuthAssetURL } from 'api/helpers'

const mockOnClick = vi.fn()

vi.mock('api/helpers', () => ({
  getAuthAssetURL: vi.fn(),
}))

describe('TrackInfo', () => {
  beforeEach(() => {
    mockOnClick.mockClear()
    ;(getAuthAssetURL as Mock).mockResolvedValue('whatever')
  })

  it('displays all track info if available', () => {
    const testTrack: Track = {
      artist: {
        id: '1',
        name: 'Artist name',
      },
      cover: 'track_cover.png',
      id: '1',
      src: '',
      title: 'Track title',
    }

    renderWithProviders(
      <BrowserRouter>
        <TrackInfo
          onClick={mockOnClick}
          track={testTrack}
          progress={72}
          duration={205}
        />
      </BrowserRouter>
    )

    expect(screen.getByText('Track title')).toBeInTheDocument()
    expect(screen.getByText('Artist name')).toBeInTheDocument()
    expect(screen.getByTestId('track-art')).toBeInTheDocument()
    expect(screen.getByText('01:12 / 03:25')).toBeInTheDocument()
  })

  it('displays default values if track info is not available', () => {
    const testTrack: Track = {
      id: '1',
      src: '',
      title: '',
    }

    renderWithProviders(
      <BrowserRouter>
        <TrackInfo
          onClick={mockOnClick}
          track={testTrack}
          progress={0}
          duration={0}
        />
      </BrowserRouter>
    )

    expect(screen.getByText('library.unknownTitle')).toBeInTheDocument()
    expect(screen.getByText('library.unknownArtist')).toBeInTheDocument()
    expect(screen.getByTestId('track-art')).toBeInTheDocument()
  })

  it('calls onClick callback when clicked', async () => {
    const testTrack: Track = {
      id: '1',
      src: '',
      title: '',
    }

    renderWithProviders(
      <BrowserRouter>
        <TrackInfo
          onClick={mockOnClick}
          track={testTrack}
          progress={0}
          duration={0}
        />
      </BrowserRouter>
    )

    await userEvent.click(screen.getByTestId('cover-default'))

    expect(mockOnClick).toHaveBeenCalled()
  })

  it('does not call onClick when the playback time is clicked', async () => {
    const testTrack: Track = {
      id: '1',
      src: '',
      title: 'Track title',
    }

    renderWithProviders(
      <BrowserRouter>
        <TrackInfo
          onClick={mockOnClick}
          track={testTrack}
          progress={72}
          duration={205}
        />
      </BrowserRouter>
    )

    await userEvent.click(screen.getByTestId('player-playback-time'))

    expect(mockOnClick).not.toHaveBeenCalled()
  })
})
