import { COLLECTION_TYPE } from 'modules/collections/utils/constants'
import { immutableNestedSort } from 'common/utils/utils'

export const convertAPICollectionToAppPlaylist = (
  apiCollection?: ApiCollection
): Playlist | undefined => {
  if (!apiCollection) {
    return undefined
  }

  return {
    id: apiCollection.id,
    title: apiCollection.title,
    dateCreated: apiCollection.dateAdded || 0,
    dateModified: apiCollection.dateModified || 0,
    items: apiCollection.items ? JSON.parse(apiCollection.items) : undefined,
  }
}

export function transformCollectionsResponse(response: GetCollectionsResponse) {
  const result: Collections = {
    playlists: [],
  }

  response.collections?.forEach((collection: ApiCollection) => {
    switch (collection.type) {
      case COLLECTION_TYPE.tracks:
        const playlist = convertAPICollectionToAppPlaylist(collection)
        if (playlist) {
          result.playlists.push(playlist)
        }

        break
    }
  })

  // Sort lists.
  result.playlists = immutableNestedSort(result.playlists, 'title')

  return result
}
