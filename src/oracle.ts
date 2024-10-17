import { Client } from "./core/client"
import {
  GetBookmarkedCollectionsArgs,
  GetCollectionsArgs,
  GetNFTArgs,
  GetNFTsArgs,
} from "./types/oracle"
import { Collectible, CollectibleMetadata } from "./interfaces/oracle"
import { ApiKeyAuthorized, Maybe } from "./types/base"
import { ApiResponse } from "./types/base/apiresponse"
import { Collection } from "./interfaces"

/**
 * Represents an Oracle class that extends Client and provides methods to interact with an Oracle API.
 * @class Oracle
 * @extends Client
 */
export class Oracle extends Client {
  /**
   * Constructor for creating an instance of a class that requires an API key for authorization.
   * @param {ApiKeyAuthorized} config - The configuration object containing the API key.
   * @returns None
   */
  constructor(config: ApiKeyAuthorized) {
    super(config.devMode)
    this._apiKey = config.apiKey
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
   * @param {GetCollectionsArgs} args - The search parameters for fetching collections.
   * @returns {Promise<Maybe<{total: number; collections: Array<Collection>}>>} A promise that resolves to the collections response or null.
   * @throws {Error} If an error occurs during the fetching process.
   */
  async getCollections(
    args: GetCollectionsArgs
  ): Promise<Maybe<{ total: number; collections: Array<Collection> }>> {
    const url: string = `${this.backendUrl()}/collection/get/all/${
      args.networkId ? args.networkId : `*`
    }/${args.searchType}/${args.skip}/${args.take}${
      args.queryString ? `/${args.queryString}` : ``
    }`

    try {
      const { response } = await this._fetch<
        ApiResponse<{ total: number; collections: Array<Collection> }>
      >(url, {
        method: "GET",
        headers: {
          "x-api-key": `${this._apiKey}`,
          Authorization: `Bearer ${this._authToken}`,
        },
      })

      if (!response || !response.data) return null

      return response.data[0]
    } catch (error) {
      console.warn(error)
    }

    return null
  }

  /**
   * Retrieves collections based on the provided search parameters.
   * @param {GetBookmarkedCollectionsArgs} args - The search parameters for fetching collections.
   * @returns {Promise<Maybe<{total: number; collections: Array<Collection>}>>} A promise that resolves to the collections response or null.
   * @throws {Error} If an error occurs during the fetching process.
   */
  async getBookmarkedCollections(
    args: GetBookmarkedCollectionsArgs
  ): Promise<Maybe<{ total: number; collections: Array<Collection> }>> {
    const url: string = `${this.backendUrl()}/collection/get/all/bookmark/${
      args.networkId ? args.networkId : `*`
    }/${args.skip}/${args.take}`

    try {
      const { response } = await this._fetch<
        ApiResponse<{ total: number; collections: Array<Collection> }>
      >(url, {
        method: "GET",
        headers: {
          "x-api-key": `${this._apiKey}`,
          Authorization: `Bearer ${this._authToken}`,
        },
      })

      if (!response || !response.data) return null

      return response.data[0]
    } catch (error) {
      console.warn(error)
    }

    return null
  }

  /**
   * Retrieves NFTs based on the provided search parameters.
   * @param {GetNFTsArgs} args - The search parameters for fetching NFTs.
   * @returns {Promise<Maybe<{
   *   nfts: Array<Collectible>
   *   continuation: Maybe<string> | undefined
   *   total: number
   * }>>} A promise that resolves to the response containing the NFTs, or null if no data is returned.
   * @throws {Error} If an error occurs during the fetch operation.
   */
  async getNFTs(args: GetNFTsArgs): Promise<
    Maybe<{
      nfts: Array<Collectible>
      continuation: Maybe<string> | undefined
      total: number
    }>
  > {
    const url: string = `${this.backendUrl()}/nft/get/all/owner/${
      args.networkId
    }/${args.collectionAddress}/${args.take}${
      args.continuation ? `/${args.continuation}` : ``
    }`

    try {
      const { response } = await this._fetch<
        ApiResponse<{
          nfts: Array<Collectible>
          continuation: Maybe<string> | undefined
          total: number
        }>
      >(url, {
        method: "POST",
        headers: {
          "x-api-key": `${this._apiKey}`,
          Authorization: `Bearer ${this._authToken}`,
        },
        body: {
          collections: args.collections ? args.collections : null,
        },
      })

      if (!response || !response.data) return null

      return response.data[0]
    } catch (error) {
      console.warn(error)
    }

    return null
  }

  /**
   * Retrieves NFT metadata based on the provided search parameters.
   * @param {GetNFTArgs} args - The search parameters for the NFT.
   * @returns {Promise<Maybe<CollectibleMetadata>>} A promise that resolves to the NFT metadata response, or null if no data is found.
   * @throws {Error} If an error occurs during the retrieval process.
   */
  async getNFT(args: GetNFTArgs): Promise<Maybe<CollectibleMetadata>> {
    const url: string = `${this.backendUrl()}/nft/metadata/${args.networkId}/${
      args.collectionAddress
    }/${args.tokenId}${args.address ? `/${args.address}` : ``}`

    try {
      const { response } = await this._fetch<ApiResponse<CollectibleMetadata>>(
        url,
        {
          method: "GET",
          headers: {
            "x-api-key": `${this._apiKey}`,
            Authorization: `Bearer ${this._authToken}`,
          },
        }
      )

      if (!response || !response.data) return null

      return response.data[0]
    } catch (error) {
      console.warn(error)
    }

    return null
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
        `${this.backendUrl()}/collection/add`,
        {
          method: "POST",
          body: {
            collections,
          },
          headers: {
            "x-api-key": `${this._apiKey}`,
            Authorization: `Bearer ${this._authToken}`,
          },
        }
      )

      if (!response || !response.data) return null

      return response.data
    } catch (error) {
      console.warn(error)
    }

    return null
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
        `${this.backendUrl()}/collection/add/bulk`,
        {
          method: "POST",
          body: {
            collections,
          },
          headers: {
            "x-api-key": `${this._apiKey}`,
            Authorization: `Bearer ${this._authToken}`,
          },
        }
      )

      if (!response || !response.data) return null

      return response.data
    } catch (error) {
      console.warn(error)
    }

    return null
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
      >(
        `${this.backendUrl()}/collection/is/supported/${address}/${networkId}`,
        {
          method: "GET",
          headers: {
            "x-api-key": `${this._apiKey}`,
            Authorization: `Bearer ${this._authToken}`,
          },
        }
      )

      if (!response || !response.data) return null

      return response.data[0]
    } catch (error) {
      console.warn(error)
    }

    return null
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
      >(`${this.backendUrl()}/collection/is/supported/bulk`, {
        method: "POST",
        body: {
          collections,
        },
        headers: {
          "x-api-key": `${this._apiKey}`,
          Authorization: `Bearer ${this._authToken}`,
        },
      })

      if (!response || !response.data) return null

      return response.data
    } catch (error) {
      console.warn(error)
    }

    return null
  }
}
