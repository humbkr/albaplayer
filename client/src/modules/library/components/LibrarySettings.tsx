import { useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import {
  eraseLibrary,
  setScanProgress,
  setLibraryNotUpdating,
  updateLibrary,
} from 'modules/settings/store'
import { initLibrary } from 'modules/library/store'
import libraryAPI from 'modules/library/api'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import ActionButton from 'common/components/buttons/ActionButton'
import ProgressBar from 'common/components/ProgressBar'
import Message, { MessageType } from 'common/components/Message'
import { useGetUserQuery } from 'modules/user/api'
import { userHasRole } from 'modules/user/utils'
import { USER_ROLE_OWNER } from 'modules/user/constants'

const POLL_INTERVAL_MS = 1500

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
  const scanProgress = useAppSelector(
    (state) => state.settings.library.scanProgress
  )
  const libraryError = useAppSelector((state) => state.settings.library.error)
  const librarySettings = useAppSelector(
    (state) => state.settings.library.config
  )

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const pollProgress = useCallback(async () => {
    try {
      const res = await libraryAPI.getScanProgress()
      const progress = res.data?.scanProgress
      if (!progress) {
        return
      }

      dispatch(
        setScanProgress({
          filesProcessed: progress.filesProcessed,
          filesTotal: progress.filesTotal,
        })
      )

      if (!progress.isUpdating) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        // Let the final progress state render before clearing, so the
        // user sees the completed bar even for fast scans.
        setTimeout(() => {
          dispatch(setLibraryNotUpdating())
          dispatch(initLibrary(true))
        }, 1500)
      }
    } catch {
      // Ignore transient fetch errors during polling.
    }
  }, [dispatch])

  useEffect(() => {
    // Check scan status on mount (handles page reload during a scan).
    libraryAPI.getScanProgress().then((res) => {
      const progress = res.data?.scanProgress
      if (progress?.isUpdating) {
        dispatch(
          setScanProgress({
            filesProcessed: progress.filesProcessed,
            filesTotal: progress.filesTotal,
          })
        )
      }
    })
  }, [dispatch])

  useEffect(() => {
    if (!libraryIsUpdating) {
      return
    }

    // Fire the first poll immediately so we don't wait 1.5s for the initial
    // progress data (especially the file count total).
    pollProgress()

    intervalRef.current = setInterval(pollProgress, POLL_INTERVAL_MS)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [libraryIsUpdating, pollProgress])

  const progressLabel =
    scanProgress.filesTotal > 0
      ? t('settings.library.scanProgress', {
          processed: scanProgress.filesProcessed,
          total: scanProgress.filesTotal,
        })
      : t('settings.library.scanProgressComputing', {
          processed: scanProgress.filesProcessed,
        })

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
          <ProgressBar
            value={scanProgress.filesProcessed}
            max={scanProgress.filesTotal || 1}
            label={progressLabel}
          />
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
