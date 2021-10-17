import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import NowPlayingQueue from 'modules/now_playing/components/NowPlayingQueue'
import NowPlayingHeader from 'modules/now_playing/components/NowPlayingHeader'

const NowPlaying = () => {
  const [headerIsPinned, setHeaderIsPinned] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setHeaderIsPinned(window.pageYOffset > 210)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })

  return (
    <NowPlayingWrapper>
      <NowPlayingHeader pinned={headerIsPinned} />
      <NowPlayingQueueWrapper headerIsPinned={headerIsPinned}>
        <NowPlayingQueue />
      </NowPlayingQueueWrapper>
    </NowPlayingWrapper>
  )
}

export default NowPlaying

const NowPlayingWrapper = styled.div`
  padding: 30px 0;
  max-width: 1160px;
  min-width: 800px;
  margin: 0 auto;
  position: relative;
`
const NowPlayingQueueWrapper = styled.div<{ headerIsPinned: boolean }>`
  width: 100%;
  padding: 30px 50px;

  ${({ headerIsPinned }) => headerIsPinned
    && `
    padding: 320px 50px 30px;
  `}

  > h2 {
    margin-bottom: 20px;
  }
`
