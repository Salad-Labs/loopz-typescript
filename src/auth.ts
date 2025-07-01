import { Client } from "./core/client"
import { AuthConfig, AuthEvents, AuthInfo, AuthParams } from "./types/auth"
import { ApiResponse } from "./types/base/apiresponse"
import { ApiKeyAuthorized, Maybe } from "./types/base"
import { Crypto } from "./core"
import { DexieStorage } from "./core/app"
import { AuthInternalEvents } from "./interfaces/auth/authinternalevents"
import { AccountInitConfig } from "./types/auth/account"
import { CLIENT_DB_KEY_LAST_USER_LOGGED } from "./constants/app"
import { Account, Chat, Serpens } from "."
import { LocalDBUser } from "./core/app/database"
import refreshToken from "./core/auth/refreshtoken"

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
  private static _isAuthenticated: boolean = false

  private static set authToken(authToken: Maybe<string>) {
    Auth._authToken = authToken
    Auth._realtimeAuthorizationToken = authToken
      ? `${Auth._apiKey}##${authToken}`
      : null
  }

  private static set account(account: Maybe<Account>) {
    Auth._account = account
    if (account) Auth._emit("__onAccountReady")
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

  static fetchTokenAttemptsRealtime: number = 0

  static prevToken: Maybe<string> = null

  static get MAX_ATTEMPTS_REALTIME_FETCH_AUTH_TOKEN(): number {
    return 2
  }

  private constructor() {
    if (!Auth._config)
      throw new Error("Auth must be configured before getting the instance")

    Auth._storage = Auth._config.storage
    Auth._apiKey = Auth._config.apiKey
    Auth._client = new Client(Auth._config.devMode)

    this.on("__onLoginError", (error) => {
      Auth._emit("onAuthError", error)
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

  private static async _getKeys() {
    if (!Auth._config || !Auth._instance || !Auth._client)
      throw new Error("Auth has not been configured")

    const { response } = await Auth._client.fetch<
      ApiResponse<{
        publicKeyPem: string
        privateKeyPem: string
      }>
    >(Auth._client.backendUrl("/auth/keys"), {
      method: "GET",
    })

    if (!response || !response.data) throw new Error("Invalid response.")

    const { publicKeyPem, privateKeyPem } = response.data[0]

    return { publicKeyPem, privateKeyPem }
  }

  private static async _getOrCreateUserKeys(
    did: string,
    organizationId: string
  ): Promise<{
    e2ePublicKeyPem: string
    e2ePrivateKeyPem: string
  }> {
    return new Promise<{
      e2ePublicKeyPem: string
      e2ePrivateKeyPem: string
    }>((resolve, reject) => {
      Serpens.addAction(() => {
        Auth._storage.user
          .where("[did+organizationId]")
          .equals([did, organizationId])
          .first()
          .then(async (existingUser) => {
            if (existingUser) {
              console.log("_getOrCreateUserKeys, user exists", existingUser)
              resolve({
                e2ePublicKeyPem: existingUser.e2ePublicKey,
                e2ePrivateKeyPem: existingUser.e2eEncryptedPrivateKey,
              })
            } else {
              console.log("_getOrCreateUserKeys, user doesn't exists")
              const keys = await Auth._getKeys()
              const { publicKeyPem, privateKeyPem } = keys
              console.log("two pems", publicKeyPem, privateKeyPem)

              resolve({
                e2ePublicKeyPem: publicKeyPem,
                e2ePrivateKeyPem: privateKeyPem,
              })
            }
          })
          .catch(reject)
      })
    })
  }

  private static async _storeUserOnLocalDB(keys: {
    e2ePublicKeyPem: string
    e2ePrivateKeyPem: string
  }): Promise<void> {
    try {
      if (!Auth._account) throw new Error("Account is not set")

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

      if (existingUser) {
        if (existingUser.firstLogin) {
          await new Promise((resolve, reject) => {
            Serpens.addAction(() => {
              if (!Auth._account)
                throw new Error("Account is not setup correctly.")

              Auth._storage.user
                .update(existingUser, {
                  firstLogin: false,
                })
                .then(resolve)
                .catch(reject)
            })
          })
        }

        return
      }

      //save all the data related to this user into the db

      await new Promise((resolve, reject) => {
        Serpens.addAction(() => {
          if (!Auth._account) throw new Error("Account is not setup correctly.")

          Auth._storage.user
            .add({
              did: Auth._account.did,
              organizationId: Auth._account.organizationId,
              didPrivy: Auth._account.didPrivy,
              dynamoDBUserID: Auth._account.dynamoDBUserID,
              username: Auth._account.username,
              email: Auth._account.email,
              bio: Auth._account.bio,
              instagramPublicUrl: Auth._account.instagramPublicUrl,
              xPublicUrl: Auth._account.xPublicUrl,
              tiktokPublicUrl: Auth._account.tiktokPublicUrl,
              personalWebsiteUrl: Auth._account.personalWebsiteUrl,
              avatarUrl: Auth._account.avatarUrl,
              bannerImageUrl: Auth._account.bannerImageUrl,
              imageSettings: Auth._account.imageSettings
                ? Auth._account.imageSettings
                : null,
              city: Auth._account.city,
              country: Auth._account.country,
              lat: Auth._account.lat,
              lng: Auth._account.lng,
              isCreator: Auth._account.isCreator,
              gender: Auth._account.gender,
              isVerified: Auth._account.isVerified,
              signupCompleted: Auth._account.signupCompleted,
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
              firstLogin: Auth._account.firstLogin,
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
              e2ePublicKey: keys.e2ePublicKeyPem,
              e2eEncryptedPrivateKey: keys.e2ePrivateKeyPem,
              createdAt: Auth._account.createdAt,
              updatedAt: Auth._account.updatedAt,
              lastSyncAt: null,
            })
            .then(resolve)
            .catch(reject)
        })
      })
    } catch (error) {
      console.error(error)
      throw new Error(
        "Error during setup of the local keys. Check the console to have more information."
      )
    }
  }

  private static async _callBackendAuth(authInfo: AuthInfo) {
    if (!Auth._config || !Auth._instance || !Auth._client)
      throw new Error("Auth has not been configured")

    Auth.authToken = authInfo.authToken

    try {
      const keys = await Auth._getOrCreateUserKeys(
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
        },
      })

      if (!response || !response.data) throw new Error("Invalid response.")

      const { user } = response.data[0]

      if (!user) throw new Error("Access not granted.")

      Auth._isAuthenticated = true
      Auth._authInfo = {
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

      //generation of the record in user table and local keys for e2e encryption
      await Auth._storeUserOnLocalDB(keys)

      Chat.getInstance().setCanChat(true)

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
      Auth._instance.logout()
      Auth._emit("onAuthError", error)

      throw error
    }
  }

  private static _formatAuthParams(authInfo: AuthInfo): AuthParams {
    return {
      did: authInfo.user.id,
      email: authInfo.user.email,
      referralCode: authInfo.referralCode,
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
      if (!Auth._config || !Auth._instance)
        throw new Error("Auth has not been configured")

      Auth._instance.on("__onLoginComplete", (authInfo: AuthInfo) => {
        Auth._callBackendAuth(authInfo).then(resolve).catch(reject)
      })

      Auth._instance.on("__onLoginError", reject)

      Auth._emit("__authenticate")
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
    if (Auth._config) throw new Error("Auth already configured")

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

  dismiss() {
    Auth._emit("__dismiss")
  }

  logout() {
    Auth._isAuthenticated = false
    Auth._clearEventsCallbacks(["__onLoginComplete", "__onLoginError"])
    Auth._account?.destroyLastUserLoggedKey()
    Auth._account?.emptyActiveWallets()
    Auth._account = null
    Auth.authToken = null
    Chat.getInstance().disconnect()
    Auth._emit("logout") //tells to Loopz listeners to logout
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

  public static async recoverAccountFromLocalDB() {
    if (!Auth._config || !Auth._instance || !Auth._client)
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

      Chat.getInstance().setCanChat(
        user.e2ePublicKey &&
          user.e2ePublicKey.length > 0 &&
          user.e2eEncryptedPrivateKey &&
          user.e2eEncryptedPrivateKey.length > 0
      )

      Auth.authToken = token

      Auth._isAuthenticated = true
      Auth.account = new Account({
        enableDevMode: Auth._config.devMode,
        storage: Auth._config.storage,
        did: user.did,
        organizationId: user.organizationId,
        didPrivy: user.didPrivy,
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
        instagramPublicUrl: user.instagramPublicUrl,
        xPublicUrl: user.xPublicUrl,
        tiktokPublicUrl: user.tiktokPublicUrl,
        personalWebsiteUrl: user.personalWebsiteUrl,
        firstLogin: user.firstLogin,
        avatarUrl: user.avatarUrl,
        bannerImageUrl: user.bannerImageUrl,
        imageSettings: user.imageSettings,
        city: user.city,
        country: user.country,
        lat: user.lat,
        lng: user.lng,
        isCreator: user.isCreator,
        gender: user.gender,
        phone: user.phone ? user.phone : null,
        isVerified: user.isVerified,
        signupCompleted: user.signupCompleted,
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
        e2eSecret: "", //deprecated
        e2eSecretIV: "", //deprecated
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
        Auth._instance.logout()
    }
  }

  public static async fetchAuthToken() {
    try {
      Auth._config && Auth._config.devMode && console.log("fetch new token")
      const token = await refreshToken(Auth._config!.devMode)

      Auth._config &&
        Auth._config.devMode &&
        console.log(
          "old real time auth token is",
          Auth._realtimeAuthorizationToken
        )
      Auth._config &&
        Auth._config.devMode &&
        console.log("old token is ", Auth.authToken)
      Auth._config &&
        Auth._config.devMode &&
        console.log("new token is ", token)

      Auth.authToken = token

      Auth._config &&
        Auth._config.devMode &&
        console.log("confirmation for new token ", Auth.authToken)
      Auth._config &&
        Auth._config.devMode &&
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

      Auth._config &&
        Auth._config.devMode &&
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

      Auth._config &&
        Auth._config.devMode &&
        console.log(
          "setItem performed on local storage with value",
          lastUserLoggedKey
        )
    } catch (error) {
      console.log("[fetchAuthToken error]:", error)
      console.log("logging out...")
      Auth._instance?.logout()
      Chat.getInstance().isConnected() ?? Chat.getInstance().disconnect()

      throw error
    }
  }
}
