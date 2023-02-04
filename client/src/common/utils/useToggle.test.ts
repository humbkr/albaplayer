import { act, renderHook } from '@testing-library/react'
import { useToggle } from './useToggle'

describe('HOOK: useToggle', () => {
  it('should toggle correctly', async () => {
    const { result } = renderHook(() => useToggle())

    expect(result.current.isToggled).toBe(false)

    await act(async () => {
      await result.current.toggle()
    })

    expect(result.current.isToggled).toBe(true)
  })

  it('should have the correct default value if specified', async () => {
    const { result } = renderHook(() => useToggle(true))

    expect(result.current.isToggled).toBe(true)

    await act(async () => {
      await result.current.toggle()
    })

    expect(result.current.isToggled).toBe(false)
  })
})
