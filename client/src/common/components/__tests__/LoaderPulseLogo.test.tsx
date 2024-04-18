import LoaderPulseLogo from 'common/components/LoaderPulseLogo'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'

describe('LoaderPulseLogo', () => {
  it('displays correctly', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <LoaderPulseLogo />
      </ThemeProvider>
    )

    expect(screen.getByAltText('Logo')).toBeInTheDocument()
  })
})
