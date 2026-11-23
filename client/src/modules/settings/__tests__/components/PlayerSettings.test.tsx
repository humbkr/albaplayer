import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// Load the store before the component to avoid a circular import.
import { renderWithProviders } from 'common/utils/testing/test-utils'
import { makeStore } from 'store/store'
import { userConfigApi } from 'modules/user/api'
import { selectUserConfig } from 'modules/settings/userConfig'
import { SETTINGS_PLAYER_TIME_VISIBILITY } from 'modules/settings/constants'
import PlayerSettings from 'modules/settings/components/PlayerSettings'

const makeStoreWithUser = async () => {
  const store = makeStore()
  await store.dispatch(
    userConfigApi.util.upsertQueryData('getUser', undefined, {
      id: 1,
      name: 'root',
      roles: ['root'],
    })
  )

  return store
}

describe('PlayerSettings', () => {
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

  it('displays the current track time visibility', async () => {
    const store = await makeStoreWithUser()

    renderWithProviders(<PlayerSettings />, { store })

    expect(
      screen.getByText('settings.player.timeVisibility.label')
    ).toBeInTheDocument()
    expect(
      screen.getByText('settings.player.timeVisibility.always')
    ).toBeInTheDocument()
  })

  it('saves the selected track time visibility', async () => {
    const store = await makeStoreWithUser()

    renderWithProviders(<PlayerSettings />, { store })

    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(
      screen.getByText('settings.player.timeVisibility.progressBarHover')
    )

    expect(selectUserConfig(store.getState()).player.timeVisibility).toBe(
      SETTINGS_PLAYER_TIME_VISIBILITY.progressBarHover
    )

    // Let the save complete so it doesn't leak into the next test.
    await vi.waitFor(() =>
      Object.values(store.getState().graphqlApi.mutations).forEach((mutation) =>
        expect(mutation?.status).toBe('fulfilled')
      )
    )
  })
})
