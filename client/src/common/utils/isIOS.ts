export function isIOS() {
  const isIPhoneOrOlderIPad = /iPad|iPhone|iPod/.test(navigator.userAgent)
  // IPadOS 13+ reports itself as macOS: tell them apart by the touch screen.
  const isIPad =
    navigator.userAgent.includes('Macintosh') && navigator.maxTouchPoints > 1

  return isIPhoneOrOlderIPad || isIPad
}
