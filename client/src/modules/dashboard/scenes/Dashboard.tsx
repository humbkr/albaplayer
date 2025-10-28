import styled from 'styled-components'
import Scroller from 'common/components/Scroller'
import { devices } from 'themes/breakpoints'
import RandomAlbums from '../components/RandomAlbums'
import RecentlyAddedAlbums from '../components/RecentlyAddedAlbums'

function Dashboard() {
  return (
    <Scroller>
      <Container>
        <RandomAlbums />
        <RecentlyAddedAlbums />
      </Container>
    </Scroller>
  )
}

export default Dashboard

const Container = styled.div`
  width: 100%;

  @media only screen and ${devices.md} {
    padding: 20px 0 80px;
  }
`
