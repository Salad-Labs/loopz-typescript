import { Account } from "../../core"

export type LoopzAuthContextValue =
  | {
      isLoading: true
      isAuthenticated: false
      account: null
    }
  | ({ isLoading: false } & (
      | { isAuthenticated: false; account: null }
      | { isAuthenticated: true; account: Account }
    ))
