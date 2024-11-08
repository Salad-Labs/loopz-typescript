import {
  Engine,
  User,
  Conversation,
  QIError,
  Message,
  ConversationReport,
  MessageReport,
  ConversationTradingPool,
  MessageImportant,
  ConversationPin,
  Crypto,
} from "./core/chat"
import {
  ConversationMutationEngine,
  ConversationSubscriptionEngine,
} from "./interfaces/chat/core/conversation"
import {
  MessageMutationEngine,
  MessageQueryEngine,
  MessageSubscriptionEngine,
} from "./interfaces/chat/core/message"
import {
  ConversationTradingPoolMutationEngine,
  ConversationTradingPoolQueryEngine,
  ConversationTradingPoolSubscriptionEngine,
} from "./interfaces/chat/core/conversationtradingpool"
import {
  UserMutationEngine,
  UserSubscriptionEngine,
} from "./interfaces/chat/core/user"
import {
  Conversation as ConversationGraphQL,
  ConversationReport as ConversationReportGraphQL,
  ListConversationMembers as ListConversationMembersGraphQL,
  Message as MessageGraphQL,
  MessageReport as MessageReportGraphQL,
  ConversationTradingPool as ConversationTradingPoolGraphQL,
  MutationAddBlockedUserArgs,
  MutationAddMembersToConversationArgs,
  MutationAddPinToMessageArgs,
  MutationAddReactionToMessageArgs,
  MutationAddReportToConversationArgs,
  MutationAddReportToMessageArgs,
  MutationArchiveConversationArgs,
  MutationArchiveConversationsArgs,
  MutationCreateConversationGroupArgs,
  MutationCreateConversationOneToOneArgs,
  MutationDeleteBatchConversationMessagesArgs,
  MutationDeleteConversationMessageArgs,
  MutationDeleteRequestTradeArgs,
  QueryGetConversationByIdArgs,
  User as UserGraphQL,
  MutationEditMessageArgs,
  MutationEjectMemberArgs,
  MutationEraseConversationByAdminArgs,
  EraseConversationByAdminBatchResult as EraseConversationByAdminBatchResultGraphQL,
  MutationLeaveConversationArgs,
  MutationMuteConversationArgs,
  MutationRemoveBlockedUserArgs,
  MutationRemovePinFromMessageArgs,
  MutationRemoveReactionFromMessageArgs,
  MutationRequestTradeArgs,
  MutationSendMessageArgs,
  MutationUnarchiveConversationArgs,
  MutationUnarchiveConversationsArgs,
  MutationUnmuteConversationArgs,
  MutationUpdateConversationGroupArgs,
  MutationUpdateUserInfoArgs,
  QueryListAllActiveUserConversationIdsArgs,
  ListAllActiveUserConversationIdsResult as ListAllActiveUserConversationIdsResultGraphQL,
  QueryListConversationsByIdsArgs,
  ListConversationsByIdsResult as ListConversationsByIdsResultGraphQL,
  QueryListMessagesByConversationIdArgs,
  ListMessagesByConversationIdResult as ListMessagesByConversationIdResultGraphQL,
  QueryFindUsersByUsernameOrAddressArgs,
  FindUsersByUsernameOrAddressResult as FindUsersByUsernameOrAddressResultGraphQL,
  MutationAddImportantToMessageArgs,
  MutationRemoveImportantFromMessageArgs,
  MutationAddPinToConversationArgs,
  MutationRemovePinFromConversationArgs,
  SubscriptionOnSendMessageArgs,
  SubscriptionOnEditMessageArgs,
  SubscriptionOnDeleteMessageArgs,
  SubscriptionOnRemoveReactionArgs,
  SubscriptionOnAddReactionArgs,
  SubscriptionOnAddPinMessageArgs,
  SubscriptionOnRemovePinMessageArgs,
  SubscriptionOnUpdateConversationGroupArgs,
  SubscriptionOnEjectMemberArgs,
  SubscriptionOnLeaveConversationArgs,
  SubscriptionOnAddPinConversationArgs,
  SubscriptionOnRemovePinConversationArgs,
  SubscriptionOnMuteConversationArgs,
  SubscriptionOnUpdateUserArgs,
  SubscriptionOnRequestTradeArgs,
  SubscriptionOnDeleteRequestTradeArgs,
  QueryListMessagesImportantByUserConversationIdArgs,
  ListMessagesImportantByUserConversationIdResult as ListMessagesImportantByUserConversationIdResultGraphQL,
  QueryListConversationsPinnedByCurrentUserArgs,
  ListConversationsPinnedByUserIdResult as ListConversationsPinnedByUserIdResultGraphQL,
  QueryListConversationMemberByUserIdArgs,
  ListConversationMemberByUserIdResult as ListConversationMemberByUserIdResultGraphQL,
  SubscriptionOnUnmuteConversationArgs,
  BatchDeleteMessagesResult as BatchDeleteMessagesResultGraphQL,
  SubscriptionOnBatchDeleteMessagesArgs,
  MemberOutResult as MemberOutResultGraphQL,
  QueryListUsersByIdsArgs,
  ListUsersByIdsResult as ListUsersByIdsResultGraphQL,
  MutationUpdateRequestTradeArgs,
  SubscriptionOnUpdateRequestTradeArgs,
  QueryListTradesByConversationIdArgs,
  ListTradesByConversationIdResult as ListTradesByConversationIdResultGraphQL,
  QueryGetConversationTradingPoolByIdArgs,
  QueryListMessagesByRangeOrderArgs,
  ListMessagesByRangeOrderResult as ListMessagesByRangeOrderGraphQL,
} from "./graphql/generated/graphql"
import {
  addBlockedUser,
  addImportantToMessage,
  addMembersToConversation,
  addPinToConversation,
  addPinToMessage,
  addReactionToMessage,
  addReportToConversation,
  addReportToMessage,
  archiveConversation,
  archiveConversations,
  createConversationGroup,
  createConversationOneToOne,
  deleteBatchConversationMessages,
  deleteConversationMessage,
  deleteRequestTrade,
  editMessage,
  ejectMember,
  eraseConversationByAdmin,
  leaveConversation,
  muteConversation,
  removeBlockedUser,
  removeImportantFromMessage,
  removePinFromConversation,
  removePinFromMessage,
  removeReactionFromMessage,
  requestTrade,
  sendMessage,
  unarchiveConversation,
  unarchiveConversations,
  unmuteConversation,
  updateConversationGroup,
  updateRequestTrade,
  updateUserInfo,
} from "./constants/chat/mutations"
import {
  findUsersByUsernameOrAddress,
  getConversationById,
  getCurrentUser,
  listAllActiveUserConversationIds,
  listConversationsByIds,
  listConversationsPinnedByCurrentUser,
  listMessagesByConversationId,
  listMessagesImportantByUserConversationId,
  listConversationMemberByUserId,
  listUsersByIds,
  listTradesByConversationId,
  getConversationTradingPoolById,
  listMessagesByRangeOrder,
} from "./constants/chat/queries"
import { ConversationMember } from "./core/chat/conversationmember"
import {
  AddReactionToMessageArgs,
  AddReportToConversationArgs,
  AddReportToMessageArgs,
  CreateConversationGroupArgs,
  CreateConversationOneToOneArgs,
  DeleteBatchConversationMessagesArgs,
  EditMessageArgs,
  FindUsersByUsernameOrAddressArgs,
  ListAllActiveUserConversationIdsArgs,
  ListMessagesByConversationIdArgs,
  ListMessagesImportantByUserConversationIdArgs,
  MuteConversationArgs,
  RemoveReactionFromMessageArgs,
  RequestTradeArgs,
  SendMessageArgs,
  UpdateConversationGroupInputArgs,
  UpdateUserArgs,
  AddMembersToConversationArgs,
  EjectMemberArgs,
  UpdateRequestTradeArgs,
  ListTradesByConversationIdArgs,
  ListMessagesByRangeOrderArgs,
} from "./types/chat/schema/args"
import { UAMutationEngine, UAQueryEngine } from "./interfaces/chat/core/ua"
import { Asset, Maybe } from "./types/base"
import {
  onDeleteMessage,
  onEditMessage,
  onSendMessage,
  onRemoveReaction,
  onAddReaction,
  onAddPinMessage,
  onRemovePinMessage,
  onUpdateConversationGroup,
  onEjectMember,
  onLeaveConversation,
  onAddPinConversation,
  onRemovePinConversation,
  onMuteConversation,
  onUnmuteConversation,
  onUpdateUser,
  onRequestTrade,
  onDeleteRequestTrade,
  onUpdateRequestTrade,
  onAddMembersToConversation,
  onBatchDeleteMessages,
} from "./constants/chat/subscriptions"
import { OperationResult } from "@urql/core"
import { SubscriptionGarbage } from "./types/chat/subscriptiongarbage"
import { KeyPairItem } from "./types/chat/keypairitem"
import {
  ActiveUserConversationType,
  ConversationTradingPoolStatus,
} from "./enums"
import {
  LocalDBConversation,
  LocalDBMessage,
  LocalDBUser,
} from "./core/app/database"
import { Converter, findAddedAndRemovedConversation } from "./core"
import Dexie, { Table } from "dexie"
import { Reaction } from "./core/chat/reaction"
import { v4 as uuidv4 } from "uuid"
import * as bip39 from "@scure/bip39"
import { wordlist } from "@scure/bip39/wordlists/english"
import { ApiResponse } from "./types/base/apiresponse"
import { md, mgf, pki } from "node-forge"
import { Order } from "./order"
import { Auth, ChatEvents, EngineInitConfig } from "."
import { DetectiveMessage } from "./core/chat/detectivemessage"

export class Chat
  extends Engine
  implements
    UserMutationEngine,
    UserSubscriptionEngine,
    ConversationMutationEngine,
    ConversationSubscriptionEngine,
    MessageQueryEngine,
    MessageMutationEngine,
    MessageSubscriptionEngine,
    ConversationTradingPoolQueryEngine,
    ConversationTradingPoolMutationEngine,
    ConversationTradingPoolSubscriptionEngine,
    UAMutationEngine,
    UAQueryEngine
{
  private static _config: Maybe<EngineInitConfig> = null

  private static _instance: Maybe<Chat> = null

  private _isSyncing = false

  private _syncingCounter: number = 0

  private _eventsCallbacks: Array<{
    event: ChatEvents
    callbacks: Array<Function>
  }> = []

  private _unsubscribeSyncSet: Array<{
    type:
      | "onAddMembersToConversation"
      | "onAddReaction"
      | "onSendMessage"
      | "onEditMessage"
      | "onEjectMember"
      | "onLeaveConversation"
      | "onMuteConversation"
      | "onUnmuteConversation"
      | "onDeleteMessage"
      | "onAddReaction"
      | "onRemoveReaction"
      | "onBatchDeleteMessages"
      | "onUpdateConversationGroup"

    unsubscribe: Function
    uuid: string
    conversationId: string
  }> = []

  private _conversationsMap: Array<{
    type: "CANCELED" | "ACTIVE"
    conversationId: string
    conversation: Conversation
  }> = []

  private _keyPairingObject: Maybe<{
    publicKey: Maybe<pki.rsa.PublicKey>
    privateKey: Maybe<pki.rsa.PrivateKey>
    md: Maybe<md.sha256.MessageDigest>
    mgf1: Maybe<string>
  }> = null

  private _canChat: boolean = true

  private _hookMessageCreated: boolean = false

  private _hookMessageUpdated: boolean = false

  private _hookMessageDeleted: boolean = false

  private _hookConversationCreated: boolean = false

  private _hookConversationUpdated: boolean = false

  private _syncRunning: boolean = false

  private _hookMessageCreatingFn: Maybe<
    (primaryKey: string, record: LocalDBMessage) => void
  > = null

  private _hookMessageUpdatingFn: Maybe<
    (modifications: Object, primaryKey: string, record: LocalDBMessage) => void
  > = null

  private _hookConversationCreatingFn: Maybe<
    (primaryKey: string, record: LocalDBConversation) => void
  > = null

  private _hookConversationUpdatingFn: Maybe<
    (
      modifications: Object,
      primaryKey: string,
      record: LocalDBConversation
    ) => void
  > = null

  private _syncTimeout: Maybe<NodeJS.Timeout> = null

  private static _detectiveMessage: DetectiveMessage

  static readonly SYNCING_TIME = 60000

  private constructor() {
    if (!!!Chat._config)
      throw new Error("Chat must be configured before getting the instance")

    super(Chat._config)

    //let's build the instance of DetectiveMessage, starting the scan immediately
    if (!Chat._detectiveMessage) {
      DetectiveMessage.config({ storage: Chat._config.storage })
      Chat._detectiveMessage = DetectiveMessage.getInstance()
    }

    this._defineHookFnLocalDB()

    Chat._instance = this
  }

  /** static methods */

  static config(config: EngineInitConfig) {
    if (!!Chat._config) throw new Error("Chat already configured")

    Chat._config = config
  }

  static getInstance() {
    return Chat._instance ?? new Chat()
  }

  static getDetectiveMessageInstance() {
    return Chat._detectiveMessage
  }

  /** private instance methods */

  private _defineHookFnLocalDB() {
    this._hookMessageCreatingFn = (primaryKey, record) => {
      const _message = {
        ...record,
        content: Crypto.decryptStringOrFail(
          this.findPrivateKeyById(record.conversationId),
          record.content
        ),
        reactions: record.reactions
          ? record.reactions.map((reaction) => {
              return {
                ...reaction,
                content: Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(record.conversationId),
                  reaction.content
                ),
              }
            })
          : null,
      }

      _message.messageRoot = record.messageRoot
        ? {
            ...record.messageRoot,
            content: Crypto.decryptStringOrFail(
              this.findPrivateKeyById(record.conversationId),
              record.messageRoot.content
            ),
            reactions: record.messageRoot.reactions
              ? record.messageRoot.reactions.map((reaction) => {
                  return {
                    ...reaction,
                    content: Crypto.decryptStringOrFail(
                      this.findPrivateKeyById(record.conversationId),
                      reaction.content
                    ),
                  }
                })
              : null,
          }
        : null

      this._emit("messageCreatedLDB", _message)
    }

    this._hookMessageUpdatingFn = (modifications, primaryKey, record) => {
      const _message = {
        ...record,
        content: Crypto.decryptStringOrFail(
          this.findPrivateKeyById(record.conversationId),
          record.content
        ),
        reactions: record.reactions
          ? record.reactions.map((reaction) => {
              return {
                ...reaction,
                content: Crypto.decryptStringOrFail(
                  this.findPrivateKeyById(record.conversationId),
                  reaction.content
                ),
              }
            })
          : null,
      }

      _message.messageRoot = record.messageRoot
        ? {
            ...record.messageRoot,
            content: Crypto.decryptStringOrFail(
              this.findPrivateKeyById(record.conversationId),
              record.messageRoot.content
            ),
            reactions: record.messageRoot.reactions
              ? record.messageRoot.reactions.map((reaction) => {
                  return {
                    ...reaction,
                    content: Crypto.decryptStringOrFail(
                      this.findPrivateKeyById(record.conversationId),
                      reaction.content
                    ),
                  }
                })
              : null,
          }
        : null

      this._emit("messageUpdatedLDB", _message)
    }

    this._hookConversationCreatingFn = (primaryKey, record) => {
      const _conversation = {
        ...record,
        name: Crypto.decryptStringOrFail(
          this.findPrivateKeyById(record.id),
          record.name
        ),
        description: Crypto.decryptStringOrFail(
          this.findPrivateKeyById(record.id),
          record.description
        ),
        imageURL: Crypto.decryptStringOrFail(
          this.findPrivateKeyById(record.id),
          record.imageURL
        ),
        bannerImageURL: Crypto.decryptStringOrFail(
          this.findPrivateKeyById(record.id),
          record.bannerImageURL
        ),
        settings: JSON.parse(
          Crypto.decryptStringOrFail(
            this.findPrivateKeyById(record.id),
            record.settings
          )
        ),
      }

      this._emit("conversationCreatedLDB", _conversation)
    }

    this._hookConversationUpdatingFn = (modifications, primaryKey, record) => {
      const _conversation = {
        ...record,
        name: Crypto.decryptStringOrFail(
          this.findPrivateKeyById(record.id),
          record.name
        ),
        description: Crypto.decryptStringOrFail(
          this.findPrivateKeyById(record.id),
          record.description
        ),
        imageURL: Crypto.decryptStringOrFail(
          this.findPrivateKeyById(record.id),
          record.imageURL
        ),
        bannerImageURL: Crypto.decryptStringOrFail(
          this.findPrivateKeyById(record.id),
          record.bannerImageURL
        ),
        settings: JSON.parse(
          Crypto.decryptStringOrFail(
            this.findPrivateKeyById(record.id),
            record.settings
          )
        ),
      }

      this._emit("conversationUpdatedLDB", _conversation)
    }
  }

  private _emit(event: ChatEvents, args?: any) {
    const index = this._eventsCallbacks.findIndex((item) => {
      return item.event === event
    })

    if (index > -1)
      this,
        this._eventsCallbacks[index].callbacks.forEach((callback) => {
          callback(args)
        })
  }

  /** syncing data with backend*/

  private async recoverUserConversations(
    type: ActiveUserConversationType
  ): Promise<Maybe<Array<Conversation>>> {
    try {
      let AUCfirstSet = await this.listAllActiveUserConversationIds({
        type,
      })

      if (AUCfirstSet instanceof QIError)
        throw new Error(JSON.stringify(AUCfirstSet))

      let { nextToken, items } = AUCfirstSet
      let activeIds = [...items]

      while (nextToken) {
        const set = await this.listAllActiveUserConversationIds({
          type,
          nextToken,
        })

        if (set instanceof QIError) break

        const { nextToken: token, items } = set

        activeIds = [...activeIds, ...items]

        if (token) nextToken = token
        else break
      }

      let conversationfirstSet = await this.listConversationsByIds(activeIds)

      if (conversationfirstSet instanceof QIError)
        throw new Error(JSON.stringify(conversationfirstSet))

      let { unprocessedKeys, items: conversations } = conversationfirstSet
      let conversationsItems = [...conversations]

      while (unprocessedKeys) {
        const set = await this.listConversationsByIds(unprocessedKeys)

        if (set instanceof QIError) break

        const { unprocessedKeys: ids, items } = set

        conversationsItems = [...conversationsItems, ...items]

        if (ids) unprocessedKeys = ids
        else break
      }

      const currentUser = await this.getCurrentUser()

      if (currentUser instanceof QIError)
        throw new Error(JSON.stringify(currentUser))

      //? Serpens
      //stores/update the conversations into the local db

      if (this._syncingCounter > 0) {
        //if this sync is not the first one, we disable the hook for the creation and update of the conversations
        //because potentially could be detrimental for the performance
        this._storage.conversation
          .hook("creating")
          .unsubscribe(this._hookConversationCreatingFn!)
        this._storage.conversation
          .hook("updating")
          .unsubscribe(this._hookConversationUpdatingFn!)

        this._hookConversationCreated = false
        this._hookConversationUpdated = false
      }

      await this._storage.insertBulkSafe(
        "conversation",
        conversationsItems.map((conversation: Conversation) => {
          let isConversationArchived = false

          if (currentUser.archivedConversations) {
            const index = currentUser.archivedConversations.findIndex((id) => {
              return id === conversation.id
            })

            if (index > -1) isConversationArchived = true
          }

          return Converter.fromConversationToLocalDBConversation(
            conversation,
            Auth.account!.did,
            Auth.account!.organizationId,
            isConversationArchived
          )
        })
      )

      return conversationsItems
    } catch (error) {
      console.log("[ERROR]: recoverUserConversations() -> ", error)
    }

    return null
  }

  private async recoverKeysFromConversations(): Promise<boolean> {
    try {
      let firstConversationMemberSet =
        await this.listConversationMemberByUserId()

      if (firstConversationMemberSet instanceof QIError)
        throw new Error(JSON.stringify(firstConversationMemberSet))

      let { nextToken, items } = firstConversationMemberSet
      let conversationMemberItems = [...items]

      while (nextToken) {
        const set = await this.listConversationMemberByUserId(nextToken)

        if (set instanceof QIError) break

        const { nextToken: token, items } = set

        conversationMemberItems = [...conversationMemberItems, ...items]

        if (token) nextToken = token
        else break
      }

      //let's take all the information related to our keys into _userKeyPair object. These are the public and private key of the current user.
      //To do that, let's do a query on the local user table. If the _userKeyPair is already set, we skip this operation.
      if (!this._userKeyPair) {
        let user = (await this._storage.get("user", "[did+organizationId]", [
          Auth.account!.did,
          Auth.account!.organizationId,
        ])) as LocalDBUser

        const { e2eEncryptedPrivateKey, e2ePublicKey: e2ePublicKeyPem } = user!
        const { e2eSecret } = Auth.account!
        const { e2eSecretIV } = Auth.account!

        const e2ePrivateKeyPem = Crypto.decryptAES_CBC(
          e2eEncryptedPrivateKey,
          Buffer.from(e2eSecret, "hex").toString("base64"),
          Buffer.from(e2eSecretIV, "hex").toString("base64")
        )

        const userKeyPair = await Crypto.generateKeyPairFromPem(
          e2ePublicKeyPem,
          e2ePrivateKeyPem
        )

        if (!userKeyPair)
          throw new Error("Impossible to recover the user key pair.")

        this.setUserKeyPair(userKeyPair)
      }

      //now, from the private key of the user, we will decrypt all the information about the conversation member.
      //we will store these decrypted pairs public keys/private keys into the _keyPairsMap array.
      const _keyPairsMap: Array<KeyPairItem> = []
      let isError: boolean = false

      for (const conversationMember of conversationMemberItems) {
        const {
          encryptedConversationPrivateKey,
          encryptedConversationPublicKey,
        } = conversationMember
        const privateKeyPem = Crypto.decryptStringOrFail(
          this.getUserKeyPair()!.privateKey,
          encryptedConversationPrivateKey
        )
        const publicKeyPem = Crypto.decryptStringOrFail(
          this.getUserKeyPair()!.privateKey,
          encryptedConversationPublicKey
        )
        const keypair = await Crypto.generateKeyPairFromPem(
          privateKeyPem,
          publicKeyPem
        )

        if (!keypair) {
          isError = true
          break
        }

        _keyPairsMap.push({
          id: conversationMember.conversationId,
          keypair,
        })
      }

      if (isError)
        throw new Error("Failed to convert a public/private key pair.")

      this.setKeyPairMap(_keyPairsMap)

      return true
    } catch (error) {
      console.log("[ERROR]: recoverKeysFromConversations() -> ", error)
    }

    return false
  }

  private async recoverMessagesFromConversations(
    conversations: Array<Conversation>
  ): Promise<boolean> {
    try {
      for (const conversation of conversations) {
        const { id, lastMessageSentAt } = conversation

        //if the conversation hasn't any message it's useless to download the messages.
        if (!lastMessageSentAt) continue

        //let's see if the last message sent into the conversation is more recent than the last message stored in the database

        //messages important handling
        const messagesImportantFirstSet =
          await this.listMessagesImportantByUserConversationId({
            conversationId: id,
          })

        if (messagesImportantFirstSet instanceof QIError)
          throw new Error(JSON.stringify(messagesImportantFirstSet))

        let { nextToken, items } = messagesImportantFirstSet
        let messagesImportant = [...items]

        while (nextToken) {
          const set = await this.listMessagesImportantByUserConversationId({
            conversationId: id,
            nextToken,
          })

          if (set instanceof QIError) break

          const { nextToken: token, items } = set

          messagesImportant = [...messagesImportant, ...items]

          if (token) nextToken = token
          else break
        }

        //messages handling
        let lastMessageStored = await this._storage.message
          .orderBy("createdAt")
          .filter(
            (element) =>
              element.origin === "USER" && element.userDid === Auth.account!.did
          )
          .reverse()
          .first()

        const canDownloadMessages =
          !lastMessageStored ||
          (lastMessageStored &&
            lastMessageStored.createdAt! < lastMessageSentAt)

        //the check of history message is already done on backend side

        if (canDownloadMessages) {
          const messagesFirstSet = await this.listMessagesByConversationId({
            id,
          })

          if (messagesFirstSet instanceof QIError)
            throw new Error(JSON.stringify(messagesFirstSet))

          let { nextToken, items } = messagesFirstSet
          let messages = [...items]

          while (nextToken) {
            const set = await this.listMessagesByConversationId({
              id,
              nextToken,
            })

            if (set instanceof QIError) break

            const { nextToken: token, items } = set

            messages = [...messages, ...items]

            if (token) nextToken = token
            else break
          }

          //let's store the messages without create duplicates
          if (messages.length > 0) {
            //if this sync is not the first one, we disable the hook for the creation and update of the messages
            //because potentially could be detrimental for the performance
            if (this._syncingCounter > 0) {
              this._storage.message
                .hook("creating")
                .unsubscribe(this._hookMessageCreatingFn!)
              this._storage.message
                .hook("updating")
                .unsubscribe(this._hookMessageUpdatingFn!)

              this._hookMessageCreated = false
              this._hookMessageUpdated = false
            }
            //Serpens?
            //it's possible this array is empty when the chat history settings has value 'false'
            this._storage.insertBulkSafe(
              "message",
              messages.map((message) => {
                const isMessageImportant =
                  messagesImportant.findIndex((important) => {
                    return important.messageId === message.id
                  }) > -1

                return Converter.fromMessageToLocalDBMessage(
                  message,
                  Auth.account!.did,
                  Auth.account!.organizationId,
                  isMessageImportant,
                  "USER"
                )
              })
            )

            //let's collect these messages for our detective message instance (only if this sync is not the first)
            if (this._syncingCounter > 0)
              messages.forEach((message) => {
                Chat._detectiveMessage.collectClue(
                  message,
                  Auth.account!.did,
                  Auth.account!.organizationId
                )
              })
          }
        }
      }

      return true
    } catch (error) {
      console.log("[ERROR]: recoverMessagesFromConversations() -> ", error)
    }

    return false
  }

  private async _sync(syncingCounter: number): Promise<void> {
    this._isSyncing = true
    this._emit("syncing", this._syncingCounter)

    //first operation. Recover the list of the conversations in which the user is a member.
    //unactive conversations are the convos in which the user left the group or has been ejected
    const activeConversations = await this.recoverUserConversations(
      ActiveUserConversationType.Active
    )
    const unactiveConversations = await this.recoverUserConversations(
      ActiveUserConversationType.Canceled
    )

    if (!activeConversations || !unactiveConversations) {
      this._emit("syncError", { error: `error during conversation syncing.` })
      this.unsync()
      return
    }

    //second operation. Recover the list of conversation member objects, in order to retrieve the public & private keys of all conversations.
    const keysRecovered = await this.recoverKeysFromConversations()
    if (!keysRecovered) {
      this._emit("syncError", {
        error: `error during recovering of the keys from conversations.`,
      })
      this.unsync()
      return
    }

    //third operation. For each conversation, we need to download the messages if the lastMessageSentAt of the conversation is != null
    //and the date of the last message stored in the local db is less recent than the lastMessageSentAt date.
    const messagesRecovered = await this.recoverMessagesFromConversations([
      ...activeConversations,
      ...unactiveConversations,
    ])
    if (!messagesRecovered) {
      this._emit("syncError", {
        error: `error during recovering of the messages from conversations.`,
      })
      this.unsync()
      return
    }

    //let's setup an array of the conversations in the first sync cycle.
    //This will allow to map the conversations in every single cycle that comes after the first one.
    if (syncingCounter === 0) {
      for (const activeConversation of activeConversations)
        this._conversationsMap.push({
          type: "ACTIVE",
          conversationId: activeConversation.id,
          conversation: activeConversation,
        })

      for (const unactiveConversation of unactiveConversations)
        this._conversationsMap.push({
          type: "CANCELED",
          conversationId: unactiveConversation.id,
          conversation: unactiveConversation,
        })
    } else {
      //this situation happens when a subscription between onAddMembersToConversation, onEjectMember, onLeaveConversation doesn't fire properly.
      //here we can check if there are differences between the previous sync and the current one
      //theoretically since we have subscriptions, we should be in a situation in which we don't have any difference
      //since the subscription role is to keep the array _conversationsMap synchronized.
      //But it can be also the opposite. So inside this block we will check if there are conversations that need
      //subscriptions to be added or the opposite (so subscriptions that need to be removed)

      const conversations = [...activeConversations, ...unactiveConversations]
      const flatConversationMap = this._conversationsMap.map(
        (item) => item.conversation
      )

      const { added, removed } = findAddedAndRemovedConversation(
        conversations,
        flatConversationMap
      )

      if (added.length > 0)
        for (const conversation of added)
          this._addSubscriptionsSync(conversation.id)

      if (removed.length > 0)
        for (const conversation of removed)
          this._removeSubscriptionsSync(conversation.id)
    }

    //we add the internal events for the local database
    if (!this._hookMessageCreated) this._onMessageCreatedLDB()
    if (!this._hookMessageUpdated) this._onMessageUpdatedLDB()
    if (!this._hookMessageDeleted) this._onMessageDeletedLDB()
    if (!this._hookConversationCreated) this._onConversationCreatedLDB()
    if (!this._hookConversationUpdated) this._onConversationUpdatedLDB()

    this._isSyncing = false

    syncingCounter === 0
      ? this._emit("sync")
      : this._emit("syncUpdate", this._syncingCounter)

    this._syncingCounter++

    if (this._syncTimeout) clearTimeout(this._syncTimeout)
    this._syncTimeout = setTimeout(async () => {
      await this._sync(this._syncingCounter)
    }, Chat.SYNCING_TIME)
  }

  private async _onAddMembersToConversationSync(
    response:
      | QIError
      | {
          conversationId: string
          membersIds: Array<string>
          items: Array<ConversationMember>
        },
    source: OperationResult<
      {
        onAddMembersToConversation: ListConversationMembersGraphQL
      },
      {
        jwt: string
      }
    >,
    uuid: string
  ) {
    try {
      if (!(response instanceof QIError)) {
        //we need to update the _keyPairsMap with the new keys of the new conversation
        const { conversationId, items } = response
        const item = items.find(
          (item) => item.userId === Auth.account?.dynamoDBUserID
        )
        const {
          encryptedConversationPrivateKey,
          encryptedConversationPublicKey,
        } = item!
        //these pair is encrypted with the public key of the current user, so we need to decrypt them
        const conversationPrivateKeyPem = Crypto.decryptStringOrFail(
          this._userKeyPair!.privateKey,
          encryptedConversationPrivateKey
        )
        const conversationPublicKeyPem = Crypto.decryptStringOrFail(
          this._userKeyPair!.privateKey,
          encryptedConversationPublicKey
        )
        const keypair = await Crypto.generateKeyPairFromPem(
          conversationPublicKeyPem,
          conversationPrivateKeyPem
        )

        //this add a key pair only if it doesn't exist. if it does, then internally skip this operation
        this.addKeyPairItem({
          id: conversationId,
          keypair: keypair!,
        })

        //we update also the _unsubscribeSyncSet array using the uuid emitted by the subscription
        //in order to map the unsubscribe function with the conversation
        const index = this._unsubscribeSyncSet.findIndex((item) => {
          return item.uuid === uuid
        })

        if (index > -1)
          this._unsubscribeSyncSet[index].conversationId = conversationId

        //now we store the conversation in the local database
        const responseConversation = await this.listConversationsByIds([
          conversationId,
        ])

        if (!(responseConversation instanceof QIError)) {
          const { items } = responseConversation
          const conversation = items[0]

          //we need to check if the conversation was already inside the _conversationsMap array. If it exists then we update the array
          //otherwise we add a new element
          const index = this._conversationsMap.findIndex((conversationItem) => {
            return conversationItem.conversationId === conversation.id
          })

          //this is an additional check that it's used to avoid to add the subscriptions to a conversation that potentially
          //could have them already. This could happen potentially if the _sync() is executed
          //immediately before the _onAddMembersToConversationSync() in the javascript event loop
          const subscriptionConversationCheck = {
            conversationWasActive: false,
          }

          if (index > -1) {
            //it should never be ACTIVE at this point, but this is for more safety
            if (this._conversationsMap[index].type === "ACTIVE")
              subscriptionConversationCheck.conversationWasActive = true

            this._conversationsMap[index].type = "ACTIVE"
            this._conversationsMap[index].conversation = conversation
          } else
            this._conversationsMap.push({
              conversation,
              conversationId: conversation.id,
              type: "ACTIVE",
            })

          const currentUser = await this.getCurrentUser()

          if (currentUser instanceof QIError)
            throw new Error(JSON.stringify(currentUser))

          //stores/update the conversations into the local db
          let isConversationArchived = false

          if (currentUser.archivedConversations) {
            const index = currentUser.archivedConversations.findIndex((id) => {
              return id === conversationId
            })

            if (index > -1) isConversationArchived = true
          }

          this._storage.insertBulkSafe("conversation", [
            Converter.fromConversationToLocalDBConversation(
              conversation,
              Auth.account!.did,
              Auth.account!.organizationId,
              isConversationArchived
            ),
          ])

          //let's remove all the subscriptions previously added
          if (subscriptionConversationCheck.conversationWasActive) {
            this._removeSubscriptionsSync(conversationId)
            this._conversationsMap[index].type = "ACTIVE" //assign again "type" the value "ACTIVE" because _removeSubscriptionsSync() turns type to "CANCELED"
          }

          //let's add the subscriptions in order to keep synchronized this conversation
          this._addSubscriptionsSync(conversationId)

          this._emit("conversationNewMembers", {
            conversation,
            conversationId,
          })
        }
      }
    } catch (error) {
      console.log("[ERROR]: _onAddMembersToConversationSync() -> ", error)
      this._emit("conversationNewMembersError", error)
    }
  }

  private async _onAddReactionSync(
    response: QIError | Message,
    source: OperationResult<
      {
        onAddReaction: MessageGraphQL
      },
      SubscriptionOnAddReactionArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    try {
      if (!(response instanceof QIError)) {
        this._storage.insertBulkSafe("message", [
          Converter.fromMessageToLocalDBMessage(
            response,
            Auth.account!.did,
            Auth.account!.organizationId,
            false,
            "USER"
          ),
        ])

        this._emit("reactionAdded", {
          message: response,
          conversationId: response.conversationId,
        })
      }
    } catch (error) {
      console.log("[ERROR]: _onAddReactionSync() -> ", error)
      this._emit("reactionAddedError", error)
    }
  }

  private async _onRemoveReactionSync(
    response: QIError | Message,
    source: OperationResult<
      {
        onRemoveReaction: MessageGraphQL
      },
      SubscriptionOnRemoveReactionArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    try {
      if (!(response instanceof QIError)) {
        this._storage.insertBulkSafe("message", [
          Converter.fromMessageToLocalDBMessage(
            response,
            Auth.account!.did,
            Auth.account!.organizationId,
            false,
            "USER"
          ),
        ])

        this._emit("reactionRemoved", {
          message: response,
          conversationId: response.conversationId,
        })
      }
    } catch (error) {
      console.log("[ERROR]: _onRemoveReactionSync() -> ", error)
      this._emit("reactionRemovedError", error)
    }
  }

  private async _onSendMessageSync(
    response: Message | QIError,
    source: OperationResult<
      {
        onSendMessage: MessageGraphQL
      },
      SubscriptionOnSendMessageArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    try {
      if (!(response instanceof QIError)) {
        //let's insert the new message
        this._storage.insertBulkSafe("message", [
          Converter.fromMessageToLocalDBMessage(
            response,
            Auth.account!.did,
            Auth.account!.organizationId,
            false,
            "USER"
          ),
        ])

        Chat._detectiveMessage.collectClue(
          response,
          Auth.account!.did,
          Auth.account!.organizationId
        )
        //let's update the conversation in the case it was deleted locally by the user.
        //the conversation if it is deleted, returns visible for the user.

        this._storage.query(
          async (
            db: Dexie,
            table: Table<LocalDBConversation, string, LocalDBConversation>
          ) => {
            const conversation = await this._storage.get(
              "conversation",
              "[conversationId+userDid]",
              [response.conversationId, Auth.account!.did]
            )
            table.update(conversation, {
              deletedAt: null,
            })
          },
          "conversation"
        )

        this._emit("messageReceived", {
          message: response,
          conversationId: response.conversationId,
        })
      }
    } catch (error) {
      console.log("[ERROR]: _onSendMessageSync() -> ", error)
      this._emit("messageReceivedError", error)
    }
  }

  private async _onEditMessageSync(
    response: QIError | Message,
    source: OperationResult<
      {
        onEditMessage: MessageGraphQL
      },
      SubscriptionOnEditMessageArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    try {
      if (!(response instanceof QIError)) {
        this._storage.insertBulkSafe("message", [
          Converter.fromMessageToLocalDBMessage(
            response,
            Auth.account!.did,
            Auth.account!.organizationId,
            false,
            "USER"
          ),
        ])

        this._emit("messageUpdated", {
          message: response,
          conversationId: response.conversationId,
        })
      }
    } catch (error) {
      console.log("[ERROR]: _onEditMessageSync() -> ", error)
      this._emit("messageUpdatedError", error)
    }
  }

  private async _onDeleteMessageSync(
    response: QIError | Message,
    source: OperationResult<
      {
        onDeleteMessage: MessageGraphQL
      },
      SubscriptionOnDeleteMessageArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    try {
      if (!(response instanceof QIError)) {
        await this._storage.deleteItem("message", "[id+userDid]", [
          response.id,
          Auth.account!.did,
        ])

        this._emit("messageDeleted", {
          message: response,
          conversationId: response.conversationId,
        })
      }
    } catch (error) {
      console.log("[ERROR]: _onDeleteMessageSync() -> ", error)
      this._emit("messageDeletedError", error)
    }
  }

  private async _onBatchDeleteMessagesSync(
    response:
      | QIError
      | {
          conversationId: string
          messagesIds: string[]
        },
    source: OperationResult<
      {
        onBatchDeleteMessages: BatchDeleteMessagesResultGraphQL
      },
      SubscriptionOnBatchDeleteMessagesArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    try {
      if (!(response instanceof QIError)) {
        for (const id of response.messagesIds) {
          await this._storage.deleteItem("message", "[id+userDid]", [
            id,
            Auth.account!.did,
          ])
        }

        this._emit("batchMessagesDeleted", {
          messagesIds: response.messagesIds,
        })
      }
    } catch (error) {
      console.log("[ERROR]: _onBatchDeleteMessagesSync() -> ", error)
      this._emit("batchMessagesDeletedError", error)
    }
  }

  private async _onUpdateConversationGroupSync(
    response: QIError | Conversation,
    source: OperationResult<
      {
        onUpdateConversationGroup: ConversationGraphQL
      },
      SubscriptionOnUpdateConversationGroupArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    try {
      if (!(response instanceof QIError)) {
        const conversationStored = (await this._storage.get(
          "conversation",
          "[id+userDid]",
          [(response.id, Auth.account!.did)]
        )) as Maybe<LocalDBConversation>

        this._storage.insertBulkSafe("conversation", [
          Converter.fromConversationToLocalDBConversation(
            response,
            Auth.account!.did,
            Auth.account!.organizationId,
            conversationStored ? conversationStored.isArchived : false
          ),
        ])

        this._emit("conversationGroupUpdated", {
          conversation: response,
        })
      }
    } catch (error) {
      console.log("[ERROR]: _onUpdateConversationGroupSync() -> ", error)
      this._emit("conversationGroupUpdatedError", error)
    }
  }

  private _onEjectMemberSync(
    response:
      | QIError
      | { conversationId: string; conversation: Conversation; memberOut: User },
    source: OperationResult<
      {
        onEjectMember: MemberOutResultGraphQL
      },
      SubscriptionOnEjectMemberArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    try {
      if (!(response instanceof QIError)) {
        const conversationId = response.conversationId
        this._removeSubscriptionsSync(conversationId)
        const message = {
          id: uuidv4(),
          userId: response.memberOut.id,
          organizationId: Auth.account!.organizationId,
          userDid: Auth.account!.did,
          conversationId: response.conversationId,
          content: "",
          reactions: [],
          isImportant: false,
          type: "EJECTED",
          origin: "SYSTEM",
          messageRoot: null,
          messageRootId: null,
          createdAt: new Date(),
          updateAt: null,
          deletedAt: null,
        }

        this._storage.insertBulkSafe("message", [message])

        this._emit("messageReceived", {
          message,
          conversationId,
        })
      }
    } catch (error) {
      console.log("[ERROR]: _onEjectMemberSync() -> ", error)
      this._emit("memberEjectedError", error)
      this._emit("messageReceivedError", error)
    }
  }

  private _onLeaveConversationSync(
    response:
      | QIError
      | { conversationId: string; conversation: Conversation; memberOut: User },
    source: OperationResult<
      {
        onLeaveConversation: MemberOutResultGraphQL
      },
      SubscriptionOnLeaveConversationArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    //TODO handling system messages that shows the user left the conversation
    try {
      if (!(response instanceof QIError)) {
        const conversationId = response.conversationId
        this._removeSubscriptionsSync(conversationId)
        const message = {
          id: uuidv4(),
          userId: response.memberOut.id,
          organizationId: Auth.account!.organizationId,
          userDid: Auth.account!.did,
          conversationId: response.conversationId,
          content: "",
          reactions: [],
          isImportant: false,
          type: "LEFT",
          origin: "SYSTEM",
          messageRoot: null,
          messageRootId: null,
          createdAt: new Date(),
          updateAt: null,
          deletedAt: null,
        }

        //handling system messages that shows the user left the conversation
        this._storage.insertBulkSafe("message", [message])

        this._emit("messageReceived", {
          message,
          conversationId,
        })
      }
    } catch (error) {
      console.log("[ERROR]: _onLeaveConversationSync() -> ", error)
      this._emit("memberLeftError", error)
      this._emit("messageReceivedError", error)
    }
  }

  private _onMuteConversationSync(
    response: QIError | Conversation,
    source: OperationResult<
      {
        onMuteConversation: ConversationGraphQL
      },
      SubscriptionOnMuteConversationArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    //TODO socket notification handling
    try {
      if (!(response instanceof QIError)) {
        this._emit("conversationMuted", {
          conversation: response,
        })
      }
    } catch (error) {
      console.log("[ERROR]: _onMuteConversationSync() -> ", error)
      this._emit("conversationMutedError", error)
    }
  }

  private _onUnmuteConversationSync(
    response: QIError | Conversation,
    source: OperationResult<
      {
        onUnmuteConversation: ConversationGraphQL
      },
      SubscriptionOnUnmuteConversationArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    //TODO socket notification handling
    try {
      if (!(response instanceof QIError)) {
        this._emit("conversationUnmuted", {
          conversation: response,
        })
      }
    } catch (error) {
      console.log("[ERROR]: _onUnmuteConversationSync() -> ", error)
      this._emit("conversationMutedError", error)
    }
  }

  private _addSubscriptionsSync(conversationId: string) {
    //add reaction(conversationId)
    const onAddReaction = this.onAddReaction(
      conversationId,
      this._onAddReactionSync
    )

    if (!(onAddReaction instanceof QIError)) {
      const { unsubscribe, uuid } = onAddReaction
      this._unsubscribeSyncSet.push({
        type: "onAddReaction",
        unsubscribe,
        uuid,
        conversationId,
      })
    }

    //remove reaction(conversationId)
    const onRemoveReaction = this.onRemoveReaction(
      conversationId,
      this._onRemoveReactionSync
    )

    if (!(onRemoveReaction instanceof QIError)) {
      const { unsubscribe, uuid } = onRemoveReaction
      this._unsubscribeSyncSet.push({
        type: "onRemoveReaction",
        unsubscribe,
        uuid,
        conversationId,
      })
    }

    //send message(conversationId)
    const onSendMessage = this.onSendMessage(
      conversationId,
      this._onSendMessageSync
    )

    if (!(onSendMessage instanceof QIError)) {
      const { unsubscribe, uuid } = onSendMessage
      this._unsubscribeSyncSet.push({
        type: "onSendMessage",
        unsubscribe,
        uuid,
        conversationId,
      })
    }

    //edit message(conversationId)
    const onEditMessage = this.onEditMessage(
      conversationId,
      this._onEditMessageSync
    )

    if (!(onEditMessage instanceof QIError)) {
      const { unsubscribe, uuid } = onEditMessage
      this._unsubscribeSyncSet.push({
        type: "onEditMessage",
        unsubscribe,
        uuid,
        conversationId,
      })
    }

    //delete message(conversationId)
    const onDeleteMessage = this.onDeleteMessage(
      conversationId,
      this._onDeleteMessageSync
    )

    if (!(onDeleteMessage instanceof QIError)) {
      const { unsubscribe, uuid } = onDeleteMessage
      this._unsubscribeSyncSet.push({
        type: "onDeleteMessage",
        unsubscribe,
        uuid,
        conversationId,
      })
    }

    //delete batch messages(conversationId)
    const onBatchDeleteMessages = this.onBatchDeleteMessages(
      conversationId,
      this._onBatchDeleteMessagesSync
    )

    if (!(onBatchDeleteMessages instanceof QIError)) {
      const { unsubscribe, uuid } = onBatchDeleteMessages
      this._unsubscribeSyncSet.push({
        type: "onBatchDeleteMessages",
        unsubscribe,
        uuid,
        conversationId,
      })
    }

    //update settings group(conversationId)
    const onUpdateConversationGroup = this.onUpdateConversationGroup(
      conversationId,
      this._onUpdateConversationGroupSync
    )

    if (!(onUpdateConversationGroup instanceof QIError)) {
      const { unsubscribe, uuid } = onUpdateConversationGroup
      this._unsubscribeSyncSet.push({
        type: "onUpdateConversationGroup",
        unsubscribe,
        uuid,
        conversationId,
      })
    }

    //eject member(conversationId)
    const onEjectMember = this.onEjectMember(
      conversationId,
      this._onEjectMemberSync
    )

    if (!(onEjectMember instanceof QIError)) {
      const { unsubscribe, uuid } = onEjectMember
      this._unsubscribeSyncSet.push({
        type: "onEjectMember",
        unsubscribe,
        uuid,
        conversationId,
      })
    }

    //leave group/conversation(conversationId)
    const onLeaveConversation = this.onLeaveConversation(
      conversationId,
      this._onLeaveConversationSync
    )

    if (!(onLeaveConversation instanceof QIError)) {
      const { unsubscribe, uuid } = onLeaveConversation
      this._unsubscribeSyncSet.push({
        type: "onLeaveConversation",
        unsubscribe,
        uuid,
        conversationId,
      })
    }

    //mute conversation(conversationId)
    const onMuteConversation = this.onMuteConversation(
      conversationId,
      this._onMuteConversationSync
    )

    if (!(onMuteConversation instanceof QIError)) {
      const { unsubscribe, uuid } = onMuteConversation
      this._unsubscribeSyncSet.push({
        type: "onMuteConversation",
        unsubscribe,
        uuid,
        conversationId,
      })
    }

    //unmute conversation(conversationId)
    const onUnmuteConversation = this.onUnmuteConversation(
      conversationId,
      this._onUnmuteConversationSync
    )

    if (!(onUnmuteConversation instanceof QIError)) {
      const { unsubscribe, uuid } = onUnmuteConversation
      this._unsubscribeSyncSet.push({
        type: "onUnmuteConversation",
        unsubscribe,
        uuid,
        conversationId,
      })
    }
  }

  private _removeSubscriptionsSync(conversationId: string) {
    //let's remove first the subscriptions
    const unsubscribeItems = this._unsubscribeSyncSet.filter((item) => {
      return item.conversationId === conversationId
    })

    unsubscribeItems.forEach((item) => {
      try {
        item.unsubscribe()
      } catch (error) {
        console.log("[ERROR]: unsubscribe() -> ", item.uuid, item.type)
      }
    })

    //let's remove the unsubscriptions functions from the _unsubscribeSyncSet since we have unsubscribed everything
    this._unsubscribeSyncSet = this._unsubscribeSyncSet.filter((item) => {
      return item.conversationId !== conversationId
    })

    //let's update also the _conversationsMap and turn this conversation as unactive
    const index = this._conversationsMap.findIndex((conversation) => {
      return conversation.conversationId === conversationId
    })

    if (index > -1) this._conversationsMap[index].type = "CANCELED"
  }

  /** local database events */

  private _onMessageCreatedLDB() {
    try {
      this._storage.query(
        (db: Dexie, message: Table<LocalDBMessage, string, LocalDBMessage>) => {
          this._hookMessageCreated = true
          message.hook("creating", this._hookMessageCreatingFn!)
        },
        "message"
      )
    } catch (error) {
      console.log(error)
      this._hookMessageCreated = false
      this._emit("messageCreatedLDBError", error)
    }
  }

  private _onMessageDeletedLDB() {
    try {
      this._storage.query(
        (db: Dexie, message: Table<LocalDBMessage, string, LocalDBMessage>) => {
          this._hookMessageDeleted = true
          message.hook("deleting", (primaryKey, record) => {
            const _message = {
              ...record,
              content: Crypto.decryptStringOrFail(
                this.findPrivateKeyById(record.conversationId),
                record.content
              ),
              reactions: record.reactions
                ? record.reactions.map((reaction) => {
                    return {
                      ...reaction,
                      content: Crypto.decryptStringOrFail(
                        this.findPrivateKeyById(record.conversationId),
                        reaction.content
                      ),
                    }
                  })
                : null,
            }

            _message.messageRoot = record.messageRoot
              ? {
                  ...record.messageRoot,
                  content: Crypto.decryptStringOrFail(
                    this.findPrivateKeyById(record.conversationId),
                    record.messageRoot.content
                  ),
                  reactions: record.messageRoot.reactions
                    ? record.messageRoot.reactions.map((reaction) => {
                        return {
                          ...reaction,
                          content: Crypto.decryptStringOrFail(
                            this.findPrivateKeyById(record.conversationId),
                            reaction.content
                          ),
                        }
                      })
                    : null,
                }
              : null

            this._emit("messageDeletedLDB", _message)
          })
        },
        "message"
      )
    } catch (error) {
      console.log(error)
      this._hookMessageDeleted = false
      this._emit("messageDeletedLDBError", error)
    }
  }

  private _onMessageUpdatedLDB() {
    try {
      this._storage.query(
        (db: Dexie, message: Table<LocalDBMessage, string, LocalDBMessage>) => {
          this._hookMessageUpdated = true
          message.hook("updating", this._hookMessageUpdatingFn!)
        },
        "message"
      )
    } catch (error) {
      console.log(error)
      this._hookMessageUpdated = false
      this._emit("messageUpdatedLDBError", error)
    }
  }

  private _onConversationCreatedLDB() {
    try {
      this._storage.query(
        (
          db: Dexie,
          conversation: Table<LocalDBConversation, string, LocalDBConversation>
        ) => {
          this._hookConversationCreated = true
          conversation.hook("creating", this._hookConversationCreatingFn!)
        },
        "conversation"
      )
    } catch (error) {
      console.log(error)
      this._hookConversationCreated = false
      this._emit("conversationCreatedLDBError", error)
    }
  }

  private _onConversationUpdatedLDB() {
    try {
      this._storage.query(
        (
          db: Dexie,
          conversation: Table<LocalDBConversation, string, LocalDBConversation>
        ) => {
          this._hookConversationUpdated = true
          conversation.hook("updating", this._hookConversationUpdatingFn!)
        },
        "conversation"
      )
    } catch (error) {
      console.log(error)
      this._hookConversationUpdated = false
      this._emit("conversationUpdatedLDBError", error)
    }
  }

  /** public instance methods */

  /** Mutations */

  /**
   * Blocks a user by their ID.
   * @param {string} [id] - The ID of the user to block.
   * @returns {Promise<User | QIError>} A promise that resolves to a User object if successful, or a QIError object if there was an error.
   */
  async blockUser(): Promise<User | QIError>
  async blockUser(id: string): Promise<User | QIError>
  async blockUser(id?: unknown): Promise<User | QIError> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use blockUser(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationAddBlockedUserArgs,
      { addBlockedUser: UserGraphQL },
      UserGraphQL
    >("addBlockedUser", addBlockedUser, "_mutation() -> blockUser()", {
      blockId: id,
    })

    if (response instanceof QIError) return response

    return new User({
      ...this._parentConfig!,
      id: response.id,
      username: response.username ? response.username : null,
      did: response.did,
      address: response.address,
      email: response.email ? response.email : null,
      bio: response.bio ? response.bio : null,
      avatarUrl: response.avatarUrl ? new URL(response.avatarUrl) : null,
      imageSettings: response.imageSettings ? response.imageSettings : null,
      isVerified: response.isVerified ? response.isVerified : false,
      isPfpNft: response.isPfpNft ? response.isPfpNft : false,
      blacklistIds: response.blacklistIds ? response.blacklistIds : null,
      allowNotification: response.allowNotification
        ? response.allowNotification
        : false,
      allowNotificationSound: response.allowNotificationSound
        ? response.allowNotificationSound
        : false,
      visibility: response.visibility ? response.visibility : false,
      archivedConversations: response.archivedConversations
        ? response.archivedConversations
        : null,
      onlineStatus: response.onlineStatus ? response.onlineStatus : null,
      allowReadReceipt: response.allowReadReceipt
        ? response.allowReadReceipt
        : false,
      allowReceiveMessageFrom: response.allowReceiveMessageFrom
        ? response.allowReceiveMessageFrom
        : null,
      allowAddToGroupsFrom: response.allowAddToGroupsFrom
        ? response.allowAddToGroupsFrom
        : null,
      allowGroupsSuggestion: response.allowGroupsSuggestion
        ? response.allowGroupsSuggestion
        : false,
      e2ePublicKey: response.e2ePublicKey ? response.e2ePublicKey : null,
      e2eSecret: response.e2eSecret ? response.e2eSecret : null,
      e2eSecretIV: response.e2eSecretIV ? response.e2eSecretIV : null,
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async addMembersToConversation(
    args: AddMembersToConversationArgs
  ): Promise<
    { conversationId: string; items: Array<ConversationMember> } | QIError
  > {
    const response = await this._mutation<
      MutationAddMembersToConversationArgs,
      { addMembersToConversation: ListConversationMembersGraphQL },
      ListConversationMembersGraphQL
    >(
      "addMembersToConversation",
      addMembersToConversation,
      "_mutation() -> addMembersToConversation()",
      {
        input: {
          conversationId: (args as AddMembersToConversationArgs).id,
          members: (args as AddMembersToConversationArgs).members,
        },
      }
    )

    if (response instanceof QIError) return response

    const listConversationMembers: {
      conversationId: string
      items: Array<ConversationMember>
    } = {
      conversationId: response.conversationId,
      items: response.items.map((item) => {
        return new ConversationMember({
          ...this._parentConfig!,
          id: item.id,
          conversationId: item.conversationId,
          userId: item.userId,
          type: item.type,
          encryptedConversationPublicKey: item.encryptedConversationPublicKey,
          encryptedConversationPrivateKey: item.encryptedConversationPrivateKey,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        })
      }),
    }

    return listConversationMembers
  }

  async pinMessage(): Promise<Message | QIError>
  async pinMessage(id: string): Promise<Message | QIError>
  async pinMessage(id?: unknown): Promise<Message | QIError> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use pinMessage(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationAddPinToMessageArgs,
      { addPinToMessage: MessageGraphQL },
      MessageGraphQL
    >("addPinToMessage", addPinToMessage, "_mutation() -> pinMessage()", {
      messageId: id,
    })

    if (response instanceof QIError) return response

    return new Message({
      ...this._parentConfig!,
      id: response.id,
      content: response.content,
      conversationId: response.conversationId,
      reactions: response.reactions
        ? response.reactions.map((reaction) => {
            return new Reaction({
              ...this._parentConfig!,
              userId: reaction.userId,
              content: reaction.content,
              createdAt: reaction.createdAt,
              client: this._client!,
              realtimeClient: this._realtimeClient!,
            })
          })
        : null,
      userId: response.userId,
      messageRoot: response.messageRoot
        ? new Message({
            ...this._parentConfig!,
            id: response.messageRoot.id,
            content: response.messageRoot.content,
            conversationId: response.messageRoot.conversationId,
            reactions: response.messageRoot.reactions
              ? response.messageRoot.reactions.map((reaction) => {
                  return new Reaction({
                    ...this._parentConfig!,
                    userId: reaction.userId,
                    content: reaction.content,
                    createdAt: reaction.createdAt,
                    client: this._client!,
                    realtimeClient: this._realtimeClient!,
                  })
                })
              : null,
            userId: response.messageRoot.userId,
            messageRoot: null,
            messageRootId: null,
            type: response.messageRoot.type
              ? (response.messageRoot.type as
                  | "TEXTUAL"
                  | "ATTACHMENT"
                  | "TRADE_PROPOSAL"
                  | "RENT")
              : null,
            order: response.messageRoot.order,
            createdAt: response.messageRoot.createdAt,
            updatedAt: response.messageRoot.updatedAt
              ? response.messageRoot.updatedAt
              : null,
            deletedAt: response.messageRoot.deletedAt
              ? response.messageRoot.deletedAt
              : null,
            client: this._client!,
            realtimeClient: this._realtimeClient!,
          })
        : null,
      messageRootId: response.messageRootId ? response.messageRootId : null,
      type: response.type
        ? (response.type as
            | "TEXTUAL"
            | "ATTACHMENT"
            | "TRADE_PROPOSAL"
            | "RENT")
        : null,
      order: response.order,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async addReactionToMessage(
    args: AddReactionToMessageArgs
  ): Promise<Message | QIError> {
    const response = await this._mutation<
      MutationAddReactionToMessageArgs,
      { addReactionToMessage: MessageGraphQL },
      MessageGraphQL
    >(
      "addReactionToMessage",
      addReactionToMessage,
      "_mutation() -> addReactionToMessage()",
      {
        input: {
          messageId: args.messageId,
          reactionContent: Crypto.encryptStringOrFail(
            this.findPublicKeyById(args.conversationId),
            args.reaction
          ),
          conversationId: args.conversationId,
        },
      }
    )

    if (response instanceof QIError) return response

    return new Message({
      ...this._parentConfig!,
      id: response.id,
      content: response.content,
      conversationId: response.conversationId,
      reactions: response.reactions
        ? response.reactions.map((reaction) => {
            return new Reaction({
              ...this._parentConfig!,
              userId: reaction.userId,
              content: reaction.content,
              createdAt: reaction.createdAt,
              client: this._client!,
              realtimeClient: this._realtimeClient!,
            })
          })
        : null,
      userId: response.userId,
      messageRoot: response.messageRoot
        ? new Message({
            ...this._parentConfig!,
            id: response.messageRoot.id,
            content: response.messageRoot.content,
            conversationId: response.messageRoot.conversationId,
            reactions: response.messageRoot.reactions
              ? response.messageRoot.reactions.map((reaction) => {
                  return new Reaction({
                    ...this._parentConfig!,
                    userId: reaction.userId,
                    content: reaction.content,
                    createdAt: reaction.createdAt,
                    client: this._client!,
                    realtimeClient: this._realtimeClient!,
                  })
                })
              : null,
            userId: response.messageRoot.userId,
            messageRoot: null,
            messageRootId: null,
            type: response.messageRoot.type
              ? (response.messageRoot.type as
                  | "TEXTUAL"
                  | "ATTACHMENT"
                  | "TRADE_PROPOSAL"
                  | "RENT")
              : null,
            order: response.messageRoot.order,
            createdAt: response.messageRoot.createdAt,
            updatedAt: response.messageRoot.updatedAt
              ? response.messageRoot.updatedAt
              : null,
            deletedAt: response.messageRoot.deletedAt
              ? response.messageRoot.deletedAt
              : null,
            client: this._client!,
            realtimeClient: this._realtimeClient!,
          })
        : null,
      messageRootId: response.messageRootId ? response.messageRootId : null,
      type: response.type
        ? (response.type as
            | "TEXTUAL"
            | "ATTACHMENT"
            | "TRADE_PROPOSAL"
            | "RENT")
        : null,
      order: response.order,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async addReportToConversation(
    args: AddReportToConversationArgs
  ): Promise<QIError | ConversationReport> {
    const response = await this._mutation<
      MutationAddReportToConversationArgs,
      { addReportToConversation: ConversationReportGraphQL },
      ConversationReportGraphQL
    >(
      "addReportToConversation",
      addReportToConversation,
      "_mutation() -> addReportToConversation()",
      {
        input: {
          conversationId: args.id,
          description: args.description,
        },
      }
    )

    if (response instanceof QIError) return response

    return new ConversationReport({
      ...this._parentConfig!,
      id: response.id,
      description: response.description ? response.description : null,
      userId: response.userId ? response.userId : null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async addReportToMessage(
    args: AddReportToMessageArgs
  ): Promise<QIError | MessageReport> {
    const response = await this._mutation<
      MutationAddReportToMessageArgs,
      { addReportToMessage: MessageReportGraphQL },
      MessageReportGraphQL
    >(
      "addReportToMessage",
      addReportToMessage,
      "_mutation() -> addReportToMessage()",
      {
        input: {
          messageId: args.id,
          description: args.description,
        },
      }
    )

    if (response instanceof QIError) return response

    return new MessageReport({
      ...this._parentConfig!,
      id: response.id,
      description: response.description,
      userId: response.userId ? response.userId : null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async archiveConversation(): Promise<User | QIError>
  async archiveConversation(id: string): Promise<User | QIError>
  async archiveConversation(id?: unknown): Promise<User | QIError> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use archiveConversation(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationArchiveConversationArgs,
      { archiveConversation: UserGraphQL },
      UserGraphQL
    >(
      "archiveConversation",
      archiveConversation,
      "_mutation() -> archiveConversation()",
      {
        conversationId: id,
      }
    )

    if (response instanceof QIError) return response

    return new User({
      ...this._parentConfig!,
      id: response.id,
      username: response.username ? response.username : null,
      did: response.did,
      address: response.address,
      email: response.email ? response.email : null,
      bio: response.bio ? response.bio : null,
      avatarUrl: response.avatarUrl ? new URL(response.avatarUrl) : null,
      imageSettings: response.imageSettings ? response.imageSettings : null,
      isVerified: response.isVerified ? response.isVerified : false,
      isPfpNft: response.isPfpNft ? response.isPfpNft : false,
      blacklistIds: response.blacklistIds ? response.blacklistIds : null,
      allowNotification: response.allowNotification
        ? response.allowNotification
        : false,
      allowNotificationSound: response.allowNotificationSound
        ? response.allowNotificationSound
        : false,
      visibility: response.visibility ? response.visibility : false,
      archivedConversations: response.archivedConversations
        ? response.archivedConversations
        : null,
      onlineStatus: response.onlineStatus ? response.onlineStatus : null,
      allowReadReceipt: response.allowReadReceipt
        ? response.allowReadReceipt
        : false,
      allowReceiveMessageFrom: response.allowReceiveMessageFrom
        ? response.allowReceiveMessageFrom
        : null,
      allowAddToGroupsFrom: response.allowAddToGroupsFrom
        ? response.allowAddToGroupsFrom
        : null,
      allowGroupsSuggestion: response.allowGroupsSuggestion
        ? response.allowGroupsSuggestion
        : false,
      e2ePublicKey: response.e2ePublicKey ? response.e2ePublicKey : null,
      e2eSecret: response.e2eSecret ? response.e2eSecret : null,
      e2eSecretIV: response.e2eSecretIV ? response.e2eSecretIV : null,
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async archiveConversations(ids: Array<string>): Promise<User | QIError> {
    const response = await this._mutation<
      MutationArchiveConversationsArgs,
      { archiveConversations: UserGraphQL },
      UserGraphQL
    >(
      "archiveConversations",
      archiveConversations,
      "_mutation() -> archiveConversations()",
      {
        conversationIds: ids,
      }
    )

    if (response instanceof QIError) return response

    return new User({
      ...this._parentConfig!,
      id: response.id,
      username: response.username ? response.username : null,
      did: response.did,
      address: response.address,
      email: response.email ? response.email : null,
      bio: response.bio ? response.bio : null,
      avatarUrl: response.avatarUrl ? new URL(response.avatarUrl) : null,
      imageSettings: response.imageSettings ? response.imageSettings : null,
      isVerified: response.isVerified ? response.isVerified : false,
      isPfpNft: response.isPfpNft ? response.isPfpNft : false,
      blacklistIds: response.blacklistIds ? response.blacklistIds : null,
      allowNotification: response.allowNotification
        ? response.allowNotification
        : false,
      allowNotificationSound: response.allowNotificationSound
        ? response.allowNotificationSound
        : false,
      visibility: response.visibility ? response.visibility : false,
      archivedConversations: response.archivedConversations
        ? response.archivedConversations
        : null,
      onlineStatus: response.onlineStatus ? response.onlineStatus : null,
      allowReadReceipt: response.allowReadReceipt
        ? response.allowReadReceipt
        : false,
      allowReceiveMessageFrom: response.allowReceiveMessageFrom
        ? response.allowReceiveMessageFrom
        : null,
      allowAddToGroupsFrom: response.allowAddToGroupsFrom
        ? response.allowAddToGroupsFrom
        : null,
      allowGroupsSuggestion: response.allowGroupsSuggestion
        ? response.allowGroupsSuggestion
        : false,
      e2ePublicKey: response.e2ePublicKey ? response.e2ePublicKey : null,
      e2eSecret: response.e2eSecret ? response.e2eSecret : null,
      e2eSecretIV: response.e2eSecretIV ? response.e2eSecretIV : null,
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async createConversationGroup(
    args: CreateConversationGroupArgs
  ): Promise<
    { keypairItem: KeyPairItem | null; conversation: Conversation } | QIError
  > {
    const keypair = await Crypto.generateKeys("HIGH")
    const response = await this._mutation<
      MutationCreateConversationGroupArgs,
      { createConversationGroup: ConversationGraphQL },
      ConversationGraphQL
    >(
      "createConversationGroup",
      createConversationGroup,
      "_mutation() -> createConversationGroup()",
      {
        input: {
          name: Crypto.encrypt(keypair!.publicKey, args.name),
          description: Crypto.encrypt(keypair!.publicKey, args.description),
          bannerImageURL: Crypto.encrypt(
            keypair!.publicKey,
            args.bannerImageURL
          ),
          imageURL: Crypto.encrypt(keypair!.publicKey, args.imageURL),
          imageSettings: Crypto.encrypt(
            keypair!.publicKey,
            JSON.stringify(args.imageSettings)
          ),
        },
      }
    )

    if (response instanceof QIError) return response

    this.addKeyPairItem({
      id: response.id,
      keypair: keypair!,
    })

    const conversationGroup: {
      keypairItem: KeyPairItem
      conversation: Conversation
    } = {
      keypairItem: {
        id: response.id,
        keypair: keypair!,
      },
      conversation: new Conversation({
        ...this._parentConfig!,
        id: response.id,
        name: response.name,
        description: response.description ? response.description : null,
        imageURL: response.imageURL ? response.imageURL : null,
        bannerImageURL: response.bannerImageURL
          ? response.bannerImageURL
          : null,
        imageSettings: response.imageSettings ? response.imageSettings : null,
        settings: response.settings ? response.settings : null,
        membersIds: response.membersIds ? response.membersIds : null,
        mutedBy: response.mutedBy ? response.mutedBy : null,
        type: response.type,
        lastMessageSentAt: response.lastMessageSentAt
          ? response.lastMessageSentAt
          : null,
        ownerId: response.ownerId ? response.ownerId : null,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt ? response.updatedAt : null,
        deletedAt: response.deletedAt ? response.deletedAt : null,
        client: this._client!,
        realtimeClient: this._realtimeClient!,
      }),
    }

    return conversationGroup
  }

  async createConversationOneToOne(
    args: CreateConversationOneToOneArgs
  ): Promise<
    QIError | { keypairItem: KeyPairItem | null; conversation: Conversation }
  > {
    const keypair = await Crypto.generateKeys("HIGH")
    const response = await this._mutation<
      MutationCreateConversationOneToOneArgs,
      { createConversationOneToOne: ConversationGraphQL },
      ConversationGraphQL
    >(
      "createConversationOneToOne",
      createConversationOneToOne,
      "_mutation() -> createConversationOneToOne()",
      {
        input: {
          name: Crypto.encrypt(keypair!.publicKey, args.name),
          description: Crypto.encrypt(keypair!.publicKey, args.description),
          bannerImageURL: Crypto.encrypt(
            keypair!.publicKey,
            args.bannerImageURL
          ),
          imageURL: Crypto.encrypt(keypair!.publicKey, args.imageURL),
        },
      }
    )

    if (response instanceof QIError) return response

    const conversationItem: {
      keypairItem: KeyPairItem | null
      conversation: Conversation
    } = {
      keypairItem: {
        id: response.id,
        keypair: keypair!,
      },
      conversation: new Conversation({
        ...this._parentConfig!,
        id: response.id,
        name: response.name,
        description: response.description ? response.description : null,
        imageURL: response.imageURL ? response.imageURL : null,
        bannerImageURL: response.bannerImageURL
          ? response.bannerImageURL
          : null,
        imageSettings: response.imageSettings ? response.imageSettings : null,
        settings: response.settings ? response.settings : null,
        membersIds: response.membersIds ? response.membersIds : null,
        mutedBy: response.mutedBy ? response.mutedBy : null,
        type: response.type,
        lastMessageSentAt: response.lastMessageSentAt
          ? response.lastMessageSentAt
          : null,
        ownerId: response.ownerId ? response.ownerId : null,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt ? response.updatedAt : null,
        deletedAt: response.deletedAt ? response.deletedAt : null,
        client: this._client!,
        realtimeClient: this._realtimeClient!,
      }),
    }

    return conversationItem
  }

  async deleteBatchConversationMessages(
    args: DeleteBatchConversationMessagesArgs
  ): Promise<{ conversationId: string; messagesIds: string[] } | QIError> {
    const response = await this._mutation<
      MutationDeleteBatchConversationMessagesArgs,
      { deleteBatchConversationMessages: BatchDeleteMessagesResultGraphQL },
      BatchDeleteMessagesResultGraphQL
    >(
      "deleteBatchConversationMessages",
      deleteBatchConversationMessages,
      "_mutation() -> deleteBatchConversationMessages()",
      {
        input: {
          conversationId: args.id,
          messagesIds: args.messagesIds,
        },
      }
    )

    if (response instanceof QIError) return response

    return {
      conversationId: response.conversationId,
      messagesIds: response.messagesIds,
    }
  }

  async deleteMessage(id: string): Promise<Message | QIError> {
    const response = await this._mutation<
      MutationDeleteConversationMessageArgs,
      { deleteConversationMessage: MessageGraphQL },
      MessageGraphQL
    >(
      "deleteConversationMessage",
      deleteConversationMessage,
      "_mutation() -> deleteMessage()",
      {
        input: {
          messageId: id,
        },
      }
    )

    if (response instanceof QIError) return response

    return new Message({
      ...this._parentConfig!,
      id: response.id,
      content: response.content,
      conversationId: response.conversationId,
      reactions: response.reactions
        ? response.reactions.map((reaction) => {
            return new Reaction({
              ...this._parentConfig!,
              userId: reaction.userId,
              content: reaction.content,
              createdAt: reaction.createdAt,
              client: this._client!,
              realtimeClient: this._realtimeClient!,
            })
          })
        : null,
      userId: response.userId,
      messageRoot: response.messageRoot
        ? new Message({
            ...this._parentConfig!,
            id: response.messageRoot.id,
            content: response.messageRoot.content,
            conversationId: response.messageRoot.conversationId,
            reactions: response.messageRoot.reactions
              ? response.messageRoot.reactions.map((reaction) => {
                  return new Reaction({
                    ...this._parentConfig!,
                    userId: reaction.userId,
                    content: reaction.content,
                    createdAt: reaction.createdAt,
                    client: this._client!,
                    realtimeClient: this._realtimeClient!,
                  })
                })
              : null,
            userId: response.messageRoot.userId,
            messageRoot: null,
            messageRootId: null,
            type: response.messageRoot.type
              ? (response.messageRoot.type as
                  | "TEXTUAL"
                  | "ATTACHMENT"
                  | "TRADE_PROPOSAL"
                  | "RENT")
              : null,
            order: response.messageRoot.order,
            createdAt: response.messageRoot.createdAt,
            updatedAt: response.messageRoot.updatedAt
              ? response.messageRoot.updatedAt
              : null,
            deletedAt: response.messageRoot.deletedAt
              ? response.messageRoot.deletedAt
              : null,
            client: this._client!,
            realtimeClient: this._realtimeClient!,
          })
        : null,
      messageRootId: response.messageRootId ? response.messageRootId : null,
      type: response.type
        ? (response.type as
            | "TEXTUAL"
            | "ATTACHMENT"
            | "TRADE_PROPOSAL"
            | "RENT")
        : null,
      order: response.order,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async deleteRequestTrade(
    id: string
  ): Promise<ConversationTradingPool | QIError> {
    const response = await this._mutation<
      MutationDeleteRequestTradeArgs,
      { deleteRequestTrade: ConversationTradingPoolGraphQL },
      ConversationTradingPoolGraphQL
    >(
      "deleteRequestTrade",
      deleteRequestTrade,
      "_mutation() -> deleteRequestTrade()",
      {
        requestTradeId: id,
      }
    )

    if (response instanceof QIError) return response

    return new ConversationTradingPool({
      ...this._parentConfig!,
      id: response.id,
      conversationId: response.conversationId ? response.conversationId : null,
      userId: response.userId ? response.userId : null,
      involvedUsers: response.involvedUsers ? response.involvedUsers : null,
      operation: response.operation ? response.operation : null,
      status: response.status ? response.status : null,
      type: response.type ? response.type : null,
      createdAt: response.createdAt ? response.createdAt : null,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async editMessage(args: EditMessageArgs): Promise<QIError | Message> {
    const response = await this._mutation<
      MutationEditMessageArgs,
      { editMessage: MessageGraphQL },
      MessageGraphQL
    >("editMessage", editMessage, "_mutation() -> editMessage()", {
      input: {
        messageId: args.id,
        content: Crypto.encryptStringOrFail(
          this.findPublicKeyById(args.conversationId),
          args.content
        ),
        conversationId: args.conversationId,
      },
    })

    if (response instanceof QIError) return response

    return new Message({
      ...this._parentConfig!,
      id: response.id,
      content: response.content,
      conversationId: response.conversationId,
      reactions: response.reactions
        ? response.reactions.map((reaction) => {
            return new Reaction({
              ...this._parentConfig!,
              userId: reaction.userId,
              content: reaction.content,
              createdAt: reaction.createdAt,
              client: this._client!,
              realtimeClient: this._realtimeClient!,
            })
          })
        : null,
      userId: response.userId,
      messageRoot: response.messageRoot
        ? new Message({
            ...this._parentConfig!,
            id: response.messageRoot.id,
            content: response.messageRoot.content,
            conversationId: response.messageRoot.conversationId,
            reactions: response.messageRoot.reactions
              ? response.messageRoot.reactions.map((reaction) => {
                  return new Reaction({
                    ...this._parentConfig!,
                    userId: reaction.userId,
                    content: reaction.content,
                    createdAt: reaction.createdAt,
                    client: this._client!,
                    realtimeClient: this._realtimeClient!,
                  })
                })
              : null,
            userId: response.messageRoot.userId,
            messageRoot: null,
            messageRootId: null,
            type: response.messageRoot.type
              ? (response.messageRoot.type as
                  | "TEXTUAL"
                  | "ATTACHMENT"
                  | "TRADE_PROPOSAL"
                  | "RENT")
              : null,
            order: response.messageRoot.order,
            createdAt: response.messageRoot.createdAt,
            updatedAt: response.messageRoot.updatedAt
              ? response.messageRoot.updatedAt
              : null,
            deletedAt: response.messageRoot.deletedAt
              ? response.messageRoot.deletedAt
              : null,
            client: this._client!,
            realtimeClient: this._realtimeClient!,
          })
        : null,
      messageRootId: response.messageRootId ? response.messageRootId : null,
      type: response.type
        ? (response.type as
            | "TEXTUAL"
            | "ATTACHMENT"
            | "TRADE_PROPOSAL"
            | "RENT")
        : null,
      order: response.order,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async ejectMember(
    args: EjectMemberArgs
  ): Promise<
    | QIError
    | { conversationId: string; conversation: Conversation; memberOut: User }
  > {
    const response = await this._mutation<
      MutationEjectMemberArgs,
      { ejectMember: MemberOutResultGraphQL },
      MemberOutResultGraphQL
    >("ejectMember", ejectMember, "_mutation() -> ejectMember()", {
      input: {
        conversationId: args.id,
        userId: args.userId,
      },
    })

    if (response instanceof QIError) return response

    return {
      conversationId: response.conversationId,
      conversation: new Conversation({
        ...this._parentConfig!,
        id: response.conversation.id,
        name: response.conversation.name,
        description: response.conversation.description
          ? response.conversation.description
          : null,
        imageURL: response.conversation.imageURL
          ? response.conversation.imageURL
          : null,
        bannerImageURL: response.conversation.bannerImageURL
          ? response.conversation.bannerImageURL
          : null,
        imageSettings: response.conversation.imageSettings
          ? response.conversation.imageSettings
          : null,
        settings: response.conversation.settings
          ? response.conversation.settings
          : null,
        membersIds: response.conversation.membersIds
          ? response.conversation.membersIds
          : null,
        mutedBy: response.conversation.mutedBy
          ? response.conversation.mutedBy
          : null,
        type: response.conversation.type,
        lastMessageSentAt: response.conversation.lastMessageSentAt
          ? response.conversation.lastMessageSentAt
          : null,
        ownerId: response.conversation.ownerId
          ? response.conversation.ownerId
          : null,
        createdAt: response.conversation.createdAt,
        updatedAt: response.conversation.updatedAt
          ? response.conversation.updatedAt
          : null,
        deletedAt: response.conversation.deletedAt
          ? response.conversation.deletedAt
          : null,
        client: this._client!,
        realtimeClient: this._realtimeClient!,
      }),
      memberOut: new User({
        ...this._parentConfig!,
        id: response.memberOut.id,
        username: response.memberOut.username
          ? response.memberOut.username
          : null,
        did: response.memberOut.did,
        address: response.memberOut.address,
        email: response.memberOut.email ? response.memberOut.email : null,
        bio: response.memberOut.bio ? response.memberOut.bio : null,
        avatarUrl: response.memberOut.avatarUrl
          ? new URL(response.memberOut.avatarUrl)
          : null,
        imageSettings: response.memberOut.imageSettings
          ? response.memberOut.imageSettings
          : null,
        isVerified: response.memberOut.isVerified
          ? response.memberOut.isVerified
          : false,
        isPfpNft: response.memberOut.isPfpNft
          ? response.memberOut.isPfpNft
          : false,
        blacklistIds: response.memberOut.blacklistIds
          ? response.memberOut.blacklistIds
          : null,
        allowNotification: response.memberOut.allowNotification
          ? response.memberOut.allowNotification
          : false,
        allowNotificationSound: response.memberOut.allowNotificationSound
          ? response.memberOut.allowNotificationSound
          : false,
        visibility: response.memberOut.visibility
          ? response.memberOut.visibility
          : false,
        archivedConversations: response.memberOut.archivedConversations
          ? response.memberOut.archivedConversations
          : null,
        onlineStatus: response.memberOut.onlineStatus
          ? response.memberOut.onlineStatus
          : null,
        allowReadReceipt: response.memberOut.allowReadReceipt
          ? response.memberOut.allowReadReceipt
          : false,
        allowReceiveMessageFrom: response.memberOut.allowReceiveMessageFrom
          ? response.memberOut.allowReceiveMessageFrom
          : null,
        allowAddToGroupsFrom: response.memberOut.allowAddToGroupsFrom
          ? response.memberOut.allowAddToGroupsFrom
          : null,
        allowGroupsSuggestion: response.memberOut.allowGroupsSuggestion
          ? response.memberOut.allowGroupsSuggestion
          : false,
        e2ePublicKey: response.memberOut.e2ePublicKey
          ? response.memberOut.e2ePublicKey
          : null,
        e2eSecret: response.memberOut.e2eSecret
          ? response.memberOut.e2eSecret
          : null,
        e2eSecretIV: response.memberOut.e2eSecretIV
          ? response.memberOut.e2eSecretIV
          : null,
        createdAt: new Date(response.memberOut.createdAt),
        updatedAt: response.memberOut.updatedAt
          ? new Date(response.memberOut.updatedAt)
          : null,
        client: this._client!,
        realtimeClient: this._realtimeClient!,
      }),
    }
  }

  async eraseConversationByAdmin(
    id: string
  ): Promise<
    { conversationId: string; items: Array<{ id: string }> } | QIError
  > {
    const response = await this._query<
      MutationEraseConversationByAdminArgs,
      { eraseConversationByAdmin: EraseConversationByAdminBatchResultGraphQL },
      EraseConversationByAdminBatchResultGraphQL
    >(
      "eraseConversationByAdmin",
      eraseConversationByAdmin,
      "_mutation() -> eraseConversationByAdmin()",
      {
        conversationId: id,
      }
    )

    if (response instanceof QIError) return response

    const listConversations: {
      conversationId: string
      items: Array<{ id: string }>
    } = {
      conversationId: response.conversationId,
      items: response.items,
    }

    return listConversations
  }

  async leaveConversation(): Promise<
    | { conversationId: string; conversation: Conversation; memberOut: User }
    | QIError
  >
  async leaveConversation(
    id: string
  ): Promise<
    | { conversationId: string; conversation: Conversation; memberOut: User }
    | QIError
  >
  async leaveConversation(
    id?: unknown
  ): Promise<
    | { conversationId: string; conversation: Conversation; memberOut: User }
    | QIError
  > {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use leaveConversation(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationLeaveConversationArgs,
      { leaveConversation: MemberOutResultGraphQL },
      MemberOutResultGraphQL
    >(
      "leaveConversation",
      leaveConversation,
      "_mutation() -> leaveConversation()",
      {
        conversationId: id,
      }
    )

    if (response instanceof QIError) return response

    return {
      conversationId: response.conversationId,
      conversation: new Conversation({
        ...this._parentConfig!,
        id: response.conversation.id,
        name: response.conversation.name,
        description: response.conversation.description
          ? response.conversation.description
          : null,
        imageURL: response.conversation.imageURL
          ? response.conversation.imageURL
          : null,
        bannerImageURL: response.conversation.bannerImageURL
          ? response.conversation.bannerImageURL
          : null,
        imageSettings: response.conversation.imageSettings
          ? response.conversation.imageSettings
          : null,
        settings: response.conversation.settings
          ? response.conversation.settings
          : null,
        membersIds: response.conversation.membersIds
          ? response.conversation.membersIds
          : null,
        mutedBy: response.conversation.mutedBy
          ? response.conversation.mutedBy
          : null,
        type: response.conversation.type,
        lastMessageSentAt: response.conversation.lastMessageSentAt
          ? response.conversation.lastMessageSentAt
          : null,
        ownerId: response.conversation.ownerId
          ? response.conversation.ownerId
          : null,
        createdAt: response.conversation.createdAt,
        updatedAt: response.conversation.updatedAt
          ? response.conversation.updatedAt
          : null,
        deletedAt: response.conversation.deletedAt
          ? response.conversation.deletedAt
          : null,
        client: this._client!,
        realtimeClient: this._realtimeClient!,
      }),
      memberOut: new User({
        ...this._parentConfig!,
        id: response.memberOut.id,
        username: response.memberOut.username
          ? response.memberOut.username
          : null,
        did: response.memberOut.did,
        address: response.memberOut.address,
        email: response.memberOut.email ? response.memberOut.email : null,
        bio: response.memberOut.bio ? response.memberOut.bio : null,
        avatarUrl: response.memberOut.avatarUrl
          ? new URL(response.memberOut.avatarUrl)
          : null,
        imageSettings: response.memberOut.imageSettings
          ? response.memberOut.imageSettings
          : null,
        isVerified: response.memberOut.isVerified
          ? response.memberOut.isVerified
          : false,
        isPfpNft: response.memberOut.isPfpNft
          ? response.memberOut.isPfpNft
          : false,
        blacklistIds: response.memberOut.blacklistIds
          ? response.memberOut.blacklistIds
          : null,
        allowNotification: response.memberOut.allowNotification
          ? response.memberOut.allowNotification
          : false,
        allowNotificationSound: response.memberOut.allowNotificationSound
          ? response.memberOut.allowNotificationSound
          : false,
        visibility: response.memberOut.visibility
          ? response.memberOut.visibility
          : false,
        archivedConversations: response.memberOut.archivedConversations
          ? response.memberOut.archivedConversations
          : null,
        onlineStatus: response.memberOut.onlineStatus
          ? response.memberOut.onlineStatus
          : null,
        allowReadReceipt: response.memberOut.allowReadReceipt
          ? response.memberOut.allowReadReceipt
          : false,
        allowReceiveMessageFrom: response.memberOut.allowReceiveMessageFrom
          ? response.memberOut.allowReceiveMessageFrom
          : null,
        allowAddToGroupsFrom: response.memberOut.allowAddToGroupsFrom
          ? response.memberOut.allowAddToGroupsFrom
          : null,
        allowGroupsSuggestion: response.memberOut.allowGroupsSuggestion
          ? response.memberOut.allowGroupsSuggestion
          : false,
        e2ePublicKey: response.memberOut.e2ePublicKey
          ? response.memberOut.e2ePublicKey
          : null,
        e2eSecret: response.memberOut.e2eSecret
          ? response.memberOut.e2eSecret
          : null,
        e2eSecretIV: response.memberOut.e2eSecretIV
          ? response.memberOut.e2eSecretIV
          : null,
        createdAt: new Date(response.memberOut.createdAt),
        updatedAt: response.memberOut.updatedAt
          ? new Date(response.memberOut.updatedAt)
          : null,
        client: this._client!,
        realtimeClient: this._realtimeClient!,
      }),
    }
  }

  async muteConversation(
    args: MuteConversationArgs
  ): Promise<QIError | Conversation>
  async muteConversation(args: unknown): Promise<Conversation | QIError> {
    const response = await this._mutation<
      MutationMuteConversationArgs,
      { muteConversation: ConversationGraphQL },
      ConversationGraphQL
    >(
      "muteConversation",
      muteConversation,
      "_mutation() -> muteConversation()",
      {
        conversationId: (args as MuteConversationArgs).id,
      }
    )

    if (response instanceof QIError) return response

    return new Conversation({
      ...this._parentConfig!,
      id: response.id,
      name: response.name,
      description: response.description ? response.description : null,
      imageURL: response.imageURL ? response.imageURL : null,
      bannerImageURL: response.bannerImageURL ? response.bannerImageURL : null,
      imageSettings: response.imageSettings ? response.imageSettings : null,
      settings: response.settings ? response.settings : null,
      membersIds: response.membersIds ? response.membersIds : null,
      mutedBy: response.mutedBy ? response.mutedBy : null,
      type: response.type,
      lastMessageSentAt: response.lastMessageSentAt
        ? response.lastMessageSentAt
        : null,
      ownerId: response.ownerId ? response.ownerId : null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async unlockUser(): Promise<QIError | User>
  async unlockUser(id: string): Promise<QIError | User>
  async unlockUser(id?: unknown): Promise<QIError | User> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use unlockUser(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationRemoveBlockedUserArgs,
      { removeBlockedUser: UserGraphQL },
      UserGraphQL
    >("removeBlockedUser", removeBlockedUser, "_mutation() -> unlockUser()", {
      blockId: id,
    })

    if (response instanceof QIError) return response

    return new User({
      ...this._parentConfig!,
      id: response.id,
      username: response.username ? response.username : null,
      did: response.did,
      address: response.address,
      email: response.email ? response.email : null,
      bio: response.bio ? response.bio : null,
      avatarUrl: response.avatarUrl ? new URL(response.avatarUrl) : null,
      imageSettings: response.imageSettings ? response.imageSettings : null,
      isVerified: response.isVerified ? response.isVerified : false,
      isPfpNft: response.isPfpNft ? response.isPfpNft : false,
      blacklistIds: response.blacklistIds ? response.blacklistIds : null,
      allowNotification: response.allowNotification
        ? response.allowNotification
        : false,
      allowNotificationSound: response.allowNotificationSound
        ? response.allowNotificationSound
        : false,
      visibility: response.visibility ? response.visibility : false,
      archivedConversations: response.archivedConversations
        ? response.archivedConversations
        : null,
      onlineStatus: response.onlineStatus ? response.onlineStatus : null,
      allowReadReceipt: response.allowReadReceipt
        ? response.allowReadReceipt
        : false,
      allowReceiveMessageFrom: response.allowReceiveMessageFrom
        ? response.allowReceiveMessageFrom
        : null,
      allowAddToGroupsFrom: response.allowAddToGroupsFrom
        ? response.allowAddToGroupsFrom
        : null,
      allowGroupsSuggestion: response.allowGroupsSuggestion
        ? response.allowGroupsSuggestion
        : false,
      e2ePublicKey: response.e2ePublicKey ? response.e2ePublicKey : null,
      e2eSecret: response.e2eSecret ? response.e2eSecret : null,
      e2eSecretIV: response.e2eSecretIV ? response.e2eSecretIV : null,
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async unpinMessage(): Promise<QIError | Message>
  async unpinMessage(id: string): Promise<QIError | Message>
  async unpinMessage(id?: unknown): Promise<QIError | Message> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use unpinMessage(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationRemovePinFromMessageArgs,
      { removePinFromMessage: MessageGraphQL },
      MessageGraphQL
    >(
      "removePinFromMessage",
      removePinFromMessage,
      "_mutation() -> unpinMessage()",
      {
        messageId: id,
      }
    )

    if (response instanceof QIError) return response

    return new Message({
      ...this._parentConfig!,
      id: response.id,
      content: response.content,
      conversationId: response.conversationId,
      reactions: response.reactions
        ? response.reactions.map((reaction) => {
            return new Reaction({
              ...this._parentConfig!,
              userId: reaction.userId,
              content: reaction.content,
              createdAt: reaction.createdAt,
              client: this._client!,
              realtimeClient: this._realtimeClient!,
            })
          })
        : null,
      userId: response.userId,
      messageRoot: response.messageRoot
        ? new Message({
            ...this._parentConfig!,
            id: response.messageRoot.id,
            content: response.messageRoot.content,
            conversationId: response.messageRoot.conversationId,
            reactions: response.messageRoot.reactions
              ? response.messageRoot.reactions.map((reaction) => {
                  return new Reaction({
                    ...this._parentConfig!,
                    userId: reaction.userId,
                    content: reaction.content,
                    createdAt: reaction.createdAt,
                    client: this._client!,
                    realtimeClient: this._realtimeClient!,
                  })
                })
              : null,
            userId: response.messageRoot.userId,
            messageRoot: null,
            messageRootId: null,
            type: response.messageRoot.type
              ? (response.messageRoot.type as
                  | "TEXTUAL"
                  | "ATTACHMENT"
                  | "TRADE_PROPOSAL"
                  | "RENT")
              : null,
            order: response.messageRoot.order,
            createdAt: response.messageRoot.createdAt,
            updatedAt: response.messageRoot.updatedAt
              ? response.messageRoot.updatedAt
              : null,
            deletedAt: response.messageRoot.deletedAt
              ? response.messageRoot.deletedAt
              : null,
            client: this._client!,
            realtimeClient: this._realtimeClient!,
          })
        : null,
      messageRootId: response.messageRootId ? response.messageRootId : null,
      type: response.type
        ? (response.type as
            | "TEXTUAL"
            | "ATTACHMENT"
            | "TRADE_PROPOSAL"
            | "RENT")
        : null,
      order: response.order,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async removeReactionFromMessage(
    args: RemoveReactionFromMessageArgs
  ): Promise<QIError | Message> {
    const response = await this._mutation<
      MutationRemoveReactionFromMessageArgs,
      { removeReactionFromMessage: MessageGraphQL },
      MessageGraphQL
    >(
      "removeReactionFromMessage",
      removeReactionFromMessage,
      "_mutation() -> removeReactionFromMessage()",
      {
        input: {
          reactionContent: Crypto.encryptStringOrFail(
            this.findPublicKeyById(args.conversationId),
            args.reaction
          ),
          messageId: args.messageId,
          conversationId: args.conversationId,
        },
      }
    )

    if (response instanceof QIError) return response

    return new Message({
      ...this._parentConfig!,
      id: response.id,
      content: response.content,
      conversationId: response.conversationId,
      reactions: response.reactions
        ? response.reactions.map((reaction) => {
            return new Reaction({
              ...this._parentConfig!,
              userId: reaction.userId,
              content: reaction.content,
              createdAt: reaction.createdAt,
              client: this._client!,
              realtimeClient: this._realtimeClient!,
            })
          })
        : null,
      userId: response.userId,
      messageRoot: response.messageRoot
        ? new Message({
            ...this._parentConfig!,
            id: response.messageRoot.id,
            content: response.messageRoot.content,
            conversationId: response.messageRoot.conversationId,
            reactions: response.messageRoot.reactions
              ? response.messageRoot.reactions.map((reaction) => {
                  return new Reaction({
                    ...this._parentConfig!,
                    userId: reaction.userId,
                    content: reaction.content,
                    createdAt: reaction.createdAt,
                    client: this._client!,
                    realtimeClient: this._realtimeClient!,
                  })
                })
              : null,
            userId: response.messageRoot.userId,
            messageRoot: null,
            messageRootId: null,
            type: response.messageRoot.type
              ? (response.messageRoot.type as
                  | "TEXTUAL"
                  | "ATTACHMENT"
                  | "TRADE_PROPOSAL"
                  | "RENT")
              : null,
            order: response.messageRoot.order,
            createdAt: response.messageRoot.createdAt,
            updatedAt: response.messageRoot.updatedAt
              ? response.messageRoot.updatedAt
              : null,
            deletedAt: response.messageRoot.deletedAt
              ? response.messageRoot.deletedAt
              : null,
            client: this._client!,
            realtimeClient: this._realtimeClient!,
          })
        : null,
      messageRootId: response.messageRootId ? response.messageRootId : null,
      type: response.type
        ? (response.type as
            | "TEXTUAL"
            | "ATTACHMENT"
            | "TRADE_PROPOSAL"
            | "RENT")
        : null,
      order: response.order,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async requestTrade(
    args: RequestTradeArgs
  ): Promise<QIError | ConversationTradingPool> {
    const response = await this._mutation<
      MutationRequestTradeArgs,
      { requestTrade: ConversationTradingPoolGraphQL },
      ConversationTradingPoolGraphQL
    >("requestTrade", requestTrade, "_mutation() -> requestTrade()", {
      input: {
        involvedUsers: args.involvedUsers,
        conversationId: args.conversationId,
        operation: JSON.stringify(args.operation),
      },
    })

    if (response instanceof QIError) return response

    return new ConversationTradingPool({
      ...this._parentConfig!,
      id: response.id,
      conversationId: response.conversationId ? response.conversationId : null,
      userId: response.userId ? response.userId : null,
      involvedUsers: response.involvedUsers ? response.involvedUsers : null,
      operation: response.operation ? response.operation : null,
      status: response.status ? response.status : null,
      type: response.type ? response.type : null,
      createdAt: response.createdAt ? response.createdAt : null,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async updateRequestTrade(
    args: UpdateRequestTradeArgs
  ): Promise<QIError | ConversationTradingPool> {
    const response = await this._mutation<
      MutationUpdateRequestTradeArgs,
      { updateRequestTrade: ConversationTradingPoolGraphQL },
      ConversationTradingPoolGraphQL
    >(
      "requestTrade",
      updateRequestTrade,
      "_mutation() -> updateRequestTrade()",
      {
        input: {
          conversationTradingPoolId: args.conversationTradingPoolId,
          status: args.status,
          orderId: args.orderId,
          counterparties: args.counterparties,
        },
      }
    )

    if (response instanceof QIError) return response

    return new ConversationTradingPool({
      ...this._parentConfig!,
      id: response.id,
      conversationId: response.conversationId ? response.conversationId : null,
      userId: response.userId ? response.userId : null,
      involvedUsers: response.involvedUsers ? response.involvedUsers : null,
      operation: response.operation ? response.operation : null,
      status: response.status ? response.status : null,
      type: response.type ? response.type : null,
      createdAt: response.createdAt ? response.createdAt : null,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async sendMessage(args: SendMessageArgs): Promise<QIError | Message> {
    let content: string

    if (typeof args.content === "object") content = JSON.stringify(args.content)
    else content = args.content

    const response = await this._mutation<
      MutationSendMessageArgs,
      { sendMessage: MessageGraphQL },
      MessageGraphQL
    >("sendMessage", sendMessage, "_mutation() -> sendMessage()", {
      input: {
        content: Crypto.encryptStringOrFail(
          this.findPublicKeyById((args as SendMessageArgs).conversationId),
          content
        ),
        conversationId: (args as SendMessageArgs).conversationId,
        type: (args as SendMessageArgs).type,
      },
    })

    if (response instanceof QIError) return response

    return new Message({
      ...this._parentConfig!,
      id: response.id,
      content: response.content,
      conversationId: response.conversationId,
      reactions: response.reactions
        ? response.reactions.map((reaction) => {
            return new Reaction({
              ...this._parentConfig!,
              userId: reaction.userId,
              content: reaction.content,
              createdAt: reaction.createdAt,
              client: this._client!,
              realtimeClient: this._realtimeClient!,
            })
          })
        : null,
      userId: response.userId,
      messageRoot: response.messageRoot
        ? new Message({
            ...this._parentConfig!,
            id: response.messageRoot.id,
            content: response.messageRoot.content,
            conversationId: response.messageRoot.conversationId,
            reactions: response.messageRoot.reactions
              ? response.messageRoot.reactions.map((reaction) => {
                  return new Reaction({
                    ...this._parentConfig!,
                    userId: reaction.userId,
                    content: reaction.content,
                    createdAt: reaction.createdAt,
                    client: this._client!,
                    realtimeClient: this._realtimeClient!,
                  })
                })
              : null,
            userId: response.messageRoot.userId,
            messageRoot: null,
            messageRootId: null,
            type: response.messageRoot.type
              ? (response.messageRoot.type as
                  | "TEXTUAL"
                  | "ATTACHMENT"
                  | "TRADE_PROPOSAL"
                  | "RENT")
              : null,
            order: response.messageRoot.order,
            createdAt: response.messageRoot.createdAt,
            updatedAt: response.messageRoot.updatedAt
              ? response.messageRoot.updatedAt
              : null,
            deletedAt: response.messageRoot.deletedAt
              ? response.messageRoot.deletedAt
              : null,
            client: this._client!,
            realtimeClient: this._realtimeClient!,
          })
        : null,
      messageRootId: response.messageRootId ? response.messageRootId : null,
      type: response.type
        ? (response.type as
            | "TEXTUAL"
            | "ATTACHMENT"
            | "TRADE_PROPOSAL"
            | "RENT")
        : null,
      order: response.order,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async unarchiveConversation(): Promise<QIError | User>
  async unarchiveConversation(id: string): Promise<QIError | User>
  async unarchiveConversation(id?: unknown): Promise<QIError | User> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use unarchiveConversation(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationUnarchiveConversationArgs,
      { unarchiveConversation: UserGraphQL },
      UserGraphQL
    >(
      "unarchiveConversation",
      unarchiveConversation,
      "_mutation() -> unarchiveConversation()",
      {
        conversationId: id,
      }
    )

    if (response instanceof QIError) return response

    return new User({
      ...this._parentConfig!,
      id: response.id,
      username: response.username ? response.username : null,
      did: response.did,
      address: response.address,
      email: response.email ? response.email : null,
      bio: response.bio ? response.bio : null,
      avatarUrl: response.avatarUrl ? new URL(response.avatarUrl) : null,
      imageSettings: response.imageSettings ? response.imageSettings : null,
      isVerified: response.isVerified ? response.isVerified : false,
      isPfpNft: response.isPfpNft ? response.isPfpNft : false,
      blacklistIds: response.blacklistIds ? response.blacklistIds : null,
      allowNotification: response.allowNotification
        ? response.allowNotification
        : false,
      allowNotificationSound: response.allowNotificationSound
        ? response.allowNotificationSound
        : false,
      visibility: response.visibility ? response.visibility : false,
      archivedConversations: response.archivedConversations
        ? response.archivedConversations
        : null,
      onlineStatus: response.onlineStatus ? response.onlineStatus : null,
      allowReadReceipt: response.allowReadReceipt
        ? response.allowReadReceipt
        : false,
      allowReceiveMessageFrom: response.allowReceiveMessageFrom
        ? response.allowReceiveMessageFrom
        : null,
      allowAddToGroupsFrom: response.allowAddToGroupsFrom
        ? response.allowAddToGroupsFrom
        : null,
      allowGroupsSuggestion: response.allowGroupsSuggestion
        ? response.allowGroupsSuggestion
        : false,
      e2ePublicKey: response.e2ePublicKey ? response.e2ePublicKey : null,
      e2eSecret: response.e2eSecret ? response.e2eSecret : null,
      e2eSecretIV: response.e2eSecretIV ? response.e2eSecretIV : null,
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async unarchiveConversations(ids: Array<string>): Promise<User | QIError> {
    const response = await this._mutation<
      MutationUnarchiveConversationsArgs,
      { unarchiveConversations: UserGraphQL },
      UserGraphQL
    >(
      "unarchiveConversations",
      unarchiveConversations,
      "_mutation() -> unarchiveConversations()",
      {
        conversationIds: ids,
      }
    )

    if (response instanceof QIError) return response

    return new User({
      ...this._parentConfig!,
      id: response.id,
      username: response.username ? response.username : null,
      did: response.did,
      address: response.address,
      email: response.email ? response.email : null,
      bio: response.bio ? response.bio : null,
      avatarUrl: response.avatarUrl ? new URL(response.avatarUrl) : null,
      imageSettings: response.imageSettings ? response.imageSettings : null,
      isVerified: response.isVerified ? response.isVerified : false,
      isPfpNft: response.isPfpNft ? response.isPfpNft : false,
      blacklistIds: response.blacklistIds ? response.blacklistIds : null,
      allowNotification: response.allowNotification
        ? response.allowNotification
        : false,
      allowNotificationSound: response.allowNotificationSound
        ? response.allowNotificationSound
        : false,
      visibility: response.visibility ? response.visibility : false,
      archivedConversations: response.archivedConversations
        ? response.archivedConversations
        : null,
      onlineStatus: response.onlineStatus ? response.onlineStatus : null,
      allowReadReceipt: response.allowReadReceipt
        ? response.allowReadReceipt
        : false,
      allowReceiveMessageFrom: response.allowReceiveMessageFrom
        ? response.allowReceiveMessageFrom
        : null,
      allowAddToGroupsFrom: response.allowAddToGroupsFrom
        ? response.allowAddToGroupsFrom
        : null,
      allowGroupsSuggestion: response.allowGroupsSuggestion
        ? response.allowGroupsSuggestion
        : false,
      e2ePublicKey: response.e2ePublicKey ? response.e2ePublicKey : null,
      e2eSecret: response.e2eSecret ? response.e2eSecret : null,
      e2eSecretIV: response.e2eSecretIV ? response.e2eSecretIV : null,
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async unmuteConversation(): Promise<QIError | Conversation>
  async unmuteConversation(id: string): Promise<QIError | Conversation>
  async unmuteConversation(id?: unknown): Promise<QIError | Conversation> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use unmuteConversation(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationUnmuteConversationArgs,
      { unmuteConversation: ConversationGraphQL },
      ConversationGraphQL
    >(
      "unmuteConversation",
      unmuteConversation,
      "_mutation() -> unmuteConversation()",
      {
        conversationId: id,
      }
    )

    if (response instanceof QIError) return response

    return new Conversation({
      ...this._parentConfig!,
      id: response.id,
      name: response.name,
      description: response.description ? response.description : null,
      imageURL: response.imageURL ? response.imageURL : null,
      bannerImageURL: response.bannerImageURL ? response.bannerImageURL : null,
      imageSettings: response.imageSettings ? response.imageSettings : null,
      settings: response.settings ? response.settings : null,
      membersIds: response.membersIds ? response.membersIds : null,
      mutedBy: response.mutedBy ? response.mutedBy : null,
      type: response.type,
      lastMessageSentAt: response.lastMessageSentAt
        ? response.lastMessageSentAt
        : null,
      ownerId: response.ownerId ? response.ownerId : null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async updateConversationGroup(
    args: UpdateConversationGroupInputArgs
  ): Promise<QIError | Conversation> {
    const response = await this._mutation<
      MutationUpdateConversationGroupArgs,
      { updateConversationGroup: ConversationGraphQL },
      ConversationGraphQL
    >(
      "updateConversationGroup",
      updateConversationGroup,
      "_mutation() -> updateConversationGroup()",
      {
        input: {
          conversationId: args.conversationId,
          description: Crypto.encryptStringOrFail(
            this.findPublicKeyById(args.conversationId),
            args.description
          ),
          imageURL: Crypto.encryptStringOrFail(
            this.findPublicKeyById(args.conversationId),
            new URL(args.imageURL).toString()
          ),
          bannerImageURL: Crypto.encryptStringOrFail(
            this.findPublicKeyById(args.conversationId),
            new URL(args.bannerImageURL).toString()
          ),
          name: Crypto.encryptStringOrFail(
            this.findPublicKeyById(args.conversationId),
            args.name
          ),
          settings: JSON.stringify(args.settings),
        },
      }
    )

    if (response instanceof QIError) return response

    return new Conversation({
      ...this._parentConfig!,
      id: response.id,
      name: response.name,
      description: response.description ? response.description : null,
      imageURL: response.imageURL ? response.imageURL : null,
      bannerImageURL: response.bannerImageURL ? response.bannerImageURL : null,
      imageSettings: response.imageSettings ? response.imageSettings : null,
      settings: response.settings ? response.settings : null,
      membersIds: response.membersIds ? response.membersIds : null,
      mutedBy: response.mutedBy ? response.mutedBy : null,
      type: response.type,
      lastMessageSentAt: response.lastMessageSentAt
        ? response.lastMessageSentAt
        : null,
      ownerId: response.ownerId ? response.ownerId : null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async updateUser(args: UpdateUserArgs): Promise<QIError | User> {
    const response = await this._mutation<
      MutationUpdateUserInfoArgs,
      { updateUserInfo: UserGraphQL },
      UserGraphQL
    >("updateUserInfo", updateUserInfo, "_mutation() -> updateUser()", {
      input: {
        allowNotification: args.allowNotification,
        allowNotificationSound: args.allowNotificationSound,
        visibility: args.visibility,
        onlineStatus: args.onlineStatus,
        allowReadReceipt: args.allowReadReceipt
          ? args.allowReadReceipt
          : undefined,
        allowReceiveMessageFrom: args.allowReceiveMessageFrom,
        allowAddToGroupsFrom: args.allowAddToGroupsFrom,
        allowGroupsSuggestion: args.allowGroupsSuggestion,
      },
    })

    if (response instanceof QIError) throw response

    return new User({
      ...this._parentConfig!,
      id: response.id,
      username: response.username ? response.username : null,
      did: response.did,
      address: response.address,
      email: response.email ? response.email : null,
      bio: response.bio ? response.bio : null,
      avatarUrl: response.avatarUrl ? new URL(response.avatarUrl) : null,
      imageSettings: response.imageSettings ? response.imageSettings : null,
      isVerified: response.isVerified ? response.isVerified : false,
      isPfpNft: response.isPfpNft ? response.isPfpNft : false,
      blacklistIds: response.blacklistIds ? response.blacklistIds : null,
      allowNotification: response.allowNotification
        ? response.allowNotification
        : false,
      allowNotificationSound: response.allowNotificationSound
        ? response.allowNotificationSound
        : false,
      visibility: response.visibility ? response.visibility : false,
      archivedConversations: response.archivedConversations
        ? response.archivedConversations
        : null,
      onlineStatus: response.onlineStatus ? response.onlineStatus : null,
      allowReadReceipt: response.allowReadReceipt
        ? response.allowReadReceipt
        : false,
      allowReceiveMessageFrom: response.allowReceiveMessageFrom
        ? response.allowReceiveMessageFrom
        : null,
      allowAddToGroupsFrom: response.allowAddToGroupsFrom
        ? response.allowAddToGroupsFrom
        : null,
      allowGroupsSuggestion: response.allowGroupsSuggestion
        ? response.allowGroupsSuggestion
        : false,
      e2ePublicKey: response.e2ePublicKey ? response.e2ePublicKey : null,
      e2eSecret: response.e2eSecret ? response.e2eSecret : null,
      e2eSecretIV: response.e2eSecretIV ? response.e2eSecretIV : null,
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async markImportantMessage(): Promise<Message | QIError>
  async markImportantMessage(id: string): Promise<Message | QIError>
  async markImportantMessage(id?: unknown): Promise<Message | QIError> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use markImportantMessage(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationAddImportantToMessageArgs,
      { addImportantToMessage: MessageGraphQL },
      MessageGraphQL
    >(
      "addImportantToMessage",
      addImportantToMessage,
      "_mutation() -> markImportantMessage()",
      {
        messageId: id,
      }
    )

    if (response instanceof QIError) return response

    const message = new Message({
      ...this._parentConfig!,
      id: response.id,
      content: response.content,
      conversationId: response.conversationId,
      reactions: response.reactions
        ? response.reactions.map((reaction) => {
            return new Reaction({
              ...this._parentConfig!,
              userId: reaction.userId,
              content: reaction.content,
              createdAt: reaction.createdAt,
              client: this._client!,
              realtimeClient: this._realtimeClient!,
            })
          })
        : null,
      userId: response.userId,
      messageRoot: response.messageRoot
        ? new Message({
            ...this._parentConfig!,
            id: response.messageRoot.id,
            content: response.messageRoot.content,
            conversationId: response.messageRoot.conversationId,
            reactions: response.messageRoot.reactions
              ? response.messageRoot.reactions.map((reaction) => {
                  return new Reaction({
                    ...this._parentConfig!,
                    userId: reaction.userId,
                    content: reaction.content,
                    createdAt: reaction.createdAt,
                    client: this._client!,
                    realtimeClient: this._realtimeClient!,
                  })
                })
              : null,
            userId: response.messageRoot.userId,
            messageRoot: null,
            messageRootId: null,
            type: response.messageRoot.type
              ? (response.messageRoot.type as
                  | "TEXTUAL"
                  | "ATTACHMENT"
                  | "TRADE_PROPOSAL"
                  | "RENT")
              : null,
            order: response.messageRoot.order,
            createdAt: response.messageRoot.createdAt,
            updatedAt: response.messageRoot.updatedAt
              ? response.messageRoot.updatedAt
              : null,
            deletedAt: response.messageRoot.deletedAt
              ? response.messageRoot.deletedAt
              : null,
            client: this._client!,
            realtimeClient: this._realtimeClient!,
          })
        : null,
      messageRootId: response.messageRootId ? response.messageRootId : null,
      type: response.type
        ? (response.type as
            | "TEXTUAL"
            | "ATTACHMENT"
            | "TRADE_PROPOSAL"
            | "RENT")
        : null,
      order: response.order,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })

    //let's update the local db
    this._storage.insertBulkSafe("message", [
      Converter.fromMessageToLocalDBMessage(
        message,
        Auth.account!.did,
        Auth.account!.organizationId,
        true,
        "USER"
      ),
    ])

    return message
  }

  async unmarkImportantMessage(): Promise<QIError | Message>
  async unmarkImportantMessage(id: string): Promise<QIError | Message>
  async unmarkImportantMessage(id?: unknown): Promise<QIError | Message> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use unmarkImportantMessage(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationRemoveImportantFromMessageArgs,
      { removeImportantFromMessage: MessageGraphQL },
      MessageGraphQL
    >(
      "removeImportantFromMessage",
      removeImportantFromMessage,
      "_mutation() -> removeImportantFromMessage()",
      {
        messageId: id,
      }
    )

    if (response instanceof QIError) return response

    const message = new Message({
      ...this._parentConfig!,
      id: response.id,
      content: response.content,
      conversationId: response.conversationId,
      reactions: response.reactions
        ? response.reactions.map((reaction) => {
            return new Reaction({
              ...this._parentConfig!,
              userId: reaction.userId,
              content: reaction.content,
              createdAt: reaction.createdAt,
              client: this._client!,
              realtimeClient: this._realtimeClient!,
            })
          })
        : null,
      userId: response.userId,
      messageRoot: response.messageRoot
        ? new Message({
            ...this._parentConfig!,
            id: response.messageRoot.id,
            content: response.messageRoot.content,
            conversationId: response.messageRoot.conversationId,
            reactions: response.messageRoot.reactions
              ? response.messageRoot.reactions.map((reaction) => {
                  return new Reaction({
                    ...this._parentConfig!,
                    userId: reaction.userId,
                    content: reaction.content,
                    createdAt: reaction.createdAt,
                    client: this._client!,
                    realtimeClient: this._realtimeClient!,
                  })
                })
              : null,
            userId: response.messageRoot.userId,
            messageRoot: null,
            messageRootId: null,
            type: response.messageRoot.type
              ? (response.messageRoot.type as
                  | "TEXTUAL"
                  | "ATTACHMENT"
                  | "TRADE_PROPOSAL"
                  | "RENT")
              : null,
            order: response.messageRoot.order,
            createdAt: response.messageRoot.createdAt,
            updatedAt: response.messageRoot.updatedAt
              ? response.messageRoot.updatedAt
              : null,
            deletedAt: response.messageRoot.deletedAt
              ? response.messageRoot.deletedAt
              : null,
            client: this._client!,
            realtimeClient: this._realtimeClient!,
          })
        : null,
      messageRootId: response.messageRootId ? response.messageRootId : null,
      type: response.type
        ? (response.type as
            | "TEXTUAL"
            | "ATTACHMENT"
            | "TRADE_PROPOSAL"
            | "RENT")
        : null,
      order: response.order,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })

    //let's update the local db
    this._storage.insertBulkSafe("message", [
      Converter.fromMessageToLocalDBMessage(
        message,
        Auth.account!.did,
        Auth.account!.organizationId,
        false,
        "USER"
      ),
    ])

    return message
  }

  async pinConversation(): Promise<Conversation | QIError>
  async pinConversation(id: string): Promise<Conversation | QIError>
  async pinConversation(id?: unknown): Promise<Conversation | QIError> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use pinConversation(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationAddPinToConversationArgs,
      { addPinToConversation: ConversationGraphQL },
      ConversationGraphQL
    >(
      "addPinToConversation",
      addPinToConversation,
      "_mutation() -> pinConversation()",
      {
        conversationId: id,
      }
    )

    if (response instanceof QIError) return response

    return new Conversation({
      ...this._parentConfig!,
      id: response.id,
      name: response.name,
      description: response.description ? response.description : null,
      imageURL: response.imageURL ? response.imageURL : null,
      bannerImageURL: response.bannerImageURL ? response.bannerImageURL : null,
      imageSettings: response.imageSettings ? response.imageSettings : null,
      settings: response.settings ? response.settings : null,
      membersIds: response.membersIds ? response.membersIds : null,
      mutedBy: response.mutedBy ? response.mutedBy : null,
      type: response.type,
      lastMessageSentAt: response.lastMessageSentAt
        ? response.lastMessageSentAt
        : null,
      ownerId: response.ownerId ? response.ownerId : null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async unpinConversation(): Promise<QIError | boolean>
  async unpinConversation(id: string): Promise<QIError | boolean>
  async unpinConversation(id?: unknown): Promise<QIError | boolean> {
    if (!id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use unpinConversation(id : string) instead."
      )
    if (typeof id !== "string") throw new Error("id argument must be a string.")

    const response = await this._mutation<
      MutationRemovePinFromConversationArgs,
      { removePinFromConversation: ConversationGraphQL },
      ConversationGraphQL
    >(
      "removePinFromConversation",
      removePinFromConversation,
      "_mutation() -> unpinConversation()",
      {
        conversationId: id,
      }
    )

    if (response instanceof QIError) return response

    return true
  }

  /*
    Query
  */

  async listAllActiveUserConversationIds(
    args: ListAllActiveUserConversationIdsArgs
  ): Promise<QIError | { items: string[]; nextToken?: string | undefined }> {
    const response = await this._query<
      QueryListAllActiveUserConversationIdsArgs,
      {
        listAllActiveUserConversationIds: ListAllActiveUserConversationIdsResultGraphQL
      },
      ListAllActiveUserConversationIdsResultGraphQL
    >(
      "listAllActiveUserConversationIds",
      listAllActiveUserConversationIds,
      "_query() -> listAllActiveUserConversationIds()",
      {
        input: {
          type: args.type,
          nextToken: args.nextToken,
        },
      }
    )

    if (response instanceof QIError) return response

    const activeUserConversationIds = {
      items: response.items,
      nextToken: response.nextToken ? response.nextToken : undefined,
    }

    return activeUserConversationIds
  }

  async listConversationMemberByUserId(
    nextToken?: string | undefined
  ): Promise<
    | QIError
    | { items: ConversationMember[]; nextToken?: Maybe<string> | undefined }
  > {
    const response = await this._query<
      QueryListConversationMemberByUserIdArgs,
      {
        listConversationMemberByUserId: ListConversationMemberByUserIdResultGraphQL
      },
      ListConversationMemberByUserIdResultGraphQL
    >(
      "listConversationMemberByUserId",
      listConversationMemberByUserId,
      "_query() -> listConversationMemberByUserId()",
      {
        nextToken,
      }
    )

    if (response instanceof QIError) return response

    const listConversationMember: {
      nextToken?: string
      items: Array<ConversationMember>
    } = {
      nextToken: response.nextToken ? response.nextToken : undefined,
      items: response.items.map((item) => {
        return new ConversationMember({
          ...this._parentConfig!,
          id: item.id,
          conversationId: item.conversationId,
          userId: item.userId,
          type: item.type,
          encryptedConversationPrivateKey: item.encryptedConversationPrivateKey,
          encryptedConversationPublicKey: item.encryptedConversationPublicKey,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        })
      }),
    }

    return listConversationMember
  }

  async listUsersByIds(ids: string[]): Promise<
    | QIError
    | {
        items: User[]
        unprocessedKeys?: Maybe<string[]> | undefined
      }
  > {
    const response = await this._query<
      QueryListUsersByIdsArgs,
      { listUsersByIds: ListUsersByIdsResultGraphQL },
      ListUsersByIdsResultGraphQL
    >("listUsersByIds", listUsersByIds, "_query() -> listUsersByIds()", {
      usersIds: ids,
    })

    if (response instanceof QIError) return response

    const listUsers: {
      unprocessedKeys?: Maybe<string[]>
      items: Array<User>
    } = {
      unprocessedKeys: response.unprocessedKeys,
      items: response.items.map((item) => {
        return new User({
          ...this._parentConfig!,
          id: item.id,
          username: item.username ? item.username : null,
          did: item.did,
          address: item.address,
          email: item.email ? item.email : null,
          bio: item.bio ? item.bio : null,
          avatarUrl: item.avatarUrl ? new URL(item.avatarUrl) : null,
          imageSettings: item.imageSettings ? item.imageSettings : null,
          isVerified: item.isVerified ? item.isVerified : false,
          isPfpNft: item.isPfpNft ? item.isPfpNft : false,
          blacklistIds: item.blacklistIds ? item.blacklistIds : null,
          allowNotification: item.allowNotification
            ? item.allowNotification
            : false,
          allowNotificationSound: item.allowNotificationSound
            ? item.allowNotificationSound
            : false,
          visibility: item.visibility ? item.visibility : false,
          archivedConversations: item.archivedConversations
            ? item.archivedConversations
            : null,
          onlineStatus: item.onlineStatus ? item.onlineStatus : null,
          allowReadReceipt: item.allowReadReceipt
            ? item.allowReadReceipt
            : false,
          allowReceiveMessageFrom: item.allowReceiveMessageFrom
            ? item.allowReceiveMessageFrom
            : null,
          allowAddToGroupsFrom: item.allowAddToGroupsFrom
            ? item.allowAddToGroupsFrom
            : null,
          allowGroupsSuggestion: item.allowGroupsSuggestion
            ? item.allowGroupsSuggestion
            : false,
          e2ePublicKey: item.e2ePublicKey ? item.e2ePublicKey : null,
          e2eSecret: item.e2eSecret ? item.e2eSecret : null,
          e2eSecretIV: item.e2eSecretIV ? item.e2eSecretIV : null,
          createdAt: new Date(item.createdAt),
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        })
      }),
    }

    return listUsers
  }

  async listConversationsByIds(ids: string[]): Promise<
    | QIError
    | {
        items: Conversation[]
        unprocessedKeys?: Maybe<string[]> | undefined
      }
  > {
    const response = await this._query<
      QueryListConversationsByIdsArgs,
      { listConversationsByIds: ListConversationsByIdsResultGraphQL },
      ListConversationsByIdsResultGraphQL
    >(
      "listConversationsByIds",
      listConversationsByIds,
      "_query() -> listConversationsByIds()",
      { conversationsIds: ids }
    )

    if (response instanceof QIError) return response

    const listConversations: {
      unprocessedKeys?: Maybe<string[]>
      items: Array<Conversation>
    } = {
      unprocessedKeys: response.unprocessedKeys,
      items: response.items.map((item) => {
        return new Conversation({
          ...this._parentConfig!,
          id: item.id,
          name: item.name,
          description: item.description ? item.description : null,
          imageURL: item.imageURL ? item.imageURL : null,
          bannerImageURL: item.bannerImageURL ? item.bannerImageURL : null,
          imageSettings: item.imageSettings ? item.imageSettings : null,
          settings: item.settings ? item.settings : null,
          membersIds: item.membersIds ? item.membersIds : null,
          mutedBy: item.mutedBy ? item.mutedBy : null,
          type: item.type,
          lastMessageSentAt: item.lastMessageSentAt
            ? item.lastMessageSentAt
            : null,
          ownerId: item.ownerId ? item.ownerId : null,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt ? item.updatedAt : null,
          deletedAt: item.deletedAt ? item.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        })
      }),
    }

    return listConversations
  }

  async listMessagesByConversationId(
    args: ListMessagesByConversationIdArgs
  ): Promise<
    QIError | { items: Message[]; nextToken?: Maybe<string> | undefined }
  > {
    const response = await this._query<
      QueryListMessagesByConversationIdArgs,
      {
        listMessagesByConversationId: ListMessagesByConversationIdResultGraphQL
      },
      ListMessagesByConversationIdResultGraphQL
    >(
      "listMessagesByConversationId",
      listMessagesByConversationId,
      "_query() -> listMessagesByConversationId()",
      {
        input: {
          conversationId: args.id,
          nextToken: args.nextToken,
        },
      }
    )

    if (response instanceof QIError) return response

    const listMessages: {
      nextToken?: string
      items: Array<Message>
    } = {
      nextToken: response.nextToken ? response.nextToken : undefined,
      items: response.items.map((item) => {
        return new Message({
          ...this._parentConfig!,
          id: item.id,
          content: item.content,
          conversationId: item.conversationId,
          reactions: item.reactions
            ? item.reactions.map((reaction) => {
                return new Reaction({
                  ...this._parentConfig!,
                  userId: reaction.userId,
                  content: reaction.content,
                  createdAt: reaction.createdAt,
                  client: this._client!,
                  realtimeClient: this._realtimeClient!,
                })
              })
            : null,
          userId: item.userId,
          messageRoot: item.messageRoot
            ? new Message({
                ...this._parentConfig!,
                id: item.messageRoot.id,
                content: item.messageRoot.content,
                conversationId: item.messageRoot.conversationId,
                reactions: item.messageRoot.reactions
                  ? item.messageRoot.reactions.map((reaction) => {
                      return new Reaction({
                        ...this._parentConfig!,
                        userId: reaction.userId,
                        content: reaction.content,
                        createdAt: reaction.createdAt,
                        client: this._client!,
                        realtimeClient: this._realtimeClient!,
                      })
                    })
                  : null,
                userId: item.messageRoot.userId,
                messageRoot: null,
                messageRootId: null,
                type: item.messageRoot.type
                  ? (item.messageRoot.type as
                      | "TEXTUAL"
                      | "ATTACHMENT"
                      | "TRADE_PROPOSAL"
                      | "RENT")
                  : null,
                order: item.messageRoot.order,
                createdAt: item.messageRoot.createdAt,
                updatedAt: item.messageRoot.updatedAt
                  ? item.messageRoot.updatedAt
                  : null,
                deletedAt: item.messageRoot.deletedAt
                  ? item.messageRoot.deletedAt
                  : null,
                client: this._client!,
                realtimeClient: this._realtimeClient!,
              })
            : null,
          messageRootId: item.messageRootId ? item.messageRootId : null,
          type: item.type
            ? (item.type as
                | "TEXTUAL"
                | "ATTACHMENT"
                | "TRADE_PROPOSAL"
                | "RENT")
            : null,
          order: item.order,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt ? item.updatedAt : null,
          deletedAt: item.deletedAt ? item.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        })
      }),
    }

    return listMessages
  }

  async listMessagesByRangeOrder(
    args: ListMessagesByRangeOrderArgs
  ): Promise<
    QIError | { items: Message[]; nextToken?: Maybe<string> | undefined }
  > {
    const response = await this._query<
      QueryListMessagesByRangeOrderArgs,
      { listMessagesByRangeOrder: ListMessagesByRangeOrderGraphQL },
      ListMessagesByRangeOrderGraphQL
    >(
      "listMessagesByRangeOrder",
      listMessagesByRangeOrder,
      "_query() -> listMessagesByRangeOrder()",
      {
        input: {
          conversationId: args.id,
          minOrder: args.minOrder,
          maxOrder: args.maxOrder,
          nextToken: args.nextToken,
        },
      }
    )

    if (response instanceof QIError) return response

    const listMessages: {
      nextToken?: string
      items: Array<Message>
    } = {
      nextToken: response.nextToken ? response.nextToken : undefined,
      items: response.items.map((item) => {
        return new Message({
          ...this._parentConfig!,
          id: item.id,
          content: item.content,
          conversationId: item.conversationId,
          reactions: item.reactions
            ? item.reactions.map((reaction) => {
                return new Reaction({
                  ...this._parentConfig!,
                  userId: reaction.userId,
                  content: reaction.content,
                  createdAt: reaction.createdAt,
                  client: this._client!,
                  realtimeClient: this._realtimeClient!,
                })
              })
            : null,
          userId: item.userId,
          messageRoot: item.messageRoot
            ? new Message({
                ...this._parentConfig!,
                id: item.messageRoot.id,
                content: item.messageRoot.content,
                conversationId: item.messageRoot.conversationId,
                reactions: item.messageRoot.reactions
                  ? item.messageRoot.reactions.map((reaction) => {
                      return new Reaction({
                        ...this._parentConfig!,
                        userId: reaction.userId,
                        content: reaction.content,
                        createdAt: reaction.createdAt,
                        client: this._client!,
                        realtimeClient: this._realtimeClient!,
                      })
                    })
                  : null,
                userId: item.messageRoot.userId,
                messageRoot: null,
                messageRootId: null,
                type: item.messageRoot.type
                  ? (item.messageRoot.type as
                      | "TEXTUAL"
                      | "ATTACHMENT"
                      | "TRADE_PROPOSAL"
                      | "RENT")
                  : null,
                order: item.messageRoot.order,
                createdAt: item.messageRoot.createdAt,
                updatedAt: item.messageRoot.updatedAt
                  ? item.messageRoot.updatedAt
                  : null,
                deletedAt: item.messageRoot.deletedAt
                  ? item.messageRoot.deletedAt
                  : null,
                client: this._client!,
                realtimeClient: this._realtimeClient!,
              })
            : null,
          messageRootId: item.messageRootId ? item.messageRootId : null,
          type: item.type
            ? (item.type as
                | "TEXTUAL"
                | "ATTACHMENT"
                | "TRADE_PROPOSAL"
                | "RENT")
            : null,
          order: item.order,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt ? item.updatedAt : null,
          deletedAt: item.deletedAt ? item.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        })
      }),
    }

    return listMessages
  }

  async listMessagesImportantByUserConversationId(
    args: ListMessagesImportantByUserConversationIdArgs
  ): Promise<
    | {
        items: MessageImportant[]
        nextToken?: Maybe<string> | undefined
      }
    | QIError
  > {
    const response = await this._query<
      QueryListMessagesImportantByUserConversationIdArgs,
      {
        listMessagesImportantByUserConversationId: ListMessagesImportantByUserConversationIdResultGraphQL
      },
      ListMessagesImportantByUserConversationIdResultGraphQL
    >(
      "listMessagesImportantByUserConversationId",
      listMessagesImportantByUserConversationId,
      "_query() -> listMessagesImportantByUserConversationId()",
      {
        input: {
          conversationId: args.conversationId,
          nextToken: args.nextToken,
        },
      }
    )

    if (response instanceof QIError) return response

    const listMessagesImportant: {
      nextToken?: string
      items: Array<MessageImportant>
    } = {
      nextToken: response.nextToken ? response.nextToken : undefined,
      items: response.items.map((item) => {
        return new MessageImportant({
          ...this._parentConfig!,
          id: item.id,
          userId: item.userId,
          messageId: item.messageId,
          message: new Message({
            ...this._parentConfig!,
            id: item.message!.id,
            content: item.message!.content,
            conversationId: item.message!.conversationId,
            reactions: item.message!.reactions
              ? item.message!.reactions.map((reaction) => {
                  return new Reaction({
                    ...this._parentConfig!,
                    userId: reaction.userId,
                    content: reaction.content,
                    createdAt: reaction.createdAt,
                    client: this._client!,
                    realtimeClient: this._realtimeClient!,
                  })
                })
              : null,
            userId: item.message!.userId,
            messageRoot: item.message!.messageRoot
              ? new Message({
                  ...this._parentConfig!,
                  id: item.message!.messageRoot.id,
                  content: item.message!.messageRoot.content,
                  conversationId: item.message!.messageRoot.conversationId,
                  reactions: item.message!.messageRoot.reactions
                    ? item.message!.messageRoot.reactions.map((reaction) => {
                        return new Reaction({
                          ...this._parentConfig!,
                          userId: reaction.userId,
                          content: reaction.content,
                          createdAt: reaction.createdAt,
                          client: this._client!,
                          realtimeClient: this._realtimeClient!,
                        })
                      })
                    : null,
                  userId: item.message!.messageRoot.userId,
                  messageRoot: null,
                  messageRootId: null,
                  type: item.message!.messageRoot.type
                    ? (item.message!.messageRoot.type as
                        | "TEXTUAL"
                        | "ATTACHMENT"
                        | "TRADE_PROPOSAL"
                        | "RENT")
                    : null,
                  order: item.message!.messageRoot.order,
                  createdAt: item.message!.messageRoot.createdAt,
                  updatedAt: item.message!.messageRoot.updatedAt
                    ? item.message!.messageRoot.updatedAt
                    : null,
                  deletedAt: item.message!.messageRoot.deletedAt
                    ? item.message!.messageRoot.deletedAt
                    : null,
                  client: this._client!,
                  realtimeClient: this._realtimeClient!,
                })
              : null,
            messageRootId: item.message!.messageRootId
              ? item.message!.messageRootId
              : null,
            type: item.message!.type
              ? (item.message!.type as
                  | "TEXTUAL"
                  | "ATTACHMENT"
                  | "TRADE_PROPOSAL"
                  | "RENT")
              : null,
            order: item.message!.order,
            createdAt: item.message!.createdAt,
            updatedAt: item.message!.updatedAt ? item.message!.updatedAt : null,
            deletedAt: item.message!.deletedAt ? item.message!.deletedAt : null,
            client: this._client!,
            realtimeClient: this._realtimeClient!,
          }),
          conversationId: item.conversationId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        })
      }),
    }

    return listMessagesImportant
  }

  async listConversationsPinnedByCurrentUser(
    nextToken?: string | undefined
  ): Promise<
    | QIError
    | { items: ConversationPin[]; nextToken?: Maybe<string> | undefined }
  > {
    const response = await this._query<
      QueryListConversationsPinnedByCurrentUserArgs,
      {
        listConversationsPinnedByCurrentUser: ListConversationsPinnedByUserIdResultGraphQL
      },
      ListConversationsPinnedByUserIdResultGraphQL
    >(
      "listConversationsPinnedByCurrentUser",
      listConversationsPinnedByCurrentUser,
      "_query() -> listConversationsPinnedByCurrentUser()",
      {
        nextToken,
      }
    )

    if (response instanceof QIError) return response

    const listConversationsPinned: {
      nextToken?: string
      items: Array<ConversationPin>
    } = {
      nextToken: response.nextToken ? response.nextToken : undefined,
      items: response.items.map((item) => {
        return new ConversationPin({
          ...this._parentConfig!,
          id: item.id,
          userId: item.userId,
          conversationId: item.conversationId,
          conversation: new Conversation({
            ...this._parentConfig!,
            id: item.conversation!.id,
            name: item.conversation!.name,
            description: item.conversation!.description
              ? item.conversation!.description
              : null,
            imageURL: item.conversation!.imageURL
              ? item.conversation!.imageURL
              : null,
            bannerImageURL: item.conversation!.bannerImageURL
              ? item.conversation!.bannerImageURL
              : null,
            imageSettings: item.conversation!.imageSettings
              ? item.conversation!.imageSettings
              : null,
            settings: item.conversation!.settings
              ? item.conversation!.settings
              : null,
            membersIds: item.conversation!.membersIds
              ? item.conversation!.membersIds
              : null,
            mutedBy: item.conversation!.mutedBy
              ? item.conversation!.mutedBy
              : null,
            type: item.conversation!.type,
            lastMessageSentAt: item.conversation!.lastMessageSentAt
              ? item.conversation!.lastMessageSentAt
              : null,
            ownerId: item.conversation!.ownerId
              ? item.conversation!.ownerId
              : null,
            createdAt: item.conversation!.createdAt,
            updatedAt: item.conversation!.updatedAt
              ? item.conversation!.updatedAt
              : null,
            deletedAt: item.conversation!.deletedAt
              ? item.conversation!.deletedAt
              : null,
            client: this._client!,
            realtimeClient: this._realtimeClient!,
          }),
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        })
      }),
    }

    return listConversationsPinned
  }

  async findUsersByUsernameOrAddress(
    args: FindUsersByUsernameOrAddressArgs
  ): Promise<QIError | { items: User[]; nextToken?: String | undefined }> {
    const response = await this._query<
      QueryFindUsersByUsernameOrAddressArgs,
      {
        findUsersByUsernameOrAddress: FindUsersByUsernameOrAddressResultGraphQL
      },
      FindUsersByUsernameOrAddressResultGraphQL
    >(
      "findUsersByUsernameOrAddress",
      findUsersByUsernameOrAddress,
      "_query() -> findUsersByUsernameOrAddress()",
      {
        input: {
          searchTerm: args.searchTerm,
          nextToken: args.nextToken,
        },
      }
    )

    if (response instanceof QIError) return response

    const listUsers: {
      nextToken?: string
      items: Array<User>
    } = {
      nextToken: response.nextToken ? response.nextToken : undefined,
      items: response.items.map((item) => {
        return new User({
          ...this._parentConfig!,
          id: item.id,
          username: item.username ? item.username : null,
          did: item.did,
          address: item.address,
          email: item.email ? item.email : null,
          bio: item.bio ? item.bio : null,
          avatarUrl: item.avatarUrl ? new URL(item.avatarUrl) : null,
          imageSettings: item.imageSettings ? item.imageSettings : null,
          isVerified: item.isVerified ? item.isVerified : false,
          isPfpNft: item.isPfpNft ? item.isPfpNft : false,
          blacklistIds: item.blacklistIds ? item.blacklistIds : null,
          allowNotification: item.allowNotification
            ? item.allowNotification
            : false,
          allowNotificationSound: item.allowNotificationSound
            ? item.allowNotificationSound
            : false,
          visibility: item.visibility ? item.visibility : false,
          archivedConversations: item.archivedConversations
            ? item.archivedConversations
            : null,
          onlineStatus: item.onlineStatus ? item.onlineStatus : null,
          allowReadReceipt: item.allowReadReceipt
            ? item.allowReadReceipt
            : false,
          allowReceiveMessageFrom: item.allowReceiveMessageFrom
            ? item.allowReceiveMessageFrom
            : null,
          allowAddToGroupsFrom: item.allowAddToGroupsFrom
            ? item.allowAddToGroupsFrom
            : null,
          allowGroupsSuggestion: item.allowGroupsSuggestion
            ? item.allowGroupsSuggestion
            : false,
          e2ePublicKey: item.e2ePublicKey ? item.e2ePublicKey : null,
          e2eSecret: item.e2eSecret ? item.e2eSecret : null,
          e2eSecretIV: item.e2eSecretIV ? item.e2eSecretIV : null,
          createdAt: new Date(item.createdAt),
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        })
      }),
    }

    return listUsers
  }

  async getCurrentUser(): Promise<QIError | User> {
    const response = await this._query<
      null,
      {
        getCurrentUser: UserGraphQL
      },
      UserGraphQL
    >("getCurrentUser", getCurrentUser, "_query() -> getCurrentUser()", null)

    if (response instanceof QIError) return response

    return new User({
      ...this._parentConfig!,
      id: response.id,
      username: response.username ? response.username : null,
      did: response.did,
      address: response.address,
      email: response.email ? response.email : null,
      bio: response.bio ? response.bio : null,
      avatarUrl: response.avatarUrl ? new URL(response.avatarUrl) : null,
      imageSettings: response.imageSettings ? response.imageSettings : null,
      isVerified: response.isVerified ? response.isVerified : false,
      isPfpNft: response.isPfpNft ? response.isPfpNft : false,
      blacklistIds: response.blacklistIds ? response.blacklistIds : null,
      allowNotification: response.allowNotification
        ? response.allowNotification
        : false,
      allowNotificationSound: response.allowNotificationSound
        ? response.allowNotificationSound
        : false,
      visibility: response.visibility ? response.visibility : false,
      archivedConversations: response.archivedConversations
        ? response.archivedConversations
        : null,
      onlineStatus: response.onlineStatus ? response.onlineStatus : null,
      allowReadReceipt: response.allowReadReceipt
        ? response.allowReadReceipt
        : false,
      allowReceiveMessageFrom: response.allowReceiveMessageFrom
        ? response.allowReceiveMessageFrom
        : null,
      allowAddToGroupsFrom: response.allowAddToGroupsFrom
        ? response.allowAddToGroupsFrom
        : null,
      allowGroupsSuggestion: response.allowGroupsSuggestion
        ? response.allowGroupsSuggestion
        : false,
      e2ePublicKey: response.e2ePublicKey ? response.e2ePublicKey : null,
      e2eSecret: response.e2eSecret ? response.e2eSecret : null,
      e2eSecretIV: response.e2eSecretIV ? response.e2eSecretIV : null,
      createdAt: new Date(response.createdAt),
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async getConversationById(id: string): Promise<Conversation | QIError> {
    const response = await this._query<
      QueryGetConversationByIdArgs,
      { getConversationById: ConversationGraphQL },
      ConversationGraphQL
    >(
      "getConversationById",
      getConversationById,
      "_query() -> getConversationById()",
      {
        conversationId: id,
      }
    )

    if (response instanceof QIError) return response

    return new Conversation({
      ...this._parentConfig!,
      id: response.id,
      name: response.name,
      description: response.description ? response.description : null,
      imageURL: response.imageURL ? response.imageURL : null,
      bannerImageURL: response.bannerImageURL ? response.bannerImageURL : null,
      imageSettings: response.imageSettings ? response.imageSettings : null,
      settings: response.settings ? response.settings : null,
      membersIds: response.membersIds ? response.membersIds : null,
      mutedBy: response.mutedBy ? response.mutedBy : null,
      type: response.type,
      lastMessageSentAt: response.lastMessageSentAt
        ? response.lastMessageSentAt
        : null,
      ownerId: response.ownerId ? response.ownerId : null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  async listTradesByConversationId(
    args: ListTradesByConversationIdArgs
  ): Promise<
    | { items: Array<ConversationTradingPool>; nextToken?: Maybe<string> }
    | QIError
  > {
    const response = await this._query<
      QueryListTradesByConversationIdArgs,
      {
        listTradesByConversationId: ListTradesByConversationIdResultGraphQL
      },
      ListTradesByConversationIdResultGraphQL
    >(
      "listTradesByConversationId",
      listTradesByConversationId,
      "_query() -> listTradesByConversationId()",
      {
        input: {
          conversationId: args.conversationId,
          status: args.status,
          nextToken: args.nextToken,
        },
      }
    )

    if (response instanceof QIError) return response

    const listTrades: {
      nextToken?: string
      items: Array<ConversationTradingPool>
    } = {
      nextToken: response.nextToken ? response.nextToken : undefined,
      items: response.items.map((item) => {
        return new ConversationTradingPool({
          ...this._parentConfig!,
          id: item.id,
          conversationId: item.conversationId ? item.conversationId : null,
          userId: item.userId ? item.userId : null,
          involvedUsers: item.involvedUsers ? item.involvedUsers : null,
          operation: item.operation ? item.operation : null,
          status: item.status ? item.status : null,
          type: item.type ? item.type : null,
          createdAt: item.createdAt ? item.createdAt : null,
          updatedAt: item.updatedAt ? item.updatedAt : null,
          deletedAt: item.deletedAt ? item.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        })
      }),
    }

    return listTrades
  }

  async getConversationTradingPoolById(
    conversationTradingPoolId: string
  ): Promise<ConversationTradingPool | QIError> {
    const response = await this._query<
      QueryGetConversationTradingPoolByIdArgs,
      {
        getConversationTradingPoolById: ConversationTradingPoolGraphQL
      },
      ConversationTradingPoolGraphQL
    >(
      "getConversationTradingPoolById",
      getConversationTradingPoolById,
      "_query() -> getConversationTradingPoolById()",
      {
        conversationTradingPoolId,
      }
    )

    if (response instanceof QIError) return response

    return new ConversationTradingPool({
      ...this._parentConfig!,
      id: response.id,
      conversationId: response.conversationId ? response.conversationId : null,
      userId: response.userId ? response.userId : null,
      involvedUsers: response.involvedUsers ? response.involvedUsers : null,
      operation: response.operation ? response.operation : null,
      status: response.status ? response.status : null,
      type: response.type ? response.type : null,
      createdAt: response.createdAt ? response.createdAt : null,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  /**
   * Subscriptions
   */

  onSendMessage(
    conversationId: string,
    callback: (
      response: Message | QIError,
      source: OperationResult<
        {
          onSendMessage: MessageGraphQL
        },
        SubscriptionOnSendMessageArgs & {
          jwt: string
        }
      >,
      uuid: string
    ) => void
  ): SubscriptionGarbage | QIError {
    const key = "onSendMessage"
    const metasubcription = this._subscription<
      SubscriptionOnSendMessageArgs,
      { onSendMessage: MessageGraphQL }
    >(onSendMessage, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onSendMessage: MessageGraphQL },
        MessageGraphQL
      >("onSendMessage", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: r.content,
          conversationId: r.conversationId,
          reactions: r.reactions
            ? r.reactions.map((reaction) => {
                return new Reaction({
                  ...this._parentConfig!,
                  userId: reaction.userId,
                  content: reaction.content,
                  createdAt: reaction.createdAt,
                  client: this._client!,
                  realtimeClient: this._realtimeClient!,
                })
              })
            : null,
          userId: r.userId,
          messageRoot: r.messageRoot
            ? new Message({
                ...this._parentConfig!,
                id: r.messageRoot.id,
                content: r.messageRoot.content,
                conversationId: r.messageRoot.conversationId,
                reactions: r.messageRoot.reactions
                  ? r.messageRoot.reactions.map((reaction) => {
                      return new Reaction({
                        ...this._parentConfig!,
                        userId: reaction.userId,
                        content: reaction.content,
                        createdAt: reaction.createdAt,
                        client: this._client!,
                        realtimeClient: this._realtimeClient!,
                      })
                    })
                  : null,
                userId: r.messageRoot.userId,
                messageRoot: null,
                messageRootId: null,
                type: r.messageRoot.type
                  ? (r.messageRoot.type as
                      | "TEXTUAL"
                      | "ATTACHMENT"
                      | "TRADE_PROPOSAL"
                      | "RENT")
                  : null,
                order: r.messageRoot.order,
                createdAt: r.messageRoot.createdAt,
                updatedAt: r.messageRoot.updatedAt
                  ? r.messageRoot.updatedAt
                  : null,
                deletedAt: r.messageRoot.deletedAt
                  ? r.messageRoot.deletedAt
                  : null,
                client: this._client!,
                realtimeClient: this._realtimeClient!,
              })
            : null,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "TRADE_PROPOSAL" | "RENT")
            : null,
          order: r.order,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onEditMessage(
    conversationId: string,
    callback: (
      response: QIError | Message,
      source: OperationResult<
        { onEditMessage: MessageGraphQL },
        SubscriptionOnEditMessageArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onEditMessage"
    const metasubcription = this._subscription<
      SubscriptionOnEditMessageArgs,
      { onEditMessage: MessageGraphQL }
    >(onEditMessage, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onEditMessage: MessageGraphQL },
        MessageGraphQL
      >("onEditMessage", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: r.content,
          conversationId: r.conversationId,
          reactions: r.reactions
            ? r.reactions.map((reaction) => {
                return new Reaction({
                  ...this._parentConfig!,
                  userId: reaction.userId,
                  content: reaction.content,
                  createdAt: reaction.createdAt,
                  client: this._client!,
                  realtimeClient: this._realtimeClient!,
                })
              })
            : null,
          userId: r.userId,
          messageRoot: r.messageRoot
            ? new Message({
                ...this._parentConfig!,
                id: r.messageRoot.id,
                content: r.messageRoot.content,
                conversationId: r.messageRoot.conversationId,
                reactions: r.messageRoot.reactions
                  ? r.messageRoot.reactions.map((reaction) => {
                      return new Reaction({
                        ...this._parentConfig!,
                        userId: reaction.userId,
                        content: reaction.content,
                        createdAt: reaction.createdAt,
                        client: this._client!,
                        realtimeClient: this._realtimeClient!,
                      })
                    })
                  : null,
                userId: r.messageRoot.userId,
                messageRoot: null,
                messageRootId: null,
                type: r.messageRoot.type
                  ? (r.messageRoot.type as
                      | "TEXTUAL"
                      | "ATTACHMENT"
                      | "TRADE_PROPOSAL"
                      | "RENT")
                  : null,
                order: r.messageRoot.order,
                createdAt: r.messageRoot.createdAt,
                updatedAt: r.messageRoot.updatedAt
                  ? r.messageRoot.updatedAt
                  : null,
                deletedAt: r.messageRoot.deletedAt
                  ? r.messageRoot.deletedAt
                  : null,
                client: this._client!,
                realtimeClient: this._realtimeClient!,
              })
            : null,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "TRADE_PROPOSAL" | "RENT")
            : null,
          order: r.order,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onBatchDeleteMessages(
    conversationId: string,
    callback: (
      response: QIError | { conversationId: string; messagesIds: string[] },
      source: OperationResult<
        { onBatchDeleteMessages: BatchDeleteMessagesResultGraphQL },
        SubscriptionOnBatchDeleteMessagesArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onBatchDeleteMessages"
    const metasubcription = this._subscription<
      SubscriptionOnBatchDeleteMessagesArgs,
      { onBatchDeleteMessages: BatchDeleteMessagesResultGraphQL }
    >(onBatchDeleteMessages, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onBatchDeleteMessages: BatchDeleteMessagesResultGraphQL },
        BatchDeleteMessagesResultGraphQL
      >("onBatchDeleteMessages", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        {
          conversationId: r.conversationId,
          messagesIds: r.messagesIds,
        },
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onDeleteMessage(
    conversationId: string,
    callback: (
      response: QIError | Message,
      source: OperationResult<
        { onDeleteMessage: MessageGraphQL },
        SubscriptionOnDeleteMessageArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onDeleteMessage"
    const metasubcription = this._subscription<
      SubscriptionOnDeleteMessageArgs,
      { onDeleteMessage: MessageGraphQL }
    >(onDeleteMessage, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onDeleteMessage: MessageGraphQL },
        MessageGraphQL
      >("onDeleteMessage", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: r.content,
          conversationId: r.conversationId,
          reactions: r.reactions
            ? r.reactions.map((reaction) => {
                return new Reaction({
                  ...this._parentConfig!,
                  userId: reaction.userId,
                  content: reaction.content,
                  createdAt: reaction.createdAt,
                  client: this._client!,
                  realtimeClient: this._realtimeClient!,
                })
              })
            : null,
          userId: r.userId,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          messageRoot: r.messageRoot
            ? new Message({
                ...this._parentConfig!,
                id: r.messageRoot.id,
                content: r.messageRoot.content,
                conversationId: r.messageRoot.conversationId,
                reactions: r.messageRoot.reactions
                  ? r.messageRoot.reactions.map((reaction) => {
                      return new Reaction({
                        ...this._parentConfig!,
                        userId: reaction.userId,
                        content: reaction.content,
                        createdAt: reaction.createdAt,
                        client: this._client!,
                        realtimeClient: this._realtimeClient!,
                      })
                    })
                  : null,
                userId: r.messageRoot.userId,
                messageRoot: null,
                messageRootId: null,
                type: r.messageRoot.type
                  ? (r.messageRoot.type as
                      | "TEXTUAL"
                      | "ATTACHMENT"
                      | "TRADE_PROPOSAL"
                      | "RENT")
                  : null,
                order: r.messageRoot.order,
                createdAt: r.messageRoot.createdAt,
                updatedAt: r.messageRoot.updatedAt
                  ? r.messageRoot.updatedAt
                  : null,
                deletedAt: r.messageRoot.deletedAt
                  ? r.messageRoot.deletedAt
                  : null,
                client: this._client!,
                realtimeClient: this._realtimeClient!,
              })
            : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "TRADE_PROPOSAL" | "RENT")
            : null,
          order: r.order,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onAddReaction(
    conversationId: string,
    callback: (
      response: QIError | Message,
      source: OperationResult<
        { onAddReaction: MessageGraphQL },
        SubscriptionOnAddReactionArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onAddReaction"
    const metasubcription = this._subscription<
      SubscriptionOnAddReactionArgs,
      { onAddReaction: MessageGraphQL }
    >(onAddReaction, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onAddReaction: MessageGraphQL },
        MessageGraphQL
      >("onAddReaction", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: r.content,
          conversationId: r.conversationId,
          reactions: r.reactions
            ? r.reactions.map((reaction) => {
                return new Reaction({
                  ...this._parentConfig!,
                  userId: reaction.userId,
                  content: reaction.content,
                  createdAt: reaction.createdAt,
                  client: this._client!,
                  realtimeClient: this._realtimeClient!,
                })
              })
            : null,
          userId: r.userId,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          messageRoot: r.messageRoot
            ? new Message({
                ...this._parentConfig!,
                id: r.messageRoot.id,
                content: r.messageRoot.content,
                conversationId: r.messageRoot.conversationId,
                reactions: r.messageRoot.reactions
                  ? r.messageRoot.reactions.map((reaction) => {
                      return new Reaction({
                        ...this._parentConfig!,
                        userId: reaction.userId,
                        content: reaction.content,
                        createdAt: reaction.createdAt,
                        client: this._client!,
                        realtimeClient: this._realtimeClient!,
                      })
                    })
                  : null,
                userId: r.messageRoot.userId,
                messageRoot: null,
                messageRootId: null,
                type: r.messageRoot.type
                  ? (r.messageRoot.type as
                      | "TEXTUAL"
                      | "ATTACHMENT"
                      | "TRADE_PROPOSAL"
                      | "RENT")
                  : null,
                order: r.messageRoot.order,
                createdAt: r.messageRoot.createdAt,
                updatedAt: r.messageRoot.updatedAt
                  ? r.messageRoot.updatedAt
                  : null,
                deletedAt: r.messageRoot.deletedAt
                  ? r.messageRoot.deletedAt
                  : null,
                client: this._client!,
                realtimeClient: this._realtimeClient!,
              })
            : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "TRADE_PROPOSAL" | "RENT")
            : null,
          order: r.order,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onRemoveReaction(
    conversationId: string,
    callback: (
      response: QIError | Message,
      source: OperationResult<
        { onRemoveReaction: MessageGraphQL },
        SubscriptionOnRemoveReactionArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onRemoveReaction"
    const metasubcription = this._subscription<
      SubscriptionOnRemoveReactionArgs,
      { onRemoveReaction: MessageGraphQL }
    >(onRemoveReaction, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onRemoveReaction: MessageGraphQL },
        MessageGraphQL
      >("onRemoveReaction", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: r.content,
          conversationId: r.conversationId,
          reactions: r.reactions
            ? r.reactions.map((reaction) => {
                return new Reaction({
                  ...this._parentConfig!,
                  userId: reaction.userId,
                  content: reaction.content,
                  createdAt: reaction.createdAt,
                  client: this._client!,
                  realtimeClient: this._realtimeClient!,
                })
              })
            : null,
          userId: r.userId,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          messageRoot: r.messageRoot
            ? new Message({
                ...this._parentConfig!,
                id: r.messageRoot.id,
                content: r.messageRoot.content,
                conversationId: r.messageRoot.conversationId,
                reactions: r.messageRoot.reactions
                  ? r.messageRoot.reactions.map((reaction) => {
                      return new Reaction({
                        ...this._parentConfig!,
                        userId: reaction.userId,
                        content: reaction.content,
                        createdAt: reaction.createdAt,
                        client: this._client!,
                        realtimeClient: this._realtimeClient!,
                      })
                    })
                  : null,
                userId: r.messageRoot.userId,
                messageRoot: null,
                messageRootId: null,
                type: r.messageRoot.type
                  ? (r.messageRoot.type as
                      | "TEXTUAL"
                      | "ATTACHMENT"
                      | "TRADE_PROPOSAL"
                      | "RENT")
                  : null,
                order: r.messageRoot.order,
                createdAt: r.messageRoot.createdAt,
                updatedAt: r.messageRoot.updatedAt
                  ? r.messageRoot.updatedAt
                  : null,
                deletedAt: r.messageRoot.deletedAt
                  ? r.messageRoot.deletedAt
                  : null,
                client: this._client!,
                realtimeClient: this._realtimeClient!,
              })
            : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "TRADE_PROPOSAL" | "RENT")
            : null,
          order: r.order,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onAddPinMessage(
    conversationId: string,
    callback: (
      response: QIError | Message,
      source: OperationResult<
        { onAddPinMessage: MessageGraphQL },
        SubscriptionOnAddPinMessageArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onAddPinMessage"
    const metasubcription = this._subscription<
      SubscriptionOnAddPinMessageArgs,
      { onAddPinMessage: MessageGraphQL }
    >(onAddPinMessage, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onAddPinMessage: MessageGraphQL },
        MessageGraphQL
      >("onAddPinMessage", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: r.content,
          conversationId: r.conversationId,
          reactions: r.reactions
            ? r.reactions.map((reaction) => {
                return new Reaction({
                  ...this._parentConfig!,
                  userId: reaction.userId,
                  content: reaction.content,
                  createdAt: reaction.createdAt,
                  client: this._client!,
                  realtimeClient: this._realtimeClient!,
                })
              })
            : null,
          userId: r.userId,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          messageRoot: r.messageRoot
            ? new Message({
                ...this._parentConfig!,
                id: r.messageRoot.id,
                content: r.messageRoot.content,
                conversationId: r.messageRoot.conversationId,
                reactions: r.messageRoot.reactions
                  ? r.messageRoot.reactions.map((reaction) => {
                      return new Reaction({
                        ...this._parentConfig!,
                        userId: reaction.userId,
                        content: reaction.content,
                        createdAt: reaction.createdAt,
                        client: this._client!,
                        realtimeClient: this._realtimeClient!,
                      })
                    })
                  : null,
                userId: r.messageRoot.userId,
                messageRoot: null,
                messageRootId: null,
                type: r.messageRoot.type
                  ? (r.messageRoot.type as
                      | "TEXTUAL"
                      | "ATTACHMENT"
                      | "TRADE_PROPOSAL"
                      | "RENT")
                  : null,
                order: r.messageRoot.order,
                createdAt: r.messageRoot.createdAt,
                updatedAt: r.messageRoot.updatedAt
                  ? r.messageRoot.updatedAt
                  : null,
                deletedAt: r.messageRoot.deletedAt
                  ? r.messageRoot.deletedAt
                  : null,
                client: this._client!,
                realtimeClient: this._realtimeClient!,
              })
            : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "TRADE_PROPOSAL" | "RENT")
            : null,
          order: r.order,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onRemovePinMessage(
    conversationId: string,
    callback: (
      response: QIError | Message,
      source: OperationResult<
        { onRemovePinMessage: MessageGraphQL },
        SubscriptionOnRemovePinMessageArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onRemovePinMessage"
    const metasubcription = this._subscription<
      SubscriptionOnRemovePinMessageArgs,
      { onRemovePinMessage: MessageGraphQL }
    >(onRemovePinMessage, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onRemovePinMessage: MessageGraphQL },
        MessageGraphQL
      >("onRemovePinMessage", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Message({
          ...this._parentConfig!,
          id: r.id,
          content: r.content,
          conversationId: r.conversationId,
          reactions: r.reactions
            ? r.reactions.map((reaction) => {
                return new Reaction({
                  ...this._parentConfig!,
                  userId: reaction.userId,
                  content: reaction.content,
                  createdAt: reaction.createdAt,
                  client: this._client!,
                  realtimeClient: this._realtimeClient!,
                })
              })
            : null,
          userId: r.userId,
          messageRoot: r.messageRoot
            ? new Message({
                ...this._parentConfig!,
                id: r.messageRoot.id,
                content: r.messageRoot.content,
                conversationId: r.messageRoot.conversationId,
                reactions: r.messageRoot.reactions
                  ? r.messageRoot.reactions.map((reaction) => {
                      return new Reaction({
                        ...this._parentConfig!,
                        userId: reaction.userId,
                        content: reaction.content,
                        createdAt: reaction.createdAt,
                        client: this._client!,
                        realtimeClient: this._realtimeClient!,
                      })
                    })
                  : null,
                userId: r.messageRoot.userId,
                messageRoot: null,
                messageRootId: null,
                type: r.messageRoot.type
                  ? (r.messageRoot.type as
                      | "TEXTUAL"
                      | "ATTACHMENT"
                      | "TRADE_PROPOSAL"
                      | "RENT")
                  : null,
                order: r.messageRoot.order,
                createdAt: r.messageRoot.createdAt,
                updatedAt: r.messageRoot.updatedAt
                  ? r.messageRoot.updatedAt
                  : null,
                deletedAt: r.messageRoot.deletedAt
                  ? r.messageRoot.deletedAt
                  : null,
                client: this._client!,
                realtimeClient: this._realtimeClient!,
              })
            : null,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "TRADE_PROPOSAL" | "RENT")
            : null,
          order: r.order,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onUpdateConversationGroup(
    id: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onUpdateConversationGroup: ConversationGraphQL },
        SubscriptionOnUpdateConversationGroupArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onUpdateConversationGroup"
    const metasubcription = this._subscription<
      SubscriptionOnUpdateConversationGroupArgs,
      { onUpdateConversationGroup: ConversationGraphQL }
    >(onUpdateConversationGroup, key, { id })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onUpdateConversationGroup: ConversationGraphQL },
        ConversationGraphQL
      >("onUpdateConversationGroup", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Conversation({
          ...this._parentConfig!,
          id: r.id,
          name: r.name,
          description: r.description ? r.description : null,
          imageURL: r.imageURL ? r.imageURL : null,
          bannerImageURL: r.bannerImageURL ? r.bannerImageURL : null,
          imageSettings: r.imageSettings ? r.imageSettings : null,
          settings: r.settings ? r.settings : null,
          membersIds: r.membersIds ? r.membersIds : null,
          mutedBy: r.mutedBy ? r.mutedBy : null,
          type: r.type,
          lastMessageSentAt: r.lastMessageSentAt ? r.lastMessageSentAt : null,
          ownerId: r.ownerId ? r.ownerId : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onEjectMember(
    conversationId: string,
    callback: (
      response:
        | QIError
        | {
            conversationId: string
            conversation: Conversation
            memberOut: User
          },
      source: OperationResult<
        { onEjectMember: MemberOutResultGraphQL },
        SubscriptionOnEjectMemberArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onEjectMember"
    const metasubcription = this._subscription<
      SubscriptionOnEjectMemberArgs,
      { onEjectMember: MemberOutResultGraphQL }
    >(onEjectMember, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onEjectMember: MemberOutResultGraphQL },
        MemberOutResultGraphQL
      >("onEjectMember", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        {
          conversationId: r.conversationId,
          conversation: new Conversation({
            ...this._parentConfig!,
            id: r.conversation.id,
            name: r.conversation.name,
            description: r.conversation.description
              ? r.conversation.description
              : null,
            imageURL: r.conversation.imageURL ? r.conversation.imageURL : null,
            bannerImageURL: r.conversation.bannerImageURL
              ? r.conversation.bannerImageURL
              : null,
            imageSettings: r.conversation.imageSettings
              ? r.conversation.imageSettings
              : null,
            settings: r.conversation.settings ? r.conversation.settings : null,
            membersIds: r.conversation.membersIds
              ? r.conversation.membersIds
              : null,
            mutedBy: r.conversation.mutedBy ? r.conversation.mutedBy : null,
            type: r.conversation.type,
            lastMessageSentAt: r.conversation.lastMessageSentAt
              ? r.conversation.lastMessageSentAt
              : null,
            ownerId: r.conversation.ownerId ? r.conversation.ownerId : null,
            createdAt: r.conversation.createdAt,
            updatedAt: r.conversation.updatedAt
              ? r.conversation.updatedAt
              : null,
            deletedAt: r.conversation.deletedAt
              ? r.conversation.deletedAt
              : null,
            client: this._client!,
            realtimeClient: this._realtimeClient!,
          }),
          memberOut: new User({
            ...this._parentConfig!,
            id: r.memberOut.id,
            username: r.memberOut.username ? r.memberOut.username : null,
            did: r.memberOut.did,
            address: r.memberOut.address,
            email: r.memberOut.email ? r.memberOut.email : null,
            bio: r.memberOut.bio ? r.memberOut.bio : null,
            avatarUrl: r.memberOut.avatarUrl
              ? new URL(r.memberOut.avatarUrl)
              : null,
            imageSettings: r.memberOut.imageSettings
              ? r.memberOut.imageSettings
              : null,
            isVerified: r.memberOut.isVerified ? r.memberOut.isVerified : false,
            isPfpNft: r.memberOut.isPfpNft ? r.memberOut.isPfpNft : false,
            blacklistIds: r.memberOut.blacklistIds
              ? r.memberOut.blacklistIds
              : null,
            allowNotification: r.memberOut.allowNotification
              ? r.memberOut.allowNotification
              : false,
            allowNotificationSound: r.memberOut.allowNotificationSound
              ? r.memberOut.allowNotificationSound
              : false,
            visibility: r.memberOut.visibility ? r.memberOut.visibility : false,
            archivedConversations: r.memberOut.archivedConversations
              ? r.memberOut.archivedConversations
              : null,
            onlineStatus: r.memberOut.onlineStatus
              ? r.memberOut.onlineStatus
              : null,
            allowReadReceipt: r.memberOut.allowReadReceipt
              ? r.memberOut.allowReadReceipt
              : false,
            allowReceiveMessageFrom: r.memberOut.allowReceiveMessageFrom
              ? r.memberOut.allowReceiveMessageFrom
              : null,
            allowAddToGroupsFrom: r.memberOut.allowAddToGroupsFrom
              ? r.memberOut.allowAddToGroupsFrom
              : null,
            allowGroupsSuggestion: r.memberOut.allowGroupsSuggestion
              ? r.memberOut.allowGroupsSuggestion
              : false,
            e2ePublicKey: r.memberOut.e2ePublicKey
              ? r.memberOut.e2ePublicKey
              : null,
            e2eSecret: r.memberOut.e2eSecret ? r.memberOut.e2eSecret : null,
            e2eSecretIV: r.memberOut.e2eSecretIV
              ? r.memberOut.e2eSecretIV
              : null,
            createdAt: new Date(r.memberOut.createdAt),
            updatedAt: r.memberOut.updatedAt
              ? new Date(r.memberOut.updatedAt)
              : null,
            client: this._client!,
            realtimeClient: this._realtimeClient!,
          }),
        },
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onLeaveConversation(
    conversationId: string,
    callback: (
      response:
        | QIError
        | {
            conversationId: string
            conversation: Conversation
            memberOut: User
          },
      source: OperationResult<
        { onLeaveConversation: MemberOutResultGraphQL },
        SubscriptionOnLeaveConversationArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onLeaveConversation"
    const metasubcription = this._subscription<
      SubscriptionOnLeaveConversationArgs,
      { onLeaveConversation: MemberOutResultGraphQL }
    >(onLeaveConversation, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onLeaveConversation: MemberOutResultGraphQL },
        MemberOutResultGraphQL
      >("onLeaveConversation", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        {
          conversationId: r.conversationId,
          conversation: new Conversation({
            ...this._parentConfig!,
            id: r.conversation.id,
            name: r.conversation.name,
            description: r.conversation.description
              ? r.conversation.description
              : null,
            imageURL: r.conversation.imageURL ? r.conversation.imageURL : null,
            bannerImageURL: r.conversation.bannerImageURL
              ? r.conversation.bannerImageURL
              : null,
            settings: r.conversation.settings ? r.conversation.settings : null,
            imageSettings: r.conversation.imageSettings
              ? r.conversation.imageSettings
              : null,
            membersIds: r.conversation.membersIds
              ? r.conversation.membersIds
              : null,
            mutedBy: r.conversation.mutedBy ? r.conversation.mutedBy : null,
            type: r.conversation.type,
            lastMessageSentAt: r.conversation.lastMessageSentAt
              ? r.conversation.lastMessageSentAt
              : null,
            ownerId: r.conversation.ownerId ? r.conversation.ownerId : null,
            createdAt: r.conversation.createdAt,
            updatedAt: r.conversation.updatedAt
              ? r.conversation.updatedAt
              : null,
            deletedAt: r.conversation.deletedAt
              ? r.conversation.deletedAt
              : null,
            client: this._client!,
            realtimeClient: this._realtimeClient!,
          }),
          memberOut: new User({
            ...this._parentConfig!,
            id: r.memberOut.id,
            username: r.memberOut.username ? r.memberOut.username : null,
            did: r.memberOut.did,
            address: r.memberOut.address,
            email: r.memberOut.email ? r.memberOut.email : null,
            bio: r.memberOut.bio ? r.memberOut.bio : null,
            avatarUrl: r.memberOut.avatarUrl
              ? new URL(r.memberOut.avatarUrl)
              : null,
            imageSettings: r.memberOut.imageSettings
              ? r.memberOut.imageSettings
              : null,
            isVerified: r.memberOut.isVerified ? r.memberOut.isVerified : false,
            isPfpNft: r.memberOut.isPfpNft ? r.memberOut.isPfpNft : false,
            blacklistIds: r.memberOut.blacklistIds
              ? r.memberOut.blacklistIds
              : null,
            allowNotification: r.memberOut.allowNotification
              ? r.memberOut.allowNotification
              : false,
            allowNotificationSound: r.memberOut.allowNotificationSound
              ? r.memberOut.allowNotificationSound
              : false,
            visibility: r.memberOut.visibility ? r.memberOut.visibility : false,
            archivedConversations: r.memberOut.archivedConversations
              ? r.memberOut.archivedConversations
              : null,
            onlineStatus: r.memberOut.onlineStatus
              ? r.memberOut.onlineStatus
              : null,
            allowReadReceipt: r.memberOut.allowReadReceipt
              ? r.memberOut.allowReadReceipt
              : false,
            allowReceiveMessageFrom: r.memberOut.allowReceiveMessageFrom
              ? r.memberOut.allowReceiveMessageFrom
              : null,
            allowAddToGroupsFrom: r.memberOut.allowAddToGroupsFrom
              ? r.memberOut.allowAddToGroupsFrom
              : null,
            allowGroupsSuggestion: r.memberOut.allowGroupsSuggestion
              ? r.memberOut.allowGroupsSuggestion
              : false,
            e2ePublicKey: r.memberOut.e2ePublicKey
              ? r.memberOut.e2ePublicKey
              : null,
            e2eSecret: r.memberOut.e2eSecret ? r.memberOut.e2eSecret : null,
            e2eSecretIV: r.memberOut.e2eSecretIV
              ? r.memberOut.e2eSecretIV
              : null,
            createdAt: new Date(r.memberOut.createdAt),
            updatedAt: r.memberOut.updatedAt
              ? new Date(r.memberOut.updatedAt)
              : null,
            client: this._client!,
            realtimeClient: this._realtimeClient!,
          }),
        },
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onAddPinConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onAddPinConversation: ConversationGraphQL },
        SubscriptionOnAddPinConversationArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onAddPinConversation"
    const metasubcription = this._subscription<
      SubscriptionOnAddPinConversationArgs,
      { onAddPinConversation: ConversationGraphQL }
    >(onAddPinConversation, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onAddPinConversation: ConversationGraphQL },
        ConversationGraphQL
      >("onAddPinConversation", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Conversation({
          ...this._parentConfig!,
          id: r.id,
          name: r.name,
          description: r.description ? r.description : null,
          imageURL: r.imageURL ? r.imageURL : null,
          bannerImageURL: r.bannerImageURL ? r.bannerImageURL : null,
          imageSettings: r.imageSettings ? r.imageSettings : null,
          settings: r.settings ? r.settings : null,
          membersIds: r.membersIds ? r.membersIds : null,
          mutedBy: r.mutedBy ? r.mutedBy : null,
          type: r.type,
          lastMessageSentAt: r.lastMessageSentAt ? r.lastMessageSentAt : null,
          ownerId: r.ownerId ? r.ownerId : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onRemovePinConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onRemovePinConversation: ConversationGraphQL },
        SubscriptionOnRemovePinConversationArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onRemovePinConversation"
    const metasubcription = this._subscription<
      SubscriptionOnRemovePinConversationArgs,
      { onRemovePinConversation: ConversationGraphQL }
    >(onRemovePinConversation, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onRemovePinConversation: ConversationGraphQL },
        ConversationGraphQL
      >("onRemovePinConversation", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Conversation({
          ...this._parentConfig!,
          id: r.id,
          name: r.name,
          description: r.description ? r.description : null,
          imageURL: r.imageURL ? r.imageURL : null,
          bannerImageURL: r.bannerImageURL ? r.bannerImageURL : null,
          imageSettings: r.imageSettings ? r.imageSettings : null,
          settings: r.settings ? r.settings : null,
          membersIds: r.membersIds ? r.membersIds : null,
          mutedBy: r.mutedBy ? r.mutedBy : null,
          type: r.type,
          lastMessageSentAt: r.lastMessageSentAt ? r.lastMessageSentAt : null,
          ownerId: r.ownerId ? r.ownerId : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onMuteConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onMuteConversation: ConversationGraphQL },
        SubscriptionOnMuteConversationArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onMuteConversation"
    const metasubcription = this._subscription<
      SubscriptionOnMuteConversationArgs,
      { onMuteConversation: ConversationGraphQL }
    >(onMuteConversation, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onMuteConversation: ConversationGraphQL },
        ConversationGraphQL
      >("onMuteConversation", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Conversation({
          ...this._parentConfig!,
          id: r.id,
          name: r.name,
          description: r.description ? r.description : null,
          imageURL: r.imageURL ? r.imageURL : null,
          bannerImageURL: r.bannerImageURL ? r.bannerImageURL : null,
          imageSettings: r.imageSettings ? r.imageSettings : null,
          settings: r.settings ? r.settings : null,
          membersIds: r.membersIds ? r.membersIds : null,
          mutedBy: r.mutedBy ? r.mutedBy : null,
          type: r.type,
          lastMessageSentAt: r.lastMessageSentAt ? r.lastMessageSentAt : null,
          ownerId: r.ownerId ? r.ownerId : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onUnmuteConversation(
    conversationId: string,
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onUnmuteConversation: ConversationGraphQL },
        SubscriptionOnUnmuteConversationArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onUnmuteConversation"
    const metasubcription = this._subscription<
      SubscriptionOnUnmuteConversationArgs,
      { onUnmuteConversation: ConversationGraphQL }
    >(onUnmuteConversation, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onUnmuteConversation: ConversationGraphQL },
        ConversationGraphQL
      >("onUnmuteConversation", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new Conversation({
          ...this._parentConfig!,
          id: r.id,
          name: r.name,
          description: r.description ? r.description : null,
          imageURL: r.imageURL ? r.imageURL : null,
          bannerImageURL: r.bannerImageURL ? r.bannerImageURL : null,
          imageSettings: r.imageSettings ? r.imageSettings : null,
          settings: r.settings ? r.settings : null,
          membersIds: r.membersIds ? r.membersIds : null,
          mutedBy: r.mutedBy ? r.mutedBy : null,
          type: r.type,
          lastMessageSentAt: r.lastMessageSentAt ? r.lastMessageSentAt : null,
          ownerId: r.ownerId ? r.ownerId : null,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onAddMembersToConversation(
    callback: (
      response:
        | QIError
        | {
            conversationId: string
            items: ConversationMember[]
            membersIds: Array<string>
          },
      source: OperationResult<
        { onAddMembersToConversation: ListConversationMembersGraphQL },
        { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onAddMembersToConversation"
    const metasubcription = this._subscription<
      null,
      { onAddMembersToConversation: ListConversationMembersGraphQL }
    >(onAddMembersToConversation, key, null)

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onAddMembersToConversation: ListConversationMembersGraphQL },
        ListConversationMembersGraphQL
      >("onAddMembersToConversation", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        {
          conversationId: r.conversationId,
          items: r.items.map((item) => {
            return new ConversationMember({
              ...this._parentConfig!,
              id: item.id,
              conversationId: item.conversationId,
              userId: item.userId,
              type: item.type,
              encryptedConversationPublicKey:
                item.encryptedConversationPublicKey,
              encryptedConversationPrivateKey:
                item.encryptedConversationPrivateKey,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
              client: this._client!,
              realtimeClient: this._realtimeClient!,
            })
          }),
          membersIds: r.membersIds,
        },
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onUpdateUser(
    id: string,
    callback: (
      response: QIError | User,
      source: OperationResult<
        { onUpdateUser: UserGraphQL },
        SubscriptionOnUpdateUserArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onUpdateUser"
    const metasubcription = this._subscription<
      SubscriptionOnUpdateUserArgs,
      { onUpdateUser: UserGraphQL }
    >(onUpdateUser, key, { id })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onUpdateUser: UserGraphQL },
        UserGraphQL
      >("onUpdateUser", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new User({
          ...this._parentConfig!,
          id: r.id,
          username: r.username ? r.username : null,
          did: r.did,
          address: r.address,
          email: r.email ? r.email : null,
          bio: r.bio ? r.bio : null,
          avatarUrl: r.avatarUrl ? new URL(r.avatarUrl) : null,
          imageSettings: r.imageSettings ? r.imageSettings : null,
          isVerified: r.isVerified ? r.isVerified : false,
          isPfpNft: r.isPfpNft ? r.isPfpNft : false,
          blacklistIds: r.blacklistIds ? r.blacklistIds : null,
          allowNotification: r.allowNotification ? r.allowNotification : false,
          allowNotificationSound: r.allowNotificationSound
            ? r.allowNotificationSound
            : false,
          visibility: r.visibility ? r.visibility : false,
          archivedConversations: r.archivedConversations
            ? r.archivedConversations
            : null,
          onlineStatus: r.onlineStatus ? r.onlineStatus : null,
          allowReadReceipt: r.allowReadReceipt ? r.allowReadReceipt : false,
          allowReceiveMessageFrom: r.allowReceiveMessageFrom
            ? r.allowReceiveMessageFrom
            : null,
          allowAddToGroupsFrom: r.allowAddToGroupsFrom
            ? r.allowAddToGroupsFrom
            : null,
          allowGroupsSuggestion: r.allowGroupsSuggestion
            ? r.allowGroupsSuggestion
            : false,
          e2ePublicKey: r.e2ePublicKey ? r.e2ePublicKey : null,
          e2eSecret: r.e2eSecret ? r.e2eSecret : null,
          e2eSecretIV: r.e2eSecretIV ? r.e2eSecretIV : null,
          createdAt: new Date(r.createdAt),
          updatedAt: r.updatedAt ? new Date(r.updatedAt) : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onRequestTrade(
    conversationId: string,
    callback: (
      response: QIError | ConversationTradingPool,
      source: OperationResult<
        { onRequestTrade: ConversationTradingPoolGraphQL },
        SubscriptionOnRequestTradeArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onRequestTrade"
    const metasubcription = this._subscription<
      SubscriptionOnRequestTradeArgs,
      { onRequestTrade: ConversationTradingPoolGraphQL }
    >(onRequestTrade, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onRequestTrade: ConversationTradingPoolGraphQL },
        ConversationTradingPoolGraphQL
      >("onRequestTrade", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new ConversationTradingPool({
          ...this._parentConfig!,
          id: r.id,
          conversationId: r.conversationId ? r.conversationId : null,
          userId: r.userId ? r.userId : null,
          involvedUsers: r.involvedUsers ? r.involvedUsers : null,
          operation: r.operation ? r.operation : null,
          status: r.status ? r.status : null,
          type: r.type ? r.type : null,
          createdAt: r.createdAt ? r.createdAt : null,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onDeleteRequestTrade(
    conversationId: string,
    callback: (
      response: QIError | ConversationTradingPool,
      source: OperationResult<
        { onDeleteRequestTrade: ConversationTradingPoolGraphQL },
        SubscriptionOnDeleteRequestTradeArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onDeleteRequestTrade"
    const metasubcription = this._subscription<
      SubscriptionOnDeleteRequestTradeArgs,
      { onDeleteRequestTrade: ConversationTradingPoolGraphQL }
    >(onDeleteRequestTrade, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onDeleteRequestTrade: ConversationTradingPoolGraphQL },
        ConversationTradingPoolGraphQL
      >("onDeleteRequestTrade", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new ConversationTradingPool({
          ...this._parentConfig!,
          id: r.id,
          conversationId: r.conversationId ? r.conversationId : null,
          userId: r.userId ? r.userId : null,
          involvedUsers: r.involvedUsers ? r.involvedUsers : null,
          operation: r.operation ? r.operation : null,
          status: r.status ? r.status : null,
          type: r.type ? r.type : null,
          createdAt: r.createdAt ? r.createdAt : null,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  onUpdateRequestTrade(
    conversationId: string,
    callback: (
      response: QIError | ConversationTradingPool,
      source: OperationResult<
        { onUpdateRequestTrade: ConversationTradingPoolGraphQL },
        SubscriptionOnUpdateRequestTradeArgs & { jwt: string }
      >,
      uuid: string
    ) => void
  ): QIError | SubscriptionGarbage {
    const key = "onUpdateRequestTrade"
    const metasubcription = this._subscription<
      SubscriptionOnUpdateRequestTradeArgs,
      { onUpdateRequestTrade: ConversationTradingPoolGraphQL }
    >(onUpdateRequestTrade, key, { conversationId })

    if (metasubcription instanceof QIError) return metasubcription

    const { subscribe, uuid } = metasubcription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onUpdateRequestTrade: ConversationTradingPoolGraphQL },
        ConversationTradingPoolGraphQL
      >("onUpdateRequestTrade", result)

      if (r instanceof QIError) {
        callback(r, result, uuid)
        return
      }

      callback(
        new ConversationTradingPool({
          ...this._parentConfig!,
          id: r.id,
          conversationId: r.conversationId ? r.conversationId : null,
          userId: r.userId ? r.userId : null,
          involvedUsers: r.involvedUsers ? r.involvedUsers : null,
          operation: r.operation ? r.operation : null,
          status: r.status ? r.status : null,
          type: r.type ? r.type : null,
          createdAt: r.createdAt ? r.createdAt : null,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        }),
        result,
        uuid
      )
    })

    return { unsubscribe, uuid }
  }

  /** Chat events methods */

  /**
   * Add a new event and the associated callback.
   * @param {AuthEvents} event - The event to listen.
   * @param {Function} callback - The callback related to this event.
   * @param {boolean} onlyOnce - An optional flag, it allows the adding of only one callback associated to this event.
   * @returns None
   */
  on(event: ChatEvents, callback: Function, onlyOnce?: boolean) {
    const index = this._eventsCallbacks.findIndex((item) => {
      return item.event === event
    })

    if (index < 0)
      this._eventsCallbacks.push({
        event,
        callbacks: [callback],
      })
    else {
      if (onlyOnce) return
      this._eventsCallbacks[index].callbacks.push(callback)
    }
  }

  /**
   * Remove an event and the associated callback or all the callbacks associated to that event.
   * @param {AuthEvents} event - The event to unlisten.
   * @param {Function} callback - The callback related to this event.
   * @returns None
   */
  off(event: ChatEvents, callback?: Function) {
    const index = this._eventsCallbacks.findIndex((item) => {
      return item.event === event
    })

    if (index < 0) return

    this._eventsCallbacks[index].callbacks = callback
      ? this._eventsCallbacks[index].callbacks.filter((cb) => cb !== callback)
      : []
  }

  /** Syncing methods */

  /**
   * Sync the current client with the backend.
   * @returns {Promise<void>}
   */
  async sync(): Promise<void> {
    if (!Auth.account)
      throw new Error("You must be authenticated before to sync.")
    if (!this._storage.isStorageEnabled())
      throw new Error("sync() is available only if you enable the storage.")
    if (this._syncRunning) throw new Error("You have already launched sync().")
    if (!this._isConnected)
      throw new Error(
        "You must be connected in order to call sync(). Call connect() first..."
      )
    if (!this._canChat)
      throw new Error(
        "This client cannot start to chat. Are you missing to pairing the keys?"
      )

    //we're running sync
    this._syncRunning = true

    //let's call the detective message scan method
    Chat._detectiveMessage.scan()

    //let's call all the logics
    await this._sync(this._syncingCounter)

    //add member to conversation. This event is global, basically the user is always listening if
    //someone wants to add him into a conversation.
    const onAddMembersToConversation = this.onAddMembersToConversation(
      this._onAddMembersToConversationSync
    )

    if (!(onAddMembersToConversation instanceof QIError)) {
      const { unsubscribe, uuid } = onAddMembersToConversation
      this._unsubscribeSyncSet.push({
        type: "onAddMembersToConversation",
        unsubscribe,
        uuid,
        conversationId: "", //this value is updated inside the callback fired by the subscription
      })
    }

    //now that we have a _conversationsMap array filled, we can add subscription for every conversation that is currently active
    for (const { conversationId } of this._conversationsMap.filter(
      (conversation) => conversation.type === "ACTIVE"
    )) {
      this._addSubscriptionsSync(conversationId)
    }
  }

  /**
   * An utility event method that allows the client to track the activity of the Chat object, while it's syncing with the backend.
   * @param {Function} callback - the callback that will run once the Chat object is syncing with the backend
   * @returns none
   */
  syncing(callback: (isSyncing: boolean, syncingCounter: number) => void) {
    this.on("syncing", (syncingCounter: number) => {
      callback(this._isSyncing, syncingCounter)
    })
  }

  /**
   * An utility event method that allows the client to track the activity of the Chat object, once it's performed a new sync with the backend.
   * @param {Function} callback - the callback that will run once the Chat object has performed another sync with the backend
   * @returns none
   */
  syncUpdate(callback: (syncingCounter: number) => void) {
    this.on("syncUpdate", (syncingCounter: number) => {
      callback(syncingCounter)
    })
  }

  /**
   * Unsync the client.
   * @returns none
   */
  unsync() {
    if (this._syncTimeout) clearTimeout(this._syncTimeout)
    this._isSyncing = false
    this._syncingCounter = 0
    for (const { conversationId } of this._conversationsMap.filter(
      (conversation) => conversation.type === "ACTIVE"
    )) {
      this._removeSubscriptionsSync(conversationId)
    }
    this._conversationsMap = []
    this._keyPairsMap = []
    this._userKeyPair = null
    this._syncRunning = false
    Chat._detectiveMessage.clear()
  }

  /**
   * Check if the current Chat object is currently syncing with the backend.
   * @returns {boolean} isSyncing
   */
  isSyncing(): boolean {
    return this._isSyncing
  }

  /** read local database */

  fetchLocalDBMessages(
    conversationId: string,
    page: number,
    numberElements: number
  ): Promise<LocalDBMessage[]> {
    if (!Auth.account) throw new Error("Account must be initialized.")

    return new Promise((resolve, reject) => {
      try {
        if (page < 0 || numberElements <= 0) resolve([])

        const offset = (page - 1) * numberElements

        this._storage.query(
          async (
            db: Dexie,
            message: Table<LocalDBMessage, string, LocalDBMessage>
          ) => {
            const messages = await message
              .orderBy("createdAt")
              .reverse()
              .offset(offset)
              .limit(numberElements)
              .filter(
                (element) =>
                  element.conversationId === conversationId &&
                  element.userDid === Auth.account!.did &&
                  typeof element.deletedAt !== "undefined" &&
                  !!element.deletedAt
              )
              .toArray()

            if (!messages) reject([])

            resolve(
              messages.map((message) => {
                const _message = {
                  ...message,
                  content: Crypto.decryptStringOrFail(
                    this.findPrivateKeyById(conversationId),
                    message.content
                  ),
                  reactions: message.reactions
                    ? message.reactions.map((reaction) => {
                        return {
                          ...reaction,
                          content: Crypto.decryptStringOrFail(
                            this.findPrivateKeyById(conversationId),
                            reaction.content
                          ),
                        }
                      })
                    : null,
                }

                _message.messageRoot = message.messageRoot
                  ? {
                      ...message.messageRoot,
                      content: Crypto.decryptStringOrFail(
                        this.findPrivateKeyById(conversationId),
                        message.messageRoot.content
                      ),
                      reactions: message.messageRoot.reactions
                        ? message.messageRoot.reactions.map((reaction) => {
                            return {
                              ...reaction,
                              content: Crypto.decryptStringOrFail(
                                this.findPrivateKeyById(conversationId),
                                reaction.content
                              ),
                            }
                          })
                        : null,
                    }
                  : null

                return _message
              })
            )
          },
          "message"
        )
      } catch (error) {
        console.log("[ERROR]: fetchLocalDBMessages() -> ", error)
        reject([])
      }
    })
  }

  fetchLocalDBConversations(
    page: number,
    numberElements: number
  ): Promise<LocalDBConversation[]> {
    if (!Auth.account) throw new Error("Account must be initialized.")

    return new Promise((resolve, reject) => {
      try {
        if (page < 0 || numberElements <= 0) resolve([])

        const offset = (page - 1) * numberElements

        this._storage.query(
          async (
            db: Dexie,
            conversation: Table<
              LocalDBConversation,
              string,
              LocalDBConversation
            >
          ) => {
            const conversations = await conversation
              .orderBy("createdAt")
              .reverse()
              .offset(offset)
              .limit(numberElements)
              .filter(
                (element) =>
                  element.userDid === Auth.account!.did &&
                  typeof element.deletedAt !== "undefined" &&
                  !!element.deletedAt
              )
              .toArray()

            if (!conversations) reject([])

            resolve(
              conversations.map((conversation) => {
                return {
                  ...conversation,
                  name: Crypto.decryptStringOrFail(
                    this.findPrivateKeyById(conversation.id),
                    conversation.name
                  ),
                  description: Crypto.decryptStringOrFail(
                    this.findPrivateKeyById(conversation.id),
                    conversation.description
                  ),
                  imageURL: Crypto.decryptStringOrFail(
                    this.findPrivateKeyById(conversation.id),
                    conversation.imageURL
                  ),
                  bannerImageURL: Crypto.decryptStringOrFail(
                    this.findPrivateKeyById(conversation.id),
                    conversation.bannerImageURL
                  ),
                }
              })
            )
          },
          "conversation"
        )
      } catch (error) {
        console.log("[ERROR]: fetchLocalDBMessages() -> ", error)
        reject([])
      }
    })
  }

  async searchTermsOnLocalDB(
    terms: Array<string>
  ): Promise<Array<{ conversationId: string; messageId: string }>> {
    if (!Auth.account) throw new Error("Account must be initialized.")
    return new Promise((resolve, reject) => {
      try {
        this._storage.query(
          async (
            db: Dexie,
            message: Table<LocalDBMessage, string, LocalDBMessage>
          ) => {
            const results = await Dexie.Promise.all(
              terms.map((prefix) =>
                message
                  .where("content")
                  .startsWith(prefix)
                  .and((m) => {
                    return m.userDid === Auth.account!.did
                  })
                  .primaryKeys()
              )
            )

            // Intersect result set of primary keys
            const reduced = results.reduce((a, b) => {
              const set = new Set(b)
              return a.filter((k) => set.has(k))
            })

            const messages = (
              await message.where(":id").anyOf(reduced).toArray()
            ).map((message) => {
              return {
                messageId: message.id,
                conversationId: message.conversationId,
              }
            })

            resolve(messages)
          },
          "message"
        )
      } catch (error) {
        reject(error)
      }
    })
  }

  /** delete operations local database */

  softDeleteConversationOnLocalDB(conversationId: string): Promise<void> {
    if (!Auth.account) throw new Error("Account must be initialized.")
    return new Promise((resolve, reject) => {
      try {
        this._storage.query(
          async (
            db: Dexie,
            table: Table<LocalDBConversation, string, LocalDBConversation>
          ) => {
            await table
              .where("[id+userDid]")
              .equals([conversationId, Auth.account!.did])
              .modify((conversation: LocalDBConversation) => {
                conversation.deletedAt = new Date()
              })
          },
          "conversation"
        )

        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  async truncateTableOnLocalDB(tableName: "message" | "user" | "conversation") {
    if (!Auth.account) throw new Error("Account must be initialized.")

    await this._storage.truncate(tableName)
  }

  /** update operations local database */

  readMessage(conversationId: string): Promise<void> {
    if (!Auth.account) throw new Error("Account must be initialized.")

    return new Promise((resolve, reject) => {
      try {
        this._storage.query(
          async (
            db: Dexie,
            table: Table<LocalDBConversation, string, LocalDBConversation>
          ) => {
            await table
              .where("[id+userDid]")
              .equals([conversationId, Auth.account!.did])
              .modify((conversation: LocalDBConversation) => {
                conversation.lastMessageRead = new Date()
              })
          },
          "conversation"
        )

        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  /** transfer keys logic */

  //this action is performed by device A
  async pair(): Promise<Maybe<string>> {
    if (!this._userKeyPair)
      throw new Error(
        "Pairing is possible only if the user has generated a personal keys pair."
      )

    //WARNING!
    //old code was the following:
    /**
     *
     * const mnemonic = bip39.generateMnemonic()
     * const seed = bip39.mnemonicToSeedSync(mnemonic)
     * const hex = seed.toString("hex")
     *
     * bip39 was imported with another npm package and not @scure/bip39
     * so, the convertion in hex is not supported directly because seed now is an UInt8Array instead to be a Buffer
     * we need to verify if adding the buffer convertion has the same effect.
     *
     */

    const mnemonic = bip39.generateMnemonic(wordlist)
    const seed = bip39.mnemonicToSeedSync(mnemonic)
    const buffer = Buffer.from(seed)
    const hex = buffer.toString("hex")

    try {
      const { response } = await this._clientEngine.fetch<
        ApiResponse<{ status: number }>
      >(this._clientEngine.backendUrl("/pair/device/init"), {
        method: "POST",
        body: {
          pairingIdentity: hex,
        },
      })
      if (!response || !response.data) throw new Error("Response is invalid.")

      return mnemonic
    } catch (error: any) {
      console.error(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      return null
    }
  }

  //this action is performed by device B
  async startPairing(mnemonic: string): Promise<Maybe<{ status: number }>> {
    try {
      const keyPair = await Crypto.generateKeys("STANDARD")

      if (!keyPair)
        throw new Error("It was not possible to generate a valid key pair.")

      //WARNING!
      //old code was the following:
      /**
       *
       * const mnemonic = bip39.generateMnemonic()
       * const seed = bip39.mnemonicToSeedSync(mnemonic)
       * const hex = seed.toString("hex")
       *
       * bip39 was imported with another npm package and not @scure/bip39
       * so, the convertion in hex is not supported directly because seed now is an UInt8Array instead to be a Buffer
       * we need to verify if adding the buffer convertion has the same effect.
       *
       */

      const seed = bip39.mnemonicToSeedSync(mnemonic)
      const buffer = Buffer.from(seed)
      const hex = buffer.toString("hex")
      const _md = md.sha256.create()

      _md.update(hex)

      this._keyPairingObject = {
        privateKey: keyPair.privateKey,
        publicKey: keyPair.publicKey,
        md: _md,
        mgf1: mgf.mgf1.create(_md),
      }

      const { response } = await this._clientEngine.fetch<
        ApiResponse<{ status: number }>
      >(this._clientEngine.backendUrl("/pair/device/knowledge"), {
        method: "POST",
        body: {
          pairingIdentity: hex,
          publicKey: Crypto.convertRSAPublicKeyToPem(
            this._keyPairingObject.publicKey!
          ),
        },
      })

      if (!response || !response.data) throw new Error("Response is invalid.")

      return response.data[0]
    } catch (error: any) {
      console.error(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      return null
    }
  }

  //this is called by device A
  async transferKeysWhenReady(mnemonic: string) {
    if (!this._userKeyPair)
      throw new Error(
        "Pairing is possible only if the user has generated a personal keys pair."
      )

    try {
      console.log("trying to transfer keys...")

      //WARNING!
      //old code was the following:
      /**
       *
       * const seed = bip39.mnemonicToSeedSync(mnemonic)
       * const hex = seed.toString("hex")
       *
       * bip39 was imported with another npm package and not @scure/bip39
       * so, the convertion in hex is not supported directly because seed now is an UInt8Array instead to be a Buffer
       * we need to verify if adding the buffer convertion has the same effect.
       *
       */

      const seed = bip39.mnemonicToSeedSync(mnemonic)
      const buffer = Buffer.from(seed)
      const hex = buffer.toString("hex")

      const { response } = await this._clientEngine.fetch<
        ApiResponse<{ status: number; publicKey: string }>
      >(this._clientEngine.backendUrl("/pair/device/check"), {
        method: "POST",
        body: {
          pairingIdentity: hex,
        },
      })

      if (!response || !response.data) throw new Error("Response is invalid.")

      const status = response.data[0].status
      const publicKeyPem = response.data[0].publicKey

      if (status === 1) setTimeout(this.transferKeysWhenReady.bind(this), 2000)
      else {
        //let's encrypt the personal key pair of the current user
        const personalPublicKey = this._userKeyPair!.publicKey
        const personalPrivateKey = this._userKeyPair!.privateKey
        const publicKey = pki.publicKeyFromPem(publicKeyPem)
        const personalPublicKeyPem =
          Crypto.convertRSAPublicKeyToPem(personalPublicKey)
        const personalPrivateKeyPem =
          Crypto.convertRSAPrivateKeyToPem(personalPrivateKey)
        const _md = md.sha256.create()
        _md.update(hex)
        const mgf1 = mgf.mgf1.create(_md)

        const encryptedPublicKey = publicKey.encrypt(
          personalPublicKeyPem,
          "RSA-OAEP",
          {
            md: _md,
            mgf1,
          }
        )
        const encryptedPrivateKey = publicKey.encrypt(
          personalPrivateKeyPem,
          "RSA-OAEP",
          {
            md: _md,
            mgf1,
          }
        )

        const encryptedPublicKeyBase64 = Crypto.toBase64(encryptedPublicKey)
        const encryptedPrivateKeyBase64 = Crypto.toBase64(encryptedPrivateKey)

        const { response } = await this._clientEngine.fetch<
          ApiResponse<{ status: number }>
        >(this._clientEngine.backendUrl("/pair/device/transfer/keys"), {
          method: "POST",
          body: {
            pairingIdentity: hex,
            encryptedPublicKey: encryptedPublicKeyBase64,
            encryptedPrivateKey: encryptedPrivateKeyBase64,
          },
        })

        if (!response || !response.data) throw new Error("Response is invalid.")

        return response.data[0]
      }
    } catch (error: any) {
      console.error(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      throw error
    }
  }

  //called by device B
  async downloadKeysWhenReady(mnemonic: string) {
    if (!Auth.account)
      throw new Error(
        "Account is not setup correctly. Authenticate to the platform first."
      )

    try {
      console.log("trying to download keys...")

      //WARNING!
      //old code was the following:
      /**
       *
       * const seed = bip39.mnemonicToSeedSync(mnemonic)
       * const hex = seed.toString("hex")
       *
       * bip39 was imported with another npm package and not @scure/bip39
       * so, the convertion in hex is not supported directly because seed now is an UInt8Array instead to be a Buffer
       * we need to verify if adding the buffer convertion has the same effect.
       *
       */

      const seed = bip39.mnemonicToSeedSync(mnemonic)
      const buffer = Buffer.from(seed)
      const hex = buffer.toString("hex")

      const { response } = await this._clientEngine.fetch<
        ApiResponse<{
          status: number
          encryptedPrivateKey?: string
          encryptedPublicKey?: string
        }>
      >(this._clientEngine.backendUrl("/pair/device/download/keys"), {
        method: "POST",
        body: {
          pairingIdentity: hex,
        },
      })

      if (!response || !response.data) throw new Error("Response is invalid.")

      const status = response.data[0].status
      const encryptedPrivateKey = response.data[0].encryptedPrivateKey
      const encryptedPublicKey = response.data[0].encryptedPublicKey

      if (status === 3) setTimeout(this.downloadKeysWhenReady.bind(this), 2000)
      else {
        //let's decrypt the personal key pair for the current user
        const personalEncryptedPublicKeyBase64 = encryptedPublicKey!
        const personalEncryptedPrivateKeyBase64 = encryptedPrivateKey!
        const personalEncryptedPublicKey = Crypto.fromBase64(
          personalEncryptedPublicKeyBase64
        )
        const personalEncryptedPrivateKey = Crypto.fromBase64(
          personalEncryptedPrivateKeyBase64
        )
        const personalPublicKeyPem =
          this._keyPairingObject!.privateKey!.decrypt(
            personalEncryptedPublicKey,
            "RSA-OAEP",
            {
              md: this._keyPairingObject!.md,
              mgf1: this._keyPairingObject!.mgf1,
            }
          )
        const personalPrivateKeyPem =
          this._keyPairingObject!.privateKey!.decrypt(
            personalEncryptedPrivateKey,
            "RSA-OAEP",
            {
              md: this._keyPairingObject!.md,
              mgf1: this._keyPairingObject!.mgf1,
            }
          )

        this._userKeyPair = await Crypto.generateKeyPairFromPem(
          personalPublicKeyPem,
          personalPrivateKeyPem
        )

        if (!this._userKeyPair)
          throw new Error("Key pair generated is not valid.")

        //let's update the current user on our local database
        const privateKeyForLocalDB = Crypto.encryptAES_CBC(
          personalPrivateKeyPem,
          Buffer.from(Auth.account!.e2eSecret, "hex").toString("base64"),
          Buffer.from(Auth.account!.e2eSecretIV, "hex").toString("base64")
        )

        await this._storage.transaction("rw", this._storage.user, async () => {
          let user = await this._storage.get("user", "[did+organizationId]", [
            Auth.account!.did,
            Auth.account!.organizationId,
          ])

          await this._storage.user.update(user, {
            e2eEncryptedPrivateKey: privateKeyForLocalDB,
            e2ePublicKey: personalPublicKeyPem,
          })

          return true
        })

        this._canChat = true
        return this._userKeyPair
      }
    } catch (error: any) {
      console.error(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      throw error
    }
  }

  /** handling of "ability to chat" based on _canChat, a property that becomes false if the system notices the current user has done another signin in another device */

  clientCanChat(): boolean {
    return this._canChat === true
  }

  setCanChat(canChat: boolean) {
    this._canChat = canChat
    if (!this._canChat)
      console.warn("User needs to transfer private keys between devices.")
  }

  /** combining messages (NFT & crypto) */
  async combineMessages({
    initializator,
    counterparty,
    messageInitializator,
    messageCounterparty,
  }: {
    initializator: User
    counterparty: User
    messageInitializator: Message
    messageCounterparty: Message
  }) {
    if (!this._canChat)
      throw new Error(
        "This client chat cannot combine messages. Are you missing to pairing the keys?"
      )
    if (!Auth.account) throw new Error("Account is not setup correctly.")
    if (messageInitializator.type !== "TRADE_PROPOSAL")
      throw new Error("messageInitializator is not of type `TRADE_PROPOSAL`.")
    if (messageCounterparty.type !== "TRADE_PROPOSAL")
      throw new Error("messageCounterparty is not of type `TRADE_PROPOSAL`.")
    if (
      messageInitializator.conversationId !== messageCounterparty.conversationId
    )
      throw new Error("Messages must be of the same conversation.")
    if (
      [messageCounterparty.userId, messageInitializator.userId].indexOf(
        Auth.account.dynamoDBUserID
      ) === -1
    )
      throw new Error(
        "User must combine at least a message on which he is the author."
      )
    if (messageInitializator.userId !== initializator.id)
      throw new Error(
        "It seems the `initializator` is not the author of `messageInitializator`."
      )
    if (messageCounterparty.userId !== counterparty.id)
      throw new Error(
        "It seems the `counterparty` is not the author of `messageCounterparty`."
      )

    try {
      const counterpartyId = counterparty.id
      const initializatorId = initializator.id
      const involvedUsers = [counterpartyId, initializatorId]

      const {
        assets: assetsInitializator,
      }: { assets: Array<Asset>; message: string } = JSON.parse(
        messageInitializator.content
      )
      const {
        assets: assetsCounterparty,
      }: { assets: Array<Asset>; message: string } = JSON.parse(
        messageCounterparty.content
      )

      //let's check if the assets contains crypto
      let cryptoParticipantOne = 0
      let cryptoParticipantTwo = 0

      assetsInitializator.forEach((asset) => {
        if (asset.itemType === "NATIVE" || asset.itemType === "ERC20")
          cryptoParticipantOne++
      })

      assetsCounterparty.forEach((asset) => {
        if (asset.itemType === "NATIVE" || asset.itemType === "ERC20")
          cryptoParticipantTwo++
      })

      if (cryptoParticipantOne > 1)
        throw new Error(
          "You cannot add more than one crypto on the first participant side."
        )
      if (cryptoParticipantTwo > 1)
        throw new Error(
          "You cannot add more than one crypto on the second participant side."
        )
      if (cryptoParticipantOne > 0 && cryptoParticipantTwo > 0)
        throw new Error(
          "Both participants cannot add a token (ERC20 or NATIVE) in the order. Only one counterparty is allowed to add a token in the trade."
        )

      const operation = {
        operation: "trade",
        creatorDid: "",
        counterpartyDid: "",
        creatorAddress: "",
        counterpartyAddress: "",
        organizationId: Auth.account.organizationId,
        networkId: Auth.account.getCurrentNetwork(false),
        participantOneId: initializator.id,
        participantTwoId: counterparty.id,
        participantOneAddress: initializator.address,
        participantTwoAddress: counterparty.address,
        participantOneDid: initializator.did,
        participantTwoDid: counterparty.did,
        assets: {
          participantOne: assetsInitializator,
          participantTwo: assetsCounterparty,
        },
        orderId: "",
      }

      await this.requestTrade({
        involvedUsers,
        conversationId: messageInitializator.conversationId,
        operation,
      })
    } catch (error) {
      console.log(error)
    }
  }

  async handleOrderFromMessages({
    conversationTradingPoolId,
    status,
    orderRef,
    dayDuration,
  }: {
    conversationTradingPoolId: string
    status: ConversationTradingPoolStatus
    orderRef: Order
    dayDuration: number
  }) {
    if (!this._canChat)
      throw new Error(
        "This client chat cannot perform order. Are you missing to pairing the keys?"
      )
    if (!Auth.account) throw new Error("Account is not setup correctly.")
    if (!orderRef.isInitialized())
      throw new Error(
        "Order referece must be initialized in order to use this method."
      )

    try {
      const conversationTradingPool = await this.getConversationTradingPoolById(
        conversationTradingPoolId
      )

      if (conversationTradingPool instanceof QIError)
        throw new Error(
          "Error while retrieving ConversationTradingPool. The `conversationTradingPoolId` provided is wrong maybe?"
        )

      const operation = JSON.parse(conversationTradingPool.operation!)

      if (status === ConversationTradingPoolStatus.TradeProgress) {
        if (
          conversationTradingPool.status !==
          ConversationTradingPoolStatus.TradeInitialized
        )
          throw new Error(
            "Trade status is not in state `TRADE_INITIALIZED`. You are trying to update a trade that was already initialized."
          )

        const { assets } = operation
        const {
          participantOne: assetsParticipantOne,
          participantTwo: assetsParticipantTwo,
        } = assets
        let participantOne
        let participantTwo
        let creatorAddress
        let creatorDid
        let counterpartyAddress
        let counterpartyDid

        //in this way we understand who is the creator and who is the counterparty
        if (Auth.account.dynamoDBUserID === operation.participantOneId) {
          participantOne = {
            assets: assetsParticipantOne,
            address: operation.participantOneAddress,
          } //maker is the current user
          participantTwo = {
            assets: assetsParticipantTwo,
            address: operation.participantTwoAddress,
          } //taker is the other user

          creatorAddress = operation.participantOneAddress
          creatorDid = operation.participantOneDid
          counterpartyAddress = operation.participantTwoAddress
          counterpartyDid = operation.participantTwoDid
        } else {
          participantOne = {
            assets: assetsParticipantTwo,
            address: operation.participantTwoAddress,
          } //maker is the user marked as participantTwo
          participantTwo = {
            assets: assetsParticipantOne,
            address: operation.participantOneAddress,
          } //taker is the user marked as participantOne

          creatorAddress = operation.participantTwoAddress
          creatorDid = operation.participantTwoDid
          counterpartyAddress = operation.participantOneAddress
          counterpartyDid = operation.participantOneDid
        }

        const order = await orderRef.create(
          participantOne,
          participantTwo,
          dayDuration
        )

        if (!order) throw new Error("Order was not created successfully.")

        const orderId = order.orderId.toString()

        await this.updateRequestTrade({
          conversationTradingPoolId,
          status,
          counterparties: {
            creatorAddress,
            creatorDid,
            counterpartyAddress,
            counterpartyDid,
          },
          orderId,
        })
      } else if (status === ConversationTradingPoolStatus.TradeCompleted) {
        await orderRef.finalize(operation.orderId)
        await this.updateRequestTrade({
          conversationTradingPoolId,
          status,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}
