import {
  LocalDBConversation,
  LocalDBMessage,
  LocalDBDetectiveMessageCollector,
  LocalDBDetectiveMessageQueue,
  LocalDBUser,
} from "@src/core/app/database"
import { BaseStorage } from "./basestorage"
import { CreateOrConnectDexieArgs } from "../../types/app"
import Dexie, { Table } from "dexie"

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
    return new Promise(async (resolve, reject) => {
      try {
        if (!this._enableStorage) return

        this.transaction("r", tableName, async () => {
          if (tableName === "user") {
            resolve(await this.user.where(key).equals(value).first())
          } else if (tableName === "conversation") {
            resolve(await this.conversation.where(key).equals(value).first())
          } else if (tableName === "message") {
            resolve(await this.message.where(key).equals(value).first())
          } else if (tableName === "detectivemessagecollector") {
            resolve(
              await this.detectivemessagecollector
                .where(key)
                .equals(value)
                .first()
            )
          } else if (tableName === "detectivemessagequeue") {
            resolve(
              await this.detectivemessagequeue.where(key).equals(value).first()
            )
          } else {
            reject(
              `${tableName} argument given is wrong. No table exists with that name.`
            )
          }
        })
      } catch (error) {
        reject(error)
      }
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
  ): Promise<void> {
    if (!this._enableStorage) return
    return new Promise(async (resolve, reject) => {
      this.transaction("rw", tableName, async () => {
        if (tableName === "conversation")
          await this.conversation.where(key).equals(value).delete()
        else if (tableName === "user")
          await this.user.where(key).equals(value).delete()
        else if (tableName === "message")
          await this.message.where(key).equals(value).delete()
        else if (tableName === "detectivemessagecollector")
          await this.detectivemessagecollector.where(key).equals(value).delete()
        else if (tableName === "detectivemessagequeue")
          await this.detectivemessagequeue.where(key).equals(value).delete()
        resolve()
      }).catch((error) => {
        reject(error)
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
    if (!this._enableStorage) return
    return new Promise(async (resolve, reject) => {
      this.transaction("rw", tableName, async () => {
        if (tableName === "conversation") this.conversation.bulkDelete(ids)
        else if (tableName === "user") this.user.bulkDelete(ids)
        else if (tableName === "message") this.message.bulkDelete(ids)
        else if (tableName === "detectivemessagecollector")
          this.detectivemessagecollector.bulkDelete(ids)
        else if (tableName === "detectivemessagequeue")
          this.detectivemessagequeue.bulkDelete(ids)
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  }

  async query<T>(
    callback: (db: Dexie, table: Table<T, string, T>) => void,
    tableName:
      | "user"
      | "conversation"
      | "message"
      | "detectivemessagecollector"
      | "detectivemessagequeue"
  ): Promise<void> {
    if (!this._enableStorage) return
    if (tableName === "user") callback(this, this.user as Table<T, string, T>)
    else if (tableName === "conversation")
      callback(this, this.conversation as Table<T, string, T>)
    else if (tableName === "message")
      callback(this, this.message as Table<T, string, T>)
    else if (tableName === "detectivemessagecollector")
      callback(this, this.detectivemessagecollector as Table<T, string, T>)
    else if (tableName === "detectivemessagequeue")
      callback(this, this.detectivemessagequeue as Table<T, string, T>)
  }

  async insertBulkSafe<T>(
    tableName:
      | "user"
      | "conversation"
      | "message"
      | "detectivemessagecollector"
      | "detectivemessagequeue",
    items: T[]
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.transaction("rw", tableName, async () => {
        if (tableName === "conversation")
          await this.conversation.bulkPut(items as LocalDBConversation[])
        else if (tableName === "user")
          await this.user.bulkPut(items as LocalDBUser[])
        else if (tableName === "message")
          await this.message.bulkPut(items as LocalDBMessage[])
        else if (tableName === "detectivemessagecollector")
          await this.detectivemessagecollector.bulkPut(
            items as LocalDBDetectiveMessageCollector[]
          )
        else if (tableName === "detectivemessagequeue")
          await this.detectivemessagequeue.bulkPut(
            items as LocalDBDetectiveMessageQueue[]
          )

        resolve()
      }).catch((error) => {
        reject(error)
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

  getTable<T>(
    tableName:
      | "user"
      | "conversation"
      | "message"
      | "detectivemessagecollector"
      | "detectivemessagequeue"
  ) {
    if (tableName === "user") return this.user as T
    else if (tableName === "conversation") return this.conversation as T
    else if (tableName === "message") return this.message as T
    else if (tableName === "detectivemessagecollector")
      return this.detectivemessagecollector as T
    else if (tableName === "detectivemessagequeue")
      return this.detectivemessagequeue as T

    throw new Error(`Table ${tableName} not found`)
  }

  async truncate(
    tableName:
      | "user"
      | "conversation"
      | "message"
      | "detectivemessagecollector"
      | "detectivemessagequeue"
  ): Promise<void> {
    if (!this._enableStorage) return

    if (tableName === "user") {
      await this.user.clear()
    } else if (tableName === "conversation") {
      await this.conversation.clear()
    } else if (tableName === "message") {
      await this.message.clear()
    } else if (tableName === "detectivemessagecollector") {
      await this.detectivemessagecollector.clear()
    } else if (tableName === "detectivemessagequeue") {
      await this.detectivemessagequeue.clear()
    }

    throw new Error(`Table ${tableName} not found`)
  }
}
