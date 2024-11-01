import { Auth } from "."
import { Client } from "./core/client"
import { Maybe } from "./types"
import { NotificationMessage } from "./types/notification"
import { v4 as uuid } from "uuid"

export class Notification extends Client {
  private static _config: Maybe<{ devMode: boolean }> = null

  private static _instance: Maybe<Notification> = null

  private _socket: Maybe<WebSocket> = null

  private _socketInitialized: boolean = false

  private _onOpenConnectionFunctions: Array<{
    key: string
    fn: (this: WebSocket, ev: Event) => any
  }> = []

  private _onCloseConnectionFunctions: Array<{
    key: string
    fn: (this: WebSocket, ev: CloseEvent) => any
  }> = []

  private _onMessageFunctions: Array<{
    key: string
    fn: (message: NotificationMessage) => any
  }> = []

  private constructor() {
    if (!!!Notification._config)
      throw new Error(
        "Notification must be configured before getting the instance"
      )

    super(Notification._config.devMode)
  }

  /** static methods */

  static config(config: { devMode: boolean }) {
    if (!!Notification._config)
      throw new Error("Notification already configured")

    Notification._config = config
  }

  static getInstance() {
    return Notification._instance ?? new Notification()
  }

  /** public instance methods */

  init() {
    if (!Auth.authToken) return
    try {
      this._socket = new WebSocket(
        this._backendNotificationUrl(
          `?jwt=${Auth.authToken}&organizationId=${Auth.apiKey}`
        )
      )
      this._socketInitialized = true
    } catch (error) {
      console.log(error)
      this._socketInitialized = false
    }
  }

  close() {
    if (!this._socketInitialized) return

    this._socket?.close()
    this._socketInitialized = false
  }

  onOpenConnection(
    callback: (this: WebSocket, ev: Event) => any
  ): Maybe<string> {
    if (!this._socketInitialized) return null

    this._socket!.addEventListener("open", callback)
    this._onOpenConnectionFunctions.push({
      key: uuid(),
      fn: callback,
    })

    return this._onOpenConnectionFunctions[
      this._onOpenConnectionFunctions.length - 1
    ].key
  }

  onCloseConnection(callback: (this: WebSocket, ev: CloseEvent) => any) {
    if (!this._socketInitialized) return

    this._socket!.addEventListener("close", callback)
    this._onCloseConnectionFunctions.push({
      key: uuid(),
      fn: callback,
    })

    return this._onCloseConnectionFunctions[
      this._onCloseConnectionFunctions.length - 1
    ].key
  }

  onMessage(callback: (message: NotificationMessage) => any) {
    if (!this._socketInitialized) return

    this._socket!.addEventListener("message", callback)
    this._onMessageFunctions.push({
      key: uuid(),
      fn: callback,
    })

    return this._onMessageFunctions[this._onMessageFunctions.length - 1].key
  }

  offOpenConnection(key: string) {
    if (!this._socketInitialized) return

    const index = this._onOpenConnectionFunctions.findIndex((element) => {
      return element.key === key
    })

    if (index > -1) {
      this._socket!.removeEventListener(
        "open",
        this._onOpenConnectionFunctions[index].fn
      )
      this._onOpenConnectionFunctions.splice(index, 1)
    }
  }

  offCloseConnection(key: string) {
    if (!this._socketInitialized) return

    const index = this._onCloseConnectionFunctions.findIndex((element) => {
      return element.key === key
    })

    if (index > -1) {
      this._socket!.removeEventListener(
        "close",
        this._onCloseConnectionFunctions[index].fn
      )
      this._onCloseConnectionFunctions.splice(index, 1)
    }
  }

  offMessage(key: string) {
    if (!this._socketInitialized) return

    const index = this._onMessageFunctions.findIndex((element) => {
      return element.key === key
    })

    if (index > -1) {
      this._socket!.removeEventListener(
        "message",
        this._onMessageFunctions[index].fn
      )
      this._onMessageFunctions.splice(index, 1)
    }
  }
}
