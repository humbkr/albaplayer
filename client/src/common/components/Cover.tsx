import styled from 'styled-components'
import { getAuthAssetURL } from 'api/helpers'
import type { HTMLAttributes } from 'react'
import { useEffect, useState } from 'react'
import coverPlaceholder from '../assets/images/cover_placeholder.png'

type Props = HTMLAttributes<HTMLDivElement> & {
  src?: string
}

function Cover({ src, ...props }: Props) {
  const [coverURL, setCoverUrl] = useState('')

  useEffect(() => {
    if (src) {
      getAuthAssetURL(src).then((url) => setCoverUrl(url))
    }
  }, [src])

  return (
    <div {...props}>
      <DefaultCover src={coverPlaceholder} data-testid="cover-default" />
      {coverURL && (
        <RealCoverWrapper cover={coverURL}>
          <RealCover src={coverURL} data-testid="cover-image" />
        </RealCoverWrapper>
      )}
    </div>
  )
}

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
