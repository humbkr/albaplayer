import React from 'react'
import styled from 'styled-components'
import RandomAlbums from '../components/RandomAlbums'
import RecentlyAddedAlbums from '../components/RecentlyAddedAlbums'

const Dashboard = () => (
  <Wrapper>
    <RandomAlbums />
    <RecentlyAddedAlbums />
  </Wrapper>
)

export default Dashboard

const Wrapper = styled.div`
  padding: 20px 0 80px;
`
