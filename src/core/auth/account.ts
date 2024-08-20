import { AccountEngine, AccountSchema } from "@src/interfaces/auth"
import { Maybe, Network } from "../../types"
import { AccountInitConfig } from "../../types/auth/account"
import { ConnectedWallet, EIP1193Provider } from "@privy-io/react-auth"
import { CLIENT_DB_KEY_LAST_USER_LOGGED } from "../../constants/app"
import { encodeFunctionData } from "viem"
import { erc1155Abi } from "../../constants"
import { ethers } from "ethers"

export class Account implements AccountSchema, AccountEngine {
  readonly did: string
  readonly organizationId: string
  readonly walletAddress: string
  readonly walletConnectorType: string
  readonly walletImported: boolean
  readonly walletRecoveryMethod: string
  readonly walletClientType: string
  readonly appleSubject: Maybe<string>
  readonly appleEmail: Maybe<string>
  readonly discordSubject: Maybe<string>
  readonly discordEmail: Maybe<string>
  readonly discordUsername: Maybe<string>
  readonly farcasterFid: Maybe<number>
  readonly farcasterDisplayName: Maybe<string>
  readonly farcasterOwnerAddress: Maybe<string>
  readonly farcasterPfp: Maybe<string>
  readonly farcasterSignerPublicKey: Maybe<string>
  readonly farcasterUrl: Maybe<string>
  readonly farcasterUsername: Maybe<string>
  readonly githubSubject: Maybe<string>
  readonly githubEmail: Maybe<string>
  readonly githubName: Maybe<string>
  readonly githubUsername: Maybe<string>
  readonly googleEmail: Maybe<string>
  readonly googleName: Maybe<string>
  readonly googleSubject: Maybe<string>
  readonly instagramSubject: Maybe<string>
  readonly instagramUsername: Maybe<string>
  readonly linkedinEmail: Maybe<string>
  readonly linkedinName: Maybe<string>
  readonly linkedinSubject: Maybe<string>
  readonly linkedinVanityName: Maybe<string>
  readonly spotifyEmail: Maybe<string>
  readonly spotifyName: Maybe<string>
  readonly spotifySubject: Maybe<string>
  readonly telegramFirstName: Maybe<string>
  readonly telegramLastName: Maybe<string>
  readonly telegramPhotoUrl: Maybe<string>
  readonly telegramUserId: Maybe<string>
  readonly telegramUsername: Maybe<string>
  readonly tiktokName: Maybe<string>
  readonly tiktokSubject: Maybe<string>
  readonly tiktokUsername: Maybe<string>
  readonly twitterName: Maybe<string>
  readonly twitterSubject: Maybe<string>
  readonly twitterProfilePictureUrl: Maybe<string>
  readonly twitterUsername: Maybe<string>
  readonly dynamoDBUserID: string
  readonly username: string
  readonly email: string
  readonly bio: string
  readonly firstLogin: boolean
  readonly avatarUrl: string
  readonly phone: Maybe<string>
  readonly isVerified: boolean
  readonly isNft: boolean
  readonly collectionAddress: string
  readonly tokenId: Maybe<string>
  readonly postNotificationPush: boolean
  readonly postNotificationSystem: boolean
  readonly dealNotificationPush: boolean
  readonly dealNotificationSystem: boolean
  readonly followNotificationPush: boolean
  readonly followNotificationSystem: boolean
  readonly collectionNotificationPush: boolean
  readonly collectionNotificationSystem: boolean
  readonly generalNotificationPush: boolean
  readonly generalNotificationSystem: boolean
  readonly accountSuspended: boolean
  readonly e2ePublicKey: string
  readonly e2eSecret: string
  readonly e2eSecretIV: string
  readonly createdAt: Date
  readonly updatedAt: Maybe<Date>
  readonly deletedAt: Maybe<Date>
  readonly token: string
  readonly allowNotification: boolean
  readonly allowNotificationSound: boolean
  readonly visibility: boolean
  readonly onlineStatus: "OFFLINE" | "ONLINE" | "BUSY"
  readonly allowReadReceipt: boolean
  readonly allowReceiveMessageFrom: "NO_ONE" | "ONLY_FOLLOWED" | "EVERYONE"
  readonly allowAddToGroupsFrom: "ONLY_FOLLOWED" | "EVERYONE"
  readonly allowGroupsSuggestion: boolean

  private _activeWallets: Array<ConnectedWallet> = []

  private _embeddedWallet: Maybe<ConnectedWallet> = null

  private _eventsCallbacks: Array<{
    eventName: "onFundExit"
    callbacks: Array<Function>
  }> = []

  constructor(config: AccountInitConfig) {
    this.did = config.did
    this.organizationId = config.organizationId
    this.token = config.token
    this.walletAddress = config.walletAddress
    this.walletConnectorType = config.walletConnectorType
    this.walletImported = config.walletImported
    this.walletRecoveryMethod = config.walletRecoveryMethod
    this.walletClientType = config.walletClientType
    this.appleSubject = config.appleSubject
    this.appleEmail = config.appleEmail
    this.discordSubject = config.discordSubject
    this.discordEmail = config.discordEmail
    this.discordUsername = config.discordUsername
    this.farcasterFid = config.farcasterFid
    this.farcasterDisplayName = config.farcasterDisplayName
    this.farcasterOwnerAddress = config.farcasterOwnerAddress
    this.farcasterPfp = config.farcasterPfp
    this.farcasterSignerPublicKey = config.farcasterSignerPublicKey
    this.farcasterUrl = config.farcasterUrl
    this.farcasterUsername = config.farcasterUsername
    this.githubSubject = config.githubSubject
    this.githubEmail = config.githubEmail
    this.githubName = config.githubName
    this.githubUsername = config.githubUsername
    this.googleEmail = config.googleEmail
    this.googleName = config.googleName
    this.googleSubject = config.googleSubject
    this.instagramSubject = config.instagramSubject
    this.instagramUsername = config.instagramUsername
    this.linkedinEmail = config.linkedinEmail
    this.linkedinName = config.linkedinName
    this.linkedinSubject = config.linkedinSubject
    this.linkedinVanityName = config.linkedinVanityName
    this.spotifyEmail = config.spotifyEmail
    this.spotifyName = config.spotifyName
    this.spotifySubject = config.spotifySubject
    this.telegramFirstName = config.telegramFirstName
    this.telegramLastName = config.telegramLastName
    this.telegramPhotoUrl = config.telegramPhotoUrl
    this.telegramUserId = config.telegramUserId
    this.telegramUsername = config.telegramUsername
    this.tiktokName = config.tiktokName
    this.tiktokSubject = config.tiktokSubject
    this.tiktokUsername = config.tiktokUsername
    this.twitterName = config.twitterName
    this.twitterSubject = config.twitterSubject
    this.twitterProfilePictureUrl = config.twitterProfilePictureUrl
    this.twitterUsername = config.twitterUsername
    this.dynamoDBUserID = config.dynamoDBUserID
    this.username = config.username
    this.email = config.email
    this.bio = config.bio
    this.firstLogin = config.firstLogin
    this.avatarUrl = config.avatarUrl
    this.phone = config.phone
    this.isVerified = config.isVerified
    this.isNft = config.isNft
    this.collectionAddress = config.collectionAddress
    this.tokenId = config.tokenId
    this.postNotificationPush = config.postNotificationPush
    this.postNotificationSystem = config.postNotificationSystem
    this.dealNotificationPush = config.dealNotificationPush
    this.dealNotificationSystem = config.dealNotificationSystem
    this.followNotificationPush = config.followNotificationPush
    this.followNotificationSystem = config.followNotificationSystem
    this.collectionNotificationPush = config.collectionNotificationPush
    this.collectionNotificationSystem = config.collectionNotificationSystem
    this.generalNotificationPush = config.generalNotificationPush
    this.generalNotificationSystem = config.generalNotificationSystem
    this.accountSuspended = config.accountSuspended
    this.e2ePublicKey = config.e2ePublicKey
    this.e2eSecret = config.e2eSecret
    this.e2eSecretIV = config.e2eSecretIV
    this.createdAt = new Date(config.createdAt)
    this.updatedAt = config.updatedAt ? new Date(config.updatedAt) : null
    this.deletedAt = config.deletedAt ? new Date(config.deletedAt) : null
    this.allowNotification = config.allowNotification
    this.allowNotificationSound = config.allowNotificationSound
    this.visibility = config.visibility
    this.onlineStatus = config.onlineStatus
    this.allowReadReceipt = config.allowReadReceipt
    this.allowReceiveMessageFrom = config.allowReceiveMessageFrom
    this.allowAddToGroupsFrom = config.allowAddToGroupsFrom
    this.allowGroupsSuggestion = config.allowGroupsSuggestion
  }

  private _clearEventsCallbacks(events: Array<"onFundExit">) {
    events.forEach((event: "onFundExit") => {
      const index = this._eventsCallbacks.findIndex((item) => {
        return item.eventName === event
      })

      if (index > -1) this._eventsCallbacks[index].callbacks = []
    })
  }

  async test(contractAddress: string, provider: EIP1193Provider) {
    const data = encodeFunctionData({
      abi: erc1155Abi,
      functionName: `setApprovalForAll`,
      args: [contractAddress, true],
    })

    const transactionRequest = {
      to: contractAddress,
      data: data,
    }

    await provider.request({
      method: "eth_sendTransaction",
      params: [transactionRequest],
    })
  }

  //store the key of the last user logged in the local storage, this allow to recover the user and rebuild the account object when
  //the user refresh the page
  storeLastUserLoggedKey() {
    if (!this.did || !this.organizationId || !this.token) return

    window.localStorage.setItem(
      CLIENT_DB_KEY_LAST_USER_LOGGED,
      JSON.stringify({
        did: this.did,
        organizationId: this.organizationId,
        token: this.token,
      })
    )
  }

  destroyLastUserLoggedKey() {
    window.localStorage.removeItem(CLIENT_DB_KEY_LAST_USER_LOGGED)
  }

  getActiveWallets(): Array<ConnectedWallet> {
    return this._activeWallets
  }

  getEmbeddedWallet(): Maybe<ConnectedWallet> {
    return this._embeddedWallet
  }

  setActiveWallets(wallets: Array<ConnectedWallet>): void {
    this._activeWallets = wallets
  }

  setEmbeddedWallet(wallet: ConnectedWallet): void {
    this._embeddedWallet = wallet
  }

  emptyActiveWallets() {
    this._activeWallets = []
  }

  getCurrentNetwork(): Network {
    return this._activeWallets[0].chainId as Network
  }

  async changeNetwork(chainId: number | `0x${string}`): Promise<void> {
    await this._activeWallets[0].switchChain(chainId)
  }

  on(eventName: "onFundExit", callback: Function, onlyOnce?: boolean) {
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
   * @param {"onFundExit"} eventName - The name of the event to unsubscribe from.
   * @returns None
   * @throws {Error} If the event is not supported or the callback is not a function.
   */
  off(eventName: "onFundExit") {
    const item = this._eventsCallbacks.find((eventItem) => {
      return eventItem.eventName === eventName
    })

    if (item) item.callbacks = []
  }

  /**
   * Emits an event with the specified name and parameters to all registered callbacks for that event.
   * @param {"onFundExit"} event - The name of the event to emit.
   * @param {any} [params] - The parameters to pass to the event callbacks.
   * @returns None
   */
  _emit(event: "onFundExit", params?: any) {
    const item = this._eventsCallbacks.find((item) => {
      return item.eventName === event
    })

    if (item) for (const cb of item.callbacks) cb(params as any)
  }
}
