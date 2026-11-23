import { BrowserRouter } from 'react-router'
import { screen } from '@testing-library/react'
// Load the store before the component to avoid a circular import.
import { renderWithProviders } from 'common/utils/testing/test-utils'
import { libraryInitialState } from 'modules/library/store'
import { browserInitialState } from 'modules/browser/store'
import { AlbumDetailsHeader } from 'modules/browser/components/AlbumDetailsHeader'

const renderHeader = (year: string, durations: number[]) => {
  const tracks = Object.fromEntries(
    durations.map((duration, index) => [
      `${index + 1}`,
      {
        id: `${index + 1}`,
        title: `Track ${index + 1}`,
        src: '',
        albumId: '1',
        duration,
      },
    ])
  )

  renderWithProviders(
    <BrowserRouter>
      <AlbumDetailsHeader />
    </BrowserRouter>,
    {
      preloadedState: {
        library: {
          ...libraryInitialState,
          artists: { 1: { id: '1', name: 'Artist name' } },
          albums: {
            1: {
              id: '1',
              title: 'Album title',
              year,
              artistId: '1',
              dateAdded: 0,
            },
          },
          tracks,
        },
        libraryBrowser: { ...browserInitialState, selectedAlbums: '1' },
      },
    }
  )
}

describe('AlbumDetailsHeader', () => {
  it('displays the year and the total length of the album', () => {
    renderHeader('2017', [205, 300, 1200])

    expect(screen.getByText('Album title')).toBeInTheDocument()
    expect(screen.getByText('28:25').parentElement).toHaveTextContent(
      '2017 · 28:25'
    )
    expect(screen.getByText('28:25')).toHaveStyle('font-style: italic')
  })

  it('displays only the year when track durations are unknown', () => {
    renderHeader('2017', [0, 0])

    expect(screen.getByText('2017')).toBeInTheDocument()
  })

  it('displays only the total length when the year is unknown', () => {
    renderHeader('', [3000, 905])

    expect(screen.getByText('1:05:05')).toBeInTheDocument()
  })
})
