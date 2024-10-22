type LoadingErrorService = "Auth" | "Chat"

export class LoadingError extends Error {
  constructor(method: string, service: LoadingErrorService) {
    super(`Cannot call ${method}. ${service} is still loading`)
    this.name = "LoadingError"
  }
}
