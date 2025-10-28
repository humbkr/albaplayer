import SidebarNavLink from 'common/components/layout/SidebarNavLink'
import { screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import { renderWithProviders } from 'common/utils/testing/test-utils'

describe('Sidebar', () => {
  it('displays correctly', () => {
    renderWithProviders(
      <BrowserRouter>
        <SidebarNavLink to="/test">Children</SidebarNavLink>
      </BrowserRouter>
    )

    expect(screen.getByText('Children')).toBeInTheDocument()
  })
  it('displays an icon if specified', () => {
    renderWithProviders(
      <BrowserRouter>
        <SidebarNavLink to="/test" icon="add">
          Children
        </SidebarNavLink>
      </BrowserRouter>
    )

    expect(screen.getByText('Children')).toBeInTheDocument()
    expect(screen.getByText('add')).toBeInTheDocument()
  })
})
