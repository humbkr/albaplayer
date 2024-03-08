/* istanbul ignore file */

// eslint-disable-next-line import/no-extraneous-dependencies
import { gql } from 'graphql-request'
import { graphqlAPI } from 'api/api'

type GetUsersResponse = {
  users: User[]
}

type GetUserResponse = {
  user: User
}

export type UserToUpdate = Partial<User> & {
  currentPassword?: string
  newPassword?: string
}

const userApi = graphqlAPI
  .enhanceEndpoints({ addTagTypes: ['Users', 'User'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUsers: builder.query<User[], void>({
        providesTags: ['Users'],
        query: () => ({
          document: gql`
            query getUsers {
              users {
                id
                name
                email
                data
                dateAdded
                roles
              }
            }
          `,
        }),
        transformResponse: (response: GetUsersResponse) => response.users,
      }),
      getUser: builder.query<User, number | void>({
        providesTags: ['Auth', 'User'],
        query: (userId) => ({
          document: userId
            ? gql`
            query getUser {
                user(id: ${userId}) {
                    id
                    name
                    email
                    data
                    dateAdded
                    roles
                }
            }
        `
            : gql`
                query getUser {
                  user {
                    id
                    name
                    email
                    data
                    dateAdded
                    roles
                    isDefaultUser
                  }
                }
              `,
        }),
        transformResponse: (response: GetUserResponse) => response.user,
      }),
      createUser: builder.mutation<User, UserToUpdate>({
        query: (user) => {
          const mutation = gql`
            mutation CreateUser($input: UserInput!) {
              createUser(input: $input) {
                id
                name
                email
                data
                dateAdded
                roles
              }
            }
          `

          const variables = {
            id: user.id,
            input: {
              name: user.name,
              email: user.email,
              password: user.newPassword,
              data: user.data,
              roles: user.roles,
            },
          }

          return {
            document: mutation,
            variables,
          }
        },
        transformResponse: (response: GetUserResponse) => response.user,
        invalidatesTags: ['Users', 'User'],
      }),
      updateUser: builder.mutation<User, UserToUpdate>({
        query: (user) => {
          const mutation = gql`
            mutation UpdateUser($id: ID!, $input: UserInput!) {
              updateUser(id: $id, input: $input) {
                id
                name
                email
                data
                dateAdded
                roles
              }
            }
          `

          const variables = {
            id: user.id,
            input: {
              name: user.name,
              email: user.email,
              currentPassword: user.currentPassword,
              password: user.newPassword,
              data: user.data,
              roles: user.roles,
            },
          }

          return {
            document: mutation,
            variables,
          }
        },
        transformResponse: (response: GetUserResponse) => response.user,
        invalidatesTags: ['Users', 'User'],
      }),
      deleteUser: builder.mutation<Boolean, number>({
        query: (userId) => {
          const mutation = gql`
            mutation DeleteUser($id: ID!) {
              deleteUser(id: $id)
            }
          `

          const variables = {
            id: userId,
          }

          return {
            document: mutation,
            variables,
          }
        },
        invalidatesTags: ['Users'],
      }),
    }),
    overrideExisting: false,
  })

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi
