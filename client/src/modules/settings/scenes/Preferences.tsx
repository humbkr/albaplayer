import { useTranslation } from 'react-i18next'
import GlobalSettings from 'modules/settings/components/GlobalSettings'
import ProfileSettingsForm from 'modules/user/components/ProfileSettingsForm'
import { useTabs } from 'common/utils/useTabs'
import SettingsPageContainer from 'modules/settings/components/SettingsPageContainer'
import { useGetAppConfigQuery } from 'modules/settings/api'

function Preferences() {
  const { t } = useTranslation()

  const { data: appConfig } = useGetAppConfigQuery()

  const { TabsComponent, currentTab } = useTabs(
    [
      { id: 'global', label: t('settings.global.title') },
      { id: 'profile', label: t('user.profile.title') },
    ],
    'global',
    appConfig?.authEnabled === false ? ['profile'] : []
  )

  return (
    <SettingsPageContainer>
      <h1>{t('settings.preferences.title')}</h1>
      <TabsComponent />
      {currentTab === 'global' && <GlobalSettings />}
      {currentTab === 'profile' && <ProfileSettingsForm />}
    </SettingsPageContainer>
  )
}

export default Preferences
