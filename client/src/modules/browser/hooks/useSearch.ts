import { useHistory } from 'react-router'
import { useAppDispatch } from 'store/hooks'
import { search, setSearchFilter } from '../store'

function useSearch() {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const searchForArtist = (artist: string) => {
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
