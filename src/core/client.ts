import { Maybe } from "@src/types"
import { HTTPRequestInit, HTTPResponse } from "../interfaces/base"
import { Account } from "./app"
import { getAccessToken } from "@privy-io/react-auth"
import { CLIENT_DB_KEY_LAST_USER_LOGGED } from "../constants/app"
import { Auth, Chat, Notification, Proposal, Order, Oracle, AuthInfo } from ".."
/**
 * Class representing an HTTP client for making HTTP requests.
 * @class Client
 */
export class Client {
  private static MAX_REFRESH_TOKEN_CALLS = 1
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
   * @type {Maybe<AuthInfo>} _authInfo - The auth info, which may be null.
   */
  protected _authInfo: Maybe<AuthInfo> = null

  /**
   * @type {Maybe<Account>} account - The account object, which may be null.
   */
  protected _account: Maybe<Account> = null

  /**
   * @type {number} _refreshTokenCallCount - The number of auth attempts the client is doing in case of 401 unauthorized error.
   */
  protected _refreshTokenCallCount: number = 0

  /**
   * @type {Maybe<Auth>} _authRef -
   */
  protected _authRef: Maybe<Auth> = null

  /**
   * @type {Maybe<Order>} _orderRef -
   */
  protected _orderRef: Maybe<Order> = null

  /**
   * @type {Maybe<Proposal>} _proposalRef -
   */
  protected _proposalRef: Maybe<Proposal> = null

  /**
   * @type {Maybe<Oracle>} _oracleRef -
   */
  protected _oracleRef: Maybe<Oracle> = null

  /**
   * @type { Maybe<Chat>} _chatRef -
   */
  protected _chatRef: Maybe<Chat> = null

  /**
   * @type {Maybe<Notification>} _notificationRef -
   */
  protected _notificationRef: Maybe<Notification> = null

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
    }
  ): Promise<HTTPResponse<ReturnType>> {
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
      mode: "loopz", // TODO maybe "test"?
    }

    return this._fetchXHR<ReturnType>(url, options).catch(async (e) => {
      if (
        !("statusCode" in e) ||
        e.statusCode !== 401 ||
        this._refreshTokenCallCount++ >= Client.MAX_REFRESH_TOKEN_CALLS
      )
        throw e

      // try refresh the token N times then throws
      const authToken = await getAccessToken()

      this.setAuthToken(authToken)
      this._setAllAuthToken(authToken)

      // set tokens and whatever
      return this._fetch(url, options).then((res) => {
        this._refreshTokenCallCount = 0
        return res
      })
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

  protected _setAllAuthToken(authToken: Maybe<string>) {
    this._authRef?.setAuthToken(authToken)
    this._orderRef?.setAuthToken(authToken)
    this._oracleRef?.setAuthToken(authToken)
    this._proposalRef?.setAuthToken(authToken)
    this._chatRef?.setAuthToken(authToken)
    this._notificationRef?.setAuthToken(authToken)
  }

  setLoopzObjectsReference({
    auth,
    oracle,
    order,
    proposal,
    chat,
    notification,
  }: {
    auth: Maybe<Auth>
    oracle: Maybe<Oracle>
    order: Maybe<Order>
    proposal: Maybe<Proposal>
    chat: Maybe<Chat>
    notification: Maybe<Notification>
  }) {
    this._authRef = auth
    this._oracleRef = oracle
    this._orderRef = order
    this._proposalRef = proposal
    this._chatRef = chat
    this._notificationRef = notification
  }

  setAuthToken(authToken: Maybe<string>): void {
    this._authToken = authToken
  }

  setAuthInfo(authInfo: AuthInfo) {
    this._authInfo = authInfo
  }

  getAuthInfo() {
    return this._authInfo
  }

  setCurrentAccount(account: Account) {
    this._account = account
  }

  getCurrentAccount() {
    return this._account
  }

  destroyLastUserLoggedKey() {
    window.localStorage.removeItem(CLIENT_DB_KEY_LAST_USER_LOGGED)
  }
}
