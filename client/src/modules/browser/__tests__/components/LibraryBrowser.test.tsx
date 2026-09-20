import { screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import { renderWithProviders } from 'common/utils/testing/test-utils'
import LibraryBrowser from 'modules/browser/scenes/LibraryBrowser'

describe('LibraryBrowser', () => {
  it('displays without any error', () => {
    renderWithProviders(
      <BrowserRouter>
        <LibraryBrowser ref={null} />
      </BrowserRouter>
    )

    expect(screen.getByText('browser.artists.title')).toBeInTheDocument()
    expect(screen.getByText('browser.albums.title')).toBeInTheDocument()
    expect(screen.getByText('browser.tracks.title')).toBeInTheDocument()
  })
})
