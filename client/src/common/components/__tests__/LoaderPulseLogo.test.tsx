import LoaderPulseLogo from 'common/components/LoaderPulseLogo'
import { screen } from '@testing-library/react'
import { renderWithProviders } from 'common/utils/testing/test-utils'

describe('LoaderPulseLogo', () => {
  it('displays correctly', () => {
    renderWithProviders(<LoaderPulseLogo />)

    expect(screen.getByAltText('Logo')).toBeInTheDocument()
  })
})
