const getBaseURL = () => {
  const url = !import.meta.env.VITE_BACKEND_URL
    ? window.location.href
    : import.meta.env.VITE_BACKEND_URL
  return url.replace(/\/+$/, '')
}

export default {
  COMPILATION_ARTIST_ID: '1',
  BACKEND_BASE_URL: getBaseURL(),
  USER_OWNER_ID: 1,
}
