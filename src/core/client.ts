import { HTTPRequestInit, HTTPResponse } from "../interfaces/base"
import { Auth } from ".."

/**
 * Class representing an HTTP client for making HTTP requests.
 */
export class Client {
  // readonly const
  private static get _MAX_REFRESH_TOKEN_CALLS() {
    return 1
  }

  private _devMode: "development" | "production" = "production"

  /**
   * The number of auth attempts the client is doing in case of 401 unauthorized error.
   */
  private _refreshTokenCallCount = 0

  private get _isDevelopment() {
    return this._devMode === "development"
  }

  constructor(enableDevMode?: boolean) {
    if (enableDevMode) this._devMode = "development"
  }

  /**
   * Fetches data from a specified URL using XMLHttpRequest.
   * @param url - The URL to fetch data from.
   * @param options - The options for the HTTP request.
   * @returns A promise that resolves with the HTTP response data.
   */
  private async _fetchXHR<RT = any>(
    url: string | URL,
    options: HTTPRequestInit
  ): Promise<HTTPResponse<RT>> {
    const req = new XMLHttpRequest()

    return new Promise((resolve, reject) => {
      req.addEventListener("load", () => {
        const {
          status: statusCode,
          statusText: statusMessage,
          responseText,
        } = req
        const response = responseText.length ? JSON.parse(responseText) : null

        if (statusCode >= 400)
          reject({
            statusCode,
            statusMessage,
            response,
          })
        else
          resolve({
            statusCode,
            statusMessage,
            response,
          })
      })

      req.addEventListener("error", (error) =>
        reject({
          statusCode: req.status,
          statusMessage: req.statusText,
          response: error,
        })
      )

      req.open(options.method, url)

      if (options.headers)
        for (const [name, value] of Object.entries(options.headers))
          req.setRequestHeader(name, value)

      req.send(JSON.stringify(options.body))
    })
  }

  /**
   * Fetches data from the specified URL using either browser's fetch API or Node.js's http/https module.
   * @param url - The URL to fetch data from.
   * @param options - The options for the HTTP request such as method, headers, and body.
   * @returns A promise that resolves to the HTTP response.
   */
  public async fetch<ReturnType = any>(
    url: string | URL,
    options: HTTPRequestInit = {
      method: "GET",
      headers: undefined,
      body: undefined,
    }
  ): Promise<HTTPResponse<ReturnType>> {
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
      mode: "loopz",
    }

    if (Auth.apiKey)
      options.headers = {
        ...options.headers,
        "x-api-key": Auth.apiKey,
      }

    if (Auth.authToken)
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${Auth.authToken}`,
      }

    return this._fetchXHR<ReturnType>(url, options).catch(async (e) => {
      if (
        !("statusCode" in e) ||
        e.statusCode !== 401 ||
        this._refreshTokenCallCount++ >= Client._MAX_REFRESH_TOKEN_CALLS
      )
        throw e

      try {
        await Auth.fetchAuthToken()
      } catch (error) {
        throw error
      }

      return this.fetch(url, options).then((res) => {
        this._refreshTokenCallCount = 0
        return res
      })
    })
  }

  public backendUrl(path?: string) {
    return `https://${
      this._isDevelopment ? `develop.api.` : `api.`
    }loopz.xyz/v1${path ?? ""}`
  }

  public backendChatUrl() {
    return this._isDevelopment
      ? "https://develop.api.loopz.xyz/graphql"
      : "https://api.loopz.xyz/graphql"
  }

  public backendNotificationUrl(path?: string) {
    return `wss://${this._isDevelopment ? `develop.wss.` : `wss.`}loopz.xyz${
      path ?? ""
    }`
  }

  public backendChatRealtimeUrl() {
    return this._isDevelopment
      ? "wss://develop.api.graphql.loopz.xyz/graphql/realtime" //url server chat graphql development
      : "wss://api.graphql.loopz.xyz/graphql/realtime" //url server chat graphql production
  }
}
