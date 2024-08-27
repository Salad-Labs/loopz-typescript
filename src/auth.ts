import { HTTPClient } from "./core/httpclient"
import {
  AuthClientConfig,
  AuthConfig,
  AuthEvents,
  AuthInfo,
  AuthParams,
  LinkAccountInfo,
} from "./types/auth"
import { ApiResponse } from "./types/base/apiresponse"
import { ApiKeyAuthorized, Maybe } from "./types/base"
import { Crypto } from "./core"
import { Account, DexieStorage } from "./core/app"
import { PrivyClientConfig } from "@privy-io/react-auth"
import { AuthInternalEvents } from "./interfaces/auth/authinternalevents"
import { PrivyErrorCode } from "@src/enums/adapter/auth/privyerrorcode"
import { PrivyAuthInfo } from "./types/adapter"
import { Order } from "./order"
import { Proposal } from "./proposal"
import { Oracle } from "./oracle"
import forge from "node-forge"
import { AccountInitConfig } from "./types/auth/account"
import { Chat } from "./chat"
import { CLIENT_DB_KEY_LAST_USER_LOGGED } from "./constants/app"

/**
 * Represents an authentication client that interacts with a backend server for user authentication.
 * @class Auth
 * @extends HTTPClient
 */
export class Auth extends HTTPClient implements AuthInternalEvents {
  private _storage?: DexieStorage
  private _privyAppId: string
  private _privyConfig?: PrivyClientConfig
  private _eventsCallbacks: Array<{
    callbacks: Function[]
    eventName: AuthEvents
  }> = []
  private _orderRef: Order
  private _proposalRef: Proposal
  private _oracleRef: Oracle
  private _chatRef: Chat
  private _isLoggingOut: boolean = false
  private _isAuthenticated: boolean = false

  /**
   * Constructs a new instance of Auth with the provided configuration.
   * @param {AuthConfig} config - The configuration object for authentication.
   * @returns None
   */
  constructor(config: AuthConfig & ApiKeyAuthorized) {
    super(config.devMode)

    this._storage = config.storage
    this._apiKey = config.apiKey
    this._privyAppId = config.privyAppId
    this._privyConfig = config.privyConfig
    this._orderRef = config.order
    this._oracleRef = config.oracle
    this._proposalRef = config.proposal
    this._chatRef = config.chat

    //OAuth providers like Google, Instagram etc bring the user from the current web application page to
    //their authentication pages. When the user is redirect from their auth pages to the web application page again
    //this event is fired.
    this.on(
      "__onOAuthAuthenticatedDesktop",
      async (authInfo: PrivyAuthInfo) => {
        await this._callBackendAuthAfterOAuthRedirect(authInfo)
      }
    )

    // same but for linking an account to a user already registered
    this.on(
      "__onOAuthLinkAuthenticatedDesktop",
      async (authInfo: PrivyAuthInfo) => {
        await this._callBackendLinkAfterOAuthRedirect(authInfo)
      }
    )

    //OAuth providers login error handling
    this.on("__onLoginError", (error: PrivyErrorCode) => {
      this._emit("onAuthError", error)
    })
    this.on("__onLinkAccountError", (error: PrivyErrorCode) => {
      this._emit("onLinkError", error)
    })
  }

  private async _generateKeys(): Promise<boolean | forge.pki.rsa.KeyPair> {
    const keys = await Crypto.generateKeys("HIGH")

    if (!keys) return false

    return keys
  }

  private async _getUserE2EPublicKey(
    did: string,
    organizationId: string
  ): Promise<Maybe<string>> {
    try {
      const storage = this._storage as DexieStorage
      const e2ePublicKey = await storage.transaction(
        "rw",
        storage.user,
        async () => {
          const existingUser = await storage.user
            .where("[did+organizationId]")
            .equals([did, organizationId])
            .first()

          if (!existingUser) return null

          return existingUser!.e2ePublicKey
        }
      )

      return e2ePublicKey
    } catch (error) {
      console.log(error)
      return null
    }
  }

  private async _handleDexie(account: Account) {
    const storage = this._storage as DexieStorage
    try {
      const keys = await this._generateKeys()
      if (!keys || typeof keys === "boolean")
        throw new Error("Error during generation of public/private keys.")

      //let's encrypt first the private key. Private key will be always calculated runtime.
      const encryptedPrivateKey = Crypto.encryptAES_CBC(
        Crypto.convertRSAPrivateKeyToPem(keys.privateKey),
        Buffer.from(account.e2eSecret, "hex").toString("base64"),
        Buffer.from(account.e2eSecretIV, "hex").toString("base64")
      )
      const publicKey = Crypto.convertRSAPublicKeyToPem(keys.publicKey)

      //save all the data related to this user into the db
      await storage.transaction("rw", storage.user, async () => {
        const existingUser = await storage.user
          .where("[did+organizationId]")
          .equals([account.did, account.organizationId])
          .first()

        if (!existingUser)
          await storage.user.add({
            did: account.did,
            organizationId: account.organizationId,
            username: account.username,
            email: account.email,
            bio: account.bio,
            avatarUrl: account.avatarUrl,
            isVerified: account.isVerified,
            isPfpNft: account.isPfpNft,
            wallet: {
              address: account.walletAddress,
              connectorType: account.walletConnectorType,
              imported: account.walletImported,
              recoveryMethod: account.walletRecoveryMethod,
              clientType: account.walletClientType,
            },
            apple: account.appleSubject
              ? {
                  subject: account.appleSubject,
                  email: account.email,
                }
              : null,
            discord: account.discordSubject
              ? {
                  subject: account.discordSubject,
                  email: account.discordEmail,
                  username: account.username,
                }
              : null,
            farcaster: account.farcasterFid
              ? {
                  fid: account.farcasterFid,
                  displayName: account.farcasterDisplayName,
                  ownerAddress: account.farcasterOwnerAddress,
                  pfp: account.farcasterPfp,
                  username: account.farcasterUsername,
                  signerPublicKey: account.farcasterSignerPublicKey,
                }
              : null,
            github: account.githubSubject
              ? {
                  subject: account.githubSubject,
                  email: account.githubEmail,
                  name: account.githubName,
                  username: account.githubUsername,
                }
              : null,
            google: account.googleSubject
              ? {
                  subject: account.googleSubject,
                  email: account.googleEmail,
                  name: account.googleName,
                }
              : null,
            instagram: account.instagramSubject
              ? {
                  subject: account.instagramSubject,
                  username: account.instagramUsername,
                }
              : null,
            linkedin: account.linkedinSubject
              ? {
                  subject: account.linkedinSubject,
                  email: account.linkedinEmail,
                  name: account.linkedinName,
                  vanityName: account.linkedinVanityName,
                }
              : null,
            spotify: account.spotifySubject
              ? {
                  subject: account.spotifySubject,
                  email: account.spotifyEmail,
                  name: account.spotifyName,
                }
              : null,
            telegram: account.telegramUserId
              ? {
                  firstName: account.telegramFirstName,
                  lastName: account.telegramLastName,
                  photoUrl: account.telegramPhotoUrl,
                  userId: account.telegramUserId,
                  username: account.telegramUsername,
                }
              : null,
            tiktok: account.tiktokSubject
              ? {
                  name: account.tiktokName,
                  subject: account.tiktokSubject,
                  username: account.tiktokUsername,
                }
              : null,
            twitter: account.twitterSubject
              ? {
                  name: account.twitterName,
                  subject: account.twitterSubject,
                  profilePictureUrl: account.twitterProfilePictureUrl,
                  username: account.twitterUsername,
                }
              : null,
            allowNotification: account.allowNotification,
            allowNotificationSound: account.allowNotificationSound,
            visibility: account.visibility,
            onlineStatus: account.onlineStatus,
            allowReadReceipt: account.allowReadReceipt,
            allowReceiveMessageFrom: account.allowReceiveMessageFrom,
            allowAddToGroupsFrom: account.allowAddToGroupsFrom,
            allowGroupsSuggestion: account.allowGroupsSuggestion,
            e2ePublicKey: publicKey,
            e2eEncryptedPrivateKey: encryptedPrivateKey,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
          })
      })
    } catch (error) {
      console.log(error)
      throw new Error(
        "Error during setup of the local keys. Check the console to have more information."
      )
    }
  }

  private async _callBackendAuthAfterOAuthRedirect(authInfo: PrivyAuthInfo) {
    try {
      const { response } = await this._fetch<
        ApiResponse<{
          user: AccountInitConfig
        }>
      >(`${this.backendUrl()}/auth`, {
        method: "POST",
        body: {
          ...this._formatAuthParams(authInfo),
          e2ePublicKey: await this._getUserE2EPublicKey(
            authInfo.user.id,
            this._apiKey!
          ),
        },
        headers: {
          "x-api-key": `${this._apiKey}`,
          Authorization: `Bearer ${authInfo.authToken}`,
        },
      })

      if (!response || !response.data)
        return this._emit(
          "onAuthError",
          new Error("No response from backend during authentication")
        )

      const { user } = response.data[0]

      if (!user)
        return this._emit("onAuthError", new Error("Access not granted."))

      const account = new Account(user)
      //store the key of the last user logged in the local storage, this allow to recover the user and rebuild the account object when
      //the user refresh the page
      account.storeLastUserLoggedKey()

      this.setAuthToken(authInfo.authToken)
      this._orderRef.setAuthToken(authInfo.authToken)
      this._oracleRef.setAuthToken(authInfo.authToken)
      this._proposalRef.setAuthToken(authInfo.authToken)
      this._chatRef.setAuthToken(authInfo.authToken)

      this._chatRef.setCurrentAccount(account)
      this._orderRef.setCurrentAccount(account)
      this._oracleRef.setCurrentAccount(account)
      this._proposalRef.setCurrentAccount(account)
      this.setCurrentAccount(account) //this must be the last because it fires event

      //clear all the internal callbacks connected to the authentication...
      this._clearEventsCallbacks([
        "__onOAuthAuthenticatedDesktop",
        "__onLoginError",
      ])

      //generation of the table and local keys for e2e encryption
      await this._handleDexie(account)

      this._isAuthenticated = true
    } catch (error) {
      //safety check, _account could be null and this method destroy the local storage values stored
      if ("statusCode" in (error as any) && (error as any).statusCode === 401)
        this.destroyLastUserLoggedKey()

      //clear all the internal callbacks connected to the authentication...
      this._clearEventsCallbacks([
        "__onOAuthAuthenticatedDesktop",
        "__onLoginError",
      ])
      await this.logout()
      this._emit("onAuthError", error)
    }
  }

  private async _callBackendAuth(
    resolve: (
      value:
        | { auth: AuthInfo; account: Account }
        | PromiseLike<{ auth: AuthInfo; account: Account }>
    ) => void,
    reject: (reason?: any) => void,
    authInfo: PrivyAuthInfo
  ) {
    try {
      const { response } = await this._fetch<
        ApiResponse<{
          user: AccountInitConfig
        }>
      >(`${this.backendUrl()}/auth`, {
        method: "POST",
        body: {
          ...this._formatAuthParams(authInfo),
          e2ePublicKey: await this._getUserE2EPublicKey(
            authInfo.user.id,
            this._apiKey!
          ),
        },
        headers: {
          "x-api-key": `${this._apiKey}`,
          Authorization: `Bearer ${authInfo.authToken}`,
        },
      })

      if (!response || !response.data) throw new Error("Invalid response.")

      const { user } = response.data[0]

      if (!user) throw new Error("Access not granted.")

      const account = new Account(user)
      //store the key of the last user logged in the local storage, this allow to recover the user and rebuild the account object when
      //the user refresh the page
      account.storeLastUserLoggedKey()

      this.setAuthToken(authInfo.authToken)
      console.log(authInfo.authToken)
      this._orderRef.setAuthToken(authInfo.authToken)
      this._oracleRef.setAuthToken(authInfo.authToken)
      this._proposalRef.setAuthToken(authInfo.authToken)
      this._chatRef.setAuthToken(authInfo.authToken)

      this._chatRef.setCurrentAccount(account)
      this._orderRef.setCurrentAccount(account)
      this._oracleRef.setCurrentAccount(account)
      this._proposalRef.setCurrentAccount(account)
      this.setCurrentAccount(account) //this must be the last because it fires event

      //clear all the internal callbacks connected to the authentication...
      this._clearEventsCallbacks(["__onLoginComplete", "__onLoginError"])

      //generation of the table and local keys for e2e encryption
      await this._handleDexie(account)

      this._isAuthenticated = true

      resolve({
        auth: {
          isConnected: true,
          ...authInfo,
        },
        account,
      })
    } catch (error) {
      //safety check, _account could be null and this method destroy the local storage values stored
      if ("statusCode" in (error as any) && (error as any).statusCode === 401)
        this.destroyLastUserLoggedKey()

      //clear all the internal callbacks connected to the authentication...
      this._clearEventsCallbacks(["__onLoginComplete", "__onLoginError"])
      await this.logout()
      this._emit("onAuthError", error)

      reject(error)
    }
  }

  private async _callBackendLinkAfterOAuthRedirect(authInfo: PrivyAuthInfo) {
    try {
      const { response } = await this._fetch<
        ApiResponse<{
          link: {
            status: boolean
          }
        }>
      >(`${this.backendUrl()}/user/link/account`, {
        method: "POST",
        body: {
          ...this._formatAuthParams(authInfo),
          e2ePublicKey: await this._getUserE2EPublicKey(
            authInfo.user.id,
            this._apiKey!
          ),
        },
        headers: {
          "x-api-key": `${this._apiKey}`,
          Authorization: `Bearer ${authInfo.authToken}`,
        },
      })

      if (!response || !response.data) throw new Error("Invalid response.")

      const { link } = response.data[0]
      const { status } = link

      if (!link || !status)
        throw new Error("An error occured while updating the account.")

      //clear all the internal callbacks connected to the authentication...
      this._clearEventsCallbacks([
        "__onOAuthLinkAuthenticatedDesktop",
        "__onLinkAccountError",
      ])

      this._emit("link", {
        ...authInfo,
      })
    } catch (error) {
      //safety check, _account could be null and this method destroy the local storage values stored
      if ("statusCode" in (error as any) && (error as any).statusCode === 401)
        this.destroyLastUserLoggedKey()

      this._clearEventsCallbacks([
        "__onOAuthLinkAuthenticatedDesktop",
        "__onLinkAccountError",
      ])
      this._emit("onLinkError", error)
    }
  }

  private async _callBackendLink(
    resolve: (value: PrivyAuthInfo | PromiseLike<PrivyAuthInfo>) => void,
    reject: (reason?: any) => void,
    authInfo: PrivyAuthInfo
  ) {
    try {
      const { response } = await this._fetch<
        ApiResponse<{
          link: {
            status: boolean
          }
        }>
      >(`${this.backendUrl()}/user/link/account`, {
        method: "POST",
        body: {
          ...this._formatAuthParams(authInfo),
          e2ePublicKey: await this._getUserE2EPublicKey(
            authInfo.user.id,
            this._apiKey!
          ),
        },
        headers: {
          "x-api-key": `${this._apiKey}`,
          Authorization: `Bearer ${authInfo.authToken}`,
        },
      })

      if (!response || !response.data) throw new Error("Invalid response.")

      const { link } = response.data[0]
      const { status } = link

      if (!link || !status)
        throw new Error("An error occured while updating the account.")

      //clear all the internal callbacks connected to the link...
      this._clearEventsCallbacks([
        "__onLinkAccountComplete",
        "__onLinkAccountError",
      ])

      resolve({ ...authInfo })
    } catch (error) {
      //safety check, _account could be null and this method destroy the local storage values stored
      if ("statusCode" in (error as any) && (error as any).statusCode === 401)
        this.destroyLastUserLoggedKey()

      this._clearEventsCallbacks([
        "__onLinkAccountComplete",
        "__onLinkAccountError",
      ])
      reject(error)
    }
  }

  private _formatAuthParams(authInfo: PrivyAuthInfo): AuthParams {
    return {
      did: authInfo.user.id,
      walletAddress: authInfo.user.wallet!.address,
      walletConnectorType: authInfo.user.wallet!.connectorType!,
      walletImported: authInfo.user.wallet!.imported
        ? authInfo.user.wallet!.imported
        : false,
      walletRecoveryMethod: authInfo.user.wallet!.recoveryMethod
        ? authInfo.user.wallet!.recoveryMethod
        : "",
      walletClientType: authInfo.user.wallet!.walletClientType
        ? authInfo.user.wallet!.walletClientType
        : "",
      appleSubject: authInfo.user.apple ? authInfo.user.apple.subject : null,
      appleEmail: authInfo.user.apple ? authInfo.user.apple.email : null,
      discordSubject: authInfo.user.discord
        ? authInfo.user.discord.subject
        : null,
      discordEmail: authInfo.user.discord ? authInfo.user.discord.email : null,
      discordUsername: authInfo.user.discord
        ? authInfo.user.discord.username
        : null,
      farcasterFid: authInfo.user.farcaster
        ? authInfo.user.farcaster.fid
        : null,
      farcasterDisplayName: authInfo.user.farcaster
        ? authInfo.user.farcaster.displayName
        : null,
      farcasterOwnerAddress: authInfo.user.farcaster
        ? authInfo.user.farcaster.ownerAddress
        : null,
      farcasterPfp: authInfo.user.farcaster
        ? authInfo.user.farcaster.pfp
        : null,
      farcasterSignerPublicKey: authInfo.user.farcaster
        ? authInfo.user.farcaster.signerPublicKey
        : null,
      farcasterUrl: authInfo.user.farcaster
        ? authInfo.user.farcaster.url
        : null,
      farcasterUsername: authInfo.user.farcaster
        ? authInfo.user.farcaster.username
        : null,
      githubSubject: authInfo.user.github ? authInfo.user.github.subject : null,
      githubEmail: authInfo.user.github ? authInfo.user.github.email : null,
      githubName: authInfo.user.github ? authInfo.user.github.name : null,
      githubUsername: authInfo.user.github
        ? authInfo.user.github.username
        : null,
      googleEmail: authInfo.user.google ? authInfo.user.google.email : null,
      googleName: authInfo.user.google ? authInfo.user.google.name : null,
      googleSubject: authInfo.user.google ? authInfo.user.google.subject : null,
      instagramSubject: authInfo.user.instagram
        ? authInfo.user.instagram.subject
        : null,
      instagramUsername: authInfo.user.instagram
        ? authInfo.user.instagram.username
        : null,
      linkedinEmail: authInfo.user.linkedin
        ? authInfo.user.linkedin.email
        : null,
      linkedinName: authInfo.user.linkedin ? authInfo.user.linkedin.name : null,
      linkedinSubject: authInfo.user.linkedin
        ? authInfo.user.linkedin.subject
        : null,
      linkedinVanityName: authInfo.user.linkedin
        ? authInfo.user.linkedin.vanityName
        : null,
      spotifyEmail: authInfo.user.spotify ? authInfo.user.spotify.email : null,
      spotifyName: authInfo.user.spotify ? authInfo.user.spotify.name : null,
      spotifySubject: authInfo.user.spotify
        ? authInfo.user.spotify.subject
        : null,
      telegramFirstName: authInfo.user.telegram
        ? authInfo.user.telegram.firstName
        : null,
      telegramLastName: authInfo.user.telegram
        ? authInfo.user.telegram.lastName
        : null,
      telegramPhotoUrl: authInfo.user.telegram
        ? authInfo.user.telegram.photoUrl
        : null,
      telegramUserId: authInfo.user.telegram
        ? authInfo.user.telegram.telegramUserId
        : null,
      telegramUsername: authInfo.user.telegram
        ? authInfo.user.telegram.username
        : null,
      tiktokName: authInfo.user.tiktok ? authInfo.user.tiktok.name : null,
      tiktokSubject: authInfo.user.tiktok ? authInfo.user.tiktok.subject : null,
      tiktokUsername: authInfo.user.tiktok
        ? authInfo.user.tiktok.username
        : null,
      twitterName: authInfo.user.twitter ? authInfo.user.twitter.name : null,
      twitterSubject: authInfo.user.twitter
        ? authInfo.user.twitter.subject
        : null,
      twitterProfilePictureUrl: authInfo.user.twitter
        ? authInfo.user.twitter.profilePictureUrl
        : null,
      twitterUsername: authInfo.user.twitter
        ? authInfo.user.twitter.username
        : null,
      phone: authInfo.user.phone ? authInfo.user.phone.number : null,
      email: authInfo.user.email ? authInfo.user.email.address : null,
    }
  }

  private _clearEventsCallbacks(events: Array<AuthEvents>) {
    events.forEach((event: AuthEvents) => {
      const index = this._eventsCallbacks.findIndex((item) => {
        return item.eventName === event
      })

      if (index > -1) this._eventsCallbacks[index].callbacks = []
    })
  }

  private _handleDesktopAuthentication(
    resolve: (
      value:
        | { auth: AuthInfo; account: Account }
        | PromiseLike<{ auth: AuthInfo; account: Account }>
    ) => void,
    reject: (reason?: any) => void
  ) {
    try {
      this.on("__onLoginComplete", async (authInfo: PrivyAuthInfo) => {
        this._callBackendAuth(resolve, reject, authInfo)
      })

      this.on("__onLoginError", (error: PrivyErrorCode) => {
        reject(error)
      })

      this._emit("__authenticate")
    } catch (error) {
      reject(error)
    }
  }

  private _handleDesktopLink(
    resolve: (value: PrivyAuthInfo | PromiseLike<PrivyAuthInfo>) => void,
    reject: (reason?: any) => void,

    method:
      | "apple"
      | "discord"
      | "email"
      | "farcaster"
      | "github"
      | "google"
      | "instagram"
      | "linkedin"
      | "phone"
      | "spotify"
      | "tiktok"
      | "twitter"
      | "wallet"
      | "telegram"
  ) {
    try {
      this.on("__onLinkAccountComplete", async (authInfo: PrivyAuthInfo) => {
        this._callBackendLink(resolve, reject, authInfo)
      })

      this.on("__onLinkAccountError", (error: PrivyErrorCode) => {
        reject(error)
      })

      this._emit("__link", method)
    } catch (error) {
      reject(error)
    }
  }

  _emit(eventName: AuthEvents, params?: any) {
    const index = this._eventsCallbacks.findIndex((item) => {
      return item.eventName === eventName
    })

    if (index > -1)
      this._eventsCallbacks[index].callbacks.forEach((callback) => {
        callback(params)
      })
  }

  /**
   * Updates the configuration settings for the authentication client.
   * @param {AuthClientConfig} config - The configuration object containing the settings to update.
   * @returns None
   */
  config(config: AuthClientConfig) {
    if (config.storage) this._storage = config.storage
  }

  on(eventName: AuthEvents, callback: Function, onlyOnce?: boolean) {
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

  authenticate(): Promise<{ auth: AuthInfo; account: Account }> {
    return new Promise((resolve, reject) => {
      this._handleDesktopAuthentication(resolve, reject)
    })
  }

  sendEmailOTPCode(email: string): Promise<{ email: string }> {
    return new Promise((resolve, reject) => {
      this.on("__onEmailOTPCodeSent", (email: string) => {
        resolve({ email })
      })

      this.on("__onEmailOTPCodeSentError", (error: string) => {
        reject(error)
      })

      this._emit("__sendEmailOTPCode", email)
    })
  }

  sendPhoneOTPCode(phone: string): Promise<{ phone: string }> {
    return new Promise((resolve, reject) => {
      this.on("__onSMSOTPCodeSent", (phone: string) => {
        resolve({ phone })
      })

      this.on("__onSMSOTPCodeSentError", (error: string) => {
        reject(error)
      })

      this._emit("__sendSMSOTPCode", phone)
    })
  }

  sendEmailOTPCodeAfterAuth(email: string): Promise<{ email: string }> {
    return new Promise((resolve, reject) => {
      this.on("__onEmailOTPCodeAfterAuthSent", (email: string) => {
        resolve({ email })
      })

      this.on("__onEmailOTPCodeAfterAuthSentError", (error: string) => {
        reject(error)
      })

      this._emit("__sendEmailOTPCodeAfterAuth", email)
    })
  }

  sendPhoneOTPCodeAfterAuth(phone: string): Promise<{ phone: string }> {
    return new Promise((resolve, reject) => {
      this.on("__onSMSOTPCodeAfterAuthSent", (phone: string) => {
        resolve({ phone })
      })

      this.on("__onSMSOTPCodeSentAfterAuthError", (error: string) => {
        reject(error)
      })

      this._emit("__sendSMSOTPCodeAfterAuth", phone)
    })
  }

  //call this if you want to auth the user automatically without the need of a button to authenticate
  //e.g. auth.ready(() => { auth.authenticate() })
  ready() {
    return new Promise((resolve, reject) => {
      try {
        this.on("__onPrivyReady", () => {
          resolve(true)
        })
      } catch (error) {
        resolve(false)
      }
    })
  }

  logout(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.on("__onLogoutComplete", (status: boolean) => {
          this._isLoggingOut = false
          this._clearEventsCallbacks(["__onLogoutComplete"])
          resolve(status)
        })

        this._isLoggingOut = true
        this._isAuthenticated = false
        this._clearEventsCallbacks(["__onLoginComplete", "__onLoginError"])
        this._account?.emptyActiveWallets()
        this.destroyLastUserLoggedKey()
        this.setAuthToken(null)
        this._oracleRef.setAuthToken(null)
        this._chatRef.setAuthToken(null)
        this._orderRef.setAuthToken(null)
        this._proposalRef.setAuthToken(null)

        this._emit("__logout")
      } catch (error) {
        this._clearEventsCallbacks([
          "__onLoginComplete",
          "__onLoginError",
          "__onLogoutComplete",
        ])
        console.warn(error)
        reject(false)
      }
    })
  }

  isLoggingOut() {
    return this._isLoggingOut === true
  }

  isAuthenticated() {
    return this._isAuthenticated === true
  }

  link(
    method:
      | "apple"
      | "discord"
      | "email"
      | "farcaster"
      | "github"
      | "google"
      | "instagram"
      | "linkedin"
      | "phone"
      | "spotify"
      | "tiktok"
      | "twitter"
      | "wallet"
      | "telegram"
  ): Promise<LinkAccountInfo> {
    return new Promise((resolve, reject) => {
      this._handleDesktopLink(resolve, reject, method)
    })
  }

  unlink(
    method:
      | "apple"
      | "discord"
      | "email"
      | "farcaster"
      | "github"
      | "google"
      | "instagram"
      | "linkedin"
      | "phone"
      | "spotify"
      | "tiktok"
      | "twitter"
      | "wallet"
      | "telegram"
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.on("__onUnlinkAccountComplete", (status: boolean) => {
          //aggiungere await per chiamata lato server per aggiornare backend
          resolve(status)
        })

        this.on(
          "__onUnlinkAccountError",
          ({ error }: { error: PrivyErrorCode }) => {
            reject({ error })
          }
        )

        this._emit("__unlink", method)
      } catch (error) {
        console.warn(error)
        reject(error)
      }
    })
  }

  async recoverAccountFromLocalDB(): Promise<void> {
    if (!this._storage) return
    if (this._account) return

    const lastUserLoggedKey = window.localStorage.getItem(
      CLIENT_DB_KEY_LAST_USER_LOGGED
    )

    if (!lastUserLoggedKey) return

    try {
      const { did, organizationId, token } = JSON.parse(lastUserLoggedKey)
      const user = await this._storage.get("user", "[did+organizationId]", [
        did,
        organizationId,
      ])

      const { response } = await this._fetch<
        ApiResponse<{
          secrets: {
            e2eSecret: string
            e2eSecretIV: string
          }
        }>
      >(`${this.backendUrl()}/user/secrets`, {
        method: "GET",
        headers: {
          "x-api-key": `${this._apiKey}`,
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response || !response.data) return

      const { secrets } = response.data[0]

      if (!secrets) return

      const { e2eSecret, e2eSecretIV } = secrets

      const account = new Account({
        did: user.did,
        organizationId: user.organizationId,
        token: token,
        walletAddress: user.wallet.address,
        walletConnectorType: user.wallet.connectorType,
        walletImported: user.wallet.imported,
        walletRecoveryMethod: user.wallet.recoveryMethod,
        walletClientType: user.wallet.clientType,
        appleSubject: user.apple ? user.apple.subject : null,
        appleEmail: user.apple ? user.apple.email : null,
        discordSubject: user.discord ? user.discord.subject : null,
        discordEmail: user.discord ? user.discord.email : null,
        discordUsername: user.discord ? user.discord.username : null,
        farcasterFid: user.farcaster ? user.farcaster.fid : null,
        farcasterDisplayName: user.farcaster
          ? user.farcaster.displayName
          : null,
        farcasterOwnerAddress: user.farcaster
          ? user.farcaster.ownerAddress
          : null,
        farcasterPfp: user.farcaster ? user.farcaster.pfp : null,
        farcasterSignerPublicKey: user.farcaster
          ? user.farcaster.signerPublicKey
          : null,
        farcasterUrl: user.farcaster ? user.farcaster.url : null,
        farcasterUsername: user.farcaster ? user.farcaster.username : null,
        githubSubject: user.github ? user.github.subject : null,
        githubEmail: user.github ? user.github.email : null,
        githubName: user.github ? user.github.name : null,
        githubUsername: user.github ? user.github.username : null,
        googleEmail: user.google ? user.google.email : null,
        googleName: user.github ? user.google.name : null,
        googleSubject: user.github ? user.google.subject : null,
        instagramSubject: user.instagram ? user.instagram.subject : null,
        instagramUsername: user.instagram ? user.instagram.username : null,
        linkedinEmail: user.linkedin ? user.linkedin.email : null,
        linkedinName: user.linkedin ? user.linkedin.name : null,
        linkedinSubject: user.linkedin ? user.linkedin.subject : null,
        linkedinVanityName: user.linkedin ? user.linkedin.vanityName : null,
        spotifyEmail: user.spotify ? user.spotify.email : null,
        spotifyName: user.spotify ? user.spotify.name : null,
        spotifySubject: user.spotify ? user.spotifySubject : null,
        telegramFirstName: user.telegram ? user.telegram.firstName : null,
        telegramLastName: user.telegram ? user.telegram.lastName : null,
        telegramPhotoUrl: user.telegram ? user.telegram.photoUrl : null,
        telegramUserId: user.telegram ? user.telegram.userId : null,
        telegramUsername: user.telegram ? user.telegram.username : null,
        tiktokName: user.tiktok ? user.tiktok.name : null,
        tiktokSubject: user.tiktok ? user.tiktok.subject : null,
        tiktokUsername: user.tiktok ? user.tiktok.username : null,
        twitterName: user.twitter ? user.twitter.name : null,
        twitterSubject: user.twitter ? user.twitter.subject : null,
        twitterProfilePictureUrl: user.twitter
          ? user.twitter.profilePictureUrl
          : null,
        twitterUsername: user.twitter ? user.twitter.username : null,
        dynamoDBUserID: user.dynamoDBUserID,
        username: user.username,
        email: user.email,
        bio: user.bio,
        firstLogin: user.firstLogin,
        avatarUrl: user.avatarUrl,
        phone: user.phone ? user.phone : null,
        isVerified: user.isVerified,
        isPfpNft: user.isPfpNft,
        collectionAddress: user.collectionAddress,
        tokenId: user.tokenId ? user.tokenId : null,
        proposalNotificationPush: user.proposalNotificationPush,
        proposalNotificationSystem: user.proposalNotificationSystem,
        orderNotificationPush: user.orderNotificationPush,
        orderNotificationSystem: user.orderNotificationSystem,
        followNotificationPush: user.followNotificationPush,
        followNotificationSystem: user.followNotificationSystem,
        collectionNotificationPush: user.collectionNotificationPush,
        collectionNotificationSystem: user.collectionNotificationSystem,
        generalNotificationPush: user.generalNotificationPush,
        generalNotificationSystem: user.generalNotificationSystem,
        accountSuspended: user.accountSuspended,
        e2ePublicKey: user.e2ePublicKey,
        e2eSecret, //this info comes from the backend. This data is never stored in the local DB, it exists only in memory to make harder the access to it
        e2eSecretIV, //this info comes from the backend. This data is never stored in the local DB, it exists only in memory to make harder the access to it
        createdAt: user.createdAt,
        updatedAt: user.updatedAt ? user.updatedAt : null,
        deletedAt: user.deletedAt ? user.deletedAt : null,
        allowNotification: user.allowNotification,
        allowNotificationSound: user.allowNotificationSound,
        visibility: user.visibility,
        onlineStatus: user.onlineStatus,
        allowReadReceipt: user.allowReadReceipt,
        allowReceiveMessageFrom: user.allowReceiveMessageFrom,
        allowAddToGroupsFrom: user.allowAddToGroupsFrom,
        allowGroupsSuggestion: user.allowGroupsSuggestion,
      })

      this.setAuthToken(token)
      this._oracleRef.setAuthToken(token)
      this._chatRef.setAuthToken(token)
      this._proposalRef.setAuthToken(token)
      this._orderRef.setAuthToken(token)

      this._chatRef.setCurrentAccount(account)
      this._orderRef.setCurrentAccount(account)
      this._oracleRef.setCurrentAccount(account)
      this._proposalRef.setCurrentAccount(account)
      this.setCurrentAccount(account) //this must be the last because it fires event
    } catch (error) {
      //safety check, _account could be null and this method destroy the local storage values stored
      if ("statusCode" in (error as any) && (error as any).statusCode === 401) {
        this.destroyLastUserLoggedKey()
        await this.logout()
      }

      console.log("Error during rebuilding phase for account.")
      console.log(error)
    }
  }

  destroyLastUserLoggedKey() {
    window.localStorage.removeItem(CLIENT_DB_KEY_LAST_USER_LOGGED)
  }

  setCurrentAccount(account: Account) {
    super.setCurrentAccount(account)
    this._emit("__onAccountReady")
  }
}
