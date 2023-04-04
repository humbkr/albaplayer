import { BrowserRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'
import Dashboard from 'modules/dashboard/scenes/Dashboard'

jest.mock(
  'modules/dashboard/components/RandomAlbums',
  () =>
    function () {
      return <div data-testid="RandomAlbums" />
    }
)
jest.mock(
  'modules/dashboard/components/RecentlyAddedAlbums',
  () =>
    function () {
      return <div data-testid="RecentlyAddedAlbums" />
    }
)

describe('dashboard - Dashboard scene', () => {
  it('should render without error', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </ThemeProvider>
    )

    expect(screen.getByTestId('RandomAlbums')).toBeInTheDocument()
    expect(screen.getByTestId('RecentlyAddedAlbums')).toBeInTheDocument()
  })
})
