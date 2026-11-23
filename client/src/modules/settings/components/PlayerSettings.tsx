import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import {
  selectUserConfig,
  updatePlayerConfig,
} from 'modules/settings/userConfig'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { SETTINGS_PLAYER_TIME_VISIBILITY } from 'modules/settings/constants'
import SelectField, {
  getSelectedOption,
} from 'common/components/forms/SelectField'
import FieldGroup from 'common/components/forms/FieldGroup'

function PlayerSettings() {
  const { t } = useTranslation()

  const config = useAppSelector((state) => selectUserConfig(state).player)
  const dispatch = useAppDispatch()

  const timeVisibilityOptions = [
    {
      value: SETTINGS_PLAYER_TIME_VISIBILITY.always,
      label: t('settings.player.timeVisibility.always'),
    },
    {
      value: SETTINGS_PLAYER_TIME_VISIBILITY.progressBarHover,
      label: t('settings.player.timeVisibility.progressBarHover'),
    },
    {
      value: SETTINGS_PLAYER_TIME_VISIBILITY.never,
      label: t('settings.player.timeVisibility.never'),
    },
  ]

  return (
    <Block data-testid="settings-player">
      <FieldGroup>
        <SelectField
          label={t('settings.player.timeVisibility.label')}
          data-testid="settings-player-time-visibility-select"
          options={timeVisibilityOptions}
          value={getSelectedOption(
            timeVisibilityOptions,
            config.timeVisibility
          )}
          onChange={(selected) =>
            dispatch(
              updatePlayerConfig({
                timeVisibility:
                  selected?.value as SETTINGS_PLAYER_TIME_VISIBILITY,
              })
            )
          }
        />
      </FieldGroup>
    </Block>
  )
}

export default PlayerSettings

const Block = styled.div`
  margin-top: 30px;
`
