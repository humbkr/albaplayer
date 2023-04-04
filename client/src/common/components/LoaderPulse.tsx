import styled from 'styled-components'

const LoaderPulse = styled.div<{ size?: number }>`
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.buttonText};
  animation: customPulse 1s infinite ease-out;

  @keyframes customPulse {
    0% {
      transform: scale(0.15);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }

    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
`
LoaderPulse.defaultProps = {
  size: 24,
}

export default LoaderPulse
