import { screen } from '@testing-library/react'

import AnimatedEQ from 'common/components/AnimatedEQ'
import { renderWithProviders } from 'common/utils/testing/test-utils'

describe('Message', () => {
  it('display correctly if a custom size is passed', () => {
    renderWithProviders(<AnimatedEQ size={45} />)

    expect(screen.getByTestId('animated-eq-icon')).toHaveAttribute(
      'width',
      '45'
    )
  })

  it('display correctly if no custom size is passed', () => {
    renderWithProviders(<AnimatedEQ />)

    expect(screen.getByTestId('animated-eq-icon')).toHaveAttribute(
      'width',
      '24'
    )
  })
})
