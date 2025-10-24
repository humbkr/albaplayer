import LoaderPulseLogo from 'common/components/LoaderPulseLogo'
import type React from 'react'
import styled from 'styled-components'

type Props = {
  isLoading: boolean
  isServerReachable: boolean
  children: React.ReactNode
}

export default function AppLoader({
  isLoading,
  isServerReachable,
  children,
}: Props) {
  if (isLoading) {
    return (
      <LoadingContainer>
        <LoaderPulseLogo />
      </LoadingContainer>
    )
  } else if (!isServerReachable) {
    return (
      <GlobalError>
        <h2>
          Error: Unable to connect to server, please check your configuration
        </h2>
      </GlobalError>
    )
  }

  return children
}

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`
const GlobalError = styled.div`
  padding: 20px;
  color: ${(props) => props.theme.colors.textPrimary};
`
