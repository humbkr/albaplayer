/* istanbul ignore file */

import { gql } from 'graphql-request'
import { graphqlAPI } from 'api/api'
import { transformCollectionsResponse } from 'modules/collections/services/utils'

const collectionApi = graphqlAPI
  .enhanceEndpoints({ addTagTypes: ['Collections', 'Collection'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getCollections: builder.query<Collections, void>({
        providesTags: ['Collections'],
        query: () => ({
          document: gql`
            query collections {
              collections {
                id
                type
                title
                items
                dateAdded
              }
            }
          `,
        }),
        transformResponse: (response: GetCollectionsResponse) =>
          transformCollectionsResponse(response),
      }),
      createCollection: builder.mutation<
        ApiCollection,
        ApiCollectionForCreation
      >({
        query: (collection) => {
          const mutation = gql`
            mutation CreateCollection($input: CollectionInput!) {
              createCollection(input: $input) {
                title
                type
                items
              }
            }
          `

          const variables = {
            input: {
              title: collection.title,
              type: collection.type,
              items: collection.items,
            },
          }

          return {
            document: mutation,
            variables,
          }
        },
        transformResponse: (response: GetCollectionResponse) =>
          response.collection,
        invalidatesTags: ['Collections', 'Collection'],
      }),
      updateCollection: builder.mutation<ApiCollection, ApiCollectionForUpdate>(
        {
          query: (collection) => {
            const mutation = gql`
              mutation UpdateCollection($id: ID!, $input: CollectionInput!) {
                updateCollection(id: $id, input: $input) {
                  id
                  title
                  type
                  items
                }
              }
            `

            const variables = {
              id: collection.id,
              input: {
                title: collection.title,
                type: collection.type,
                items: collection.items,
              },
            }

            return {
              document: mutation,
              variables,
            }
          },
          transformResponse: (response: GetCollectionResponse) =>
            response.collection,
          invalidatesTags: ['Collections', 'Collection'],
        }
      ),
      deleteCollection: builder.mutation<Boolean, string>({
        query: (collectionId) => {
          const mutation = gql`
            mutation DeleteCollection($id: ID!) {
              deleteCollection(id: $id)
            }
          `

          const variables = {
            id: collectionId,
          }

          return {
            document: mutation,
            variables,
          }
        },
        invalidatesTags: ['Collections'],
      }),
    }),
    overrideExisting: false,
  })

export const {
  useGetCollectionsQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
} = collectionApi
export default collectionApi
