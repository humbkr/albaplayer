import { ThemeProvider } from 'styled-components'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import theme from 'themes/lightGreen'
import TrackInfo from 'modules/player/components/TrackInfo'
import { makeMockStore } from '../../../../../__tests__/test-utils/redux'

const mockOnClick = jest.fn()
const mockStore = makeMockStore()

describe('TrackInfo', () => {
  beforeEach(() => jest.clearAllMocks())

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

    render(
      <ReduxProvider store={mockStore}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <TrackInfo onClick={mockOnClick} track={testTrack} />
          </ThemeProvider>
        </BrowserRouter>
      </ReduxProvider>
    )

    expect(screen.getByText('Track title')).toBeInTheDocument()
    expect(screen.getByText('Artist name')).toBeInTheDocument()
    expect(screen.getByTestId('cover-image')).toHaveAttribute(
      'src',
      testTrack.cover
    )
  })

  it('displays default values if track info is not available', () => {
    const testTrack: Track = {
      id: '1',
      src: '',
      title: '',
    }

    render(
      <ReduxProvider store={mockStore}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <TrackInfo onClick={mockOnClick} track={testTrack} />
          </ThemeProvider>
        </BrowserRouter>
      </ReduxProvider>
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

    render(
      <ReduxProvider store={mockStore}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <TrackInfo onClick={mockOnClick} track={testTrack} />
          </ThemeProvider>
        </BrowserRouter>
      </ReduxProvider>
    )

    await userEvent.click(screen.getByTestId('cover-default'))

    expect(mockOnClick).toHaveBeenCalled()
  })
})
