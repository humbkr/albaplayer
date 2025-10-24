import { devices } from 'themes/breakpoints'
import useMediaQuery from './useMediaQuery'

/**
 * Get a set of boolean representing which breakpoint is active
 * and which breakpoints are inactive.
 *
 * Inspired by: https://github.com/contra/react-responsive/issues/162#issuecomment-592082035
 */
export default function useBreakpoints() {
  const breakpoints = {
    isXS: useMediaQuery(devices.xs),
    isSM: useMediaQuery(devices.sm),
    isMD: useMediaQuery(devices.md),
    isLG: useMediaQuery(devices.lg),
    isXL: useMediaQuery(devices.xl),
    isXXL: useMediaQuery(devices.xxl),
    active: 'xs',
  }

  if (breakpoints.isXS) {
    breakpoints.active = 'xs'
  }
  if (breakpoints.isSM) {
    breakpoints.active = 'sm'
  }
  if (breakpoints.isMD) {
    breakpoints.active = 'md'
  }
  if (breakpoints.isLG) {
    breakpoints.active = 'lg'
  }
  if (breakpoints.isXL) {
    breakpoints.active = 'xl'
  }
  if (breakpoints.isXXL) {
    breakpoints.active = 'xxl'
  }

  return breakpoints
}
