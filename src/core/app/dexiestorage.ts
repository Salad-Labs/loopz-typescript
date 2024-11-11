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
      const dbVersion = await new Promise<
        { key: string; value: any } | undefined
      >((resolve, reject) => {
        Serpens.addAction(() => {
          this.migration.get("dbVersion").then(resolve).catch(reject)
        })
      })

      if (dbVersion?.value !== this._dbVersion) {
        await new Promise((resolve, reject) => {
          Serpens.addAction(() => {
            this.migration
              .put({
                key: "dbVersion",
                value: this._dbVersion,
              })
              .then(resolve)
              .catch(reject)
          })
        })
      }
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

    return new Promise((resolve, reject) => {
      Serpens.addAction(() => {
        this[tableName]
          .where(key)
          .equals(value)
          .first()
          .then(resolve)
          .catch(reject)
      })
    })
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
  ): Promise<number> {
    if (!(tableName in this)) throw new Error(`Table ${tableName} not found`)
    if (!this._enableStorage) return -1

    return new Promise((resolve, reject) => {
      Serpens.addAction(() => {
        this[tableName]
          .where(key)
          .equals(value)
          .delete()
          .then(resolve)
          .catch(reject)
      })
    })
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

    return new Promise((resolve, reject) => {
      Serpens.addAction(() => {
        this[tableName].bulkDelete(ids).then(resolve).catch(reject)
      })
    })
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

    return new Promise((resolve, reject) => {
      Serpens.addAction(() => {
        table.bulkPut(items).then(resolve).catch(reject)
      })
    })
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

    return new Promise((resolve, reject) => {
      Serpens.addAction(() => {
        this[tableName].clear().then(resolve).catch(reject)
      })
    })
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
}
