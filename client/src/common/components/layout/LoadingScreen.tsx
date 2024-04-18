import styled from 'styled-components'
import { useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import LoaderPulseLogo from 'common/components/LoaderPulseLogo'

function LoadingScreen() {
  const { t } = useTranslation()

  const isFetching = useAppSelector((state) => state.library.isFetching)
  const initHasFailed = useAppSelector((state) => state.library.initHasFailed)

  return (
    <LoadingScreenWrapper data-testid="main-loading-screen">
      {isFetching && (
        <LoadingScreenInitProgress>
          <LoaderPulseLogo />
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`
const LoadingScreenInitProgress = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > h2 {
    // So the text appears vertically centered.
    margin: 20px 0 75px;
  }
`
const LoadingScreenInitFailed = styled.div`
  display: table-cell;
  padding: 20px;
`
