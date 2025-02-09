import MainPanel from 'common/components/layout/MainPanel'
import type { Mock } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useAppSelector } from 'store/hooks'
import { BrowserRouter } from 'react-router'

vi.mock('store/hooks')
const useAppSelectorMock = useAppSelector as unknown as Mock

vi.mock('modules/now_playing/scenes/NowPlaying', () => ({
  default: () => <div data-testid="now-playing" />,
}))
vi.mock('modules/settings/scenes/Preferences', () => ({
  default: () => <div data-testid="preferences" />,
}))
vi.mock('modules/collections/scenes/Playlists', () => ({
  default: () => <div data-testid="playlists" />,
}))
vi.mock('modules/dashboard/scenes/Dashboard', () => ({
  default: () => <div data-testid="dashboard" />,
}))
vi.mock('modules/settings/scenes/Administration', () => ({
  default: () => <div data-testid="administration" />,
}))
vi.mock('modules/browser/scenes/LibraryBrowser', () => ({
  default: () => <div data-testid="library-browser" />,
}))

describe('MainPanel', () => {
  it('displays a loader if app is not initialised', () => {
    useAppSelectorMock.mockReturnValue({
      isFetching: false,
      isInitialized: false,
    })

    render(
      <BrowserRouter>
        <MainPanel />
      </BrowserRouter>
    )

    expect(screen.getByTestId('main-loading-screen')).toBeInTheDocument()
  })

  it('displays a loader if data is fetching', () => {
    useAppSelectorMock.mockReturnValue({
      isFetching: true,
      isInitialized: true,
    })

    render(
      <BrowserRouter>
        <MainPanel />
      </BrowserRouter>
    )

    expect(screen.getByTestId('main-loading-screen')).toBeInTheDocument()
  })

  it('does not display a loader if app is initialised', () => {
    useAppSelectorMock.mockReturnValue({
      isFetching: false,
      isInitialized: true,
    })

    render(
      <BrowserRouter>
        <MainPanel />
      </BrowserRouter>
    )

    expect(screen.queryByTestId('main-loading-screen')).not.toBeInTheDocument()
  })
})
