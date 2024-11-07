import {
  LocalDBConversation,
  LocalDBMessage,
  LocalDBDetectiveMessageCollector,
  LocalDBDetectiveMessageQueue,
  LocalDBUser,
} from "../../core/app/database"
import { BaseStorage } from "./basestorage"
import { CreateOrConnectDexieArgs } from "../../types/app"
import Dexie, { Table } from "dexie"
import { Serpens } from "../utilities"
import { getSerpensProxy } from "../utilities/getSerpensProxy"
import { GetSerpensProxyOptions } from "../../types/app/core/getserpensproxy"

export class DexieStorage extends Dexie implements BaseStorage {
  //db info
  private _dbName: string
  private _dbVersion: number
  private _enableStorage: boolean = true

  //tables
  migration!: Dexie.Table<{ key: string; value: any }, string>
  user!: Dexie.Table<LocalDBUser, string>
  message!: Dexie.Table<LocalDBMessage, string>
  conversation!: Dexie.Table<LocalDBConversation, string>
  detectivemessagecollector!: Dexie.Table<LocalDBDetectiveMessageCollector>
  detectivemessagequeue!: Dexie.Table<LocalDBDetectiveMessageQueue>

  private constructor(dbName: string, dbVersion: number) {
    super(dbName)

    Dexie.debug = true

    this._dbName = dbName
    this._dbVersion = dbVersion

    this.version(this._dbVersion).stores({
      user: "[did+organizationId]",
      conversation: "[id+userDid], name, description, createdAt",
      message: "[id+userDid], content, origin, userDid, type, createdAt",
      detectivemessagecollector:
        "++id, did, organizationId, conversationId, messageId, order, createdAt",
      detectivemessagequeue:
        "++id, did, organizationId, conversationId, queue, createdAt",
      migration: "key",
    })

    //let's store the current version of the database
    this.on("ready", async () => {
      const dbVersion = (await this.migration.get("dbVersion"))?.value
      if (dbVersion !== this._dbVersion)
        await this.migration.put({ key: "dbVersion", value: this._dbVersion })
    })

    const tableProxyOptions: GetSerpensProxyOptions<typeof Dexie.Promise> = {
      mode: "only",
      keys: [
        "get",
        "count",
        "each",
        "toArray",
        "add",
        "update",
        "put",
        "delete",
        "clear",
        "bulkGet",
        "bulkAdd",
        "bulkPut",
        "bulkUpdate",
        "bulkDelete",
      ],
      PromiseConstructor: Dexie.Promise,
    }

    // * until this, methods are not enqueued
    this.migration = getSerpensProxy(this.migration, tableProxyOptions)
    this.user = getSerpensProxy(this.user, tableProxyOptions)
    this.message = getSerpensProxy(this.message, tableProxyOptions)
    this.conversation = getSerpensProxy(this.conversation, tableProxyOptions)
    this.detectivemessagecollector = getSerpensProxy(
      this.detectivemessagecollector,
      tableProxyOptions
    )
    this.detectivemessagequeue = getSerpensProxy(
      this.detectivemessagequeue,
      tableProxyOptions
    )

    return getSerpensProxy(this, {
      mode: "exclude",
      keys: [
        "disableStorage",
        "enableStorage",
        "getDBName",
        "getDBVersion",
        "typeOf",
        "isStorageEnabled",
      ],
    })
  }

  static async createOrConnect(
    params: CreateOrConnectDexieArgs
  ): Promise<DexieStorage> {
    const instance = new DexieStorage(params.dbName, params.dbVersion)

    return instance
  }

  async get(
    tableName:
      | "user"
      | "conversation"
      | "message"
      | "detectivemessagecollector"
      | "detectivemessagequeue",
    key: string,
    value: string | string[]
  ): Promise<any> {
    if (!(tableName in this)) throw new Error(`Table ${tableName} not found`)
    if (!this._enableStorage) return

    return new Promise((resolve, reject) =>
      this.transaction("r", tableName, () =>
        this[tableName]
          .where(key)
          .equals(value)
          .first()
          .then(resolve)
          .catch(reject)
      ).catch(reject)
    )
  }

  async deleteItem(
    tableName:
      | "user"
      | "conversation"
      | "message"
      | "detectivemessagecollector"
      | "detectivemessagequeue",
    key: string,
    value: string | string[]
  ): Promise<void> {
    if (!(tableName in this)) throw new Error(`Table ${tableName} not found`)
    if (!this._enableStorage) return

    return new Promise((resolve, reject) =>
      this.transaction("rw", tableName, () =>
        this[tableName]
          .where(key)
          .equals(value)
          .delete()
          .then(() => resolve())
          .catch(reject)
      ).catch(reject)
    )
  }

  async deleteBulk(
    tableName:
      | "user"
      | "conversation"
      | "message"
      | "detectivemessagecollector"
      | "detectivemessagequeue",
    ids: string[]
  ): Promise<void> {
    if (!(tableName in this)) throw new Error(`Table ${tableName} not found`)
    if (!this._enableStorage) return

    return new Promise((resolve, reject) =>
      this.transaction("rw", tableName, () =>
        this[tableName].bulkDelete(ids).then(resolve).catch(reject)
      ).catch(reject)
    )
  }

  async query<
    TN extends
      | "user"
      | "conversation"
      | "message"
      | "detectivemessagecollector"
      | "detectivemessagequeue"
  >(
    callback: (db: DexieStorage, table: (typeof this)[TN]) => void,
    tableName: TN
  ): Promise<void> {
    if (!(tableName in this)) throw new Error(`Table ${tableName} not found`)
    if (!this._enableStorage) return

    callback(this, this[tableName])
  }

  async insertBulkSafe(
    tableName:
      | "user"
      | "conversation"
      | "message"
      | "detectivemessagecollector"
      | "detectivemessagequeue",
    items: unknown[]
  ): Promise<void> {
    if (!(tableName in this)) throw new Error(`Table ${tableName} not found`)
    if (!this._enableStorage) return

    const table: Table = this[tableName]

    return new Promise((resolve, reject) =>
      this.transaction("rw", tableName, () =>
        table.bulkPut(items).then(resolve).catch(reject)
      ).catch(reject)
    )
  }

  disableStorage(): void {
    this._enableStorage = false
  }

  enableStorage(): void {
    this._enableStorage = true
  }

  getDBName(): string {
    return this._dbName
  }

  getDBVersion(): number {
    return this._dbVersion
  }

  typeOf(): string {
    return this.constructor.name
  }

  isStorageEnabled(): boolean {
    return this._enableStorage === true
  }

  async truncate(
    tableName:
      | "user"
      | "conversation"
      | "message"
      | "detectivemessagecollector"
      | "detectivemessagequeue"
  ): Promise<void> {
    if (!(tableName in this)) throw new Error(`Table ${tableName} not found`)
    if (!this._enableStorage) return

    this[tableName].clear()
  }
}
