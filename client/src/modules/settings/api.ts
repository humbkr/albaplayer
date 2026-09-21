import { graphqlAPISlice, restAPISlice } from 'api/api'
import { gql } from 'graphql-request'

type AppConfigResponse = {
  auth_enabled: boolean
  library_configuration_disabled: boolean
  root_user_created: boolean
}

type VersionResponse = {
  version: string
}

type LibraryLastUpdatedResponse = {
  lastUpdated: string
}

type getVariableResponse = {
  value: string
}

type AppConfig = {
  authEnabled: boolean
  libraryConfigurationDisabled: boolean
  rootUserCreated: boolean
}

const settingsApi = restAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppConfig: builder.query<AppConfig, void>({
      query: () => '/config',
      transformResponse: (response: AppConfigResponse) => ({
        authEnabled: response.auth_enabled,
        libraryConfigurationDisabled: response.library_configuration_disabled,
        rootUserCreated: response.root_user_created,
      }),
    }),
    getServerVersion: builder.query<string, void>({
      query: () => '/version',
      transformResponse: (response: VersionResponse) => response.version,
    }),
    getLibraryLastUpdated: builder.query<string, void>({
      query: () => '/library-last-updated',
      transformResponse: (response: LibraryLastUpdatedResponse) =>
        response.lastUpdated,
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetAppConfigQuery,
  useGetServerVersionQuery,
  useGetLibraryLastUpdatedQuery,
} = settingsApi

const variableApi = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    getVariable: builder.query<string, string>({
      query: (key) => ({
        document: gql`
          query getVariable($key: String!) {
            variable(key: $key) {
              value
            }
          }
        `,
        variables: { key },
      }),
      transformResponse: (response: getVariableResponse) => response.value,
    }),
  }),
  overrideExisting: false,
})

export const { useGetVariableQuery } = variableApi
