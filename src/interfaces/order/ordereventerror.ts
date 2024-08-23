/**
 * Represents an error event in the TradeClient with a specific event name.
 * @interface OrderEventError - The type of event that caused the error.
 */
import { OrderError } from "./ordererror"

export interface OrderEventError<EventName extends keyof OrderError> {
  /**
   * @property {any} error - The error object associated with the event.
   */
  error: any
  /**
   * @property {"waitError" | "ApiError" | OrderError[EventName]} typeError - The type of error that occurred.
   */
  typeError: "waitError" | "ApiError" | OrderError[EventName]
}
