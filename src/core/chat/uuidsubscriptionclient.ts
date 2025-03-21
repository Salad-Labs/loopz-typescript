import { ClientOptions, SubscriptionClient } from "subscriptions-transport-ws"
import { v4 as uuid4 } from "uuid"
import { RealTimeWebSocketConnectionParams } from "../../types/chat/realtimewebsocketconnectionparams"
import { Engine } from "../"
import { Auth, Chat } from "../../"

/**
 * Represents a custom SubscriptionClient that extends the functionality of the SubscriptionClient class.
 * @class UUIDSubscriptionClient
 * @extends SubscriptionClient
 */
// @ts-ignore
export default class UUIDSubscriptionClient extends SubscriptionClient {
  private _engine: Engine
  /**
   * Constructs a new UUIDSubscriptionClient instance with the provided URL, client options, and connection parameters.
   * @param {string} url - The URL for the WebSocket connection.
   * @param {ClientOptions} args - The options for the WebSocket client.
   * @param {RealTimeWebSocketConnectionParams} connectionParams - The connection parameters for the WebSocket connection.
   * @returns None
   */
  constructor(
    url: string,
    args: ClientOptions,
    connectionParams: RealTimeWebSocketConnectionParams,
    engine: Engine
  ) {
    super(
      `${url}?header=${btoa(JSON.stringify(connectionParams))}&payload=${btoa(
        JSON.stringify({})
      )}`,
      args
    )
    console.log("i'm creating an instance of uuidsubscription client.")
    this._engine = engine
  }

  /**
   * Generates a unique operation ID using the uuid4 function.
   * @returns A unique operation ID.
   */
  generateOperationId() {
    return uuid4()
  }

  /**
   * Process the received data, parsing it as JSON and checking for a specific message type.
   * If the message type is "start_ack", the function returns early.
   * If the received data is not JSON-parsable, an error is thrown.
   * @param {string} receivedData - The data received as a string.
   * @returns None
   */
  processReceivedData(receivedData: string) {
    try {
      const parsedMessage = JSON.parse(receivedData)
      if (parsedMessage?.type === "start_ack") return

      const { payload } = parsedMessage

      if (payload) {
        if ("errors" in payload && Array.isArray(payload.errors)) {
          const error = payload.errors[0]

          if (error && "errorCode" in error && error.errorCode === 401) {
            ;(async () => {
              if (Auth.prevToken === null) {
                Auth.fetchTokenAttemptsRealtime++
                Auth.prevToken = Auth.authToken

                try {
                  //let's refresh the token and store it into local storage
                  await Auth.fetchAuthToken()

                  //let's call a silent reset that basically reset the realtimeClient, create a new instance of it and restore the subscriptions previously added
                  this._engine.silentReset()
                  console.log("payload websocket is telling we are in 401!!!")
                } catch (error) {
                  console.log(
                    "something wrong with fetchAuthToken(), user should be logged out"
                  )
                  console.log(error)
                  this.close()
                }
              } else {
                console.log("Seems the prev attempt failed")
                console.log("Prev token was ", Auth.prevToken)
                console.log("Current token is", Auth.authToken)
                if (Auth.prevToken !== Auth.authToken) {
                  if (
                    Auth.fetchTokenAttemptsRealtime ===
                    Auth.MAX_ATTEMPTS_REALTIME_FETCH_AUTH_TOKEN
                  ) {
                    console.log("MAX ATTEMPTS REACHED... logout required!!!")
                    //reset prevToken and fetchTokenAttemptsRealtime
                    //do the logout and unsync if needed
                    Auth.getInstance().logout()

                    Auth.prevToken = null
                    Auth.fetchTokenAttemptsRealtime = 0
                    Chat.unsyncBrutal()
                  } else {
                    console.log("Let's try again...")
                    Auth.fetchTokenAttemptsRealtime++
                    Auth.prevToken = Auth.authToken
                    //let's refresh the token and store it into local storage
                    await Auth.fetchAuthToken()

                    //let's call a silent reset that basically reset the realtimeClient, create a new instance of it and restore the subscriptions previously added
                    this._engine.silentReset()
                  }
                } else {
                  console.log(
                    "this is strange, prevToken is equal to authToken. Let's logout the user...",
                    Auth.prevToken,
                    Auth.authToken
                  )

                  this.close()
                  Auth.getInstance().logout()
                  Auth.prevToken = null
                  Auth.fetchTokenAttemptsRealtime = 0
                  Chat.unsyncBrutal()
                }
              }
            })()
          }
        }
      }
    } catch (e) {
      throw new Error("Message must be JSON-parsable. Got: " + receivedData)
    }
    // @ts-ignore
    super.processReceivedData(receivedData)
  }

  /**
   * Builds a message with the given id, type, and payload.
   * If the type is "connection_init", the payload is set to undefined.
   * @param {string} id - The id of the message.
   * @param {string} type - The type of the message.
   * @param {any} payload - The payload of the message.
   * @returns The built message.
   */
  buildMessage(id: string, type: string, payload: any) {
    if (type === "connection_init") payload = undefined
    // @ts-ignore
    return super.buildMessage(id, type, payload)
  }
}
