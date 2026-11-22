import { useAppDispatch, useAppSelector } from 'store/hooks'
import { getArtistsList, selectArtist } from 'modules/browser/store'
import { addArtist, playArtist } from 'modules/player/store/store'
import { selectUserConfig } from 'modules/settings/userConfig'

export function useArtistsPanel() {
  const orderBy = useAppSelector(
    (state) => selectUserConfig(state).browser.sortArtists
  )
  const artists = useAppSelector((state) => getArtistsList(state, orderBy))
  const currentArtist = useAppSelector(
    (state) => state.libraryBrowser.selectedArtists
  )
  const dispatch = useAppDispatch()

  const onItemClick = (itemId: string) => {
    dispatch(selectArtist({ artistId: itemId }))
  }

  const handlePlayNow = (artistId: string) => {
    dispatch(playArtist(artistId))
  }

  const handleAddToQueue = (artistId: string) => {
    dispatch(addArtist(artistId))
  }

  return {
    artists,
    currentArtist,
    onItemClick,
    handlePlayNow,
    handleAddToQueue,
  }
}
