import LoaderPulse from 'common/components/LoaderPulse'
import { render, screen } from '@testing-library/react'
import themeDefault from 'themes/lightGreen'
import { ThemeProvider } from 'styled-components'

describe('LoaderPulse', () => {
  it('displays without error', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <LoaderPulse data-testid="loader" />
      </ThemeProvider>
    )

    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })
})
