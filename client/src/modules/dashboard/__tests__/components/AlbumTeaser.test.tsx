import { fireEvent, render, screen } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter as Router } from 'react-router-dom'
import themeDefault from 'themes/lightGreen'
import AlbumTeaser from 'modules/dashboard/components/AlbumTeaser'
import AlbumMoreActionsContextMenu from 'modules/dashboard/components/AlbumMoreActionsContextMenu'
import { makeMockStore } from '../../../../../__tests__/test-utils/redux'

jest.mock('modules/player/store/store', () => ({
  playAlbum: jest.fn(),
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
  it('should render correctly', () => {
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

    expect(screen.getByText('Test album')).toBeInTheDocument()
    expect(screen.getByText('Test artist')).toBeInTheDocument()
    expect(screen.getByTestId('album-teaser-overlay')).toHaveStyle({
      backgroundColor: 'transparent',
    })
  })

  it('should display an overlay if mouse is over', () => {
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

  it('should display a full actions menu on right-click', () => {
    const setSelected = jest.fn()

    render(
      <ReduxProvider store={store}>
        <Router>
          <ThemeProvider theme={themeDefault}>
            <AlbumTeaser
              album={album}
              selected={false}
              setSelected={setSelected}
            />
            <AlbumMoreActionsContextMenu
              menuId="random-album-more-actions-context-menu"
              onHidden={() => {}}
            />
          </ThemeProvider>
        </Router>
      </ReduxProvider>
    )

    fireEvent.contextMenu(screen.getByTestId('album-teaser'))
    expect(setSelected).toHaveBeenCalledTimes(1)
    expect(screen.getByText('player.actions.playNow')).toBeInTheDocument()
  })

  it('should display a limited actions menu on right-click', () => {
    const setSelected = jest.fn()

    render(
      <ReduxProvider store={store}>
        <Router>
          <ThemeProvider theme={themeDefault}>
            <AlbumTeaser
              album={album}
              selected={false}
              setSelected={setSelected}
            />
            <AlbumMoreActionsContextMenu
              menuId="random-album-more-actions-context-menu"
              onHidden={() => {}}
            />
          </ThemeProvider>
        </Router>
      </ReduxProvider>
    )

    fireEvent.click(screen.getByTestId('album-teaser-more-button'))
    expect(setSelected).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('player.actions.playNow')).not.toBeInTheDocument()
    expect(screen.getByText('player.actions.addToQueue')).toBeInTheDocument()
  })

  it('should play the album if user clicks on the play button', () => {
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

  it('should display "Unknown artist" if artist does not have a name', () => {
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