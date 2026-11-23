import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// Load the store before the component to avoid a circular import.
import { renderWithProviders } from 'common/utils/testing/test-utils'
import { makeStore } from 'store/store'
import { userConfigApi } from 'modules/user/api'
import {
  SETTINGS_PLAYER_TIME_DISPLAY,
  SETTINGS_PLAYER_TIME_VISIBILITY,
} from 'modules/settings/constants'
import type { UserConfig } from 'modules/settings/userConfig'
import PlaybackTime from 'modules/player/components/PlaybackTime'

const makeStoreWithUser = async (player?: Partial<UserConfig['player']>) => {
  const store = makeStore()
  await store.dispatch(
    userConfigApi.util.upsertQueryData('getUser', undefined, {
      id: 1,
      name: 'root',
      roles: ['root'],
      data: player ? JSON.stringify({ player }) : '',
    })
  )

  return store
}

describe('PlaybackTime', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      async () =>
        new Response(JSON.stringify({ data: { updateUser: { id: 1 } } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('displays the elapsed time and the duration by default', async () => {
    const store = await makeStoreWithUser()

    renderWithProviders(<PlaybackTime position={72.8} duration={205.4} />, {
      store,
    })

    expect(screen.getByText('01:12 / 03:25')).toBeInTheDocument()
  })

  it('displays the remaining time when set in the user config', async () => {
    const store = await makeStoreWithUser({
      timeDisplay: SETTINGS_PLAYER_TIME_DISPLAY.remaining,
    })

    renderWithProviders(<PlaybackTime position={72.8} duration={205.4} />, {
      store,
    })

    expect(screen.getByText('-02:13')).toBeInTheDocument()
  })

  it('cycles between the two displays when clicked', async () => {
    const store = await makeStoreWithUser()

    renderWithProviders(<PlaybackTime position={72} duration={205} />, {
      store,
    })

    await userEvent.click(screen.getByTestId('player-playback-time'))
    expect(await screen.findByText('-02:13')).toBeInTheDocument()

    await userEvent.click(screen.getByTestId('player-playback-time'))
    expect(await screen.findByText('01:12 / 03:25')).toBeInTheDocument()

    // Let the saves complete so they don't leak into the next test.
    await vi.waitFor(() =>
      Object.values(store.getState().graphqlApi.mutations).forEach((mutation) =>
        expect(mutation?.status).toBe('fulfilled')
      )
    )
  })

  it.each([0, NaN, Infinity])(
    'displays nothing when the duration is %s',
    async (duration) => {
      const store = await makeStoreWithUser()

      renderWithProviders(<PlaybackTime position={0} duration={duration} />, {
        store,
      })

      expect(
        screen.queryByTestId('player-playback-time')
      ).not.toBeInTheDocument()
    }
  )

  it('displays nothing when set to never be displayed', async () => {
    const store = await makeStoreWithUser({
      timeVisibility: SETTINGS_PLAYER_TIME_VISIBILITY.never,
    })

    renderWithProviders(
      <PlaybackTime position={72} duration={205} isProgressBarHovered />,
      { store }
    )

    expect(screen.queryByTestId('player-playback-time')).not.toBeInTheDocument()
  })

  it('is always visible by default', async () => {
    const store = await makeStoreWithUser()

    renderWithProviders(<PlaybackTime position={72} duration={205} />, {
      store,
    })

    expect(screen.getByTestId('player-playback-time')).toHaveStyle(
      'visibility: visible'
    )
  })

  it('is only visible while the progress bar is hovered when set so', async () => {
    const store = await makeStoreWithUser({
      timeVisibility: SETTINGS_PLAYER_TIME_VISIBILITY.progressBarHover,
    })

    const { rerender } = renderWithProviders(
      <PlaybackTime position={72} duration={205} />,
      { store }
    )

    expect(screen.getByTestId('player-playback-time')).toHaveStyle(
      'visibility: hidden'
    )

    rerender(<PlaybackTime position={72} duration={205} isProgressBarHovered />)

    expect(screen.getByTestId('player-playback-time')).toHaveStyle(
      'visibility: visible'
    )
  })
})
