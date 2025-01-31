import { AccountEngine, AccountSchema } from "../../interfaces/auth"
import { Maybe, Network } from "../../types"
import { AccountInitConfig } from "../../types/auth/account"
import { ConnectedWallet, EIP1193Provider } from "@privy-io/react-auth"
import { CLIENT_DB_KEY_LAST_USER_LOGGED } from "../../constants/app"
import { encodeFunctionData } from "viem"
import { erc1155Abi, erc20Abi, erc721Abi } from "../../constants"
import { Client } from "../client"
import { QIError } from ".."
import { ApiResponse } from "../../types/base/apiresponse"
import { DexieStorage } from "../app"
import { Auth, Chat, Loopz, Serpens, User } from "../.."
import { AddGroupFrom, ReceiveMessageFrom, UserOnlineStatus } from "../../enums"
import { LocalDBUser } from "../app/database"

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
  readonly bannerImageUrl: string
  readonly city: string
  readonly country: string
  readonly imageSettings: Maybe<{
    imageX: number
    imageY: number
    imageZoom: number
  }>
  readonly instagramPublicUrl: string
  readonly xPublicUrl: string
  readonly tiktokPublicUrl: string
  readonly personalWebsiteUrl: string
  readonly phone: Maybe<string>
  readonly isVerified: boolean
  readonly isPfpNft: boolean
  readonly pfp: Maybe<{
    collectionAddress: string
    tokenId: string
    networkId: Network
  }>
  readonly proposalNotificationPush: boolean
  readonly proposalNotificationSystem: boolean
  readonly orderNotificationPush: boolean
  readonly orderNotificationSystem: boolean
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

  private _client: Client
  private _storage: DexieStorage
  private _activeWallets: Array<ConnectedWallet> = []
  private _embeddedWallet: Maybe<ConnectedWallet> = null
  private _eventsCallbacks: Array<{
    eventName: "onFundExit"
    callbacks: Array<Function>
  }> = []

  set setE2EPublicKeyOnce(e2ePublicKey: string) {
    if (this.e2ePublicKey)
      throw new Error("You cannot override the e2e public key")
    ;(this as any).e2ePublicKey = e2ePublicKey
  }

  constructor(
    config: AccountInitConfig & {
      enableDevMode: boolean
      storage: DexieStorage
    }
  ) {
    this._client = new Client(config.enableDevMode)

    this._storage = config.storage

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
    this.bannerImageUrl = config.bannerImageUrl
    this.imageSettings = config.imageSettings
    this.city = config.city
    this.country = config.country
    this.phone = config.phone
    this.instagramPublicUrl = config.instagramPublicUrl
    this.xPublicUrl = config.xPublicUrl
    this.tiktokPublicUrl = config.tiktokPublicUrl
    this.personalWebsiteUrl = config.personalWebsiteUrl
    this.isVerified = config.isVerified
    this.isPfpNft = config.isPfpNft
    this.pfp = config.pfp
    this.proposalNotificationPush = config.proposalNotificationPush
    this.proposalNotificationSystem = config.proposalNotificationSystem
    this.orderNotificationPush = config.orderNotificationPush
    this.orderNotificationSystem = config.orderNotificationSystem
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

  async setApprovalForAll(
    type: "ERC721" | "ERC1155",
    contractAddress: string,
    operator: string,
    provider: EIP1193Provider
  ) {
    const data = encodeFunctionData({
      abi: type === "ERC1155" ? erc1155Abi : erc721Abi,
      functionName: `setApprovalForAll`,
      args: [operator, true],
    })

    const transactionRequest = {
      to: contractAddress,
      data,
    }

    await provider.request({
      method: "eth_sendTransaction",
      params: [transactionRequest],
    })
  }

  //ERC721
  async approve(
    contractAddress: string,
    operator: string,
    tokenId: number,
    provider: EIP1193Provider
  ) {
    const data = encodeFunctionData({
      abi: erc721Abi,
      functionName: `approve`,
      args: [operator, tokenId],
    })

    const transactionRequest = {
      to: contractAddress,
      data,
    }

    await provider.request({
      method: "eth_sendTransaction",
      params: [transactionRequest],
    })
  }

  //ERC20
  async approveToken(
    contractAddress: string,
    operator: string,
    wei: string,
    provider: EIP1193Provider
  ) {
    const data = encodeFunctionData({
      abi: erc20Abi,
      functionName: `approve`,
      args: [operator, wei],
    })

    const transactionRequest = {
      to: contractAddress,
      data,
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

  getCurrentNetwork(caip?: boolean): string | Network {
    return caip
      ? this._activeWallets[0].chainId
      : this._activeWallets[0].chainId.replace("eip155:", "")
  }

  async changeNetwork(chainId: number | `0x${string}`): Promise<void> {
    await this._activeWallets[0].switchChain(chainId)
  }

  on(eventName: "onFundExit", callback: Function, onlyOnce?: boolean) {
    const index = this._eventsCallbacks.findIndex((item) => {
      return item.eventName === eventName
    })

    if (index < 0)
      this._eventsCallbacks.push({
        eventName,
        callbacks: [callback],
      })
    else {
      if (onlyOnce) return
      this._eventsCallbacks[index].callbacks.push(callback)
    }
  }

  off(eventName: "onFundExit", callback?: Function) {
    const index = this._eventsCallbacks.findIndex((item) => {
      return item.eventName === eventName
    })

    if (index < 0) return

    this._eventsCallbacks[index].callbacks = callback
      ? this._eventsCallbacks[index].callbacks.filter((cb) => cb !== callback)
      : []
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

  async updateData({
    username,
    avatarFile,
    bannerImageFile,
    bio,
    imageSettings = null,
    city,
    country,
    instagramPublicUrl,
    xPublicUrl,
    tiktokPublicUrl,
    personalWebsiteUrl,
  }: {
    username: Maybe<string>
    avatarFile: Maybe<File>
    bannerImageFile: Maybe<File>
    bio: Maybe<string>
    imageSettings: Maybe<{
      imageX: number
      imageY: number
      imageZoom: number
    }>
    city: Maybe<string>
    country: Maybe<string>
    instagramPublicUrl: Maybe<string>
    xPublicUrl: Maybe<string>
    tiktokPublicUrl: Maybe<string>
    personalWebsiteUrl: Maybe<string>
  }): Promise<
    Maybe<{
      username: Maybe<string>
      avatarUrl: Maybe<string>
      bannerImageUrl: Maybe<string>
      bio: Maybe<string>
      imageSettings: Maybe<{
        imageX: number
        imageY: number
        imageZoom: number
      }>
      city: Maybe<string>
      country: Maybe<string>
      instagramPublicUrl: Maybe<string>
      xPublicUrl: Maybe<string>
      tiktokPublicUrl: Maybe<string>
      personalWebsiteUrl: Maybe<string>
    }>
  > {
    try {
      const { response } = await this._client.fetch<
        ApiResponse<{
          avatarUrl: Maybe<string>
          avatarSignedUrl: Maybe<string>
          bannerImageUrl: Maybe<string>
          bannerSignedImageUrl: Maybe<string>
        }>
      >(this._client.backendUrl("/user/update"), {
        method: "POST",
        body: {
          username,
          avatarFileName: avatarFile ? avatarFile.name : null,
          avatarFileType: avatarFile ? avatarFile.type : null,
          bannerImageFileName: bannerImageFile ? bannerImageFile.name : null,
          bannerImageFileType: bannerImageFile ? bannerImageFile.type : null,
          bio,
          imageSettings: imageSettings
            ? {
                imageX: imageSettings.imageX,
                imageY: imageSettings.imageY,
                imageZoom: imageSettings.imageZoom,
              }
            : null,
          instagramPublicUrl,
          xPublicUrl,
          tiktokPublicUrl,
          personalWebsiteUrl,
        },
      })

      if (!response) throw new Error("Response is invalid.")
      if (response!.code !== 200) throw new Error("Error.")

      if (
        avatarFile &&
        response.data[0].avatarUrl &&
        response.data[0].avatarSignedUrl
      ) {
        ;(this as any).avatarUrl = response.data[0].avatarUrl
        await fetch(response.data[0].avatarSignedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": avatarFile.type,
          },
          body: avatarFile,
        })
      }
      if (
        bannerImageFile &&
        response.data[0].bannerImageUrl &&
        response.data[0].bannerSignedImageUrl
      ) {
        ;(this as any).bannerImageUrl = response.data[0].bannerImageUrl
        await fetch(response.data[0].bannerSignedImageUrl, {
          method: "PUT",
          headers: {
            "Content-Type": bannerImageFile.type,
          },
          body: bannerImageFile,
        })
      }

      const user = await new Promise<LocalDBUser | undefined>(
        (resolve, reject) => {
          Serpens.addAction(() => {
            this._storage.user
              .where("[did+organizationId]")
              .equals([this.did, this.organizationId])
              .first()
              .then(resolve)
              .catch(reject)
          })
        }
      )

      if (!user) return null

      await new Promise((resolve, reject) => {
        Serpens.addAction(() => {
          this._storage.user
            .update(user, {
              username: username ? username : undefined,
              avatarUrl: (this as any).avatarUrl
                ? (this as any).avatarUrl.toString()
                : undefined,
              bannerImageUrl: (this as any).bannerImageUrl
                ? (this as any).bannerImageUrl.toString()
                : undefined,
              bio: bio ? bio : undefined,
              imageSettings: imageSettings ? imageSettings : undefined,
              city: city ? city : undefined,
              country: country ? country : undefined,
              instagramPublicUrl: instagramPublicUrl
                ? instagramPublicUrl
                : undefined,
              xPublicUrl: xPublicUrl ? xPublicUrl : undefined,
              tiktokPublicUrl: tiktokPublicUrl ? tiktokPublicUrl : undefined,
              personalWebsiteUrl: personalWebsiteUrl
                ? personalWebsiteUrl
                : undefined,
            })
            .then(resolve)
            .catch(reject)
        })
      })

      if (username) (this as any).username = username
      if (bio) (this as any).bio = bio
      if (imageSettings) {
        if (
          typeof (this as any).imageSettings === "undefined" ||
          (this as any).imageSettings === null
        ) {
          ;(this as any).imageSettings = {
            imageX: 0,
            imageY: 0,
            imageZoom: 1,
          }
        }
        ;(this as any).imageSettings.imageX = imageSettings.imageX
        ;(this as any).imageSettings.imageY = imageSettings.imageY
        ;(this as any).imageSettings.imageZoom = imageSettings.imageZoom
      }
      if (city) (this as any).city = city
      if (country) (this as any).country = country
      if (instagramPublicUrl)
        (this as any).instagramPublicUrl = instagramPublicUrl
      if (xPublicUrl) (this as any).xPublicUrl = xPublicUrl
      if (tiktokPublicUrl) (this as any).tiktokPublicUrl = tiktokPublicUrl
      if (personalWebsiteUrl)
        (this as any).personalWebsiteUrl = personalWebsiteUrl

      return {
        username: username ? username : null,
        avatarUrl: (this as any).avatarUrl ? (this as any).avatarUrl : null,
        bannerImageUrl: (this as any).bannerImageUrl
          ? (this as any).bannerImageUrl
          : null,
        bio: bio ? bio : null,
        imageSettings: imageSettings ? imageSettings : null,
        city: city ? city : null,
        country: country ? country : null,
        instagramPublicUrl: instagramPublicUrl ? instagramPublicUrl : null,
        xPublicUrl: xPublicUrl ? xPublicUrl : null,
        tiktokPublicUrl: tiktokPublicUrl ? tiktokPublicUrl : null,
        personalWebsiteUrl: personalWebsiteUrl ? personalWebsiteUrl : null,
      }
    } catch (error: any) {
      console.error(error)
      if ("statusCode" in error && error.statusCode === 401)
        await Auth.getInstance().logout()

      throw error
    }

    return null
  }

  async updateSettings(
    setting:
      | "proposalNotificationPush"
      | "proposalNotificationSystem"
      | "orderNotificationPush"
      | "orderNotificationSystem"
      | "followNotificationPush"
      | "followNotificationSystem"
      | "collectionNotificationPush"
      | "collectionNotificationSystem"
      | "generalNotificationPush"
      | "generalNotificationSystem",
    enabled: boolean
  ) {
    try {
      const { response } = await this._client.fetch<ApiResponse<{}>>(
        this._client.backendUrl("/user/update/settings"),
        {
          method: "POST",
          body: {
            setting,
            enabled,
          },
        }
      )

      if (!response) throw new Error("Response is invalid.")
      if (response!.code !== 200) throw new Error("Error")

      const user = await new Promise<LocalDBUser | undefined>(
        (resolve, reject) => {
          Serpens.addAction(() => {
            this._storage.user
              .where("[did+organizationId]")
              .equals([this.did, this.organizationId])
              .first()
              .then(resolve)
              .catch(reject)
          })
        }
      )

      if (!user) return

      await new Promise((resolve, reject) => {
        Serpens.addAction(() => {
          this._storage.user
            .update(user, {
              proposalNotificationPush:
                setting === "proposalNotificationPush" ? enabled : undefined,
              proposalNotificationSystem:
                setting === "proposalNotificationSystem" ? enabled : undefined,
              orderNotificationPush:
                setting === "orderNotificationPush" ? enabled : undefined,
              orderNotificationSystem:
                setting === "orderNotificationSystem" ? enabled : undefined,
              followNotificationPush:
                setting === "followNotificationSystem" ? enabled : undefined,
              followNotificationSystem:
                setting === "followNotificationSystem" ? enabled : undefined,
              collectionNotificationPush:
                setting === "collectionNotificationPush" ? enabled : undefined,
              collectionNotificationSystem:
                setting === "collectionNotificationSystem"
                  ? enabled
                  : undefined,
              generalNotificationPush:
                setting === "generalNotificationPush" ? enabled : undefined,
              generalNotificationSystem:
                setting === "generalNotificationSystem" ? enabled : undefined,
            })
            .then(resolve)
            .catch(reject)
        })
      })
    } catch (error: any) {
      console.error(error)
      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }
    }
  }

  async updateChatSettings(settings: {
    allowNotification: boolean
    allowNotificationSound: boolean
    visibility: boolean
    onlineStatus: UserOnlineStatus
    allowReadReceipt: boolean
    allowReceiveMessageFrom: ReceiveMessageFrom
    allowAddToGroupsFrom: AddGroupFrom
    allowGroupsSuggestion: boolean
  }) {
    try {
      // Chat.getInstance().updateUser()
      const response = await Chat.getInstance().updateUser(settings)

      if (response instanceof QIError) throw response

      const user = await new Promise<LocalDBUser | undefined>(
        (resolve, reject) => {
          Serpens.addAction(() => {
            this._storage.user
              .where("[did+organizationId]")
              .equals([this.did, this.organizationId])
              .first()
              .then(resolve)
              .catch(reject)
          })
        }
      )

      if (!user) return

      await new Promise((resolve, reject) => {
        Serpens.addAction(() => {
          this._storage.user.update(user, settings).then(resolve).catch(reject)
        })
      })
    } catch (error) {
      console.error(error)
    }
  }

  async exportPersonalKeys(download: true): Promise<undefined>
  async exportPersonalKeys(download: false): Promise<string>
  async exportPersonalKeys(download: boolean = true) {
    try {
      const items = await this._storage.get("user", "[did+organizationId]", [
        this.did,
        this.organizationId,
      ])

      const fileContent = JSON.stringify(items, null, 2)
      if (!download) return fileContent

      const blob = new Blob([fileContent], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "user.json"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  toUser() {
    return new User({
      devMode: Loopz.devMode,
      id: this.dynamoDBUserID,
      did: this.did,
      address: this.walletAddress,
      username: this.username,
      bio: this.bio,
      email: this.email,
      avatarUrl: this.avatarUrl ? new URL(this.avatarUrl) : null,
      imageSettings: this.imageSettings
        ? JSON.stringify(this.imageSettings)
        : null,
      isVerified: this.isVerified,
      isPfpNft: this.isPfpNft,
      blacklistIds: [],
      allowNotification: this.allowNotification,
      allowNotificationSound: this.allowNotificationSound,
      allowAddToGroupsFrom: this.allowAddToGroupsFrom,
      allowGroupsSuggestion: this.allowGroupsSuggestion,
      allowReadReceipt: this.allowReadReceipt,
      allowReceiveMessageFrom: this.allowReceiveMessageFrom,
      visibility: this.visibility,
      archivedConversations: [],
      onlineStatus: this.onlineStatus,
      e2ePublicKey: this.e2ePublicKey,
      e2eSecret: this.e2eSecret,
      e2eSecretIV: this.e2eSecretIV,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      client: {} as any,
      realtimeClient: {} as any,
      storage: this._storage,
    })
  }
}
