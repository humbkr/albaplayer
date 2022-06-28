import { useNavigate } from 'react-router'
import { useAppDispatch } from 'store/hooks'
import { search, setSearchFilter } from '../store'

function useSearch() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const searchForArtist = (artist: string) => {
    dispatch(setSearchFilter('artist'))
    dispatch(search(artist))
    navigate('/library')
  }

  const searchForAlbum = (album: string) => {
    dispatch(setSearchFilter('album'))
    dispatch(search(album))
    navigate('/library')
  }

  return {
    searchForArtist,
    searchForAlbum,
  }
}

export default useSearch
