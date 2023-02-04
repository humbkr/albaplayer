import { useEffect } from 'react'
import { initSettings } from 'modules/settings/store'
import { useAppDispatch } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import AppearanceSettings from 'modules/settings/components/AppearanceSettings'
import ProfileSettingsForm from 'modules/user/components/ProfileSettingsForm'
import { useTabs } from 'common/utils/useTabs'
import SettingsPageContainer from 'modules/settings/components/SettingsPage'

function Preferences() {
  const { t } = useTranslation()

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initSettings())
  }, [dispatch])

  const { TabsComponent, currentTab } = useTabs([
    { id: 'appearance', label: 'Appearance' },
    { id: 'profile', label: 'Profile' },
  ])

  return (
    <SettingsPageContainer>
      <h1>{t('settings.preferences.title')}</h1>
      <TabsComponent />
      {currentTab === 'appearance' && <AppearanceSettings />}
      {currentTab === 'profile' && <ProfileSettingsForm />}
    </SettingsPageContainer>
  )
}

export default Preferences
