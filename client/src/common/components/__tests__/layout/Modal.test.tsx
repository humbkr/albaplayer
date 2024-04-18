import Modal from 'common/components/layout/Modal'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'
import React from 'react'
import userEvent from '@testing-library/user-event'

jest.mock('react-modal', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>test {children}</div>
  ),
}))

describe('Modal', () => {
  it('displays correctly with minimal props', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <Modal id="id" isOpen>
          Children
        </Modal>
      </ThemeProvider>
    )

    expect(screen.getByText('Children')).toBeInTheDocument()
    expect(screen.getByTestId('modal-close')).toBeInTheDocument()
    expect(screen.getByText('common.cancel')).toBeInTheDocument()
    expect(screen.getByText('common.validate')).toBeInTheDocument()
  })

  it('displays correctly when a title and custom actions labels are provided', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <Modal
          id="id"
          isOpen
          title="Title test"
          cancelActionLabel="Cancel test"
          mainActionLabel="Validate test"
        >
          Children
        </Modal>
      </ThemeProvider>
    )

    expect(screen.getByText('Children')).toBeInTheDocument()
    expect(screen.getByText('Title test')).toBeInTheDocument()
    expect(screen.getByText('Cancel test')).toBeInTheDocument()
    expect(screen.getByText('Validate test')).toBeInTheDocument()
  })

  it('displays correctly when buttons are hidden', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <Modal id="id" isOpen hideCloseButton hideActionsButtons>
          Children
        </Modal>
      </ThemeProvider>
    )

    expect(screen.getByText('Children')).toBeInTheDocument()
    expect(screen.queryByTestId('modal-close')).not.toBeInTheDocument()
    expect(screen.queryByText('common.cancel')).not.toBeInTheDocument()
    expect(screen.queryByText('common.validate')).not.toBeInTheDocument()
  })

  it('displays a loader is loading', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <Modal id="id" isOpen mainActionLoading>
          Children
        </Modal>
      </ThemeProvider>
    )

    expect(screen.getByText('Children')).toBeInTheDocument()
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('triggers call back on close', async () => {
    const mockHandleClose = jest.fn()

    render(
      <ThemeProvider theme={themeDefault}>
        <Modal id="id" isOpen onClose={mockHandleClose}>
          Children
        </Modal>
      </ThemeProvider>
    )

    await userEvent.click(screen.getByTestId('modal-close'))

    expect(mockHandleClose).toHaveBeenCalledTimes(1)

    await userEvent.click(screen.getByText('common.cancel'))

    expect(mockHandleClose).toHaveBeenCalledTimes(2)
  })

  it('triggers call back on validate', async () => {
    const mockHandleValidate = jest.fn()

    render(
      <ThemeProvider theme={themeDefault}>
        <Modal id="id" isOpen onValidate={mockHandleValidate}>
          Children
        </Modal>
      </ThemeProvider>
    )

    await userEvent.click(screen.getByText('common.validate'))

    expect(mockHandleValidate).toHaveBeenCalledTimes(1)
  })
})
