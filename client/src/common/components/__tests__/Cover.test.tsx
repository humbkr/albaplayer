import { render, screen, waitFor } from '@testing-library/react'

import Cover from 'common/components/Cover'
import { getAuthAssetURL } from 'api/api'

jest.mock('api/api', () => ({
  getAuthAssetURL: jest.fn(),
}))

describe('QueueActionsMoreContextMenu', () => {
  beforeEach(() => {
    ;(getAuthAssetURL as jest.Mock).mockResolvedValue('whatever')
  })

  it('renders correctly', async () => {
    render(<Cover src="whatever" />)

    await waitFor(() => {
      expect(screen.getByTestId('cover-default')).toBeInTheDocument()
    })

    expect(screen.getByTestId('cover-image')).toBeInTheDocument()
  })

  it('renders default cover placeholder if no cover provided', async () => {
    render(<Cover src={undefined} />)

    await waitFor(() => {
      expect(screen.getByTestId('cover-default')).toBeInTheDocument()
    })
    expect(screen.queryByTestId('cover-image')).not.toBeInTheDocument()
  })
})
