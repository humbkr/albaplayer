import { useEffect } from 'react'
import styled from 'styled-components'
import ActionButton from 'common/components/ActionButton'
import Loading from 'common/components/Loading'
import Message, { MessageType } from 'common/components/Message'
import { themes } from 'themes'
import {
  initSettings,
  updateLibrary,
  eraseLibrary,
  setTheme,
} from 'modules/settings/store'
import SelectList from 'modules/settings/components/SelectList'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import info from '../../../../package.json'

function Settings() {
  const { t } = useTranslation()

  const artistsNumber = useAppSelector(
    (state) => Object.keys(state.library.artists).length
  )
  const albumsNumber = useAppSelector(
    (state) => Object.keys(state.library.albums).length
  )
  const tracksNumber = useAppSelector(
    (state) => Object.keys(state.library.tracks).length
  )
  const libraryIsUpdating = useAppSelector(
    (state) => state.settings.library.isUpdating
  )
  const libraryError = useAppSelector((state) => state.settings.library.error)
  const librarySettings = useAppSelector(
    (state) => state.settings.library.config
  )
  const theme = useAppSelector((state) => state.settings.theme)

  const dispatch = useAppDispatch()

  const themeOptions = Object.entries(themes).map((item) => ({
    value: item[0],
    label: item[1].name,
  }))

  useEffect(() => {
    dispatch(initSettings())
  }, [dispatch])

  return (
    <SettingsScreenWrapper>
      <h1>{t('settings.title')}</h1>
      <Paragraph data-testid="settings-library">
        <h2>{t('settings.library.title')}</h2>
        <p>
          {t('settings.library.stats', {
            nbArtists: artistsNumber,
            nbAlbums: albumsNumber,
            nbTracks: tracksNumber,
          })}
        </p>
        {!libraryIsUpdating && (
          <ActionButtons>
            <ActionButton
              testId="settings-library-update"
              raised
              disabled={librarySettings.disableLibrarySettings}
              onClick={() => dispatch(updateLibrary())}
            >
              {t('settings.library.updateButton')}
            </ActionButton>
            <ActionButton
              testId="settings-library-erase"
              disabled={librarySettings.disableLibrarySettings}
              onClick={() => {
                if (window.confirm(t('settings.library.clearButton'))) {
                  dispatch(eraseLibrary())
                }
              }}
            >
              {t('settings.library.clearButton')}
            </ActionButton>
          </ActionButtons>
        )}
        {libraryIsUpdating && (
          <ActionWaiting data-testid="settings-library-updating">
            <Loading />
            <p>{t('settings.library.updateInProgress')}</p>
          </ActionWaiting>
        )}
        {libraryError && (
          <div>
            <Message type={MessageType.error}>{libraryError}</Message>
          </div>
        )}
      </Paragraph>
      <Paragraph data-testid="settings-theme">
        <h2>{t('settings.appearance.theme')}</h2>
        <SelectList
          testId="settings-theme-select"
          options={themeOptions}
          value={theme}
          onChangeHandler={(event) =>
            dispatch(setTheme(event.currentTarget.value))
          }
        />
      </Paragraph>
      <VersionNumber data-testid="settings-version">
        {t('settings.version', { version: info.version })}
      </VersionNumber>
    </SettingsScreenWrapper>
  )
}

export default Settings

const SettingsScreenWrapper = styled.div`
  padding: 40px 30px;

  > h1 {
    margin-bottom: 30px;
  }
`
const Paragraph = styled.div`
  margin-top: 30px;

  > h2 {
    margin-bottom: 15px;
  }

  > p {
    margin-bottom: 10px;
  }
`
const ActionButtons = styled.div`
  > * {
    margin: 3px 3px 3px 0;
  }
`
const ActionWaiting = styled.div`
  color: ${(props) => props.theme.textSecondaryColor};
  font-style: italic;

  > * {
    display: inline-block;
    vertical-align: top;
    height: 30px;
    line-height: 30px;
    margin-right: 5px;
  }
`
const VersionNumber = styled.div`
  color: ${(props) => props.theme.textSecondaryColor};
  font-style: italic;
  font-size: 0.8em;
  margin-top: 30px;
`
