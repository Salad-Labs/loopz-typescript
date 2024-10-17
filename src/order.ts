import { Seaport } from "@opensea/seaport-js"
import { ItemType } from "@opensea/seaport-js/lib/constants"
import { CreateOrderInput } from "@opensea/seaport-js/lib/types"
import { TOKEN_CONSTANTS } from "./constants/base/tokenconstants"
import { Client } from "./core/client"
import { ApiKeyAuthorized, Asset, Maybe, Network } from "./types/base"
import {
  SeaportFee,
  MultiSigWallet,
  Fee,
  OrderCreated,
  OrderConfig,
  PartialOrder,
  OrderListResponse,
} from "./types/order"
import { ApiResponse } from "./types/base/apiresponse"
import { Account } from "./core"
import { ethers } from "ethers"
import { Web3Provider } from "@ethersproject/providers"
import { ConnectedWallet } from "@privy-io/react-auth"
import { IOrder } from "."

/**
 * Order class that handles interactions with the OpenSea trading platform.
 * @class Order
 * @extends Client
 */

export class Order extends Client {
  /**
   * @property {Maybe<ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider>} _provider - The provider instance.
   */
  private _provider: Maybe<Web3Provider> = null
  /**
   * @property {Maybe<Seaport>} _seaport - The Seaport instance.
   */
  private _seaport: Maybe<Seaport> = null
  /**
   * @property {number} _blocksNumberConfirmationRequired - The number of block confirmations required.
   */
  private _blocksNumberConfirmationRequired: number
  /**
   * @property {number} _MIN_BLOCKS_REQUIRED - The minimum number of block confirmations required
   */
  private _MIN_BLOCKS_REQUIRED: number = 3

  private _eventsCallbacks: Array<{
    eventName:
      | "__onAccountReady"
      | "ready"
      | "onFinalizeError"
      | "onFulfillOrder"
      | "onExecuteAllActions"
      | "onExecuteAllActionsError"
      | "onFulfillOrderError"
      | "onCancelOrders"
      | "onCancelOrdersMined"
      | "onCancelOrdersError"
    callbacks: Array<Function>
  }> = []

  private _initialized: boolean = false

  /**
   * Constructor for a class that requires an API key and optionally a number of blocks for confirmation.
   * @param {object} config - Configuration object containing API key and optional blocks number confirmation.
   * @param {string} config.apiKey - The API key for authorization.
   * @param {number} [config.blocksNumberConfirmationRequired] - The number of blocks required for confirmation.
   * @throws {Error} Throws an error if blocksNumberConfirmationRequired is less than 1 or if apiKey is missing or invalid.
   */
  constructor(config: ApiKeyAuthorized) {
    super(config.devMode)

    this._blocksNumberConfirmationRequired = this._MIN_BLOCKS_REQUIRED
    this._apiKey = config.apiKey
  }

  /**
   * Asynchronously fetches the platform Gnosis multisig wallet from the backend API.
   * @returns {Promise<Maybe<<MultiSigWallet>>>} A promise that resolves to the multisig wallet object if successful,
   * or null if there was an error or no data was returned in the response.
   */
  private async _getGnosis(): Promise<Maybe<MultiSigWallet>> {
    if (!this._account) return null

    try {
      const { response } = await this._fetch<ApiResponse<MultiSigWallet>>(
        `${this.backendUrl()}/wallet/multisig/${this._account.getCurrentNetwork(
          false
        )}`,
        {
          method: "GET",
          headers: {
            "x-api-key": `${this._apiKey}`,
            Authorization: `Bearer ${this._authToken}`,
          },
        }
      )

      if (!response) return null

      const { data } = response

      return data[0]
    } catch (error) {
      console.warn(error)
    }

    return null
  }

  /**
   * Asynchronously fetches platform fees from the backend API.
   * @returns A Promise that resolves to a Maybe<Fee> object.
   */
  private async _getMasterFee(): Promise<Maybe<Fee>> {
    if (!this._account) return null

    try {
      const { response } = await this._fetch<ApiResponse<Fee>>(
        `${this.backendUrl()}/fee/platform/${this._account.getCurrentNetwork(
          false
        )}`,
        {
          method: "GET",
          headers: {
            "x-api-key": `${this._apiKey}`,
            Authorization: `Bearer ${this._authToken}`,
          },
        }
      )

      if (!response) return null

      const { data } = response

      return data[0]
    } catch (error) {
      console.warn(error)
    }

    return null
  }

  /**
   * Analyzes the order initialization object to extract offer and consideration details.
   * @param {CreateOrderInput} orderInit - The order initialization object.
   * @returns An object containing offer and consideration details.
   */
  private _analyzeOrder(orderInit: CreateOrderInput) {
    if (!orderInit || orderInit.constructor.name !== "Object")
      throw new Error("Invalid argument")

    const offer = {
        hasNFT: false,
        hasToken: false,
        NFTs: 0,
        NFTcollections: [] as Array<string>,
        NFTcollectionsIdentifiers: {} as Record<string, Array<string>>,
      },
      consideration = { ...offer }

    if (
      "offer" in orderInit &&
      Array.isArray(orderInit.offer) &&
      orderInit.offer.length
    )
      for (const o of orderInit.offer.filter(
        (rawOffer) =>
          rawOffer?.itemType !== undefined && rawOffer.itemType !== null
      ))
        switch (o.itemType) {
          case ItemType.ERC1155:
          case ItemType.ERC721:
            offer.hasNFT = true
            offer.NFTs++

            if (!offer.NFTcollections.includes(o.token))
              offer.NFTcollections.push(o.token)

            offer.NFTcollectionsIdentifiers[o.token] = [
              ...(offer.NFTcollectionsIdentifiers[o.token] ?? []),
              o.identifier,
            ]

            break
          case ItemType.ERC20:
            offer.hasToken = true
        }

    if (
      "consideration" in orderInit &&
      Array.isArray(orderInit.consideration) &&
      orderInit.consideration.length
    )
      for (const c of orderInit.consideration)
        if ("itemType" in c)
          switch (c.itemType) {
            case ItemType.ERC1155:
            case ItemType.ERC721:
              consideration.hasNFT = true
              consideration.NFTs++

              if (!consideration.NFTcollections.includes(c.token))
                consideration.NFTcollections.push(c.token)

              consideration.NFTcollectionsIdentifiers[c.token] = [
                ...(consideration.NFTcollectionsIdentifiers[c.token] ?? []),
                c.identifier,
              ]

              break
            case ItemType.ERC20:
              consideration.hasToken = true
              break
            case ItemType.NATIVE:
              consideration.hasToken = true
          }
        else consideration.hasToken = true

    return {
      offer,
      consideration,
    }
  }

  /**
   * Adds the master fees to the given order input.
   * @param {CreateOrderInput} orderInit - The initial order input to add platform fees to.
   * @returns {Promise<CreateOrderInput>} The order input with platform fees added.
   */
  private async _addMasterFee(
    orderInit: CreateOrderInput
  ): Promise<CreateOrderInput> {
    const orderTypes = this._analyzeOrder(orderInit)
    const masterFee: Maybe<Fee> = await this._getMasterFee()
    const gnosis: Maybe<MultiSigWallet> = await this._getGnosis()

    let flatFee: string = ""
    let basisPoints: number = 0
    let gnosisRecipient = ""
    let checkFee: boolean = true

    if (masterFee) {
      if (masterFee.flatFee) flatFee = masterFee.flatFee
      else checkFee = false
      if (masterFee.percentageFee) basisPoints = masterFee.percentageFee
      else checkFee = false
    } else {
      flatFee = "0"
      basisPoints = 50
    }

    if (!checkFee) {
      flatFee = "0"
      basisPoints = 50
    }

    if (gnosis) gnosisRecipient = gnosis.multisigAddress

    if (
      orderTypes.consideration.hasNFT &&
      !orderTypes.consideration.hasToken &&
      orderTypes.offer.hasNFT &&
      !orderTypes.offer.hasToken
    ) {
      return {
        ...orderInit,
        offer: orderInit.offer,
        consideration: [
          ...orderInit.consideration,
          {
            recipient: gnosisRecipient,
            itemType: TOKEN_CONSTANTS.NATIVE as any,
            token: ethers.constants.AddressZero,
            amount: ethers.utils.parseEther(flatFee).toString(),
            identifier: "0",
          },
        ],
      }
    }

    if (
      orderTypes.consideration.hasToken &&
      orderTypes.offer.hasNFT &&
      orderTypes.offer.NFTcollections.length > 0
    ) {
      if (
        !("fees" in orderInit) ||
        typeof orderInit === "undefined" ||
        (Array.isArray(orderInit.fees) && orderInit.fees.length === 0)
      )
        orderInit.fees = [
          {
            recipient: gnosisRecipient,
            basisPoints,
          },
        ]
      else if (Array.isArray(orderInit.fees) && orderInit.fees.length > 0) {
        orderInit.fees.push({
          recipient: gnosisRecipient,
          basisPoints,
        })
      }
    }
    return orderInit
  }

  isInitialized(): boolean {
    return this._initialized === true
  }

  async init(wallet: ConnectedWallet) {
    try {
      if (!this._account) throw new Error("Account is not initialized.")

      this._provider = await wallet.getEthersProvider()
      this._seaport = new Seaport(this._provider, { seaportVersion: "1.5" })
      this._initialized = true
    } catch (error) {
      console.log(error)
      this._initialized = false
    }
  }

  /**
   * Emits an event with the specified name and parameters to all registered callbacks for that event.
   * @param {string} event - The name of the event to emit.
   * @param {any} [params] - The parameters to pass to the event callbacks.
   * @returns None
   */
  _emit(
    event:
      | "__onAccountReady"
      | "ready"
      | "onFinalizeError"
      | "onFulfillOrder"
      | "onExecuteAllActions"
      | "onExecuteAllActionsError"
      | "onFulfillOrderError"
      | "onCancelOrders"
      | "onCancelOrdersMined"
      | "onCancelOrdersError",
    params?: any
  ) {
    const item = this._eventsCallbacks.find((item) => {
      return item.eventName === event
    })

    if (item) for (const cb of item.callbacks) cb(params as any)
  }

  on(
    eventName:
      | "__onAccountReady"
      | "ready"
      | "onFinalizeError"
      | "onFulfillOrder"
      | "onExecuteAllActions"
      | "onExecuteAllActionsError"
      | "onFulfillOrderError"
      | "onCancelOrders"
      | "onCancelOrdersMined"
      | "onCancelOrdersError",
    callback: Function,
    onlyOnce?: boolean
  ) {
    const index = this._eventsCallbacks.findIndex((item) => {
      return item.eventName === eventName
    })

    if (index > -1 && onlyOnce === true) return

    if (index > -1 && !onlyOnce)
      this._eventsCallbacks[index].callbacks.push(callback)

    this._eventsCallbacks.push({
      eventName,
      callbacks: [callback],
    })
  }

  /**
   * Unsubscribes a callback function from a specific event.
   * @param {"__onAccountReady" | "onFinalizeError"} eventName - The name of the event to unsubscribe from.
   * @returns None
   * @throws {Error} If the event is not supported or the callback is not a function.
   */
  off(eventName: "__onAccountReady" | "onFinalizeError") {
    const item = this._eventsCallbacks.find((eventItem) => {
      return eventItem.eventName === eventName
    })

    if (item) item.callbacks = []
  }

  /**
   * Set the block numbers to wait in which consider a transaction mined by the create, cancel and finalize methods.
   * @param {number} blocksNumberConfirmationRequired - The number of blocks required for confirmation.
   * @throws {Error} If blocksNumberConfirmationRequired is less than 1.
   */
  setBlocksNumberConfirmationRequired(
    blocksNumberConfirmationRequired: number
  ) {
    if (blocksNumberConfirmationRequired < 1)
      throw new Error(
        "blocksNumberConfirmationRequired cannot be lower than one."
      )

    this._blocksNumberConfirmationRequired = blocksNumberConfirmationRequired
  }

  /**
   * Create an order instance with the given maker and taker assets, along with additional parameters.
   * @param {{Array<Asset>; address: string}} participantOne - The assets offered by the maker.
   * @param {{Array<Asset>; address: string}} participantTwo - The assets desired by the taker.
   * @param {number} [end=0] - The end time for the order.
   * @param {Array<SeaportFee>} [fees] - Optional fees for the order.
   * @param {string} proposalId - The ID of the proposal.
   */
  async create(
    participantOne: { assets: Array<Asset>; address: string },
    participantTwo: { assets: Array<Asset>; address: string },
    end: number = 0,
    fees: Array<SeaportFee> = [],
    proposalId?: string
  ): Promise<Maybe<OrderCreated>> {
    try {
      if (!this._account) throw new Error("An account must be initialized.")
      if (!this._provider || !this._seaport)
        throw new Error("init() must be called to initialize the client.")
      if (end < 0) throw new Error("end cannot be lower than zero.")

      if (
        "assets" in participantOne &&
        participantOne.assets &&
        participantOne.assets.length > 0
      ) {
        //seaport supports erc20 tokens in the offer array object but platform not,
        //so we throw an error if someone try to place tokens in the offer
        const erc20 = participantOne.assets.find((asset) => {
          return asset.itemType === TOKEN_CONSTANTS["ERC20"]
        })

        if (erc20)
          throw new Error("You cannot add an ERC20 token in the maker assets.")

        const token = participantOne.assets.find((asset) => {
          return asset.itemType === TOKEN_CONSTANTS["NATIVE"]
        })

        if (token)
          throw new Error("You cannot add NATIVE token in the maker assets.")
      }

      // Retrieve the maker address
      const [addressMaker] = await this._provider.listAccounts()

      const makerAssets = participantOne.assets?.map((asset) => {
        return {
          ...asset,
          recipient: asset.recipient?.toLowerCase(),
          token: asset.token?.toLowerCase(),
        }
      })
      const takerAssets = participantTwo.assets?.map((asset) => {
        return {
          ...asset,
          recipient: asset.recipient?.toLowerCase(),
          token: asset.token?.toLowerCase(),
        }
      })

      const orderInit = await this._addMasterFee({
        offer: [...(makerAssets ?? [])].map(
          (asset) =>
            ({
              ...asset,
              itemType:
                typeof asset.itemType === "string"
                  ? TOKEN_CONSTANTS[asset.itemType]
                  : asset.itemType,
            } as { itemType: ItemType } & typeof asset)
        ),
        consideration: [...(takerAssets ?? [])].map(
          (asset) =>
            ({
              ...asset,
              itemType:
                typeof asset.itemType === "string"
                  ? TOKEN_CONSTANTS[asset.itemType]
                  : asset.itemType,
              recipient: asset.recipient ? asset.recipient : addressMaker,
            } as { itemType: ItemType } & typeof asset)
        ),
        zone: participantTwo.address,
        endTime: Math.floor(
          new Date().setDate(new Date().getDate() + end) / 1000
        ).toString(), // days in seconds (UNIX timestamp)
        fees,
        restrictedByZone: true,
      })

      const { executeAllActions } = await this._seaport.createOrder(
        orderInit,
        addressMaker
      )

      const order = await executeAllActions()
      const orderHash = this._seaport.getOrderHash(order.parameters)

      const { response } = await this._fetch<ApiResponse<{ orderId: number }>>(
        `${this.backendUrl()}/order/create`,
        {
          method: "POST",
          body: {
            network: `${this._account.getCurrentNetwork(false)}`,
            orderInit,
            order: {
              orderHash,
              orderType: order.parameters.orderType,
              ...order,
            },
            proposalId,
          },
          headers: {
            "x-api-key": `${this._apiKey}`,
            Authorization: `Bearer ${this._authToken}`,
          },
        }
      )

      if (!response || !response.data)
        throw new Error(
          "Order is created, but the system was not able to store it."
        )

      const { orderId } = response.data[0]

      return { hash: orderHash, orderId, ...order }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  /**
   * Finalizes a order by fetching order details, executing the order, and handling transaction events.
   * @param {string} orderId - The ID of the trade to be finalized.
   * @returns None
   */
  async finalize(orderId: string) {
    try {
      if (!this._account) throw new Error("Account must be initialized.")
      if (!this._seaport)
        throw new Error("init() must be called to initialize the client.")

      const { response } = await this._fetch<ApiResponse<IOrder>>(
        `${this.backendUrl()}/order/${this._account.getCurrentNetwork(
          false
        )}/${orderId}`,
        {
          method: "GET",
          headers: {
            "x-api-key": `${this._apiKey}`,
            Authorization: `Bearer ${this._authToken}`,
          },
        }
      )

      if (!response || !response.data) throw new Error("response data is empty")

      const { data: orderDetail } = response
      const data: IOrder = orderDetail[0]
      const parameters = data.parameters!.order.parameters
      const taker = data.parameters!.addressTaker
      const order: PartialOrder = {
        hash: data.parameters!.order.orderHash,
        parameters: parameters,
        signature: data.parameters!.order.signature,
      }

      try {
        const { executeAllActions } = await this._seaport.fulfillOrder({
          order,
          accountAddress: taker,
        })
        this._emit("onFulfillOrder")

        try {
          const transact = await executeAllActions()
          const receipt = await transact.wait(this._MIN_BLOCKS_REQUIRED)

          this._emit("onExecuteAllActions", { receipt })
        } catch (error) {
          return this._emit("onExecuteAllActionsError", {
            error,
            typeError: "waitError",
          })
        }
      } catch (error) {
        this._emit("onFulfillOrderError", {
          error,
          typeError: "execOrderTransactionError",
        })
      }
    } catch (error) {
      this._emit("onFinalizeError", {
        error,
        typeError: "ApiError",
      })
    }
  }

  /**
   * Cancel an order with the given order ID.
   * @param {string} orderId - The ID of the order to cancel.
   * @param {number} [gasLimit=2000000] - The gas limit for the transaction.
   * @param {Maybe<string>} [gasPrice=null] - The gas price for the transaction.
   * @returns None
   */
  async cancel(
    orderId: string,
    gasLimit: number = 2000000,
    gasPrice: Maybe<string> = null
  ) {
    try {
      if (!this._account) throw new Error("network must be defined.")
      if (!this._seaport)
        throw new Error("init() must be called to initialize the client.")

      const { response } = await this._fetch<ApiResponse<IOrder>>(
        `${this.backendUrl()}/order/${this._account.getCurrentNetwork(
          false
        )}/${orderId}`,
        {
          method: "GET",
          headers: {
            "x-api-key": `${this._apiKey}`,
            Authorization: `Bearer ${this._authToken}`,
          },
        }
      )

      if (!response || !response.data) throw new Error("response data is empty")

      const { data: orderDetail } = response
      const data: IOrder = orderDetail[0]
      const parameters = data.parameters!.order.parameters
      const maker = data.parameters!.addressMaker
      const txOverrides: { gasLimit?: number; gasPrice?: string } = {}

      if (gasLimit && gasLimit !== 2000000) txOverrides.gasLimit = gasLimit
      if (gasPrice) txOverrides.gasPrice = gasPrice

      const tx = this._seaport.cancelOrders([parameters], maker)
      this._emit("onCancelOrders", { tx })

      const transact = await tx.transact({ ...txOverrides })
      const receipt = await transact.wait(
        this._blocksNumberConfirmationRequired
      )

      this._emit("onCancelOrdersMined", { receipt })
    } catch (error) {
      this._emit("onCancelOrdersError", {
        error,
      })
    }
  }

  /**
   * Retrieves order details for a specific network and order ID.
   * @param {string} networkId - The network ID for the order.
   * @param {string} id - The ID of the order.
   * @returns {Promise<Maybe<OrderDetail>>} A Promise that resolves to the order detail information, or null if an error occurs.
   */
  async get(networkId: string, id: string): Promise<Maybe<IOrder>> {
    try {
      const { response } = await this._fetch<ApiResponse<IOrder>>(
        `${this.backendUrl()}/order/${networkId}/${id}`,
        {
          method: "GET",
          headers: {
            "x-api-key": `${this._apiKey}`,
            Authorization: `Bearer ${this._authToken}`,
          },
        }
      )

      if (!response) return null

      const { data } = response

      return data[0]
    } catch (error) {
      console.warn(error)
    }

    return null
  }

  /**
   * Retrieves a list of global orderss based on the provided parameters.
   * @param {object} options - An object containing the parameters for fetching the orders list.
   * @param {Network | "*"} networkId - The network ID or "*" for all networks.
   * @param {string | "*"} status - The status of the orders or "*" for all statuses.
   * @param {number} skip - The number of orders to skip.
   * @param {number} take - The number of orders to retrieve.
   * @param {string} [from] - Optional parameter for filtering orders from a specific date.
   * @param {string} [to] - Optional parameter for filtering orders up to a specific date.
   * @param {Array<{ address: string; networkId: Network }>} [collectios] - an raary of collections paired with their respective network.
   * @param {Array<string>} [search] - An array of search terms to filter results.
   * @param {object} [order] - An object containing direction and field for ordering results.
   * @param {string} order.direction - The direction of ordering, either "ASC" for ascending or "DESC" for descending.
   * @param {string} order.field - The field to order results by.
   */
  async listOrders({
    networkId,
    status,
    skip,
    take,
    from,
    to,
    collections,
    search,
    order,
  }: {
    networkId: Network | "*"
    status: string | "*"
    skip: number
    take: number
    from?: string
    to?: string
    collections?: Array<{ address: string; networkId: Network }>
    search?: Array<string>
    order?: {
      direction: "ASC" | "DESC"
      field: string
    }
  }): Promise<Maybe<OrderListResponse>> {
    try {
      const { response } = await this._fetch<ApiResponse<OrderListResponse>>(
        `${this.backendUrl()}/order/get/all/${networkId}/${status}/${skip}/${take}`,
        {
          headers: {
            "x-api-key": `${this._apiKey}`,
            Authorization: `Bearer ${this._authToken}`,
          },
          method: "POST",
          body: {
            collections: typeof collections !== "undefined" ? collections : [],
            search: typeof search !== "undefined" ? search : [],
            order: typeof order !== "undefined" ? order : null,
            from: typeof from !== "undefined" ? from : null,
            to: typeof to !== "undefined" ? to : null,
          },
        }
      )

      if (!response || !response.data) return null

      const { data } = response

      return data[0]
    } catch (error) {
      console.warn(error)
    }

    return null
  }

  /**
   * Retrieves a list of user orders based on the provided parameters.
   * @param {object} options - An object containing the parameters for fetching user orders.
   * @param {Network | "*"} networkId - The network ID or "*" for all networks.
   * @param {string} did - The user's did.
   * @param {string | "*"} status - The status of the orders or "*" for all statuses.
   * @param {number} skip - The number of orders to skip.
   * @param {number} take - The number of orders to retrieve.
   * @param {string} [from] - Optional parameter for filtering orders from a specific date.
   * @param {string} [to] - Optional parameter for filtering orders up to a specific date.
   * @param {Array<{ address: string; networkId: Network }>} [collectios] - an raary of collections paired with their respective network.
   * @param {Array<string>} [search] - An array of search terms to filter results.
   * @param {object} [order] - An object containing direction and field for ordering results.
   * @param {string} order.direction - The direction of ordering, either "ASC" for ascending or "DESC" for descending.
   * @param {string} order.field - The field to order results by.
   */
  async listUserOrders({
    networkId,
    did,
    status,
    skip,
    take,
    from,
    to,
    collections,
    searchAddress,
    order,
  }: {
    networkId: Network | "*"
    did: string
    status: string | "*"
    skip: number
    take: number
    from?: string
    to?: string
    collections?: Array<{ address: string; networkId: Network }>
    searchAddress?: string
    order?: {
      direction: "ASC" | "DESC"
      field: string
    }
  }): Promise<Maybe<OrderListResponse>> {
    try {
      const { response } = await this._fetch<ApiResponse<OrderListResponse>>(
        `${this.backendUrl()}/order/user/all/${networkId}/${did}/${status}/${skip}/${take}${
          typeof searchAddress !== "undefined" && searchAddress !== null
            ? `/${searchAddress}`
            : ""
        }`,
        {
          headers: {
            "x-api-key": `${this._apiKey}`,
            Authorization: `Bearer ${this._authToken}`,
          },
          method: "POST",
          body: {
            collections: typeof collections !== "undefined" ? collections : [],
            order: typeof order !== "undefined" ? order : null,
            from: typeof from !== "undefined" ? from : null,
            to: typeof to !== "undefined" ? to : null,
          },
        }
      )

      if (!response || !response.data) return null

      const { data } = response

      return data[0]
    } catch (error) {
      console.warn(error)
    }

    return null
  }

  /**
   * Updates the configuration settings for the order module.
   * @param {OrderConfig} config - The configuration object for the order module.
   * @returns None
   */
  config(config: OrderConfig) {
    if (config.minBlocksRequired)
      this._MIN_BLOCKS_REQUIRED = config.minBlocksRequired
  }

  setCurrentAccount(account: Account): void {
    super.setCurrentAccount(account)
    this._emit("__onAccountReady", account)
  }
}
