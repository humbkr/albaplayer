import userEvent from '@testing-library/user-event'
import usePlaybackKeys from 'modules/player/hooks/usePlaybackKeys'
import { playerInitialState } from 'modules/player/store/player.store'
import { renderWithProviders } from 'common/utils/testing/test-utils'

const track: Track = {
  id: '1',
  title: 'Track 1',
  src: '/stream/1',
  number: 1,
  disc: '',
  duration: 123,
  cover: '',
}

function PlaybackKeysHarness() {
  usePlaybackKeys()

  return null
}

describe('usePlaybackKeys', () => {
  it('toggles playback when Space is pressed', async () => {
    const { store } = renderWithProviders(<PlaybackKeysHarness />, {
      preloadedState: {
        player: { ...playerInitialState, track, loading: false },
      },
    })

    await userEvent.keyboard(' ')

    expect(store.getState().player.playing).toBe(true)
  })

  it('does not toggle playback when Space is pressed while a track is loading', async () => {
    const { store } = renderWithProviders(<PlaybackKeysHarness />, {
      preloadedState: {
        player: { ...playerInitialState, track, loading: true },
      },
    })

    await userEvent.keyboard(' ')

    expect(store.getState().player.playing).toBe(false)
  })
})
