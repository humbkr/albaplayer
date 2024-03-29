import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { immutableRemove } from 'common/utils/utils'

export type QueueStateType = {
  items: QueueItem[]
  current?: number
}

export const queueInitialState: QueueStateType = {
  items: [],
  current: undefined,
}

const queueSlice = createSlice({
  name: 'queue',
  initialState: queueInitialState,
  reducers: {
    queueAddTracks(state, action: PayloadAction<Track[]>) {
      const queueItems = action.payload.map((track) => ({ track }))
      state.items.push(...queueItems)
    },
    queueRemoveTrack(state, action: PayloadAction<number>) {
      const itemIndex = action.payload

      let nextCurrent = state.current
      // When removing a track before the current one playing or being the current
      // one playing, shift back the current track being played to match the new queue.
      if (nextCurrent && itemIndex <= nextCurrent) {
        nextCurrent -= 1
      }

      state.items = immutableRemove(state.items, itemIndex)
      state.current = nextCurrent
    },
    queueClear() {
      return queueInitialState
    },
    queueReplace(state, action: PayloadAction<QueueItem[]>) {
      state.items = action.payload
    },
    queueSetCurrent(state, action: PayloadAction<number>) {
      state.current = action.payload
    },
    queueAddTracksAfterCurrent(state, action: PayloadAction<Track[]>) {
      const queueItems = action.payload.map((track) => ({ track }))

      if (state.current !== undefined) {
        state.items.splice(state.current + 1, 0, ...queueItems)
      } else {
        // No item currently playing, add at the end of the queue.
        state.items.push(...queueItems)
      }
    },
  },
})

export default queueSlice
