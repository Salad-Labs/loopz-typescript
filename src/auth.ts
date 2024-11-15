import { Client } from "./core/client"
import {
  AuthConfig,
  AuthEvents,
  AuthInfo,
  AuthParams,
  LinkAccountInfo,
} from "./types/auth"
import { ApiResponse } from "./types/base/apiresponse"
import { ApiKeyAuthorized, Maybe } from "./types/base"
import { Crypto } from "./core"
import { DexieStorage } from "./core/app"
import { AuthInternalEvents } from "./interfaces/auth/authinternalevents"
import { PrivyErrorCode } from "./enums/adapter/auth/privyerrorcode"
import { PrivyAuthInfo } from "./types/adapter"
import { AccountInitConfig } from "./types/auth/account"
import { CLIENT_DB_KEY_LAST_USER_LOGGED } from "./constants/app"
import { AuthLinkMethod } from "./types/auth/authlinkmethod"
import { getAccessToken } from "@privy-io/react-auth"
import { Account, Chat, Serpens } from "."
import { LocalDBUser } from "./core/app/database"

/**
 * Represents an authentication client that interacts with a backend server for user authentication.
 */
export class Auth implements AuthInternalEvents {
  private static _config: Maybe<AuthConfig & ApiKeyAuthorized> = null
  private static _instance: Maybe<Auth> = null
  private static _client: Maybe<Client> = null

  private static _realtimeAuthorizationToken: Maybe<string> = null
  private static _authToken: Maybe<string> = null
  private static _apiKey: string
  private static _account: Maybe<Account> = null
  private static _authInfo: Maybe<AuthInfo> = null

  private static _storage: DexieStorage
  private static _eventsCallbacks: Array<{
    callbacks: Function[]
    event: AuthEvents
  }> = []
  private static _isLoggingOut = false
  private static _isAuthenticated = false

  private static set authToken(authToken: Maybe<string>) {
    Auth._authToken = authToken
    Auth._realtimeAuthorizationToken = authToken
      ? `${Auth._apiKey}##${authToken}`
      : null
  }

  private static set account(account: Maybe<Account>) {
    Auth._account = account
    if (!!account) Auth._emit("__onAccountReady")
  }

  static get realtimeAuthorizationToken() {
    return Auth._realtimeAuthorizationToken
  }

  static get apiKey() {
    return Auth._apiKey
  }

  static get authToken() {
    return Auth._authToken
  }

  static get account() {
    return Auth._account
  }

  private constructor() {
    if (!!!Auth._config)
      throw new Error("Auth must be configured before getting the instance")

    Auth._storage = Auth._config.storage
    Auth._apiKey = Auth._config.apiKey
    Auth._client = new Client(Auth._config.devMode)

    //OAuth providers like Google, Instagram etc bring the user from the current web application page to
    //their authentication pages. When the user is redirect from their auth pages to the web application page again
    //this event is fired.
    this.on(
      "__onOAuthAuthenticatedDesktop",
      Auth._callBackendAuthAfterOAuthRedirect
    )

    // same but for linking an account to a user already registered
    this.on(
      "__onOAuthLinkAuthenticatedDesktop",
      Auth._callBackendLinkAfterOAuthRedirect
    )

    //OAuth providers login error handling
    this.on("__onLoginError", (error: PrivyErrorCode) => {
      Auth._emit("onAuthError", error)
    })

    this.on("__onLinkAccountError", (error: PrivyErrorCode) => {
      Auth._emit("onLinkError", error)
    })

    Auth._instance = this
  }

  /** static methods */

  private static async _generateKeys() {
    try {
      const keys = await Crypto.generateKeys("HIGH")
      if (!keys)
        throw new Error("Error during generation of public/private keys.")

      return keys
    } catch (error) {
      throw error
    }
  }

  private static async _getUserE2EPublicKey(
    did: string,
    organizationId: string
  ): Promise<Maybe<string>> {
    return new Promise<Maybe<string>>((resolve, reject) => {
      Serpens.addAction(() => {
        Auth._storage.user
          .where("[did+organizationId]")
          .equals([did, organizationId])
          .first()
          .then((existingUser) => {
            resolve(existingUser ? existingUser.e2ePublicKey : null)
          })
          .catch(reject)
      })
    })
  }

  private static async _storeUserLocalDB(): Promise<Maybe<string>> {
    try {
      if (!Auth._account) throw new Error("Account is not set")
      const keys = await Auth._generateKeys()

      //let's encrypt first the private key. Private key will be always calculated runtime.
      const encryptedPrivateKey = Crypto.encryptAES_CBC(
        Crypto.convertRSAPrivateKeyToPem(keys.privateKey),
        Buffer.from(Auth._account.e2eSecret, "hex").toString("base64"),
        Buffer.from(Auth._account.e2eSecretIV, "hex").toString("base64")
      )
      const publicKey = Crypto.convertRSAPublicKeyToPem(keys.publicKey)

      const existingUser = await new Promise<LocalDBUser | undefined>(
        (resolve, reject) => {
          Serpens.addAction(() => {
            if (!Auth._account)
              throw new Error("Account is not setup correctly.")

            Auth._storage.user
              .where("[did+organizationId]")
              .equals([Auth._account!.did, Auth._account!.organizationId])
              .first()
              .then(resolve)
              .catch(reject)
          })
        }
      )

      if (existingUser) return null

      //save all the data related to this user into the db

      await new Promise((resolve, reject) => {
        Serpens.addAction(() => {
          if (!Auth._account) throw new Error("Account is not setup correctly.")

          Auth._storage.user
            .add({
              did: Auth._account.did,
              organizationId: Auth._account.organizationId,
              dynamoDBUserID: Auth._account.dynamoDBUserID,
              username: Auth._account.username,
              email: Auth._account.email,
              bio: Auth._account.bio,
              avatarUrl: Auth._account.avatarUrl,
              imageSettings: Auth._account.imageSettings
                ? Auth._account.imageSettings
                : null,
              isVerified: Auth._account.isVerified,
              isPfpNft: Auth._account.isPfpNft,
              pfp: Auth._account.pfp ? Auth._account.pfp : null,
              wallet: {
                address: Auth._account.walletAddress,
                connectorType: Auth._account.walletConnectorType,
                imported: Auth._account.walletImported,
                recoveryMethod: Auth._account.walletRecoveryMethod,
                clientType: Auth._account.walletClientType,
              },
              apple: Auth._account.appleSubject
                ? {
                    subject: Auth._account.appleSubject,
                    email: Auth._account.email,
                  }
                : null,
              discord: Auth._account.discordSubject
                ? {
                    subject: Auth._account.discordSubject,
                    email: Auth._account.discordEmail,
                    username: Auth._account.username,
                  }
                : null,
              farcaster: Auth._account.farcasterFid
                ? {
                    fid: Auth._account.farcasterFid,
                    displayName: Auth._account.farcasterDisplayName,
                    ownerAddress: Auth._account.farcasterOwnerAddress,
                    pfp: Auth._account.farcasterPfp,
                    username: Auth._account.farcasterUsername,
                    signerPublicKey: Auth._account.farcasterSignerPublicKey,
                  }
                : null,
              github: Auth._account.githubSubject
                ? {
                    subject: Auth._account.githubSubject,
                    email: Auth._account.githubEmail,
                    name: Auth._account.githubName,
                    username: Auth._account.githubUsername,
                  }
                : null,
              google: Auth._account.googleSubject
                ? {
                    subject: Auth._account.googleSubject,
                    email: Auth._account.googleEmail,
                    name: Auth._account.googleName,
                  }
                : null,
              instagram: Auth._account.instagramSubject
                ? {
                    subject: Auth._account.instagramSubject,
                    username: Auth._account.instagramUsername,
                  }
                : null,
              linkedin: Auth._account.linkedinSubject
                ? {
                    subject: Auth._account.linkedinSubject,
                    email: Auth._account.linkedinEmail,
                    name: Auth._account.linkedinName,
                    vanityName: Auth._account.linkedinVanityName,
                  }
                : null,
              spotify: Auth._account.spotifySubject
                ? {
                    subject: Auth._account.spotifySubject,
                    email: Auth._account.spotifyEmail,
                    name: Auth._account.spotifyName,
                  }
                : null,
              telegram: Auth._account.telegramUserId
                ? {
                    firstName: Auth._account.telegramFirstName,
                    lastName: Auth._account.telegramLastName,
                    photoUrl: Auth._account.telegramPhotoUrl,
                    userId: Auth._account.telegramUserId,
                    username: Auth._account.telegramUsername,
                  }
                : null,
              tiktok: Auth._account.tiktokSubject
                ? {
                    name: Auth._account.tiktokName,
                    subject: Auth._account.tiktokSubject,
                    username: Auth._account.tiktokUsername,
                  }
                : null,
              twitter: Auth._account.twitterSubject
                ? {
                    name: Auth._account.twitterName,
                    subject: Auth._account.twitterSubject,
                    profilePictureUrl: Auth._account.twitterProfilePictureUrl,
                    username: Auth._account.twitterUsername,
                  }
                : null,
              proposalNotificationPush: Auth._account.proposalNotificationPush,
              proposalNotificationSystem:
                Auth._account.proposalNotificationSystem,
              orderNotificationPush: Auth._account.orderNotificationPush,
              orderNotificationSystem: Auth._account.orderNotificationSystem,
              followNotificationPush: Auth._account.followNotificationPush,
              followNotificationSystem: Auth._account.followNotificationSystem,
              collectionNotificationPush:
                Auth._account.collectionNotificationPush,
              collectionNotificationSystem:
                Auth._account.collectionNotificationSystem,
              generalNotificationPush: Auth._account.generalNotificationPush,
              generalNotificationSystem:
                Auth._account.generalNotificationSystem,
              accountSuspended: Auth._account.accountSuspended,
              allowNotification: Auth._account.allowNotification,
              allowNotificationSound: Auth._account.allowNotificationSound,
              visibility: Auth._account.visibility,
              onlineStatus: Auth._account.onlineStatus,
              allowReadReceipt: Auth._account.allowReadReceipt,
              allowReceiveMessageFrom: Auth._account.allowReceiveMessageFrom,
              allowAddToGroupsFrom: Auth._account.allowAddToGroupsFrom,
              allowGroupsSuggestion: Auth._account.allowGroupsSuggestion,
              e2ePublicKey: publicKey,
              e2eEncryptedPrivateKey: encryptedPrivateKey,
              createdAt: Auth._account.createdAt,
              updatedAt: Auth._account.updatedAt,
            })
            .then(resolve)
            .catch(reject)
        })
      })

      return publicKey
    } catch (error) {
      console.error(error)
      throw new Error(
        "Error during setup of the local keys. Check the console to have more information."
      )
    }
  }

  private static async _callBackendAuthAfterOAuthRedirect(
    authInfo: PrivyAuthInfo
  ) {
    if (!!!Auth._config || !!!Auth._instance || !!!Auth._client)
      throw new Error("Auth has not been configured")

    Auth.authToken = authInfo.authToken

    try {
      const e2ePublicKey = await Auth._getUserE2EPublicKey(
        authInfo.user.id,
        Auth._apiKey
      )

      const { response } = await Auth._client.fetch<
        ApiResponse<{
          user: AccountInitConfig
        }>
      >(Auth._client.backendUrl("/auth"), {
        method: "POST",
        body: {
          ...Auth._formatAuthParams(authInfo),
          e2ePublicKey,
        },
      })

      if (!response || !response.data)
        return Auth._emit(
          "onAuthError",
          new Error("No response from backend during authentication.")
        )

      const { user } = response.data[0]

      if (!user)
        return Auth._emit("onAuthError", new Error("Access not granted."))

      //let's check if it's the first login of the user.
      //this is needed to understand if the user is doing the login on a different device
      Chat.getInstance().setCanChat(user.firstLogin || !!e2ePublicKey)
      Auth._isAuthenticated = true
      Auth.account = new Account({
        enableDevMode: Auth._config.devMode,
        storage: Auth._config.storage,
        ...user,
      })
      //store the key of the last user logged in the local storage, this allow to recover the user and rebuild the account object when
      //the user refresh the page
      Auth._account!.storeLastUserLoggedKey()

      //generation of the table and local keys for e2e encryption
      const e2eKey = await Auth._storeUserLocalDB()

      //if this condition is true, means the user has done the signup for the first time ever, since e2ePublicKey is supposed to be null in that case
      if (e2eKey !== e2ePublicKey && !e2ePublicKey) {
        const { response } = await Auth._client.fetch<
          ApiResponse<{
            updated: boolean
          }>
        >(Auth._client.backendUrl("/auth/update/e2e"), {
          method: "POST",
          body: {
            e2ePublicKey: e2eKey,
          },
        })

        if (!response || !response.data) throw new Error("Invalid response.")

        const { updated } = response.data[0]

        if (!updated) throw new Error("Update E2E Failed. Access not granted.")
      }

      //clear all the internal callbacks connected to the authentication...
      Auth._clearEventsCallbacks([
        "__onOAuthAuthenticatedDesktop",
        "__onLoginError",
      ])
    } catch (error) {
      //clear all the internal callbacks connected to the authentication...
      this._clearEventsCallbacks([
        "__onOAuthAuthenticatedDesktop",
        "__onLoginError",
      ])
      await Auth._instance.logout()
      Auth._emit("onAuthError", error)
    }
  }

  private static async _callBackendAuth(authInfo: PrivyAuthInfo) {
    if (!!!Auth._config || !!!Auth._instance || !!!Auth._client)
      throw new Error("Auth has not been configured")

    Auth.authToken = authInfo.authToken

    try {
      const e2ePublicKey = await Auth._getUserE2EPublicKey(
        authInfo.user.id,
        Auth._apiKey
      )

      const { response } = await Auth._client.fetch<
        ApiResponse<{
          user: AccountInitConfig
        }>
      >(Auth._client.backendUrl("/auth"), {
        method: "POST",
        body: {
          ...Auth._formatAuthParams(authInfo),
          e2ePublicKey,
        },
      })

      if (!response || !response.data) throw new Error("Invalid response.")

      const { user } = response.data[0]

      if (!user) throw new Error("Access not granted.")

      //let's check if it's the first login of the user.
      //this is needed to understand if the user is doing the login on a different device
      Chat.getInstance().setCanChat(user.firstLogin || !!e2ePublicKey)
      Auth._isAuthenticated = true
      Auth._authInfo = {
        isConnected: true,
        ...authInfo,
      }
      Auth.account = new Account({
        enableDevMode: Auth._config.devMode,
        storage: Auth._config.storage,
        ...user,
      })

      //store the key of the last user logged in the local storage, this allow to recover the user and rebuild the account object when
      //the user refresh the page
      Auth._account!.storeLastUserLoggedKey()

      //generation of the table and local keys for e2e encryption
      const e2eKey = await Auth._storeUserLocalDB()

      //if this condition is true, means the user has done the signup for the first time ever, since e2ePublicKey is supposed to be null in that case
      if (e2eKey !== e2ePublicKey && !e2ePublicKey) {
        const { response } = await Auth._client.fetch<
          ApiResponse<{
            updated: boolean
          }>
        >(Auth._client.backendUrl("/auth/update/e2e"), {
          method: "POST",
          body: {
            e2ePublicKey: e2eKey,
          },
        })

        if (!response || !response.data) throw new Error("Invalid response.")

        const { updated } = response.data[0]

        if (!updated) throw new Error("Update E2E Failed. Access not granted.")
      }

      //clear all the internal callbacks connected to the authentication...
      Auth._clearEventsCallbacks(["__onLoginComplete", "__onLoginError"])

      return {
        auth: Auth._authInfo,
        account: Auth._account!,
      }
    } catch (error) {
      console.error(error)

      //clear all the internal callbacks connected to the authentication...
      Auth._clearEventsCallbacks(["__onLoginComplete", "__onLoginError"])
      await Auth._instance.logout()
      Auth._emit("onAuthError", error)

      throw error
    }
  }

  private static async _callBackendLinkAfterOAuthRedirect(
    authInfo: PrivyAuthInfo
  ) {
    if (!!!Auth._config || !!!Auth._instance || !!!Auth._client)
      throw new Error("Auth has not been configured")

    Auth.authToken = authInfo.authToken

    try {
      const { response } = await Auth._client.fetch<
        ApiResponse<{
          link: {
            status: boolean
          }
        }>
      >(Auth._client.backendUrl("/user/link/account"), {
        method: "POST",
        body: {
          ...Auth._formatAuthParams(authInfo),
          e2ePublicKey: await Auth._getUserE2EPublicKey(
            authInfo.user.id,
            Auth._apiKey
          ),
        },
      })

      if (!response || !response.data) throw new Error("Invalid response.")

      const { link } = response.data[0]
      const { status } = link

      if (!link || !status)
        throw new Error("An error occured while updating the account.")

      //clear all the internal callbacks connected to the authentication...
      Auth._clearEventsCallbacks([
        "__onOAuthLinkAuthenticatedDesktop",
        "__onLinkAccountError",
      ])
      Auth._emit("link", authInfo)
    } catch (error: any) {
      console.error(error)
      if ("statusCode" in error && error.statusCode === 401) {
        Auth._clearEventsCallbacks([
          "__onOAuthLinkAuthenticatedDesktop",
          "__onLinkAccountError",
          "__onLoginComplete",
          "__onLoginError",
        ])

        Auth._emit("onLinkError", error)
        await Auth._instance.logout()
        Auth._emit("onAuthError", error)
      } else {
        Auth._clearEventsCallbacks([
          "__onOAuthLinkAuthenticatedDesktop",
          "__onLinkAccountError",
        ])
        Auth._emit("onLinkError", error)
      }
    }
  }

  private static async _callBackendLink(authInfo: PrivyAuthInfo) {
    if (!!!Auth._config || !!!Auth._instance || !!!Auth._client)
      throw new Error("Auth has not been configured")

    Auth.authToken = authInfo.authToken

    try {
      const { response } = await Auth._client.fetch<
        ApiResponse<{
          link: {
            status: boolean
          }
        }>
      >(Auth._client.backendUrl("/user/link/account"), {
        method: "POST",
        body: {
          ...Auth._formatAuthParams(authInfo),
          e2ePublicKey: await Auth._getUserE2EPublicKey(
            authInfo.user.id,
            Auth._apiKey
          ),
        },
      })

      if (!response || !response.data) throw new Error("Invalid response.")

      const { link } = response.data[0]
      const { status } = link

      if (!link || !status)
        throw new Error("An error occured while updating the account.")

      //clear all the internal callbacks connected to the link...
      Auth._clearEventsCallbacks([
        "__onLinkAccountComplete",
        "__onLinkAccountError",
      ])

      return authInfo
    } catch (error: any) {
      if ("statusCode" in error && error.statusCode === 401) {
        Auth._clearEventsCallbacks([
          "__onLinkAccountComplete",
          "__onLinkAccountError",
          "__onLoginComplete",
          "__onLoginError",
        ])

        await Auth._instance.logout()
        Auth._emit("onAuthError", error)
      } else {
        Auth._clearEventsCallbacks([
          "__onLinkAccountComplete",
          "__onLinkAccountError",
        ])
      }

      throw error
    }
  }

  private static _formatAuthParams(authInfo: PrivyAuthInfo): AuthParams {
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

  private static _clearEventsCallbacks(events: Array<AuthEvents>) {
    for (const event of events) {
      const index = Auth._eventsCallbacks.findIndex(
        (item) => item.event === event
      )
      if (index < 0) return

      Auth._eventsCallbacks[index].callbacks = []
    }
  }

  private static async _handleDesktopAuthentication() {
    return new Promise<{
      auth: AuthInfo
      account: Account
    }>((resolve, reject) => {
      if (!!!Auth._config || !!!Auth._instance)
        throw new Error("Auth has not been configured")

      Auth._instance.on("__onLoginComplete", (authInfo: PrivyAuthInfo) => {
        Auth._callBackendAuth(authInfo).then(resolve).catch(reject)
      })

      Auth._instance.on("__onLoginError", reject)

      Auth._emit("__authenticate")
    })
  }

  private static async _handleDesktopLink(method: AuthLinkMethod) {
    return new Promise<PrivyAuthInfo>((resolve, reject) => {
      if (!!!Auth._config || !!!Auth._instance)
        throw new Error("Auth has not been configured")

      Auth._instance.on(
        "__onLinkAccountComplete",
        (authInfo: PrivyAuthInfo) => {
          Auth._callBackendLink(authInfo).then(resolve).catch(reject)
        }
      )

      Auth._instance.on("__onLinkAccountError", reject)

      Auth._emit("__link", method)
    })
  }

  static _emit(event: AuthEvents, params?: any) {
    const index = Auth._eventsCallbacks.findIndex(
      (item) => item.event === event
    )
    if (index < 0) return

    Auth._eventsCallbacks[index].callbacks.forEach((callback) =>
      callback(params)
    )
  }

  static config(config: AuthConfig & ApiKeyAuthorized) {
    if (!!Auth._config) throw new Error("Auth already configured")

    Auth._config = config
  }

  static getInstance() {
    return Auth._instance ?? new Auth()
  }

  /** public instance methods */

  /**
   * Add a new event and the associated callback.
   * @param event - The event to listen.
   * @param callback - The callback related to this event.
   * @param onlyOnce - An optional flag, it allows the adding of only one callback associated to this event.
   */
  on(event: AuthEvents, callback: Function, onlyOnce?: boolean) {
    const index = Auth._eventsCallbacks.findIndex(
      (item) => item.event === event
    )

    if (index < 0)
      Auth._eventsCallbacks.push({
        event,
        callbacks: [callback],
      })
    else {
      // this is wrong, if i flag onlyOnce: true i still want my callback to be executed, just once tho
      if (onlyOnce) return
      Auth._eventsCallbacks[index].callbacks.push(callback)
    }
  }

  /**
   * Remove an event and the associated callback or all the callbacks associated to that event.
   * @param event - The event to unlisten.
   * @param callback - The callback related to this event.
   * @returns None
   */
  off(event: AuthEvents, callback?: Function) {
    const index = Auth._eventsCallbacks.findIndex((item) => {
      return item.event === event
    })

    if (index < 0) return

    Auth._eventsCallbacks[index].callbacks = callback
      ? Auth._eventsCallbacks[index].callbacks.filter((cb) => cb !== callback)
      : []
  }

  authenticate(): Promise<{ auth: AuthInfo; account: Account }> {
    return Auth._handleDesktopAuthentication()
  }

  sendEmailOTPCode(email: string): Promise<{ email: string }> {
    return new Promise((resolve, reject) => {
      this.on("__onEmailOTPCodeSent", (email: string) => resolve({ email }))

      this.on("__onEmailOTPCodeSentError", reject)

      Auth._emit("__sendEmailOTPCode", email)
    })
  }

  sendPhoneOTPCode(phone: string): Promise<{ phone: string }> {
    return new Promise((resolve, reject) => {
      this.on("__onSMSOTPCodeSent", (phone: string) => resolve({ phone }))

      this.on("__onSMSOTPCodeSentError", reject)

      Auth._emit("__sendSMSOTPCode", phone)
    })
  }

  sendEmailOTPCodeAfterAuth(email: string): Promise<{ email: string }> {
    return new Promise((resolve, reject) => {
      this.on("__onEmailOTPCodeAfterAuthSent", (email: string) =>
        resolve({ email })
      )

      this.on("__onEmailOTPCodeAfterAuthSentError", reject)

      Auth._emit("__sendEmailOTPCodeAfterAuth", email)
    })
  }

  sendPhoneOTPCodeAfterAuth(phone: string): Promise<{ phone: string }> {
    return new Promise((resolve, reject) => {
      this.on("__onSMSOTPCodeAfterAuthSent", (phone: string) =>
        resolve({ phone })
      )

      this.on("__onSMSOTPCodeSentAfterAuthError", reject)

      Auth._emit("__sendSMSOTPCodeAfterAuth", phone)
    })
  }

  /**
   * call this if you want to auth the user automatically without the need of a button to authenticate.
   *
   * e.g. auth.ready().then(() => auth.authenticate())
   */
  ready() {
    return new Promise((resolve) =>
      this.on("__onPrivyReady", () => resolve(true))
    )
  }

  logout(): Promise<boolean> {
    return new Promise((resolve) => {
      this.on("__onLogoutComplete", (status: boolean) => {
        Auth._isLoggingOut = false
        Auth._clearEventsCallbacks(["__onLogoutComplete"])
        resolve(status)
      })

      Auth._isLoggingOut = true
      Auth._isAuthenticated = false
      Auth.authToken = null
      // ? should Auth._account = null? auth.on("_logout", () => auth.getCurrentAccount() // exists)
      Auth._clearEventsCallbacks(["__onLoginComplete", "__onLoginError"])

      // TODO exists?
      Auth._account?.emptyActiveWallets()
      Chat.getInstance().disconnect()

      Auth._emit("__logout")
    })
  }

  isLoggingOut() {
    return Auth._isLoggingOut
  }

  isAuthenticated() {
    return Auth._isAuthenticated
  }

  getAuthInfo() {
    return Auth._authInfo
  }

  getCurrentAccount() {
    return Auth.account
  }

  async link(method: AuthLinkMethod) {
    return new Promise<LinkAccountInfo>((resolve, reject) => {
      Auth._handleDesktopLink(method).then(resolve).catch(reject)
    })
  }

  async unlink(method: AuthLinkMethod) {
    return new Promise<boolean>((resolve, reject) => {
      this.on("__onUnlinkAccountComplete", (status: boolean) => {
        // TODO aggiungere await per chiamata lato server per aggiornare backend
        resolve(status)
      })

      this.on("__onUnlinkAccountError", reject)

      Auth._emit("__unlink", method)
    })
  }

  public static async recoverAccountFromLocalDB() {
    if (!!!Auth._config || !!!Auth._instance || !!!Auth._client)
      throw new Error("Auth has not been configured")
    if (Auth._account) return

    const lastUserLoggedKey = window.localStorage.getItem(
      CLIENT_DB_KEY_LAST_USER_LOGGED
    )

    if (!lastUserLoggedKey) return

    try {
      const { did, organizationId, token } = JSON.parse(lastUserLoggedKey)
      const user = await Auth._storage.get("user", "[did+organizationId]", [
        did,
        organizationId,
      ])

      Auth.authToken = token

      const { response } = await Auth._client.fetch<
        ApiResponse<{
          secrets: {
            e2eSecret: string
            e2eSecretIV: string
          }
        }>
      >(Auth._client.backendUrl("/user/secrets"))

      if (!response || !response.data) return

      const { secrets } = response.data[0]

      if (!secrets) return

      const { e2eSecret, e2eSecretIV } = secrets

      Auth._isAuthenticated = true

      Auth.account = new Account({
        enableDevMode: Auth._config.devMode,
        storage: Auth._config.storage,
        did: user.did,
        organizationId: user.organizationId,
        token: Auth.authToken!, //we use Auth.authToken and not token because in case we have a 401 error, variable 'token' has the value of the previous token. Instead Auth.authToken has the updated value.
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
        imageSettings: user.imageSettings,
        phone: user.phone ? user.phone : null,
        isVerified: user.isVerified,
        isPfpNft: user.isPfpNft,
        pfp: user.pfp ? user.pfp : null,
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
    } catch (error: any) {
      console.log("Error during rebuilding phase for account.")
      console.error(error)
      if ("statusCode" in error && error.statusCode === 401)
        await Auth._instance.logout()
    }
  }

  public static async fetchAuthToken() {
    try {
      console.log("fetch new token")
      const token = await getAccessToken()

      console.log(
        "old real time auth token is",
        Auth._realtimeAuthorizationToken
      )
      console.log("old token is ", Auth.authToken)
      console.log("new token is ", token)

      Auth.authToken = token

      console.log("confirmation for new token ", Auth.authToken)
      console.log(
        "confirmation for new real time auth token ",
        Auth._realtimeAuthorizationToken
      )

      let lastUserLoggedKey = window.localStorage.getItem(
        CLIENT_DB_KEY_LAST_USER_LOGGED
      )

      if (!token) throw new Error("Impossible to refresh the token.")

      if (!lastUserLoggedKey)
        throw new Error("Impossible to detect a logged user key.")

      console.log(
        "lastuserlogged key from local storage is ",
        JSON.parse(lastUserLoggedKey)
      )

      lastUserLoggedKey = JSON.parse(lastUserLoggedKey)
      ;(
        lastUserLoggedKey as unknown as {
          did: string
          token: string
          organizationId: string
        }
      ).token = token
      window.localStorage.setItem(
        CLIENT_DB_KEY_LAST_USER_LOGGED,
        JSON.stringify(lastUserLoggedKey)
      )

      console.log(
        "setItem performed on local storage with value",
        lastUserLoggedKey
      )
    } catch (error) {
      console.log("[fetchAuthToken error]:", error)
      console.log("logging out...")
      Auth._instance?.logout()

      throw error
    }
  }
}
