import LoaderPulse from 'common/components/LoaderPulse'
import { screen } from '@testing-library/react'

import { renderWithProviders } from 'common/utils/testing/test-utils'

describe('LoaderPulse', () => {
  it('displays without error', () => {
    renderWithProviders(<LoaderPulse data-testid="loader" />)

    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })
})
