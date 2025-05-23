import {
  AnyVariables,
  Client,
  OperationResult,
  TypedDocumentNode,
  fetchExchange,
  subscriptionExchange,
  createClient,
} from "@urql/core"
import { IEngine } from "../../interfaces/chat/core"
import { Client as ClientEngine } from "../client"
import { QIError } from "./qierror"
import { Maybe } from "../../types/base"
import { RealTimeWebSocketConnectionParams } from "../../types/chat/realtimewebsocketconnectionparams"
import { ErrorLike, FetchBody } from "@urql/core/dist/urql-core-chunk"
import UUIDSubscriptionClient from "./uuidsubscriptionclient"
import { Observable } from "subscriptions-transport-ws"
import { v4 as uuid4 } from "uuid"
import forge from "node-forge"
import { KeyPairItem } from "../../types/chat/keypairitem"
import { EngineInitConfig } from "../../types"
import { DexieStorage } from "../app"
import { Auth, Chat } from "../.."

/**
 * Represents an Engine class that extends Client and implements IEngine interface.
 * Manages API configurations, WebSocket connections, and GraphQL operations.
 * @extends Client
 * @implements IEngine
 */

export class Engine implements IEngine {
  protected _clientEngine: ClientEngine
  /**
   * @property {Maybe<EngineInitConfig>} _parentConfig - The parent configuration for the engine.
   */
  protected _parentConfig: Maybe<EngineInitConfig> = null
  /**
   * @property {Maybe<Client>} _client - The client for API connections.
   */
  protected _client: Maybe<Client> = null

  /**
   * @property {Maybe<UUIDSubscriptionClient>} _realtimeClient - The UUID subscription client for real-time communication.
   */
  protected _realtimeClient: Maybe<UUIDSubscriptionClient> = null
  /**
   * @property {Maybe<forge.pki.rsa.KeyPair>} _userKeyPair - The RSA key pair for the user.
   */
  protected _userKeyPair: Maybe<forge.pki.rsa.KeyPair> = null
  /**
   * @property {Maybe<Array<KeyPairItem>>} _keyPairsMap - An array of key pair items.
   */
  protected _keyPairsMap: Maybe<Array<KeyPairItem>> = null
  /**
   * @property {DexieStorage} _storage - The storage of the application.
   */
  protected _storage: DexieStorage
  /**
   * @property {boolean} _isConnected - Wheather the client has connected to the server
   */
  protected _isConnected: boolean = false
  /**
   * @property {boolean} _isConnecting - Wheather the client has connected to the server
   */
  protected _isConnecting: boolean = false
  /**
   * @property {Maybe<Function>} _connectCallback - The callback function for connecting to real-time services.
   */
  private _connectCallback: Maybe<Function> = null
  /**
   * @property {Maybe<RealTimeWebSocketConnectionParams>} _connectionParams - The connection parameters for the WebSocket.
   */
  private _connectionParams: Maybe<RealTimeWebSocketConnectionParams> = null
  /**
   * @property {Maybe<Array<Function>>} _offEventsFns - an array of off functions callback to remove the listeners from the subscription object
   */
  private _offEventsFnsCollector: Maybe<Array<Function>> = null
  /**
   * @property {number} WS_TIMEOUT - a static property representing the timeout before to close to the websocket connection
   */
  static readonly WS_TIMEOUT = 300000 //five minutes

  /**
   * Constructs a new instance of the Engine class with the provided configuration.
   * @param {EngineInitConfig} config - The configuration object for initializing the Engine.
   * @constructor
   */
  constructor(config: EngineInitConfig) {
    this._clientEngine = new ClientEngine(config.devMode)

    this._storage = config.storage
    this._parentConfig = config
    this._connectionParams = {
      Authorization: null,
      host: null,
    }
    this._offEventsFnsCollector = []
  }

  /**
   * Returns a QIError object with a specific message indicating that the internal _client is not defined.
   * @returns {QIError} A QIError object with the specified message.
   */
  private _returnQIErrorInternalClientNotDefined(): QIError {
    return new QIError(
      {
        networkError: undefined,
        graphQLErrors: undefined,
        response: undefined,
      },
      "QIError: internal _client is not defined.",
      false
    )
  }

  /**
   * Returns a QIError object with a message indicating that no data is available in the response.
   * @returns {QIError} - A QIError object with the specified message.
   */
  private _returnQIErrorNoDataAvailable(): QIError {
    return new QIError(
      {
        networkError: undefined,
        graphQLErrors: undefined,
        response: undefined,
      },
      "QIError: no data in the response is available.",
      false
    )
  }

  /**
   * Handles the WebSocket client events by setting up event listeners for various events
   * such as connecting, reconnecting, disconnected, reconnected, error, and connected.
   * If the WebSocket client or event listener collector is not available, the function returns early.
   * @returns None
   */
  private async _handleWSClient(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._realtimeClient)
        return reject(new Error("realtime client unavailable"))
      if (!this._offEventsFnsCollector)
        return reject(new Error("offEvents collector unavailable"))

      const offConnecting = this._realtimeClient.on("connecting", () => {
        this._isConnecting = true
        this._parentConfig?.devMode && console.log("connecting...")
      })

      const offReconnecting = this._realtimeClient.on("reconnecting", () => {
        this._isConnecting = true
        this._parentConfig?.devMode && console.log("reconnecting...")
      })

      const offDisconnected = this._realtimeClient.on("disconnected", () => {
        this._isConnecting = false
        this._isConnected = false
        this._parentConfig?.devMode && console.log("disconnected.")
      })

      const offReconnected = this._realtimeClient.on(
        "reconnected",
        (payload) => {
          console.log("reconnected", "[payload]:", payload)
          //reset?
          resolve()
        }
      )

      const offError = this._realtimeClient.on("error", () => {
        console.log("websocket error.")
      })

      const offConnected = this._realtimeClient.on(
        "connected",
        (payload: { connectionTimeoutMs: number }) => {
          console.log("connected", "[payload]:", payload)

          resolve()
        }
      )

      this._offEventsFnsCollector = [
        offConnecting,
        offReconnecting,
        offDisconnected,
        offReconnected,
        offError,
        offConnected,
      ]
    })
  }

  /**
   * Creates a WebSocket client with the provided callback function.
   * @param {Function} callback - The callback function to be executed.
   * @returns None
   */
  private async _makeWSClient(): Promise<void> {
    try {
      this._connectionParams!.Authorization = Auth.realtimeAuthorizationToken
      this._connectionParams!.host = this._clientEngine
        .backendChatUrl()
        .replace("https://", "")
        .replace("/graphql", "")

      this._realtimeClient = new UUIDSubscriptionClient(
        this._clientEngine.backendChatRealtimeUrl(),
        {
          reconnect: true,
          timeout: Engine.WS_TIMEOUT,
        },
        this._connectionParams!,
        this
      )

      return this._handleWSClient()
    } catch (error) {
      console.log(error)
      throw new Error(
        "Exception during the creation of the websocket client. See the console for more info."
      )
    }
  }

  /**
   * Computes the operation to be performed based on the provided fetch body and data.
   * @param {FetchBody & { data?: string }} operation - The operation to be computed.
   * @returns An Observable containing the result of the operation.
   */
  private _computeOperation(
    operation: FetchBody & { data?: string }
  ): Observable<any> {
    if (this._connectionParams)
      operation.extensions = {
        authorization: {
          Authorization: this._connectionParams.Authorization,
          host: this._connectionParams.host,
        },
      }
    const query = {
      query: operation.query!,
      variables: operation.variables,
    }
    operation.data = JSON.stringify(query)

    delete operation.operationName
    delete operation.variables

    return this._realtimeClient!.request(operation)
  }

  /**
   * Creates a client for making API requests if all required parameters are set.
   * @returns {Maybe<Client>} A client object for making API requests or null if any required parameter is missing.
   */
  private _makeClient(): Maybe<Client> {
    if (!this._realtimeClient) return null
    if (!this._client) {
      try {
        this._client = createClient({
          url: this._clientEngine.backendChatUrl(),
          exchanges: [
            fetchExchange,
            subscriptionExchange({
              forwardSubscription: (op: FetchBody & { data?: string }) => {
                return this._computeOperation(op)
              },
            }),
          ],
          fetchOptions: () => {
            return {
              headers: {
                Authorization: Auth.apiKey,
              },
            }
          },
        })
      } catch (error) {
        console.error(error)
        return null
      }
    }

    return this._client
  }

  /**
   * Resets the state of the object by unsubscribing from all events, closing the realtime client,
   * and executing a callback function.
   * @returns None
   */
  private _reset(): void {
    if (!this._realtimeClient) return

    this._realtimeClient.unsubscribeAll() //clear all the subscriptions of UUIDSubscriptionClient
    this._offUUIDSubscriptionEvents() //clear all the events of UUIDSubscriptionClient
    this._realtimeClient.close() //close the websocket connection
    this._realtimeClient = null
    this._offEventsFnsCollector = [] //reset the UUIDSubscriptionClient off events collector array

    console.warn("connection closed.")
  }

  /**
   * Clears all subscription off events by calling the functions stored in _offEventsFnsCollector.
   * If an error occurs during the process, a warning message is logged.
   * @returns void
   */
  private _offUUIDSubscriptionEvents(): void {
    if (this._offEventsFnsCollector) {
      this._offEventsFnsCollector.forEach((fn) => {
        try {
          fn()
        } catch (error) {
          console.warn(
            "[warning]: an exception occured while the client was clearing the subscription off events. More info -> ",
            error
          )
        }
      })
    }
  }

  protected _handleUnauthorizedQIError(error: QIError): Maybe<"_401_"> {
    if (error.graphQLErrors && Array.isArray(error.graphQLErrors)) {
      const _error = error.graphQLErrors[0]
      if (
        _error &&
        "originalError" in _error &&
        _error.originalError &&
        "errorType" in _error.originalError
      ) {
        this._parentConfig?.devMode &&
          console.log(
            "the qi error is ",
            _error.originalError,
            _error.originalError.errorType
          )
        if (_error.originalError.errorType === "UnauthorizedException")
          return "_401_"
      }
    }

    return null
  }

  /**
   * Handles the response from an operation result and returns the data or an error.
   * @param {K} queryName - The name of the query.
   * @param {OperationResult<T>} response - The response from the operation.
   * @returns {R | QIError} - The data or an error object.
   */
  protected _handleResponse<K extends string, T extends { [key in K]: any }, R>(
    queryName: K,
    response: OperationResult<T>
  ): R | QIError {
    if (
      response.error &&
      (!("data" in response) ||
        ("data" in response &&
          typeof response.data !== "undefined" &&
          !response.data[queryName]))
    )
      return new QIError(response.error, "", true)

    if ("error" in response && response.error)
      return new QIError(
        {
          graphQLErrors: response.error.graphQLErrors,
          response: response.error.response,
        },
        JSON.stringify(response.error.graphQLErrors),
        false
      )

    if (
      !("data" in response) ||
      typeof response.data === "undefined" ||
      response.data[queryName] === null
    )
      return this._returnQIErrorNoDataAvailable()

    return response.data[queryName] as R
  }

  /**
   * Executes a subscription operation with the provided arguments and returns a subscription object
   * or a QIError in case of an error.
   * @param {TypedDocumentNode<any, AnyVariables>} node - The GraphQL document node representing the subscription operation.
   * @param {string} __functionName - The name of the function executing the subscription.
   * @param {TArgs} args - The arguments for the subscription operation.
   * @returns {Object | QIError} An object containing the subscription and UUID or a QIError in case of an error.
   */
  protected _subscription<
    TArgs,
    TSubscriptionResult extends { [x: string]: any }
  >(
    node: TypedDocumentNode<any, AnyVariables>,
    __functionName: string,
    args: TArgs
  ):
    | {
        subscribe: (
          onResult: (
            value: OperationResult<
              TSubscriptionResult,
              TArgs & {
                jwt: string
              }
            >
          ) => void
        ) => { unsubscribe: () => void }
        uuid: string
      }
    | QIError {
    try {
      const client = this._makeClient()
      if (!client) return this._returnQIErrorInternalClientNotDefined()
      if (!Auth.authToken) throw new Error("authToken is not setup properly.")

      const subscription = client.subscription<
        TSubscriptionResult,
        TArgs & { jwt: string }
      >(node, { ...args, jwt: Auth.authToken })

      return {
        subscribe: subscription.subscribe,
        uuid: uuid4(),
      }
    } catch (error) {
      console.error(error)
      console.error("arguments:", args)
      throw new Error(
        `Internal error: ${__functionName} thrown an exception. See the console to have more information.`
      )
    }
  }

  /**
   * Executes a mutation operation using Apollo Client with the provided arguments.
   * @param {string} key - The key associated with the mutation operation.
   * @param {TypedDocumentNode<any, AnyVariables>} node - The GraphQL document node representing the mutation.
   * @param {string} __functionName - The name of the function calling the mutation.
   * @param {TArgs} args - The arguments required for the mutation operation.
   * @returns {Promise<TResult | QIError>} A promise that resolves to the result of the mutation or an error.
   * @throws {Error} Throws an error if an exception occurs during the mutation operation.
   */
  protected async _mutation<
    TArgs,
    TMutationResult extends { [x: string]: any },
    TResult
  >(
    key: string,
    node: TypedDocumentNode<any, AnyVariables>,
    __functionName: string,
    args: TArgs
  ): Promise<TResult | QIError> {
    try {
      const client = this._makeClient()
      if (!client) return this._returnQIErrorInternalClientNotDefined()
      if (!Auth.authToken) throw new Error("authToken is not set")

      const response = await client
        .mutation<TMutationResult, TArgs & { jwt: string }>(node, {
          ...args,
          jwt: Auth.authToken,
        })
        .toPromise()

      return this._handleResponse<typeof key, TMutationResult, TResult>(
        key,
        response
      )
    } catch (error) {
      console.error(error)
      console.error("arguments:", args)
      throw new Error(
        `Internal error: ${__functionName} thrown an exception. See the console to have more information.`
      )
    }
  }

  /**
   * Executes a query using Apollo Client with the provided key, node, function name, and arguments.
   * @param {string} key - The key for the query.
   * @param {TypedDocumentNode<any, AnyVariables>} node - The GraphQL document node for the query.
   * @param {string} __functionName - The name of the function executing the query.
   * @param {TArgs} args - The arguments for the query.
   * @returns {Promise<TResult | QIError>} A promise that resolves with the query result or an error.
   */
  protected async _query<
    TArgs,
    TQueryResult extends { [x: string]: any },
    TResult
  >(
    key: string,
    node: TypedDocumentNode<any, AnyVariables>,
    __functionName: string,
    args: TArgs
  ): Promise<TResult | QIError> {
    try {
      const client = this._makeClient()
      if (!client) return this._returnQIErrorInternalClientNotDefined()
      if (!Auth.authToken) throw new Error("authToken is not set")

      const response = await client
        .query<TQueryResult, TArgs & { jwt: string }>(node, {
          ...args,
          jwt: Auth.authToken,
        })
        .toPromise()

      return this._handleResponse<typeof key, TQueryResult, TResult>(
        key,
        response
      )
    } catch (error) {
      console.error(error)
      console.error("arguments:", args)
      throw new Error(
        `Internal error: ${__functionName}() thrown an exception. See the console to have more information.`
      )
    }
  }

  // TODO why the need of this function?
  /**
   * Refreshes the JWT token with the provided token and updates the realtime authorization token.
   * @param jwt - The new JWT token to be set.
   * @returns void
   */
  // refreshJWTToken(jwt: string) {
  //   this._authToken = jwt
  //   this._realtimeAuthorizationToken = `${this._apiKey}##${this._authToken}`
  // }

  /**
   * Reconnects to a service by resetting and then connecting again.
   */
  reconnect() {
    this._reset()
    return this.connect(true)
  }

  /**
   * Connects to a WebSocket server and executes the provided callback function.
   */
  async connect(force = false): Promise<void> {
    if (this._isConnecting) throw new Error("Chat is already connecting")
    if (!force && this._realtimeClient) return

    await this._makeWSClient()
    this._isConnected = true
    this._isConnecting = false
  }

  disconnect() {
    this._reset()
    this._isConnecting = false
    this._isConnected = false
  }

  silentReset() {
    if (!this._realtimeClient) return

    this._parentConfig?.devMode && console.log("silent reset! shhhh...")

    this._reset()
    this._makeWSClient() //silent creation of a new realtimeClient instance
    Chat.silentRestoreSubscriptionSync() //silent restore of the subscriptions from chat
  }

  /**
   * Returns the API URL as a string or null if it is not set.
   * @returns The API URL as a string or null if not set.
   */
  getApiURL() {
    return this._clientEngine.backendChatUrl()
  }

  /**
   * Returns the Realtime API URL as a string or null if it is not set.
   * @returns {string} The Realtime API URL as a string or null.
   */
  getRealtimeApiURL(): string {
    return this._clientEngine.backendChatRealtimeUrl()
  }

  /**
   * Adds a new KeyPairItem to the list of KeyPairItems if it does not already exist.
   * @param {KeyPairItem} newItem - The KeyPairItem to add to the list.
   * @returns {KeyPairItem[]} - The updated list of KeyPairItems after adding the new item.
   */
  addKeyPairItem(newItem: KeyPairItem): KeyPairItem[] {
    if (!this._keyPairsMap) this._keyPairsMap = []

    const index = this._keyPairsMap.findIndex((keypair: KeyPairItem) => {
      return keypair.id.toLowerCase() === newItem.id.toLowerCase()
    })

    if (index === -1) this._keyPairsMap.push(newItem)

    return this._keyPairsMap
  }

  /**
   * Removes a KeyPairItem from the _keyPairsMap based on the provided id.
   * @param {string} id - The id of the KeyPairItem to be removed.
   * @returns {KeyPairItem[]} - The updated _keyPairsMap after removing the KeyPairItem.
   */
  removeKeyPairItem(id: string): KeyPairItem[] {
    if (!this._keyPairsMap) this._keyPairsMap = []

    const index = this._keyPairsMap.findIndex((keypair: KeyPairItem) => {
      return keypair.id.toLowerCase() === id.toLowerCase()
    })

    if (index > -1) this._keyPairsMap = this._keyPairsMap.splice(index, 1)

    return this._keyPairsMap
  }

  /**
   * Get the key pair map as an array of KeyPairItem objects.
   * @returns {KeyPairItem[]} An array of KeyPairItem objects representing the key pair map.
   */
  getKeyPairMap(): KeyPairItem[] {
    return this._keyPairsMap!
  }

  /**
   * Sets the key pair map with the provided array of KeyPairItem objects.
   * @param {KeyPairItem[]} map - An array of KeyPairItem objects to set as the key pair map.
   * @returns void
   */
  setKeyPairMap(map: KeyPairItem[]): void {
    this._keyPairsMap = map
  }

  /**
   * Finds a key pair in the key pairs map based on the provided ID.
   * @param {string} id - The ID of the key pair to find.
   * @returns {Maybe<{AES: string; iv: string}>} The key pair associated with the provided ID, or null if not found.
   */

  findKeyPairById(id: string): Maybe<{ AES: string; iv: string }> {
    if (!this._keyPairsMap) return null

    const item = this._keyPairsMap.find((k: KeyPairItem) => {
      return k.id.toLowerCase() === id.toLowerCase()
    })

    if (!item) return null

    return {
      AES: item.AES,
      iv: item.iv,
    }
  }

  /**
   * Sets the user key pair for encryption and decryption.
   * @param {forge.pki.rsa.KeyPair} userKeyPair - The RSA key pair for the user.
   * @returns {void}
   */
  setUserKeyPair(userKeyPair: forge.pki.rsa.KeyPair): void {
    this._userKeyPair = userKeyPair
  }

  /**
   * Get the user's key pair.
   * @returns {Maybe<forge.pki.rsa.KeyPair>} The user's key pair, if available.
   */
  getUserKeyPair(): Maybe<forge.pki.rsa.KeyPair> {
    return this._userKeyPair
  }

  /**
   * Get the status of the connection with the server
   * @returns {boolean} _isConnected - a boolean representing the status of the connection with the server
   */
  isConnected(): boolean {
    return this._isConnected
  }

  /**
   * Get the status of attempting of connection with the server
   * @returns {boolean} _isConnecting - a boolean representing the status of attempting the connection with the server
   */
  isConnecting(): boolean {
    return this._isConnecting
  }
}
