import KeyboardNavPlayModal from 'common/components/KeyboardNavPlayModal'
import { render } from '@testing-library/react'

describe('KeyboardNavPlayModal', () => {
  it('displays correctly', () => {
    const mockHandlePlayNow = jest.fn()
    const mockHandleAddToQueue = jest.fn()
    const mockHandleClose = jest.fn()

    render(
      <KeyboardNavPlayModal
        id="id"
        itemId="item-id"
        handlePlayNow={mockHandlePlayNow}
        handleAddToQueue={mockHandleAddToQueue}
        isOpen
        onClose={mockHandleClose}
      />
    )
    // TODO code tests
  })
})
