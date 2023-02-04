import { restAPI } from 'api/api'

type AppConfigResponse = {
  auth_enabled: boolean
  library_configuration_disabled: boolean
}

type AppConfig = {
  authEnabled: boolean
  libraryConfigurationDisabled: boolean
}

const settingsApi = restAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAppConfig: builder.query<AppConfig, void>({
      query: () => '/config',
      transformResponse: (response: AppConfigResponse) => ({
        authEnabled: response.auth_enabled,
        libraryConfigurationDisabled: response.library_configuration_disabled,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetAppConfigQuery } = settingsApi
