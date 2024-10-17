import { DexieStorage } from "./core/app"
import {
  CLIENT_DB_NAME,
  CLIENT_DB_VERSION_LOCALSTORAGE_PROPERTY_NAME,
} from "./constants/app"
import { v4 as uuid } from "uuid"
import { Auth } from "./auth"
import { Chat } from "./chat"
import { Oracle } from "./oracle"
import { Proposal } from "./proposal"
import { Order } from "./order"
import { Notification } from "./notification"
import { LoopzConfig } from "./types/app/loopzconfig"
import { PrivyClientConfig } from "@privy-io/react-auth"
import { PrivyAdapter } from "./adapter/privyadapter"
import { Maybe } from "./types"

export class Loopz {
  private static _instance: Loopz
  private static _randomLsname: string

  private static _auth: Auth
  private static _chat: Chat
  private static _oracle: Oracle
  private static _proposal: Proposal
  private static _order: Order
  private static _notification: Notification

  private static _apiKey: string

  private static _privyAppId: string

  private static _privyClientConfig: PrivyClientConfig

  private static _storage: DexieStorage

  private static _privyAdapter: Maybe<PrivyAdapter> = null

  private static _devMode: boolean = false

  private constructor(
    config: LoopzConfig,
    runAdapter?: boolean,
    devMode?: boolean
  ) {
    Loopz._apiKey = config.apiKey
    Loopz._privyAppId = config.privyAppId
    Loopz._privyClientConfig = config.privyClientConfig
    Loopz._storage = config.storage
    Loopz._randomLsname = `loopz_${uuid()}`

    if (runAdapter === true || typeof runAdapter === "undefined") {
      if (typeof window !== "undefined")
        Loopz._privyAdapter = new PrivyAdapter({
          appId: config.privyAppId,
          options:
            typeof window === "undefined"
              ? undefined
              : config.privyClientConfig,
        })
    }

    if (typeof devMode !== "undefined" && devMode === true)
      Loopz._devMode = true

    Loopz._oracle = new Oracle({
      apiKey: config.apiKey,
      devMode: Loopz._devMode,
    })
    Loopz._proposal = new Proposal({
      apiKey: config.apiKey,
      devMode: Loopz._devMode,
    })
    Loopz._order = new Order({
      apiKey: config.apiKey,
      devMode: Loopz._devMode,
    })
    Loopz._chat = new Chat({
      apiKey: Loopz._apiKey,
      storage: config.storage,
      devMode: Loopz._devMode,
    })
    Loopz._notification = new Notification({
      apiKey: config.apiKey,
      devMode: Loopz._devMode,
    })
    Loopz._auth = new Auth({
      apiKey: config.apiKey,
      privyAppId: config.privyAppId,
      privyConfig: config.privyClientConfig,
      storage: config.storage,
      devMode: Loopz._devMode,
    })

    //set the references between the object, the target is making objects able to know each other
    Loopz._auth.setLoopzObjectsReference({
      auth: Loopz._auth,
      oracle: Loopz._oracle,
      proposal: Loopz._proposal,
      order: Loopz._order,
      chat: Loopz._chat,
      notification: Loopz._notification,
    })
    Loopz._oracle.setLoopzObjectsReference({
      auth: Loopz._auth,
      oracle: Loopz._oracle,
      proposal: Loopz._proposal,
      order: Loopz._order,
      chat: Loopz._chat,
      notification: Loopz._notification,
    })
    Loopz._proposal.setLoopzObjectsReference({
      auth: Loopz._auth,
      oracle: Loopz._oracle,
      proposal: Loopz._proposal,
      order: Loopz._order,
      chat: Loopz._chat,
      notification: Loopz._notification,
    })
    Loopz._order.setLoopzObjectsReference({
      auth: Loopz._auth,
      oracle: Loopz._oracle,
      proposal: Loopz._proposal,
      order: Loopz._order,
      chat: Loopz._chat,
      notification: Loopz._notification,
    })
    Loopz._notification.setLoopzObjectsReference({
      auth: Loopz._auth,
      oracle: Loopz._oracle,
      proposal: Loopz._proposal,
      order: Loopz._order,
      chat: Loopz._chat,
      notification: Loopz._notification,
    })
    Loopz._chat.setLoopzObjectsReference({
      auth: Loopz._auth,
      oracle: Loopz._oracle,
      proposal: Loopz._proposal,
      order: Loopz._order,
      chat: Loopz._chat,
      notification: Loopz._notification,
    })

    if (Loopz._privyAdapter)
      Loopz._privyAdapter.render(Loopz._auth, Loopz._order)
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

    let DB_VERSION = localStorage.getItem(
      CLIENT_DB_VERSION_LOCALSTORAGE_PROPERTY_NAME
    )
      ? localStorage.getItem(CLIENT_DB_VERSION_LOCALSTORAGE_PROPERTY_NAME)
      : "1"

    try {
      return DexieStorage.createOrConnect({
        dbName: CLIENT_DB_NAME,
        dbVersion: Number(DB_VERSION),
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
    options?: {
      devMode?: boolean
      runAdapter?: boolean
      enableStorage?: boolean
    }
  ): Promise<Loopz> {
    if (!Loopz._instance) {
      let runAdapter = undefined
      let enableStorage = undefined
      let devMode = undefined

      if (options && "runAdapter" in options) runAdapter = options.runAdapter
      if (options && "enableStorage" in options)
        enableStorage = options.enableStorage
      if (options && "devMode" in options) devMode = options.devMode

      const storage = await Loopz.createOrConnectToStorage()

      //storage is enabled by default
      if (typeof enableStorage !== "undefined" && enableStorage === false)
        storage.disableStorage()

      Loopz._instance = new Loopz(
        {
          ...config,
          storage,
        },
        runAdapter,
        devMode
      )
    }

    return Loopz._instance
  }

  init(): {
    auth: Auth
    order: Order
    proposal: Proposal
    oracle: Oracle
    chat: Chat
    notification: Notification
  } {
    Loopz._auth.on("__tryRebuildAccountOnRefresh", async () => {
      await Loopz._auth.recoverAccountFromLocalDB()
    })

    return {
      auth: Loopz._auth,
      order: Loopz._order,
      proposal: Loopz._proposal,
      oracle: Loopz._oracle,
      chat: Loopz._chat,
      notification: Loopz._notification,
    }
  }
}
