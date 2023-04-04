import Sidebar from 'common/components/layout/Sidebar'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'

jest.mock(
  'modules/player/components/Player',
  () =>
    function () {
      return <div data-testid="Player"></div>
    }
)
jest.mock(
  'common/components/layout/SideBarNavLink',
  () =>
    function () {
      return <div data-testid="SideBarNavLink"></div>
    }
)

describe('Sidebar', () => {
  it('displays all required elements', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <Sidebar />
      </ThemeProvider>
    )

    expect(screen.getByTestId('Player')).toBeInTheDocument()
    expect(screen.getByTestId('main-menu')).toBeInTheDocument()
  })
})
