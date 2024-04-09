import styled from 'styled-components'
import { setBrowserSettings, SettingsStateType } from 'modules/settings/store'
import SelectList from 'modules/settings/components/SelectList'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import { SETTINGS_BROWSER_ONCLICK } from 'modules/settings/constants'

function LibraryBrowserSettings() {
  const { t } = useTranslation()

  const config = useAppSelector((state) => state.settings.browser)
  const dispatch = useAppDispatch()

  const onChangeConfig = (newConfig: Partial<SettingsStateType['browser']>) => {
    dispatch(setBrowserSettings(newConfig))
  }

  const onChangeClickBehavior = (newValue: string) => {
    onChangeConfig({ onClickBehavior: newValue as SETTINGS_BROWSER_ONCLICK })
  }

  const clickOptions = [
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

  return (
    <Block data-testid="settings-theme">
      <h2>{t('settings.libraryBrowser.clickBehavior.label')}</h2>
      <Field>
        <SelectList
          testId="settings-browser-click-select"
          options={clickOptions}
          value={config.onClickBehavior}
          onChangeHandler={(event) =>
            onChangeClickBehavior(event.currentTarget.value)
          }
        />
      </Field>
    </Block>
  )
}

export default LibraryBrowserSettings

const Block = styled.div`
  margin-top: 30px;

  > h2 {
    margin-bottom: 15px;
  }

  > p {
    margin-bottom: 10px;
  }
`
const Field = styled.div`
  max-width: 350px;
`
