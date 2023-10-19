import { useEffect } from 'react'
import styled from 'styled-components'
import { initSettings } from 'modules/settings/store'
import { useAppDispatch } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import { userHasRole } from 'modules/user/utils'
import { useTabs } from 'common/utils/useTabs'
import LibrarySettings from 'modules/library/components/LibrarySettings'
import UsersSettings from 'modules/user/scenes/UsersSettings'
import SettingsPageContainer from 'modules/settings/components/SettingsPageContainer'
import { useGetUserQuery } from 'modules/user/store/api'
import { useGetAppConfigQuery } from 'modules/settings/api'
import { USER_ROLE_ADMIN } from 'modules/user/constants'
import info from '../../../../package.json'

function Administration() {
  const { t } = useTranslation()

  const { data: appConfig } = useGetAppConfigQuery()
  const { data: user } = useGetUserQuery()

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initSettings())
  }, [dispatch])

  const { TabsComponent, currentTab } = useTabs(
    [
      { id: 'library', label: t('settings.library.title') },
      { id: 'users', label: t('user.usersManagement.title') },
      { id: 'about', label: t('settings.about.title') },
    ],
    'library',
    appConfig?.authEnabled === false ? ['users'] : []
  )

  if (!user || !userHasRole(user, USER_ROLE_ADMIN)) {
    return null
  }

  return (
    <SettingsPageContainer>
      <h1>{t('settings.administration.title')}</h1>
      <TabsComponent />
      {currentTab === 'library' && <LibrarySettings />}
      {currentTab === 'users' && <UsersSettings />}
      {currentTab === 'about' && (
        <VersionNumber data-testid="settings-version">
          {t('settings.about.version', { version: info.version })}
        </VersionNumber>
      )}
    </SettingsPageContainer>
  )
}

export default Administration

const VersionNumber = styled.div`
  color: ${(props) => props.theme.colors.textSecondary};
  font-style: italic;
  font-size: 0.8em;
  margin-top: 30px;
`
