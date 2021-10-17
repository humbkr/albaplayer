import configureMockStore from 'redux-mock-store'
// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from 'redux-thunk'

export const makeMockStore = (customState: any = {}, mockDispatch: boolean = true) => {
  const mockStore = configureMockStore([thunk])
  const store = mockStore({
    ...customState,
  })

  if (mockDispatch) {
    store.dispatch = jest.fn()
  }

  return store
}
