import styled from 'styled-components'

type Props = {
  size?: number
}

function AnimatedEQ({ size = 24 }: Props) {
  return (
    <Container>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <rect
          className="eq-bar eq-bar--1"
          x="4"
          y="4"
          width="3.7"
          height="8"
          rx="0.3"
        />
        <rect
          className="eq-bar eq-bar--2"
          x="10.2"
          y="4"
          width="3.7"
          height="16"
          rx="0.3"
        />
        <rect
          className="eq-bar eq-bar--3"
          x="16.3"
          y="4"
          width="3.7"
          height="11"
          rx="0.3"
        />
      </svg>
    </Container>
  )
}

export default AnimatedEQ

const Container = styled.div`
  > svg {
    .eq-bar {
      transform: scale(1, -1) translate(0, -24px);
    }

    .eq-bar--1 {
      animation-name: short-eq;
      animation-duration: 0.7s;
      animation-iteration-count: infinite;
      animation-delay: 0s;
    }

    .eq-bar--2 {
      animation-name: tall-eq;
      animation-duration: 0.6s;
      animation-iteration-count: infinite;
      animation-delay: 0.17s;
    }

    .eq-bar--3 {
      animation-name: medium-eq;
      animation-duration: 0.6s;
      animation-iteration-count: infinite;
      animation-delay: 0.44s;
    }
  }

  @keyframes short-eq {
    0% {
      height: 8px;
    }

    50% {
      height: 4px;
    }

    100% {
      height: 8px;
    }
  }

  @keyframes medium-eq {
    0% {
      height: 8px;
    }

    50% {
      height: 4px;
    }

    100% {
      height: 11px;
    }
  }

  @keyframes tall-eq {
    0% {
      height: 16px;
    }

    50% {
      height: 6px;
    }

    100% {
      height: 16px;
    }
  }
`
