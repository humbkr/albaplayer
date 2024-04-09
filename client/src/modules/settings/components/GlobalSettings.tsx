import styled from 'styled-components'
import { themes } from 'themes'
import { setTheme } from 'modules/settings/store'
import SelectList from 'modules/settings/components/SelectList'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'

function GlobalSettings() {
  const { t } = useTranslation()

  const theme = useAppSelector((state) => state.settings.theme)

  const dispatch = useAppDispatch()

  const themeOptions = Object.entries(themes).map((item) => ({
    value: item[0],
    label: item[1].name,
  }))

  return (
    <Block data-testid="settings-theme">
      <h2>{t('settings.global.theme')}</h2>
      <Field>
        <SelectList
          testId="settings-theme-select"
          options={themeOptions}
          value={theme}
          onChangeHandler={(event) =>
            dispatch(setTheme(event.currentTarget.value))
          }
        />
      </Field>
    </Block>
  )
}

export default GlobalSettings

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
  max-width: 300px;
`
