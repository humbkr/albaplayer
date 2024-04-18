import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter as Router } from 'react-router-dom'
import themeDefault from 'themes/lightGreen'
import AlbumTeaser from 'modules/dashboard/components/AlbumTeaser'
import { getAuthAssetURL } from 'api/api'
import { makeMockStore } from '../../../../../__tests__/test-utils/redux'

jest.mock('modules/player/store/store', () => ({
  playAlbum: jest.fn(),
}))

jest.mock('api/api', () => ({
  getAuthAssetURL: jest.fn(),
}))

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

const album: Album = {
  id: '1',
  title: 'Test album',
  year: '1999',
  dateAdded: 12434324232,
  artist: {
    id: '1',
    name: 'Test artist',
  },
}

describe('dashboard - AlbumTeaser', () => {
  beforeEach(() => {
    ;(getAuthAssetURL as jest.Mock).mockResolvedValue('whatever')
  })

  it('should render correctly', async () => {
    render(
      <ReduxProvider store={store}>
        <Router>
          <ThemeProvider theme={themeDefault}>
            <AlbumTeaser
              album={album}
              selected={false}
              setSelected={() => {}}
            />
          </ThemeProvider>
        </Router>
      </ReduxProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test album')).toBeInTheDocument()
    })

    expect(screen.getByText('Test artist')).toBeInTheDocument()
    expect(screen.getByTestId('album-teaser-overlay')).toHaveStyle({
      backgroundColor: 'transparent',
    })
  })

  it('should display an overlay if mouse is over', async () => {
    render(
      <ReduxProvider store={store}>
        <Router>
          <ThemeProvider theme={themeDefault}>
            <AlbumTeaser
              album={album}
              selected={false}
              setSelected={() => {}}
            />
          </ThemeProvider>
        </Router>
      </ReduxProvider>
    )

    fireEvent.mouseEnter(screen.getByTestId('album-teaser'))
    expect(screen.getByTestId('album-teaser-overlay')).not.toHaveStyle({
      backgroundColor: 'transparent',
    })

    fireEvent.mouseLeave(screen.getByTestId('album-teaser'))
    expect(screen.getByTestId('album-teaser-overlay')).toHaveStyle({
      backgroundColor: 'transparent',
    })

    fireEvent.focus(screen.getByTestId('album-teaser'))
    expect(screen.getByTestId('album-teaser-overlay')).not.toHaveStyle({
      backgroundColor: 'transparent',
    })

    fireEvent.blur(screen.getByTestId('album-teaser'))
    expect(screen.getByTestId('album-teaser-overlay')).toHaveStyle({
      backgroundColor: 'transparent',
    })
  })

  it('should play the album if user clicks on the play button', async () => {
    render(
      <ReduxProvider store={store}>
        <Router>
          <ThemeProvider theme={themeDefault}>
            <AlbumTeaser
              album={album}
              selected={false}
              setSelected={() => {}}
            />
          </ThemeProvider>
        </Router>
      </ReduxProvider>
    )

    fireEvent.click(screen.getByTestId('album-teaser-play-button'))
    expect(store.dispatch).toHaveBeenCalledTimes(1)
  })

  it('should display "Unknown artist" if artist does not have a name', async () => {
    const customAlbum = { ...album }
    delete customAlbum.artist

    render(
      <ReduxProvider store={store}>
        <Router>
          <ThemeProvider theme={themeDefault}>
            <AlbumTeaser
              album={customAlbum}
              selected={false}
              setSelected={() => {}}
            />
          </ThemeProvider>
        </Router>
      </ReduxProvider>
    )

    expect(screen.getByText('library.unknownArtist')).toBeInTheDocument()
  })
})
