import SidebarNavLink from 'common/components/layout/SidebarNavLink'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'
import { BrowserRouter } from 'react-router-dom'

describe('Sidebar', () => {
  it('displays correctly', () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={themeDefault}>
          <SidebarNavLink to="/test">Children</SidebarNavLink>
        </ThemeProvider>
      </BrowserRouter>
    )

    expect(screen.getByText('Children')).toBeInTheDocument()
  })
  it('displays an icon if specified', () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={themeDefault}>
          <SidebarNavLink to="/test" icon="add">
            Children
          </SidebarNavLink>
        </ThemeProvider>
      </BrowserRouter>
    )

    expect(screen.getByText('Children')).toBeInTheDocument()
    expect(screen.getByText('add')).toBeInTheDocument()
  })
})
