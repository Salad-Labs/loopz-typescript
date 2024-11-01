import { Client } from "./core/client"
import {
  ListBookmarkedCollectionsArgs,
  GetCollectibleMetadataArgs,
  ListCollectiblesArgs,
  ListCollectionsArgs,
  ListCollectiblesByCollectionArgs,
} from "./types/oracle"
import {
  Collectible,
  CollectibleBalance,
  CollectibleMetadata,
} from "./interfaces/oracle"
import { Maybe } from "./types/base"
import { ApiResponse } from "./types/base/apiresponse"
import { Collection } from "./interfaces"
import { GetCollectibleBalanceArgs } from "./types/oracle/args/getcollectiblebalance"
import { Auth } from "."

/**
 * Represents an Oracle class that extends Client and provides methods to interact with an Oracle API.
 * @class Oracle
 * @extends Client
 */
export class Oracle extends Client {
  private static _config: Maybe<{ devMode: boolean }> = null
  private static _instance: Maybe<Oracle> = null

  public static config(config: { devMode: boolean }) {
    if (!!Oracle._config) throw new Error("Oracle already configured")

    Oracle._config = config
  }

  public static getInstance() {
    return Oracle._instance ?? new Oracle()
  }

  private constructor() {
    if (!!!Oracle._config)
      throw new Error("Oracle must be configured before getting the instance")

    super(Oracle._config.devMode)
  }

  /**
   * Validates each address in the given array of collections to ensure they are in the correct format.
   * @param {string[]} collections - An array of Ethereum addresses to validate.
   * @throws {Error} Throws an error if any address in the array is not in the correct format.
   */
  private _validate(collections: string[]) {
    let ok: boolean = true
    let i = 0

    while (i < collections.length) {
      ok = /^0x[a-fA-F0-9]{40}$/.test(collections[i])
      if (!ok) break
      i++
    }

    if (!ok)
      throw new Error(
        "An address of the set you provided is not in the right format. Please provide a valid Ethereum address."
      )
  }

  /**
   * Retrieves collections based on the provided search parameters.
   * @param {ListCollectionsArgs} args - The search parameters for fetching collections.
   * @returns {Promise<Maybe<{total: number; collections: Array<Collection>}>>} A promise that resolves to the collections response or null.
   * @throws {Error} If an error occurs during the fetching process.
   */
  async listCollections(
    args: ListCollectionsArgs
  ): Promise<Maybe<{ total: number; collections: Array<Collection> }>> {
    const url = this._backendUrl(
      `/collection/get/all/${args.networkId ? args.networkId : `*`}/${
        args.searchType
      }/${args.skip}/${args.take}${
        args.queryString ? `/${args.queryString}` : ``
      }`
    )

    try {
      const { response } = await this._fetch<
        ApiResponse<{ total: number; collections: Array<Collection> }>
      >(url)

      if (!response || !response.data) return null

      return response.data[0]
    } catch (error: any) {
      console.warn(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      return null
    }
  }

  /**
   * Retrieves collections based on the provided search parameters.
   * @param {ListBookmarkedCollectionsArgs} args - The search parameters for fetching collections.
   * @returns {Promise<Maybe<{total: number; collections: Array<Collection>}>>} A promise that resolves to the collections response or null.
   * @throws {Error} If an error occurs during the fetching process.
   */
  async listBookmarkedCollections(
    args: ListBookmarkedCollectionsArgs
  ): Promise<Maybe<{ total: number; collections: Array<Collection> }>> {
    const url = this._backendUrl(
      `/collection/get/all/bookmark/${args.networkId ? args.networkId : `*`}/${
        args.skip
      }/${args.take}`
    )

    try {
      const { response } = await this._fetch<
        ApiResponse<{ total: number; collections: Array<Collection> }>
      >(url)

      if (!response || !response.data) return null

      return response.data[0]
    } catch (error: any) {
      console.warn(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      return null
    }
  }

  /**
   * Retrieves NFTs based on the provided search parameters.
   * @param {ListCollectiblesArgs} args - The search parameters for fetching NFTs.
   * @returns {Promise<Maybe<{
   *   nfts: Array<Collectible>
   *   continuation: Maybe<string> | undefined
   *   total: number
   * }>>} A promise that resolves to the response containing the NFTs, or null if no data is returned.
   * @throws {Error} If an error occurs during the fetch operation.
   */
  async listCollectibles(args: ListCollectiblesArgs): Promise<
    Maybe<{
      nfts: Array<Collectible>
      continuation: Maybe<string> | undefined
      total: number
    }>
  > {
    const url = this._backendUrl(
      `/nft/get/all/owner/${args.networkId}/${args.collectionAddress}/${
        args.take
      }${args.continuation ? `/${args.continuation}` : ``}`
    )

    try {
      const { response } = await this._fetch<
        ApiResponse<{
          nfts: Array<Collectible>
          continuation: Maybe<string> | undefined
          total: number
        }>
      >(url, {
        method: "POST",
        body: {
          collections: args.collections ? args.collections : null,
        },
      })

      if (!response || !response.data) return null

      return response.data[0]
    } catch (error: any) {
      console.warn(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      return null
    }
  }

  /**
   * Retrieves collections based on the provided search parameters.
   * @param {ListCollectiblesByCollectionArgs} args - The search parameters for fetching collections.
   * @returns {Promise<Maybe<{nfts: Array<Collectible>; continuation: Maybe<string> | undefined; total: number}>>} A promise that resolves to the collections response or null.
   * @throws {Error} If an error occurs during the fetching process.
   */
  async listCollectiblesByCollection(
    args: ListCollectiblesByCollectionArgs
  ): Promise<
    Maybe<{
      nfts: Array<Collectible>
      continuation: Maybe<string> | undefined
      total: number
    }>
  > {
    const url = this._backendUrl(
      `/nft/get/metadata/owner/${args.networkId ? args.networkId : `*`}/${
        args.collectionAddress
      }/${args.address}/${args.take}${
        args.continuation ? `/${args.continuation}` : ``
      }`
    )

    try {
      const { response } = await this._fetch<
        ApiResponse<{
          nfts: Array<Collectible>
          continuation: Maybe<string> | undefined
          total: number
        }>
      >(url)

      if (!response || !response.data) return null

      return response.data[0]
    } catch (error: any) {
      console.warn(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      return null
    }
  }

  /**
   * Retrieves NFT metadata based on the provided search parameters.
   * @param {GetCollectibleMetadataArgs} args - The search parameters for the NFT.
   * @returns {Promise<Maybe<CollectibleMetadata>>} A promise that resolves to the NFT metadata response, or null if no data is found.
   * @throws {Error} If an error occurs during the retrieval process.
   */
  async getCollectibleMetadata(
    args: GetCollectibleMetadataArgs
  ): Promise<Maybe<CollectibleMetadata>> {
    const url = this._backendUrl(
      `/nft/metadata/${args.networkId}/${args.collectionAddress}/${
        args.tokenId
      }${args.address ? `/${args.address}` : ``}`
    )

    try {
      const { response } = await this._fetch<ApiResponse<CollectibleMetadata>>(
        url
      )

      if (!response || !response.data) return null

      return response.data[0]
    } catch (error: any) {
      console.warn(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      return null
    }
  }

  /**
   * Retrieves the balance of a collectible.
   * @param {GetCollectibleBalanceArgs} args - The search parameters for the collectible.
   * @returns {Promise<Maybe<CollectibleMetadata>>} A promise that resolves to the NFT balance response, or null if no data is found.
   * @throws {Error} If an error occurs during the retrieval process.
   */
  async getCollectibleBalance(
    args: GetCollectibleBalanceArgs
  ): Promise<Maybe<CollectibleBalance>> {
    const url = this._backendUrl("/nft/balance")
    try {
      const { response } = await this._fetch<ApiResponse<CollectibleBalance>>(
        url,
        {
          method: "PUT",
          body: args,
        }
      )

      if (!response || !response.data) return null

      return response.data[0]
    } catch (error: any) {
      console.warn(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      return null
    }
  }

  /**
   * Submit a new collection to the system.
   * @param {Array<{ address: string; networkId: string }>} collections - An array of objects containing address and networkId.
   * @returns {Promise<Maybe<Array<any>>>} A promise that resolves in case of success, or null if no data is returned.
   * @throws {Error} If an error occurs during the process.
   */
  async addCollection(
    collections: Array<{ address: string; networkId: string }>
  ): Promise<Maybe<Array<any>>> {
    this._validate(
      collections.map((c) => {
        return c.address
      })
    )

    try {
      const { response } = await this._fetch<ApiResponse<any>>(
        this._backendUrl("/collection/add"),
        {
          method: "POST",
          body: {
            collections,
          },
        }
      )

      if (!response || !response.data) return null

      return response.data
    } catch (error: any) {
      console.warn(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      return null
    }
  }

  /**
   * Submit a new set of collections to the system.
   * @param {Array<{ address: string; networkId: string }>} collections - An array of objects containing address and networkId.
   * @returns {Promise<Maybe<Array<any>>>} A promise that resolves in case of success, or null if no data is returned.
   * @throws {Error} If an error occurs during the process.
   */
  async addCollections(
    collections: Array<{ address: string; networkId: string }>
  ): Promise<Maybe<Array<any>>> {
    this._validate(
      collections.map((c) => {
        return c.address
      })
    )

    try {
      const { response } = await this._fetch<ApiResponse<any>>(
        this._backendUrl("/collection/add/bulk"),
        {
          method: "POST",
          body: {
            collections,
          },
        }
      )

      if (!response || !response.data) return null

      return response.data
    } catch (error: any) {
      console.warn(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      return null
    }
  }

  /**
   * Checks if a collection is supported for the given address and network ID.
   * @param {string} address - The address of the collection.
   * @param {string} networkId - The network ID of the collection.
   * @returns {Promise<Maybe<Array<{address: string
   * networkId: string
   * supported: boolean}>>>} A promise that resolves to an array of supported collections, or null if no data is returned.
   * @throws {Error} If an error occurs during the API call.
   */
  async isCollectionSupported(
    address: string,
    networkId: string
  ): Promise<
    Maybe<{ address: string; networkId: string; supported: boolean }>
  > {
    this._validate([address])

    try {
      const { response } = await this._fetch<
        ApiResponse<{ address: string; networkId: string; supported: boolean }>
      >(this._backendUrl(`/collection/is/supported/${address}/${networkId}`))

      if (!response || !response.data) return null

      return response.data[0]
    } catch (error: any) {
      console.warn(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      return null
    }
  }

  /**
   * Checks if the given collections are supported by the backend server.
   * @param {Array<{ address: string; networkId: string }>} collections - An array of collection objects containing address and networkId.
   * @returns {Promise<Maybe<Array<{ address: string; networkId: string; supported: boolean }>>>} A promise that resolves to an array of supported collections or null if no data is returned.
   * @throws {Error} If an error occurs during the API call.
   */
  async collectionsSupported(
    collections: Array<{ address: string; networkId: string }>
  ): Promise<
    Maybe<Array<{ address: string; networkId: string; supported: boolean }>>
  > {
    this._validate(
      collections.map((c) => {
        return c.address
      })
    )

    try {
      const { response } = await this._fetch<
        ApiResponse<{ address: string; networkId: string; supported: boolean }>
      >(this._backendUrl("/collection/is/supported/bulk"), {
        method: "POST",
        body: {
          collections,
        },
      })

      if (!response || !response.data) return null

      return response.data
    } catch (error: any) {
      console.warn(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      return null
    }
  }

  /**
   * Looks for the given address and return a promise with an object that represents the collection.
   * @param collectionAddress - string - The collection address.
   * @param networkId - string - An identifier representing the network in which looking for.
   * @returns {Promise<Maybe<Collection>>} A promise that resolves to a collection or null if no data is returned.
   * @throws {Error} If an error occurs during the API call.
   */
  async findCollection(
    collectionAddress: string,
    networkId: string
  ): Promise<Maybe<Collection>> {
    this._validate([collectionAddress])

    try {
      const { response } = await this._fetch<ApiResponse<Collection>>(
        this._backendUrl(`/collection/find/${collectionAddress}/${networkId}`)
      )

      if (!response || !response.data) return null

      return response.data[0]
    } catch (error: any) {
      console.warn(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      return null
    }
  }

  /**
   * Get the pair coins rate value using the Coinbase API.
   * @param pair - string - The pair of coins to compare
   * @returns {Promise<Maybe<{ amount: string; base: string; currency: string }>>} A promise that resolves to a pair rate value or null if no data is returned.
   * @throws {Error} If an error occurs during the API call.
   */
  async getCoinsPairRate(
    pair: `${string}-${string}`
  ): Promise<Maybe<{ amount: string; base: string; currency: string }>> {
    try {
      const { response } = await this._fetch<
        ApiResponse<{ amount: string; base: string; currency: string }>
      >(this._backendUrl(`/coinbase/get/pair/value/${pair}`))

      if (!response || !response.data) return null

      return response.data[0]
    } catch (error: any) {
      console.warn(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      return null
    }
  }

  /**
   * List the current network available supported by the platform.
   * @returns {Promise<Maybe<Array<{ networkId: string; name: string; evmLogo: string}>>>} A promise that resolves to a network array value or null if no data is returned.
   * @throws {Error} If an error occurs during the API call.
   */
  async listNetworks(): Promise<
    Maybe<
      Array<{
        networkId: string
        name: string
        evmLogo: string
      }>
    >
  > {
    try {
      const { response } = await this._fetch<
        ApiResponse<
          Array<{
            networkId: string
            name: string
            evmLogo: string
          }>
        >
      >(this._backendUrl("/networks/get/all"))

      if (!response || !response.data) return null

      return response.data[0]
    } catch (error: any) {
      console.warn(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      return null
    }
  }
}
