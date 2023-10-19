import styled from 'styled-components'
import { themes } from 'themes'
import {
  setTheme,
} from 'modules/settings/store'
import SelectList from 'modules/settings/components/SelectList'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'

function AppearanceSettings() {
  const { t } = useTranslation()

  const theme = useAppSelector((state) => state.settings.theme)

  const dispatch = useAppDispatch()

  const themeOptions = Object.entries(themes).map((item) => ({
    value: item[0],
    label: item[1].name,
  }))

  return (
    <Block data-testid="settings-theme">
      <h2>{t('settings.appearance.theme')}</h2>
      <SelectList
        testId="settings-theme-select"
        options={themeOptions}
        value={theme}
        onChangeHandler={(event) =>
          dispatch(setTheme(event.currentTarget.value))
        }
      />
    </Block>
  )
}

export default AppearanceSettings

const Block = styled.div`
  margin-top: 30px;

  > h2 {
    margin-bottom: 15px;
  }

  > p {
    margin-bottom: 10px;
  }
`
