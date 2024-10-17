import { Account } from "../../core"

export type LoopzAccountHookValue =
  | {
      isLoading: true
      isAuthenticated: false
      account: null
    }
  | ({ isLoading: false } & (
      | { isAuthenticated: true; account: null }
      | { isAuthenticated: true; account: Account }
    ))
