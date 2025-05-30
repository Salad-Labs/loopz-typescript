import { AuthEvents } from "../../types"

export interface AuthInternalEvents {
  on(eventName: AuthEvents, callback: Function): void
  off(eventName: AuthEvents, callback?: Function): void
}
