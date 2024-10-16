import { AuthEvents } from "@src/types";

export interface AuthInternalEvents {
  _emit(eventName: AuthEvents, params?: any): void;
  on(eventName: AuthEvents, callback: Function): void;
  off(eventName: AuthEvents, callback?: Function): void;
}
