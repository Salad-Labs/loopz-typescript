/**
 * Interface that maps order client error types to their corresponding strings.
 * @interface OrderError
 */
export interface OrderError {
  execOrderTransactionError: "execOrderTransactionError"
  execOrderError: "execOrderError"
  cancelOrderTransactionError: "cancelOrderTransactionError"
  cancelOrderError: "cancelOrderError"
}
