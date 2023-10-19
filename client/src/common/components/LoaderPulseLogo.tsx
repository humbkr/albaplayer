import styled from 'styled-components'
import logoIcon from 'common/assets/images/logo.png'

type Props = {
  size?: string
}

function LoaderPulseLogo({ size = '100px' }: Props = {}) {
  return (
    <Pulse size={size} data-testid="app-loader">
      <Logo src={logoIcon} alt="Logo" size={size} />
    </Pulse>
  )
}

export default LoaderPulseLogo

const Pulse = styled.div<{ size: string }>`
  height: ${(props) => props.size};
  width: ${(props) => props.size};
  display: block;
  border-radius: 50%;
  animation: pulse 1500ms infinite;

  @keyframes pulse {
    0% {
      box-shadow: ${(props) => props.theme.colors.elementHighlightFocus} 0 0 0 0;
    }
    75% {
      box-shadow: ${(props) => props.theme.colors.elementHighlightFocus}00 0 0 0
        16px;
    }
  }
`
const Logo = styled.img<{ size: string }>`
  width: ${(props) => props.size};
`
