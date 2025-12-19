import styled from 'styled-components'
import type { SettingsStateType } from 'modules/settings/store'
import { setBrowserSettings } from 'modules/settings/store'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import {
  SETTINGS_BROWSER_ONCLICK,
  SETTINGS_BROWSER_TRACKS_PANE_DISPLAY,
} from 'modules/settings/constants'
import SelectField, {
  getSelectedOption,
} from 'common/components/forms/SelectField'
import FieldGroup from 'common/components/forms/FieldGroup'

function LibraryBrowserSettings() {
  const { t } = useTranslation()

  const config = useAppSelector((state) => state.settings.browser)
  const dispatch = useAppDispatch()

  const onChangeConfig = (newConfig: Partial<SettingsStateType['browser']>) => {
    dispatch(setBrowserSettings(newConfig))
  }

  const onChangeClickBehavior = (newValue: SETTINGS_BROWSER_ONCLICK) => {
    onChangeConfig({ onClickBehavior: newValue })
  }

  const onChangeAlbumSelection = (
    newValue: SETTINGS_BROWSER_TRACKS_PANE_DISPLAY
  ) => {
    onChangeConfig({
      tracksPaneDisplay: newValue,
    })
  }

  const doubleClickBehaviourOptions = [
    {
      value: SETTINGS_BROWSER_ONCLICK.play,
      label: t('settings.libraryBrowser.clickBehavior.play'),
    },
    {
      value: SETTINGS_BROWSER_ONCLICK.add,
      label: t('settings.libraryBrowser.clickBehavior.add'),
    },
    {
      value: SETTINGS_BROWSER_ONCLICK.none,
      label: t('settings.libraryBrowser.clickBehavior.none'),
    },
  ]

  const albumSelectionOptions = [
    {
      value: SETTINGS_BROWSER_TRACKS_PANE_DISPLAY.albumInfo,
      label: t('settings.libraryBrowser.tracksPaneDisplay.displayAlbumInfo'),
    },
    {
      value: SETTINGS_BROWSER_TRACKS_PANE_DISPLAY.tracksOnly,
      label: t('settings.libraryBrowser.tracksPaneDisplay.displayTracksOnly'),
    },
  ]

  return (
    <Block data-testid="settings-theme">
      <FieldGroup>
        <SelectField
          label={t('settings.libraryBrowser.clickBehavior.label')}
          data-testid="settings-browser-click-select"
          options={doubleClickBehaviourOptions}
          value={getSelectedOption(
            doubleClickBehaviourOptions,
            config.onClickBehavior
          )}
          onChange={(selected) =>
            onChangeClickBehavior(selected?.value as SETTINGS_BROWSER_ONCLICK)
          }
        />
        <SelectField
          label={t('settings.libraryBrowser.tracksPaneDisplay.label')}
          data-testid="settings-browser-album-select-select"
          options={albumSelectionOptions}
          value={getSelectedOption(
            albumSelectionOptions,
            config.tracksPaneDisplay
          )}
          onChange={(selected) =>
            onChangeAlbumSelection(selected?.value as SETTINGS_BROWSER_TRACKS_PANE_DISPLAY)}
        />
      </FieldGroup>
    </Block>
  )
}

export default LibraryBrowserSettings

const Block = styled.div`
  margin-top: 30px;

  > p {
    margin-bottom: 10px;
  }
`
