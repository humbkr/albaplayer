import { graphqlAPI, restAPI } from 'api/api'
import { gql } from 'graphql-request'

type AppConfigResponse = {
  auth_enabled: boolean
  library_configuration_disabled: boolean
  root_user_created: boolean
}

type getVariableResponse = {
  value: string
}

type AppConfig = {
  authEnabled: boolean
  libraryConfigurationDisabled: boolean
  rootUserCreated: boolean
}

const settingsApi = restAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAppConfig: builder.query<AppConfig, void>({
      query: () => '/config',
      transformResponse: (response: AppConfigResponse) => ({
        authEnabled: response.auth_enabled,
        libraryConfigurationDisabled: response.library_configuration_disabled,
        rootUserCreated: response.root_user_created,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetAppConfigQuery } = settingsApi

const variableApi = graphqlAPI.injectEndpoints({
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
