import { AuthInfo } from ".."
import { Account } from "../../core"

export type LoopzAuthProviderContextValue =
  | {
      isLoading: true
      isAuthenticated: false
      account: null
      auth: null
    }
  | ({ isLoading: false } & (
      | { isAuthenticated: false; account: null; auth: null }
      | { isAuthenticated: true; account: Account; auth: AuthInfo }
    ))
