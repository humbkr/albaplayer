import styled from 'styled-components'
import { eraseLibrary, updateLibrary } from 'modules/settings/store'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import ActionButton from 'common/components/buttons/ActionButton'
import LoaderPulse from 'common/components/LoaderPulse'
import Message, { MessageType } from 'common/components/Message'
import { useGetUserQuery } from 'modules/user/store/api'
import { userHasRole } from 'modules/user/utils'
import { USER_ROLE_OWNER } from 'modules/user/constants'

function LibrarySettings() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const { data: user } = useGetUserQuery()

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

  return (
    <Block data-testid="settings-library">
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
          {userHasRole(user, USER_ROLE_OWNER) && (
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
          )}
        </ActionButtons>
      )}
      {libraryIsUpdating && (
        <ActionWaiting data-testid="settings-library-updating">
          <LoaderPulse />
          <p>{t('settings.library.updateInProgress')}</p>
        </ActionWaiting>
      )}
      {libraryError && (
        <div>
          <Message type={MessageType.error}>{libraryError}</Message>
        </div>
      )}
    </Block>
  )
}

export default LibrarySettings

const Block = styled.div`
  margin-top: 30px;

  > p {
    margin-bottom: 10px;
  }
`
const ActionButtons = styled.div`
  display: flex;
`
const ActionWaiting = styled.div`
  color: ${(props) => props.theme.colors.textSecondary};
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 5px;
`
