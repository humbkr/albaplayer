import { BrowserRouter } from 'react-router'
import { screen } from '@testing-library/react'
import Dashboard from 'modules/dashboard/scenes/Dashboard'
import { renderWithProviders } from 'common/utils/testing/test-utils'

vi.mock('modules/dashboard/components/RandomAlbums', () => ({
  default: () => <div data-testid="RandomAlbums" />,
}))
vi.mock('modules/dashboard/components/RecentlyAddedAlbums', () => ({
  default: () => <div data-testid="RecentlyAddedAlbums" />,
}))

describe('dashboard - Dashboard scene', () => {
  it('should render without error', () => {
    renderWithProviders(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )

    expect(screen.getByTestId('RandomAlbums')).toBeInTheDocument()
    expect(screen.getByTestId('RecentlyAddedAlbums')).toBeInTheDocument()
  })
})
