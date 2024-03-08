import { useState } from 'react'
import styled from 'styled-components'
import NowPlayingQueue from 'modules/now_playing/components/NowPlayingQueue'
import NowPlayingHeader from 'modules/now_playing/components/NowPlayingHeader'
import Scroller from 'common/components/Scroller'

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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
  max-width: ${(props) => props.theme.layout.contentMaxWidth};
  position: relative;
  margin: 0 auto;
`
const NowPlayingQueueWrapper = styled.div<{ headerIsPinned: boolean }>`
  width: 100%;
  padding: 30px 50px;

  ${({ headerIsPinned }) =>
    headerIsPinned &&
    `
    padding: 210px 50px 30px;
  `}

  > h2 {
    margin-bottom: 20px;
  }
`
