import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '../../store/types'

export interface DashboardStateType {
  randomAlbumsNumber: number
  randomAlbums: Album[]
}

export const dashboardInitialState: DashboardStateType = {
  randomAlbumsNumber: 8,
  randomAlbums: [],
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: dashboardInitialState,
  reducers: {
    setRandomAlbums(state, action: PayloadAction<Album[]>) {
      state.randomAlbums = action.payload
    },
  },
})

export const { setRandomAlbums } = dashboardSlice.actions
export default dashboardSlice.reducer

export const getRandomAlbums = (): AppThunk => (dispatch, getState) => {
  const { library } = getState()
  const number = getState().dashboard.randomAlbumsNumber

  const albums: Album[] = Object.values(library.albums)
  const randomAlbums: Album[] = []
  const numberOfAlbumsToGet = albums.length < number ? albums.length : number

  const alreadyPicked: number[] = []
  while (
    alreadyPicked.length < numberOfAlbumsToGet
    && alreadyPicked.length < albums.length
  ) {
    const randomIndex = getRandomInt(0, albums.length)
    if (!alreadyPicked.includes(randomIndex)) {
      const album = { ...albums[randomIndex] }
      album.artist = library.artists[album.artistId]

      randomAlbums.push(album)
      alreadyPicked.push(randomIndex)
    }
  }

  dispatch(setRandomAlbums(randomAlbums))
}

/* istanbul ignore next */
const getRandomInt = (min: number, max: number): number => {
  // The maximum is exclusive and the minimum is inclusive.
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min) + min)
}
