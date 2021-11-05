import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { search, setSearchFilter } from '../redux'

function useSearch() {
  const dispatch = useDispatch()
  const history = useHistory()

  const searchForArtist = (artist: string) => {
    console.log('searchForArtist:', artist)
    dispatch(setSearchFilter('artist'))
    dispatch(search(artist))
    history.push('/library')
  }

  const searchForAlbum = (album: string) => {
    dispatch(setSearchFilter('album'))
    dispatch(search(album))
    history.push('/library')
  }

  return {
    searchForArtist,
    searchForAlbum,
  }
}

export default useSearch
