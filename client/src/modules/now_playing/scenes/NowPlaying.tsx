import { useState } from 'react'
import styled from 'styled-components'
import NowPlayingQueue from 'modules/now_playing/components/NowPlayingQueue'
import NowPlayingHeader from 'modules/now_playing/components/NowPlayingHeader'
import Scroller from 'common/components/Scroller'
import { devices } from 'themes/breakpoints'

function NowPlaying() {
  const [headerIsPinned, setHeaderIsPinned] = useState(false)
  const [contentRef, setContentRef] = useState<HTMLDivElement>()

  const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (e.currentTarget.scrollTop > 210) {
      setHeaderIsPinned(true)
    } else if (e.currentTarget.scrollTop <= 210) {
      setHeaderIsPinned(false)
    }
  }

  return (
    <Scroller onScroll={onScroll}>
      <Container
        // @ts-ignore
        ref={setContentRef}
      >
        <NowPlayingHeader pinned={headerIsPinned} />
        <NowPlayingQueueWrapper headerIsPinned={headerIsPinned}>
          <NowPlayingQueue contentElement={contentRef} />
        </NowPlayingQueueWrapper>
      </Container>
    </Scroller>
  )
}

export default NowPlaying

const Container = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: ${(props) => props.theme.layout.contentMaxWidth};
  position: relative;
  margin: 0 auto;

  @media only screen and ${devices.md} {
    padding: 30px 0;
  }
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

  @media only screen and ${devices.md} {
    padding: 30px 50px;
  }
`
