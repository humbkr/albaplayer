import { useTranslation } from 'react-i18next'
import AppearanceSettings from 'modules/settings/components/AppearanceSettings'
import ProfileSettingsForm from 'modules/user/components/ProfileSettingsForm'
import { useTabs } from 'common/utils/useTabs'
import SettingsPageContainer from 'modules/settings/components/SettingsPageContainer'
import { useGetAppConfigQuery } from 'modules/settings/api'

function Preferences() {
  const { t } = useTranslation()

  const { data: appConfig } = useGetAppConfigQuery()

  const { TabsComponent, currentTab } = useTabs(
    [
      { id: 'appearance', label: t('settings.appearance.title') },
      { id: 'profile', label: t('user.profile.title') },
    ],
    'appearance',
    appConfig?.authEnabled === false ? ['profile'] : []
  )

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
