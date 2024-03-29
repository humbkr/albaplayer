import styled, { css, keyframes } from 'styled-components'
import Icon from 'common/components/Icon'

type Props = {
  size?: string
}

function Loading({ size = '1.8em' }: Props) {
  return <LoadingStyled fontSize={size}>camera</LoadingStyled>
}

export default Loading

const rotate360CounterClockwise = keyframes`
  from {
    transform: rotate(360deg);
  }
  
  to {
    transform: rotate(0deg);
  }
`
const rotate360CounterClockwiseRule = css`
  ${rotate360CounterClockwise} 2s linear infinite;
`
const LoadingStyled = styled(Icon)<{ fontSize: string }>`
  color: ${(props) => props.theme.highlight};
  font-size: ${(props) => props.fontSize};
  animation: ${rotate360CounterClockwiseRule};
`
