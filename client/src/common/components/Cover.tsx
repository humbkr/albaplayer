import React from 'react'
import styled from 'styled-components'
import coverPlaceholder from '../assets/images/cover_placeholder.png'
import { constants as APIConstants } from '../../api'

const Cover: React.FC<{
  src?: string
}> = ({ src }) => (
  <div>
    <DefaultCover src={coverPlaceholder} data-testid="cover-default" />
    {src && (
      <RealCoverWrapper
        cover={APIConstants.BACKEND_BASE_URL + src}
        data-testid="cover-image"
      >
        <RealCover src={APIConstants.BACKEND_BASE_URL + src} />
      </RealCoverWrapper>
    )}
  </div>
)

export default Cover

const RealCoverWrapper = styled.div<{ cover: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &:before {
    width: 100%;
    height: 100%;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    background-image: url(${(props) => props.cover});
    background-size: cover;
    background-position: center;
    filter: blur(5px);
    transform: scale(1.1);
  }
`
const RealCover = styled.img`
  max-width: 100%;
  max-height: 100%;
  z-index: 5;
`
const DefaultCover = styled.img`
  display: block;
  max-width: 100%;
`
