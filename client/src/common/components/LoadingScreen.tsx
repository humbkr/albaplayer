import React from 'react'
import styled from 'styled-components'
import Loading from 'common/components/Loading'
import { useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'

const LoadingScreen = () => {
  const { t } = useTranslation()

  const isFetching = useAppSelector((state) => state.library.isFetching)
  const initHasFailed = useAppSelector((state) => state.library.initHasFailed)

  return (
    <LoadingScreenWrapper>
      {isFetching && (
        <LoadingScreenInitProgress>
          <Loading size="60px" />
          <h2>{t('library.initializing')}</h2>
        </LoadingScreenInitProgress>
      )}
      {initHasFailed && (
        <LoadingScreenInitFailed>
          <h2>{t('library.initialisationFailed')}</h2>
        </LoadingScreenInitFailed>
      )}
    </LoadingScreenWrapper>
  )
}

export default LoadingScreen

const LoadingScreenWrapper = styled.div`
  display: table;
  width: 100%;
  height: 100vh;
`
const LoadingScreenInitProgress = styled.div`
  display: table-cell;
  text-align: center;
  vertical-align: middle;

  > h2 {
    // So the text appears vertically centered.
    margin-bottom: 75px;
  }
`
const LoadingScreenInitFailed = styled.div`
  display: table-cell;
  padding: 20px;
`
