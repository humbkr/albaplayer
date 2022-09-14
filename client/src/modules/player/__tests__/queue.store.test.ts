import queueSlice, {
  queueInitialState,
  QueueStateType,
} from 'modules/player/store/queue.store'

const {
  queueSetCurrent,
  queueRemoveTrack,
  queueClear,
  queueReplace,
  queueAddTracks,
  queueAddTracksAfterCurrent,
} = queueSlice.actions

describe('queue reducer', () => {
  it('should handle queue initial state', () => {
    // @ts-ignore
    expect(queueSlice.reducer(undefined, {})).toEqual(queueInitialState)
  })

  it('should handle queueAddTracks action', () => {
    const tracksToAdd: Track[] = [
      {
        id: '1',
        title: 'Track 1',
        src: '/stream/1',
        number: 1,
        disc: '',
        duration: 123,
        cover: '',
      },
      {
        id: '2',
        title: 'Track 2',
        src: '/stream/2',
        number: 2,
        disc: '',
        duration: 124,
        cover: '',
      },
    ]

    expect(
      queueSlice.reducer(queueInitialState, {
        type: queueAddTracks.type,
        payload: tracksToAdd,
      })
    ).toEqual({
      ...queueInitialState,
      items: tracksToAdd.map((item) => ({ track: item })),
    })
  })

  it('should handle queueRemoveTrack action', () => {
    // Remove track before or equal to the current one being played.
    const testState: QueueStateType = {
      ...queueInitialState,
      current: 1,
      items: [
        {
          track: {
            id: '1',
            title: 'Track 1',
            src: '/stream/1',
            number: 1,
            disc: '',
            duration: 123,
            cover: '',
          },
        },
        {
          track: {
            id: '2',
            title: 'Track 2',
            src: '/stream/2',
            number: 2,
            disc: '',
            duration: 124,
            cover: '',
          },
        },
      ],
    }

    expect(
      queueSlice.reducer(testState, {
        type: queueRemoveTrack.type,
        payload: 0,
      })
    ).toEqual({
      ...queueInitialState,
      current: 0,
      items: [
        {
          track: {
            id: '2',
            title: 'Track 2',
            src: '/stream/2',
            number: 2,
            disc: '',
            duration: 124,
            cover: '',
          },
        },
      ],
    })

    // Remove track after the current one being played.
    const testStateAfter: QueueStateType = {
      ...queueInitialState,
      current: 0,
      items: [
        {
          track: {
            id: '1',
            title: 'Track 1',
            src: '/stream/1',
            number: 1,
            disc: '',
            duration: 123,
            cover: '',
          },
        },
        {
          track: {
            id: '2',
            title: 'Track 2',
            src: '/stream/2',
            number: 2,
            disc: '',
            duration: 124,
            cover: '',
          },
        },
      ],
    }

    expect(
      queueSlice.reducer(testStateAfter, {
        type: queueRemoveTrack.type,
        payload: 1,
      })
    ).toEqual({
      ...queueInitialState,
      current: 0,
      items: [
        {
          track: {
            id: '1',
            title: 'Track 1',
            src: '/stream/1',
            number: 1,
            disc: '',
            duration: 123,
            cover: '',
          },
        },
      ],
    })
  })

  it('should handle queueClear action', () => {
    const testState: QueueStateType = {
      ...queueInitialState,
      current: 1,
      items: [
        {
          track: {
            id: '1',
            title: 'Track 1',
            src: '/stream/1',
            number: 1,
            disc: '',
            duration: 123,
            cover: '',
          },
        },
      ],
    }

    expect(
      queueSlice.reducer(testState, {
        type: queueClear.type,
      })
    ).toEqual(queueInitialState)
  })

  it('should handle queueReplace action', () => {
    const testState: QueueStateType = {
      ...queueInitialState,
      current: 1,
      items: [
        {
          track: {
            id: '1',
            title: 'Track 1',
            src: '/stream/1',
            number: 1,
            disc: '',
            duration: 123,
            cover: '',
          },
        },
      ],
    }

    const replacementItems = [
      {
        track: {
          id: '2',
          title: 'Track 2',
          number: 2,
          disc: '',
          duration: 124,
          cover: '',
        },
      },
    ]

    expect(
      queueSlice.reducer(testState, {
        type: queueReplace.type,
        payload: replacementItems,
      })
    ).toEqual({
      ...queueInitialState,
      current: 1,
      items: replacementItems,
    })
  })

  it('should handle queueSetCurrent action', () => {
    expect(
      queueSlice.reducer(queueInitialState, {
        type: queueSetCurrent.type,
        payload: 2,
      })
    ).toEqual({
      ...queueInitialState,
      current: 2,
    })
  })

  it('should handle queueAddTracksAfterCurrent action', () => {
    // Current track is defined.
    const testState: QueueStateType = {
      ...queueInitialState,
      current: 0,
      items: [
        {
          track: {
            id: '1',
            title: 'Track 1',
            src: '/stream/1',
            number: 1,
            disc: '',
            duration: 123,
            cover: '',
          },
        },
        {
          track: {
            id: '2',
            title: 'Track 2',
            src: '/stream/2',
            number: 2,
            disc: '',
            duration: 124,
            cover: '',
          },
        },
      ],
    }

    const tracksToAdd: Track[] = [
      {
        id: '3',
        title: 'Track 3',
        src: '/stream/3',
        number: 3,
        disc: '',
        duration: 123,
        cover: '',
      },
      {
        id: '4',
        title: 'Track 4',
        src: '/stream/4',
        number: 4,
        disc: '',
        duration: 124,
        cover: '',
      },
    ]

    expect(
      queueSlice.reducer(testState, {
        type: queueAddTracksAfterCurrent.type,
        payload: tracksToAdd,
      })
    ).toEqual({
      ...testState,
      items: [
        testState.items[0],
        ...tracksToAdd.map((item) => ({ track: item })),
        testState.items[1],
      ],
    })

    // No current track.
    const testStateNoCurrent: QueueStateType = {
      ...testState,
      current: undefined,
    }

    expect(
      queueSlice.reducer(testStateNoCurrent, {
        type: queueAddTracksAfterCurrent.type,
        payload: tracksToAdd,
      })
    ).toEqual({
      ...testStateNoCurrent,
      items: [
        ...testStateNoCurrent.items,
        ...tracksToAdd.map((item) => ({ track: item })),
      ],
    })
  })
})
