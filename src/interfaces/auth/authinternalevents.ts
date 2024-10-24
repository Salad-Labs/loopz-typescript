import { AuthEvents } from "@src/types"

export interface AuthInternalEvents {
  on(eventName: AuthEvents, callback: Function): void
  off(eventName: AuthEvents, callback?: Function): void
}
