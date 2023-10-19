import styled from 'styled-components'
import Scroller from 'common/components/Scroller'
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
  padding: 20px 0 80px;
`
