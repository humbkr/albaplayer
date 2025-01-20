import { BrowserRouter } from 'react-router'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TrackInfo from 'modules/player/components/TrackInfo'
import { getAuthAssetURL } from 'api/helpers'
import { renderWithProviders } from 'common/utils/testing/testUtils'

const mockOnClick = jest.fn()

jest.mock('api/helpers', () => ({
  getAuthAssetURL: jest.fn(),
}))

describe('TrackInfo', () => {
  beforeEach(() => {
    ;(getAuthAssetURL as jest.Mock).mockResolvedValue('whatever')
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
        <TrackInfo onClick={mockOnClick} track={testTrack} />
      </BrowserRouter>
    )

    expect(screen.getByText('Track title')).toBeInTheDocument()
    expect(screen.getByText('Artist name')).toBeInTheDocument()
    expect(screen.getByTestId('cover-image')).toBeInTheDocument()
  })

  it('displays default values if track info is not available', () => {
    const testTrack: Track = {
      id: '1',
      src: '',
      title: '',
    }

    renderWithProviders(
      <BrowserRouter>
        <TrackInfo onClick={mockOnClick} track={testTrack} />
      </BrowserRouter>
    )

    expect(screen.getByText('library.unknownTitle')).toBeInTheDocument()
    expect(screen.getByText('library.unknownArtist')).toBeInTheDocument()
    expect(screen.queryByTestId('cover-image')).not.toBeInTheDocument()
  })

  it('calls onClick callback when clicked', async () => {
    const testTrack: Track = {
      id: '1',
      src: '',
      title: '',
    }

    renderWithProviders(
      <BrowserRouter>
        <TrackInfo onClick={mockOnClick} track={testTrack} />
      </BrowserRouter>
    )

    await userEvent.click(screen.getByTestId('cover-default'))

    expect(mockOnClick).toHaveBeenCalled()
  })
})
