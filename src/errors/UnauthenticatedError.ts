export class UnauthenticatedError extends Error {
  constructor() {
    super("The user is not authenticated")
    this.name = "UnauthenticatedError"
  }
}
