import { render, screen } from '@testing-library/react'
import React from 'react'
import Cover from '../components/Cover'

describe('QueueActionsMoreContextMenu', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders correctly', () => {
    render(<Cover src="whatever" />)

    expect(screen.getByTestId('cover-default')).toBeInTheDocument()
    expect(screen.getByTestId('cover-image')).toBeInTheDocument()
  })

  it('renders default cover placeholder if no cover provided', () => {
    render(<Cover src={undefined} />)

    expect(screen.getByTestId('cover-default')).toBeInTheDocument()
    expect(screen.queryByTestId('cover-image')).not.toBeInTheDocument()
  })
})
