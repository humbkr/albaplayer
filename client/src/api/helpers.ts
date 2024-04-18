export const processApiError = (response: any): string => {
  let result = 'Unknown error'
  if (response.graphQLErrors.length > 0 && response.graphQLErrors[0].message) {
    result = response.graphQLErrors[0].message
  } else if (response.message) {
    result = response.message
  }

  return result
}
