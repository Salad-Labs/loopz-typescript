import { Account } from "../../core";

export type LoopzAccountHookValue =
  | {
      isLoading: true;
      isAuthenticated: false;
      isLoggingOut: false;
      account: null;
    }
  | ({ isLoading: false } & (
      | { isAuthenticated: false; isLoggingOut: false; account: null }
      | { isAuthenticated: true; isLoggingOut: true; account: null }
      | { isAuthenticated: true; isLoggingOut: false; account: Account }
    ));
