import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import ActionButton from 'common/components/ActionButton'
import Loading from 'common/components/Loading'
import Message, { MessageType } from 'common/components/Message'
import { themes } from 'themes'
import {
  initSettings,
  updateLibrary,
  eraseLibrary,
  setTheme,
} from 'modules/settings/redux'
import { RootState } from 'store/types'
import SelectList from 'modules/settings/components/SelectList'
import info from '../../../../package.json'

function Settings() {
  const artistsNumber = useSelector(
    (state: RootState) => Object.keys(state.library.artists).length
  )
  const albumsNumber = useSelector(
    (state: RootState) => Object.keys(state.library.albums).length
  )
  const tracksNumber = useSelector(
    (state: RootState) => Object.keys(state.library.tracks).length
  )
  const libraryIsUpdating = useSelector(
    (state: RootState) => state.settings.library.isUpdating
  )
  const libraryError = useSelector(
    (state: RootState) => state.settings.library.error
  )
  const librarySettings = useSelector(
    (state: RootState) => state.settings.library.config
  )
  const theme = useSelector((state: RootState) => state.settings.theme)

  const dispatch = useDispatch()

  const themeOptions = Object.entries(themes).map((item) => ({
    value: item[0],
    label: item[1].name,
  }))

  useEffect(() => {
    dispatch(initSettings())
  }, [dispatch])

  // @ts-ignore
  return (
    <SettingsScreenWrapper>
      <h1>Settings</h1>
      <Paragraph data-testid="settings-library">
        <h2>Library</h2>
        <p>
          There are currently {artistsNumber} artists, {albumsNumber} albums and{' '}
          {tracksNumber} tracks in the library.
        </p>
        {!libraryIsUpdating && (
          <ActionButtons>
            <ActionButton
              testId="settings-library-update"
              raised
              disabled={librarySettings.disableLibrarySettings}
              onClick={() => dispatch(updateLibrary())}
            >
              Update library
            </ActionButton>
            <ActionButton
              testId="settings-library-erase"
              disabled={librarySettings.disableLibrarySettings}
              onClick={() => {
                if (
                  window.confirm('Are you sure you wish to empty the library?')
                ) {
                  dispatch(eraseLibrary())
                }
              }}
            >
              Empty library
            </ActionButton>
          </ActionButtons>
        )}
        {libraryIsUpdating && (
          <ActionWaiting data-testid="settings-library-updating">
            <Loading />
            <p>Library is updating. This could take several minutes.</p>
          </ActionWaiting>
        )}
        {libraryError && (
          <div>
            <Message type={MessageType.error}>{libraryError}</Message>
          </div>
        )}
      </Paragraph>
      <Paragraph data-testid="settings-theme">
        <h2>Theme</h2>
        <SelectList
          testId="settings-theme-select"
          options={themeOptions}
          value={theme}
          onChangeHandler={(event) => dispatch(setTheme(event.currentTarget.value))}
        />
      </Paragraph>
      <VersionNumber data-testid="settings-version">
        {`Version: ${librarySettings.version} (UI version: ${info.version})`}
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
