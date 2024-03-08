import KeyboardNavPlayModal from 'common/components/KeyboardNavPlayModal'
import { render, screen } from '@testing-library/react'
import themeDefault from 'themes/lightGreen'
import { ThemeProvider } from 'styled-components'
import userEvent from '@testing-library/user-event'
import React from 'react'

jest.mock('common/components/layout/Modal', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>test {children}</div>
  ),
}))

const mockHandlePlayNow = jest.fn()
const mockHandleAddToQueue = jest.fn()
const mockHandleClose = jest.fn()

describe('KeyboardNavPlayModal', () => {
  it('displays correctly', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <KeyboardNavPlayModal
          id="id"
          itemId="item-id"
          handlePlayNow={mockHandlePlayNow}
          handleAddToQueue={mockHandleAddToQueue}
          isOpen
          onClose={mockHandleClose}
        />
      </ThemeProvider>
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
    render(
      <ThemeProvider theme={themeDefault}>
        <KeyboardNavPlayModal
          id="id"
          itemId="item-id"
          handlePlayNow={mockHandlePlayNow}
          handleAddToQueue={mockHandleAddToQueue}
          isOpen
          onClose={mockHandleClose}
        />
      </ThemeProvider>
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
    render(
      <ThemeProvider theme={themeDefault}>
        <KeyboardNavPlayModal
          id="id"
          itemId="item-id"
          handlePlayNow={mockHandlePlayNow}
          handleAddToQueue={mockHandleAddToQueue}
          isOpen
          onClose={mockHandleClose}
        />
      </ThemeProvider>
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
