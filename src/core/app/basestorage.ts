export interface BaseStorage {
  disableStorage(): void
  enableStorage(): void
  isStorageEnabled(): boolean
  getDBName(): string
  getDBVersion(): number
  typeOf(): string
  insertBulkSafe(
    tableName:
      | "user"
      | "conversation"
      | "message"
      | "detectivemessagecollector"
      | "detectivemessagequeue",
    items: unknown[]
  ): Promise<void>
  deleteItem(
    tableName:
      | "user"
      | "conversation"
      | "message"
      | "detectivemessagecollector"
      | "detectivemessagequeue",
    key: string,
    value: string | string[]
  ): Promise<void>
  deleteBulk(
    tableName:
      | "user"
      | "conversation"
      | "message"
      | "detectivemessagecollector"
      | "detectivemessagequeue",
    ids: string[]
  ): Promise<void>
  get(
    tableName:
      | "user"
      | "conversation"
      | "message"
      | "detectivemessagecollector"
      | "detectivemessagequeue",
    key: string,
    value: string | string[]
  ): Promise<any>
  truncate(
    tableName:
      | "user"
      | "conversation"
      | "message"
      | "detectivemessagecollector"
      | "detectivemessagequeue"
  ): Promise<void>
}
