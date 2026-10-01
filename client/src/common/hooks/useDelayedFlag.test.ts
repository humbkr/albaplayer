import { act, renderHook } from '@testing-library/react'
import useDelayedFlag from 'common/hooks/useDelayedFlag'

describe('useDelayedFlag', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function renderDelayedFlag(initialValue: boolean) {
    return renderHook(({ value }) => useDelayedFlag(value, 1000), {
      initialProps: { value: initialValue },
    })
  }

  it('is false while the value is false', () => {
    const { result } = renderDelayedFlag(false)

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current).toBe(false)
  })

  it('turns true only once the value has been true for the delay', () => {
    const { result } = renderDelayedFlag(true)

    act(() => {
      vi.advanceTimersByTime(999)
    })
    expect(result.current).toBe(false)

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe(true)
  })

  it('never turns true when the value turns false before the delay', () => {
    const { result, rerender } = renderDelayedFlag(true)

    act(() => {
      vi.advanceTimersByTime(999)
    })
    rerender({ value: false })
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current).toBe(false)
  })

  it('turns false immediately when the value turns false', () => {
    const { result, rerender } = renderDelayedFlag(true)
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current).toBe(true)

    rerender({ value: false })

    expect(result.current).toBe(false)
  })

  it('waits for the full delay again on the next activation', () => {
    const { result, rerender } = renderDelayedFlag(true)
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    rerender({ value: false })

    rerender({ value: true })
    expect(result.current).toBe(false)

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current).toBe(true)
  })
})
