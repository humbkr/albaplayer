import type React from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import NowPlayingQueue from 'modules/now_playing/components/NowPlayingQueue'
import NowPlayingHeader from 'modules/now_playing/components/NowPlayingHeader'
import Scroller from 'common/components/Scroller'
import { devices } from 'themes/breakpoints'
import useBreakpoints from 'common/utils/useLayoutBreakpoints'

function NowPlaying() {
  const [headerIsPinned, setHeaderIsPinned] = useState(false)
  const [contentRef, setContentRef] = useState<HTMLDivElement>()
  const { isMD } = useBreakpoints()

  const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (e.currentTarget.scrollTop > 210) {
      setHeaderIsPinned(true)
    } else if (e.currentTarget.scrollTop <= 210) {
      setHeaderIsPinned(false)
    }
  }

  const pinHeader = isMD && headerIsPinned

  return (
    <Scroller onScroll={onScroll}>
      <Container
        // @ts-ignore
        ref={setContentRef}
        headerIsPinned={pinHeader}
      >
        <NowPlayingHeader pinned={pinHeader} />
        <NowPlayingQueueWrapper headerIsPinned={pinHeader}>
          <NowPlayingQueue contentElement={contentRef} />
        </NowPlayingQueueWrapper>
      </Container>
    </Scroller>
  )
}

export default NowPlaying

const Container = styled.div<{ headerIsPinned: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 10px;
  max-width: ${(props) => props.theme.layout.contentMaxWidth};
  position: relative;
  margin: 0 auto;

  @media only screen and ${devices.sm} {
    padding: 20px 20px;
  }

  @media only screen and ${devices.lg} {
    padding: 30px 50px;
  }

  ${({ headerIsPinned }) =>
    headerIsPinned &&
    `
    padding: 210px 10px 20px;
    
    @media only screen and ${devices.lg} {
      padding: 210px 10px 20px;
    }
  `}
`
const NowPlayingQueueWrapper = styled.div<{ headerIsPinned: boolean }>`
  width: 100%;
  padding: 30px 0;

  ${({ headerIsPinned }) =>
    headerIsPinned &&
    `
    padding: 210px 50px 30px;
  `}

  > h2 {
    margin-bottom: 20px;
  }
`
