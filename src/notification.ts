import { Client } from "./core"
import { ApiKeyAuthorized, Maybe } from "./types"

export class Notification extends Client {
  private _socket: Maybe<WebSocket> = null

  constructor(config: ApiKeyAuthorized) {
    super(config.devMode)
  }
}
