import { screen } from '@testing-library/react'

import Message, { MessageType } from 'common/components/Message'
import { renderWithProviders } from 'common/utils/testing/test-utils'

describe('Message', () => {
  it('display correctly for type "info"', () => {
    renderWithProviders(<Message type={MessageType.info}>message</Message>)

    expect(screen.getByText('info')).toBeInTheDocument()
    expect(screen.getByText('message')).toBeInTheDocument()
  })

  it('display correctly for type "warning"', () => {
    renderWithProviders(<Message type={MessageType.warning}>message</Message>)

    expect(screen.getByText('warning')).toBeInTheDocument()
    expect(screen.getByText('message')).toBeInTheDocument()
  })

  it('display correctly for type "error"', () => {
    renderWithProviders(<Message type={MessageType.error}>message</Message>)

    expect(screen.getByText('error')).toBeInTheDocument()
    expect(screen.getByText('message')).toBeInTheDocument()
  })
})
