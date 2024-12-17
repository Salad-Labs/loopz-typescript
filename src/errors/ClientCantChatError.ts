export class ClientCantChatError extends Error {
  constructor() {
    super(
      "This client cannot start to chat. Are you missing to pairing the keys?"
    )
    this.name = "ClientCantChatError"
  }
}
