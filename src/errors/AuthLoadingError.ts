export class AuthLoadingError extends Error {
  constructor(method: string) {
    super(`Cannot call ${method}. Auth is still loading`)
    this.name = "AuthLoadingError"
  }
}
