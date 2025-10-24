import { screen } from '@testing-library/react'
import type { Mock } from 'vitest'
import { useNavigate } from 'react-router'
import ActionBar from 'common/components/layout/ActionBar.mobile'
import { renderWithProviders } from 'common/utils/testing/test-utils'

vi.mock('react-router')
const useNavigateMock = useNavigate as Mock
const mockNavigate = vi.fn()

describe('ActionBar (mobile)', () => {
  beforeEach(() => {
    useNavigateMock.mockReturnValue(mockNavigate)
  })

  it('should contain all the required elements', () => {
    renderWithProviders(<ActionBar />)

    expect(screen.getByTestId('search-input')).toBeInTheDocument()
  })
})
