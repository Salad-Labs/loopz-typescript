import {
  BACKEND_URLS,
  CLIENT_DB_KEY_REFRESH_TOKEN,
  CLIENT_DB_KEY_TOKEN,
} from "src/constants/app"
import fetchApi from "../utilities/fetchapi"

const refreshToken = async (devMode: boolean = false) => {
  const ENDPOINT = devMode ? BACKEND_URLS.development : BACKEND_URLS.production
  const refreshToken = localStorage.getItem(CLIENT_DB_KEY_REFRESH_TOKEN)

  if (!refreshToken) {
    throw "No refresh token available"
  }

  const { response, data } = await fetchApi(`${ENDPOINT}/auth/refresh-token`, {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.ok) {
    // Se il refresh token è scaduto, bisogna riautenticarsi
    localStorage.removeItem(CLIENT_DB_KEY_TOKEN)
    localStorage.removeItem(CLIENT_DB_KEY_REFRESH_TOKEN)

    throw "Refresh Token Failed"
  }

  localStorage.setItem(CLIENT_DB_KEY_TOKEN, data.token)

  return data.token
}

export default refreshToken
