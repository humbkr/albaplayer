import { useCallback, useEffect, useState } from 'react'

// Safari on iOS / iPadOS only exposes the webkit-prefixed Fullscreen API.
type WebkitDocument = Document & {
  webkitFullscreenEnabled?: boolean
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
}
type WebkitElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
}

function getFullscreenElement() {
  const doc = document as WebkitDocument

  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null
}

function isFullscreenSupported() {
  const doc = document as WebkitDocument

  return Boolean(doc.fullscreenEnabled || doc.webkitFullscreenEnabled)
}

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(
    () => getFullscreenElement() !== null
  )

  useEffect(() => {
    const onChange = () => setIsFullscreen(getFullscreenElement() !== null)

    document.addEventListener('fullscreenchange', onChange)
    document.addEventListener('webkitfullscreenchange', onChange)

    return () => {
      document.removeEventListener('fullscreenchange', onChange)
      document.removeEventListener('webkitfullscreenchange', onChange)
    }
  }, [])

  const toggleFullscreen = useCallback(async () => {
    const doc = document as WebkitDocument
    const element = document.documentElement as WebkitElement

    if (getFullscreenElement()) {
      await (doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.())
    } else {
      await (element.requestFullscreen?.() ??
        element.webkitRequestFullscreen?.())
    }
  }, [])

  return {
    isSupported: isFullscreenSupported(),
    isFullscreen,
    toggleFullscreen,
  }
}
