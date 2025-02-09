import KeyboardNavPlayModal from 'common/components/KeyboardNavPlayModal'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type React from 'react'
import { renderWithProviders } from 'common/utils/testing/test-utils'

vi.mock('common/components/layout/Modal', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>test {children}</div>
  ),
}))

const mockHandlePlayNow = vi.fn()
const mockHandleAddToQueue = vi.fn()
const mockHandleClose = vi.fn()

describe('KeyboardNavPlayModal', () => {
  it('displays correctly', () => {
    renderWithProviders(
      <KeyboardNavPlayModal
        id="id"
        itemId="item-id"
        handlePlayNow={mockHandlePlayNow}
        handleAddToQueue={mockHandleAddToQueue}
        isOpen
        onClose={mockHandleClose}
      />
    )

    expect(
      screen.getByText('browser.actions.pressToAddToPlaylist', { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText('browser.actions.pressToReplacePlaylist', {
        exact: false,
      })
    ).toBeInTheDocument()
  })

  it('triggers correct actions on "Enter" key press', async () => {
    renderWithProviders(
      <KeyboardNavPlayModal
        id="id"
        itemId="item-id"
        handlePlayNow={mockHandlePlayNow}
        handleAddToQueue={mockHandleAddToQueue}
        isOpen
        onClose={mockHandleClose}
      />
    )

    await userEvent.click(
      screen.getByText('browser.actions.pressToReplacePlaylist', {
        exact: false,
      })
    )
    await userEvent.keyboard('[Enter]')
    expect(mockHandleAddToQueue).toHaveBeenCalledTimes(1)
    expect(mockHandleAddToQueue).toHaveBeenCalledWith('item-id')
    expect(mockHandleClose).toHaveBeenCalledTimes(1)
  })

  it('triggers correct actions on "Space" key press', async () => {
    renderWithProviders(
      <KeyboardNavPlayModal
        id="id"
        itemId="item-id"
        handlePlayNow={mockHandlePlayNow}
        handleAddToQueue={mockHandleAddToQueue}
        isOpen
        onClose={mockHandleClose}
      />
    )

    await userEvent.click(
      screen.getByText('browser.actions.pressToAddToPlaylist', { exact: false })
    )
    await userEvent.keyboard('[Space]')
    expect(mockHandlePlayNow).toHaveBeenCalledTimes(1)
    expect(mockHandlePlayNow).toHaveBeenCalledWith('item-id')
    expect(mockHandleClose).toHaveBeenCalledTimes(1)
  })
})
