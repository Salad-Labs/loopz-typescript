export class NotInitializedError extends Error {
  constructor() {
    super("Loopz hasn't been initialized yet")
    this.name = "NotInitializedError"
  }
}
