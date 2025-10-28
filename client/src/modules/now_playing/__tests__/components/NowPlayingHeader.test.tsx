import { screen } from '@testing-library/react'
import { renderWithProviders } from 'common/utils/testing/test-utils'
import NowPlayingHeader from 'modules/now_playing/components/NowPlayingHeader'

describe('Now Playing > NowPlayingHeader', () => {
  it('should render correctly when no track loaded', () => {
    renderWithProviders(<NowPlayingHeader />)

    expect(screen.getByText('player.noTrackPlaying')).toBeInTheDocument()
  })
})
