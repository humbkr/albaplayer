import { render, screen } from '@testing-library/react'

import Scroller from 'common/components/Scroller'

describe('Scroller', () => {
  it('display correctly', () => {
    render(<Scroller>children</Scroller>)

    expect(screen.getByText('children')).toBeInTheDocument()
  })
})
