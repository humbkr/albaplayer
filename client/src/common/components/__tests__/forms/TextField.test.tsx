import TextField from 'common/components/forms/TextField'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import themeDefault from 'themes/lightGreen'

describe('TextField', () => {
  it('should display correctly', () => {
    render(
      <ThemeProvider theme={themeDefault}>
        <TextField name="test" />
      </ThemeProvider>
    )
    // TODO code tests
  })
})
