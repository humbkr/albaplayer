import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FullscreenButton from 'common/components/layout/FullscreenButton'
import { renderWithProviders } from 'common/utils/testing/test-utils'
import ResizeObserver from 'resize-observer-polyfill'

global.ResizeObserver = ResizeObserver

function setDocumentProperty(name: string, value: unknown) {
  Object.defineProperty(document, name, { configurable: true, value })
}

describe('FullscreenButton', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    Object.defineProperty(navigator, 'maxTouchPoints', {
      configurable: true,
      value: undefined,
    })
    setDocumentProperty('fullscreenEnabled', undefined)
    setDocumentProperty('webkitFullscreenEnabled', undefined)
    setDocumentProperty('fullscreenElement', undefined)
    setDocumentProperty('webkitFullscreenElement', undefined)
    setDocumentProperty('exitFullscreen', undefined)
    setDocumentProperty('webkitExitFullscreen', undefined)
    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      configurable: true,
      value: undefined,
    })
    Object.defineProperty(document.documentElement, 'webkitRequestFullscreen', {
      configurable: true,
      value: undefined,
    })
  })

  it('should not render when fullscreen is not supported', () => {
    renderWithProviders(<FullscreenButton />)

    expect(screen.queryByTestId('fullscreen-button')).not.toBeInTheDocument()
  })

  it('should not render on iOS', () => {
    setDocumentProperty('webkitFullscreenEnabled', true)
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15'
    )
    // Jsdom does not implement maxTouchPoints.
    Object.defineProperty(navigator, 'maxTouchPoints', {
      configurable: true,
      value: 5,
    })

    renderWithProviders(<FullscreenButton />)

    expect(screen.queryByTestId('fullscreen-button')).not.toBeInTheDocument()
  })

  it('should request fullscreen with the webkit API on Safari', async () => {
    const webkitRequestFullscreen = vi.fn()
    setDocumentProperty('webkitFullscreenEnabled', true)
    Object.defineProperty(document.documentElement, 'webkitRequestFullscreen', {
      configurable: true,
      value: webkitRequestFullscreen,
    })

    renderWithProviders(<FullscreenButton />)
    await userEvent.click(screen.getByTestId('fullscreen-button'))

    expect(webkitRequestFullscreen).toHaveBeenCalled()
  })

  it('should exit fullscreen when already in fullscreen', async () => {
    const webkitExitFullscreen = vi.fn()
    setDocumentProperty('webkitFullscreenEnabled', true)
    setDocumentProperty('webkitExitFullscreen', webkitExitFullscreen)

    renderWithProviders(<FullscreenButton />)

    setDocumentProperty('webkitFullscreenElement', document.documentElement)
    act(() => {
      document.dispatchEvent(new Event('webkitfullscreenchange'))
    })

    expect(screen.getByText('fullscreen_exit')).toBeInTheDocument()

    await userEvent.click(screen.getByTestId('fullscreen-button'))

    expect(webkitExitFullscreen).toHaveBeenCalled()
  })
})
