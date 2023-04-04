import MainPanel from 'common/components/layout/MainPanel'
import { render, screen } from '@testing-library/react'
import { useAppSelector } from 'store/hooks'
import { BrowserRouter } from 'react-router-dom'

jest.mock('store/hooks')
const useAppSelectorMock = useAppSelector as jest.Mock

jest.mock(
  'modules/now_playing/scenes/NowPlaying',
  () =>
    function () {
      return <div data-testid="now-playing" />
    }
)
jest.mock(
  'modules/settings/scenes/Preferences',
  () =>
    function () {
      return <div data-testid="preferences" />
    }
)
jest.mock(
  'modules/playlist/scenes/Playlists',
  () =>
    function () {
      return <div data-testid="playlists" />
    }
)
jest.mock(
  'modules/dashboard/scenes/Dashboard',
  () =>
    function () {
      return <div data-testid="dashboard" />
    }
)
jest.mock(
  'modules/settings/scenes/Administration',
  () =>
    function () {
      return <div data-testid="administration" />
    }
)
jest.mock(
  'modules/browser/scenes/LibraryBrowser',
  () =>
    function () {
      return <div data-testid="library-browser" />
    }
)

describe('MainPanel', () => {
  it('displays a loader if app is not initialised', () => {
    useAppSelectorMock.mockReturnValueOnce(true)
    useAppSelectorMock.mockReturnValueOnce(false)

    render(
      <BrowserRouter>
        <MainPanel />
      </BrowserRouter>
    )

    expect(screen.getByTestId('main-loading-screen')).toBeInTheDocument()
  })

  it('does not display a loader if app is initialised', () => {
    useAppSelectorMock.mockReturnValueOnce(false)
    useAppSelectorMock.mockReturnValueOnce(true)

    render(
      <BrowserRouter>
        <MainPanel />
      </BrowserRouter>
    )

    expect(screen.queryByTestId('main-loading-screen')).not.toBeInTheDocument()
  })
})
