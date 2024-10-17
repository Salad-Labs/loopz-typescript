import { Maybe } from "@src/types"
import { HTTPRequestInit, HTTPResponse } from "../interfaces/base"
import { Account } from "./app"
import { getAccessToken } from "@privy-io/react-auth"

/**
 * Class representing an HTTP client for making HTTP requests.
 * @class Client
 */
export class Client {
  private _devMode: "development" | "production" = "production"

  /**
   * @type {Maybe<string>} _apiKey - The API key, which may be null.
   */
  protected _apiKey: Maybe<string> = null

  /**
   * @type {Maybe<string>} _authToken - The JWT token, which may be null.
   */
  protected _authToken: Maybe<string> = null

  /**
   * @type {Maybe<Account>} account - The account object, which may be null.
   */
  protected _account: Maybe<Account> = null

  /**
   * @type {number} _requestAuthToken - The number of auth attempts the client is doing in case of 401 unauthorized error.
   */
  protected _requestAuthToken: number = 0

  constructor(enableDevMode: boolean) {
    if (enableDevMode) this.enableDevMode()
  }

  /**
   * Fetches data from a specified URL using XMLHttpRequest.
   * @param {string | URL} url - The URL to fetch data from.
   * @param {HTTPRequestInit} options - The options for the HTTP request.
   * @returns {Promise<HTTPResponse<RT>>} A promise that resolves with the HTTP response data.
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
   * @param {string | URL} url - The URL to fetch data from.
   * @param {HTTPRequestInit} [options] - The options for the HTTP request such as method, headers, and body.
   * @returns {Promise<HTTPResponse<ReturnType>>} A promise that resolves to the HTTP response.
   */
  protected _fetch<ReturnType = any>(
    url: string | URL,
    options: HTTPRequestInit = {
      method: "GET",
      headers: undefined,
      body: undefined,
    },
    callbackUnauthorized: (error: unknown) => void
  ): Promise<HTTPResponse<ReturnType>> {
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
      mode: "loopz",
    }

    return new Promise(async (resolve, reject) => {
      try {
        resolve(await this._fetchXHR<ReturnType>(url, options))
      } catch (error) {
        if (
          "statusCode" in (error as any) &&
          (error as any).statusCode === 401
        ) {
          //handle 401 error
          callbackUnauthorized(error)
        } else {
          reject(error)
        }
      }
    })
  }

  protected getDevMode(): string {
    return this._devMode
  }

  protected toggleDevMode() {
    this._devMode =
      this._devMode === "development" ? "production" : "development"
  }

  protected enableDevMode() {
    this._devMode = "development"
  }

  protected disableDevMode() {
    this._devMode = "production"
  }

  protected isDevelopment() {
    return this._devMode === "development"
  }

  protected isProduction() {
    return this._devMode === "production"
  }

  protected backendUrl(): string {
    return `https://${
      this._devMode === "development" ? `develop.api.` : `api.`
    }loopz.xyz/v1`
  }

  protected backendChatUrl(): string {
    return `${
      this._devMode === "development"
        ? `https://develop.api.loopz.xyz/graphql`
        : `https://api.loopz.xyz/graphql`
    }`
  }

  protected backendNotificationUrl(): string {
    return `${
      this._devMode === "development"
        ? `wss://develop.wss.loopz.xyz`
        : `wss://wss.loopz.xyz`
    }`
  }

  protected backendChatRealtimeUrl(): string {
    return `${
      this._devMode === "development"
        ? `wss://develop.api.graphql.loopz.xyz/graphql/realtime` //url server chat graphql development
        : `wss://api.graphql.loopz.xyz/graphql/realtime` //url server chat graphql production
    }`
  }

  protected resetRequestNewAuthToken() {
    this._requestAuthToken = 0
  }

  protected incrementRequestNewAuthToken() {
    this._requestAuthToken = this._requestAuthToken + 1
  }

  protected countRequestNewAuthToken(): number {
    return this._requestAuthToken
  }

  protected async obtainNewAuthToken(
    callbackSuccess: (authToken: string) => void,
    callbackError: (error: unknown) => void
  ) {
    try {
      const authToken = await getAccessToken()

      if (authToken) {
        callbackSuccess(authToken)
      } else {
        callbackError({
          error: "error: authToken is null.",
        })
      }
    } catch (error) {
      callbackError(error)
    }
  }

  setAuthToken(authToken: Maybe<string>): void {
    this._authToken = authToken
  }

  setCurrentAccount(account: Account) {
    this._account = account
  }

  getCurrentAccount() {
    return this._account
  }
}
