import styled from 'styled-components'
import { themes } from 'themes'
import { setTheme } from 'modules/settings/store'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import SelectField, {
  getSelectedOption,
} from 'common/components/forms/SelectField'

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
        <SelectField
          data-testid="settings-theme-select"
          options={themeOptions}
          value={getSelectedOption(themeOptions, theme)}
          onChange={(selected) => dispatch(setTheme(selected?.value as string))}
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
