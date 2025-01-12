export class NotConnectedError extends Error {
  constructor() {
    super("Chat client is not connected")
    this.name = "NotConnectedError"
  }
}
