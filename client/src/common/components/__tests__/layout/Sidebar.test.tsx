import Sidebar from 'common/components/layout/Sidebar'
import { screen } from '@testing-library/react'
import { renderWithProviders } from 'common/utils/testing/test-utils'

vi.mock('modules/player/components/Player', () => ({
  default: () => <div data-testid="Player" />,
}))
vi.mock('common/components/layout/SidebarNavLink', () => ({
  default: () => <div data-testid="SidebarNavLink" />,
}))

describe('Sidebar', () => {
  it('displays all required elements', () => {
    renderWithProviders(<Sidebar />)

    expect(screen.getByTestId('Player')).toBeInTheDocument()
    expect(screen.getByTestId('main-menu')).toBeInTheDocument()
  })
})
