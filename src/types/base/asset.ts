import { Collection } from "@src/interfaces"
import { AssetTypeName } from "./assettypename"
import { AssetTypeValue } from "./assettypevalue"
import { Maybe } from "./maybe"
import { AssetStatusVerification } from "./assetstatusverification"

/**
 * Represents an asset with specific properties.
 */
type Asset = {
  itemType: AssetTypeName | AssetTypeValue
} & Partial<{
  amount: string //optional, the amount of the asset, used for NATIVE, ERC20 or ERC1155 assets
  amountHumanReadable: string //optional, represents an amount but in a human readable format
  token: string //optional, address of the token
  identifier: string //optional, token id of the current asset, used for ERC20, ERC1155, ERC721
  recipient: string // optional, it's used by seaport to specify the recipient of the token
  name: string //optional, represents the name of the asset, usually the collection name
  statusVerification: AssetStatusVerification //optional, it's the status of the verification of the collection of this asset
  resourceUrl: string //optional, it's the resource URL of this asset. It can be an URL for an image, video or a different file format
  networkId: string //optional, it can be the network id associated with this asset. Identify the blockchain in which this asset exists
  abi: Maybe<Array<any>> //optional, it can be the ABI connected to this asset
  isNft: boolean //optional, identify if the current asset is a NFT
  symbol: string //optional, identify the symbol of the current asset
  collection: Collection //optional, represents the collection connected to this item
  createdAt: Maybe<string> //optional, represents the date in which the asset collection was added in the system
}>

export { Asset }
