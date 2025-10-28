import Tab from 'common/components/layout/Tab'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from 'common/utils/testing/test-utils'

describe('Tab', () => {
  it('displays correctly', async () => {
    const mockOnClick = vi.fn()

    renderWithProviders(<Tab id="test" label="Test" onClick={mockOnClick} />)

    expect(screen.getByText('Test')).toBeInTheDocument()

    await userEvent.click(screen.getByText('Test'))

    expect(mockOnClick).toHaveBeenCalled()
  })
})
