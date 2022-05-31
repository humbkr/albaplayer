import React from 'react'
import styled from 'styled-components'
import Loading from 'common/components/Loading'
import { useAppSelector } from 'store/hooks'

const LoadingScreen = () => {
  const isFetching = useAppSelector((state) => state.library.isFetching)
  const initHasFailed = useAppSelector((state) => state.library.initHasFailed)

  return (
    <LoadingScreenWrapper>
      {isFetching && (
        <LoadingScreenInitProgress>
          <Loading size="60px" />
          <h2>Initializing library...</h2>
        </LoadingScreenInitProgress>
      )}
      {initHasFailed && (
        <LoadingScreenInitFailed>
          <h2>Initialization has failed, check your server is accessible.</h2>
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
