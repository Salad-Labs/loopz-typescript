import { DexieStorage } from "./core/app"
import {
  CLIENT_DB_NAME,
  CLIENT_DB_VERSION_LOCALSTORAGE_PROPERTY_NAME,
} from "./constants/app"
import { v4 as uuid } from "uuid"
import { Auth } from "./auth"
import { Chat } from "./chat"
import { Oracle } from "./oracle"
import { Post } from "./post"
import { Trade } from "./trade"
import { LoopzConfig } from "./types/app/loopzconfig"
import { PrivyClientConfig } from "@privy-io/react-auth"
import { PrivyAdapter } from "./adapter"
import { Maybe } from "./types"

export class Loopz {
  private static _instance: Loopz
  private static _randomLsname: string

  private static _auth: Auth
  private static _chat: Chat
  private static _oracle: Oracle
  private static _post: Post
  private static _trade: Trade

  private static _apiKey: string

  private static _privyAppId: string

  private static _privyClientConfig: PrivyClientConfig

  private static _storage: DexieStorage

  private static _privyAdapter: Maybe<PrivyAdapter> = null

  private constructor(config: LoopzConfig, runAdapter?: boolean) {
    Loopz._apiKey = config.apiKey
    Loopz._privyAppId = config.privyAppId
    Loopz._privyClientConfig = config.privyClientConfig
    Loopz._storage = config.storage
    Loopz._randomLsname = `loopz_${uuid()}`

    if (runAdapter === true || typeof runAdapter === "undefined") {
      if (typeof window === "undefined")
        throw new Error("Adapter must be runned only in desktop environments.")
      if (typeof window !== "undefined")
        Loopz._privyAdapter = new PrivyAdapter({
          appId: config.privyAppId,
          options:
            typeof window === "undefined"
              ? undefined
              : config.privyClientConfig,
        })
    }

    Loopz._oracle = new Oracle({
      apiKey: config.apiKey,
    })
    Loopz._post = new Post({
      apiKey: config.apiKey,
    })
    Loopz._trade = new Trade({
      apiKey: config.apiKey,
    })
    Loopz._chat = new Chat({
      apiKey: Loopz._apiKey,
      storage: config.storage,
    })
    Loopz._auth = new Auth({
      apiKey: config.apiKey,
      privyAppId: config.privyAppId,
      privyConfig: config.privyClientConfig,
      oracle: Loopz._oracle,
      post: Loopz._post,
      trade: Loopz._trade,
      chat: Loopz._chat,
      storage: config.storage,
    })

    if (Loopz._privyAdapter)
      Loopz._privyAdapter.render(Loopz._auth, Loopz._trade)
  }

  private static async createOrConnectToStorage(): Promise<DexieStorage> {
    if (!window.localStorage)
      throw new Error(
        "localStorage is not supported. Use a browser that provides the window.localStorage feature."
      )

    try {
      localStorage.setItem(Loopz._randomLsname, "")
      localStorage.removeItem(Loopz._randomLsname)
    } catch (error) {
      throw new Error(
        "localStorage is not supported. Use a browser that provides the window.localStorage feature."
      )
    }

    const DB_VERSION = localStorage.getItem(
      CLIENT_DB_VERSION_LOCALSTORAGE_PROPERTY_NAME
    )

    try {
      return DexieStorage.createOrConnect({
        dbName: CLIENT_DB_NAME,
        dbVersion: DB_VERSION ? Number(DB_VERSION) : 0,
      })
    } catch (error) {
      console.log(error)
      throw new Error(
        "Error during the creation of the local database. See the console for more info."
      )
    }
  }

  static async boot(
    config: Omit<LoopzConfig, "storage">,
    options?: { runAdapter?: boolean; enableStorage?: boolean }
  ): Promise<Loopz> {
    if (!Loopz._instance) {
      let runAdapter = undefined
      let enableStorage = undefined

      if (options && "runAdapter" in options) runAdapter = options.runAdapter
      if (options && "enableStorage" in options)
        enableStorage = options.enableStorage

      const storage = await Loopz.createOrConnectToStorage()

      //storage is enabled by default
      if (typeof enableStorage !== "undefined" && enableStorage === false)
        storage.disableStorage()

      Loopz._instance = new Loopz(
        {
          ...config,
          storage,
        },
        runAdapter
      )
    }

    return Loopz._instance
  }

  init(): { auth: Auth; trade: Trade; post: Post; oracle: Oracle; chat: Chat } {
    return {
      auth: Loopz._auth,
      trade: Loopz._trade,
      post: Loopz._post,
      oracle: Loopz._oracle,
      chat: Loopz._chat,
    }
  }
}
