import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type UserStateType = {
  // Workaround because when clearing rtkQ state after logout, isFetching is true.
  loggedOut: boolean
}

export const initialState: UserStateType = {
  loggedOut: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoggedOut(state, action: PayloadAction<boolean>) {
      state.loggedOut = action.payload
    },
  },
})

export const { setLoggedOut } = userSlice.actions
export default userSlice.reducer
