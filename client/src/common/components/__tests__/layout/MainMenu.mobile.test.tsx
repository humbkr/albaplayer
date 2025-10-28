import { screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MainMenu from 'common/components/layout/MainMenu.mobile'
import { renderWithProviders } from 'common/utils/testing/test-utils'

describe('MainMenu (mobile)', () => {
  it('displays correctly', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/library']}>
        <MainMenu />
      </MemoryRouter>
    )

    expect(screen.getByTestId('main-menu')).toBeInTheDocument()
    expect(screen.getByText('play_circle_outline')).toBeInTheDocument()
    expect(screen.getByText('library_music')).toBeInTheDocument()
    expect(screen.getByText('view_list')).toBeInTheDocument()
    expect(screen.getByText('lightbulb_outline')).toBeInTheDocument()
  })
})
