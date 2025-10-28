import ActionButton from 'common/components/buttons/ActionButton'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from 'common/utils/testing/test-utils'

describe('ActionButton', () => {
  it('should display children correctly', () => {
    renderWithProviders(<ActionButton>test</ActionButton>)

    expect(screen.getByText('test')).toBeInTheDocument()
  })

  it('should display a loader if loading prop is true', () => {
    renderWithProviders(<ActionButton loading>test</ActionButton>)

    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('should display an icon if icon props is passed', () => {
    renderWithProviders(<ActionButton icon="add">test</ActionButton>)

    expect(screen.getByText('add')).toBeInTheDocument()
  })

  it('should display the loader instead of the icon if icon props is passed and loading', () => {
    renderWithProviders(
      <ActionButton raised icon="add" loading>
        test
      </ActionButton>
    )

    expect(screen.queryByText('add')).not.toBeInTheDocument()
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('should be disabled if prop passed', () => {
    renderWithProviders(
      <ActionButton disabled testId="button">
        test
      </ActionButton>
    )

    expect(screen.getByTestId('button')).toBeDisabled()
  })

  it('should trigger the onClick action when pressed', async () => {
    const mockOnClick = vi.fn()

    renderWithProviders(<ActionButton onClick={mockOnClick}>test</ActionButton>)

    await userEvent.hover(screen.getByText('test'))
    await userEvent.click(screen.getByText('test'))

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})
