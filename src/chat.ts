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
  ListMessagesUpdatedResult as ListMessagesUpdatedGraphQL,
  QueryListMessagesUpdatedArgs,
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
  listMessagesUpdated,
  getMembersFromConversationById,
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
  MessageType,
} from "./enums"
import {
  LocalDBConversation,
  LocalDBMessage,
  LocalDBUser,
} from "./core/app/database"
import { Converter, findAddedAndRemovedConversation, Serpens } from "./core"
import { Reaction } from "./core/chat/reaction"
import { v4 as uuidv4 } from "uuid"
import { ApiResponse } from "./types/base/apiresponse"
import { md, pki } from "node-forge"
import { Order } from "./order"
import { Auth, ChatEvents, EngineInitConfig } from "."
import { DetectiveMessage } from "./core/chat/detectivemessage"
import { ListMessagesUpdatedArgs } from "./types/chat/schema/args/listmessagesupdated"
import { ConnectedWallet } from "@privy-io/react-auth"

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
      | "onRequestTrade"
      | "onUpdateRequestTrade"

    unsubscribe: Function
    uuid: string
    conversationId: string
  }> = []

  private _conversationsMap: Array<{
    type: "CANCELED" | "ACTIVE"
    conversationId: string
    conversation: Conversation
  }> = []

  private _canChat: boolean = false

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
    if (!Chat._config)
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
    if (Chat._config) throw new Error("Chat already configured")

    Chat._config = config
  }

  static getInstance() {
    return Chat._instance ?? new Chat()
  }

  static getDetectiveMessageInstance() {
    return Chat._detectiveMessage
  }

  static silentRestoreSubscriptionSync() {
    if (!Chat._instance) return

    //let's clear the timeout
    if (Chat._instance._syncTimeout) clearTimeout(Chat._instance._syncTimeout)

    //let's unsubscribe everything from the previous results
    for (const { conversationId } of Chat._instance._conversationsMap.filter(
      (conversation) => conversation.type === "ACTIVE"
    )) {
      Chat._instance._removeSubscriptionsSync(conversationId)
    }

    //let's clear the _unsubscribeSyncSet from the previous results
    Chat._instance._unsubscribeSyncSet = []

    //add member to conversation. This event is global, basically the user is always listening if
    //someone wants to add him into a conversation.
    const onAddMembersToConversation =
      Chat._instance.onAddMembersToConversation(
        (
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
        ) => {
          Chat._instance!._onAddMembersToConversationSync(
            response,
            source,
            uuid
          )
        },
        true
      )

    if (!(onAddMembersToConversation instanceof QIError)) {
      const { unsubscribe, uuid } = onAddMembersToConversation
      Chat._instance._unsubscribeSyncSet.push({
        type: "onAddMembersToConversation",
        unsubscribe,
        uuid,
        conversationId: "", //this value is updated inside the callback fired by the subscription
      })
    } else {
      const error = Chat._instance._handleUnauthorizedQIError(
        onAddMembersToConversation
      )
      if (error) {
        ;(async () => {
          if (!Chat._instance) return

          await Auth.fetchAuthToken()
          Chat._instance.silentReset()
        })()

        return
      }

      Chat._instance._emit("syncError", {
        error: onAddMembersToConversation,
      })
      Chat._instance.unsync()

      return
    }

    //now that we have a _conversationsMap array filled, we can add subscription for every conversation that is currently active
    for (const { conversationId } of Chat._instance._conversationsMap.filter(
      (conversation) => conversation.type === "ACTIVE"
    )) {
      Chat._instance._addSubscriptionsSync(conversationId)
    }

    ;(async () => {
      if (!Chat._instance) return

      await Chat._instance._sync(Chat._instance._syncingCounter)
    })()
  }

  static unsyncBrutal(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!Chat._instance) {
        reject("instance not setup correctly.")
        return
      }

      Chat._instance.unsync().then(resolve).catch(reject)
    })
  }

  /** message content handling */

  private _getMessageContent(
    content: string | { assets: Asset[]; message: string },
    type: MessageType
  ): string {
    if (
      (type === MessageType.Textual ||
        type === MessageType.Attachment ||
        type === MessageType.Rent ||
        type === MessageType.TradeProposal) &&
      typeof content !== "string"
    )
      throw new Error(
        "The content of a textual message can not be different from a string."
      )

    switch (type) {
      case MessageType.Textual:
      case MessageType.Attachment:
      case MessageType.Rent:
      case MessageType.TradeProposal:
        return content as string
        break
      case MessageType.Nft:
        return JSON.stringify(content)
        break
    }
  }

  /** private instance methods */

  private _defineHookFnLocalDB() {
    this._hookMessageCreatingFn = (primaryKey, record) => {
      const _message = {
        ...record,
        content: Crypto.decryptAESorFail(
          record.content,
          this.findKeyPairById(record.conversationId)
        ),
        reactions: record.reactions
          ? record.reactions.map((reaction) => {
              return {
                ...reaction,
                content: Crypto.decryptAESorFail(
                  reaction.content,
                  this.findKeyPairById(record.conversationId)
                ),
              }
            })
          : null,
        createdAt: new Date(record.createdAt),
        updatedAt: record.updatedAt ? new Date(record.updatedAt) : null,
        deletedAt: record.deletedAt ? new Date(record.deletedAt) : null,
      }

      _message.messageRoot = record.messageRoot
        ? {
            ...record.messageRoot,
            content: Crypto.decryptAESorFail(
              record.messageRoot.content,
              this.findKeyPairById(record.conversationId)
            ),
            reactions: record.messageRoot.reactions
              ? record.messageRoot.reactions.map((reaction) => {
                  return {
                    ...reaction,
                    content: Crypto.decryptAESorFail(
                      reaction.content,
                      this.findKeyPairById(record.conversationId)
                    ),
                  }
                })
              : null,
            createdAt: new Date(record.messageRoot.createdAt),
            updatedAt: record.messageRoot.updatedAt
              ? new Date(record.messageRoot.updatedAt)
              : null,
            deletedAt: record.messageRoot.deletedAt
              ? new Date(record.messageRoot.deletedAt)
              : null,
          }
        : null

      this._emit("messageCreatedLDB", _message)
    }

    this._hookMessageUpdatingFn = (modifications, primaryKey, record) => {
      const _message = {
        ...record,
        content: Crypto.decryptAESorFail(
          record.content,
          this.findKeyPairById(record.conversationId)
        ),
        reactions: record.reactions
          ? record.reactions.map((reaction) => {
              return {
                ...reaction,
                content: Crypto.decryptAESorFail(
                  reaction.content,
                  this.findKeyPairById(record.conversationId)
                ),
              }
            })
          : null,
        createdAt: new Date(record.createdAt),
        updatedAt: record.updatedAt ? new Date(record.updatedAt) : null,
        deletedAt: record.deletedAt ? new Date(record.deletedAt) : null,
      }

      _message.messageRoot = record.messageRoot
        ? {
            ...record.messageRoot,
            content: Crypto.decryptAESorFail(
              record.messageRoot.content,
              this.findKeyPairById(record.conversationId)
            ),
            reactions: record.messageRoot.reactions
              ? record.messageRoot.reactions.map((reaction) => {
                  return {
                    ...reaction,
                    content: Crypto.decryptAESorFail(
                      reaction.content,
                      this.findKeyPairById(record.conversationId)
                    ),
                  }
                })
              : null,
            createdAt: new Date(record.messageRoot.createdAt),
            updatedAt: record.messageRoot.updatedAt
              ? new Date(record.messageRoot.updatedAt)
              : null,
            deletedAt: record.messageRoot.deletedAt
              ? new Date(record.messageRoot.deletedAt)
              : null,
          }
        : null

      this._emit("messageUpdatedLDB", _message)
    }

    this._hookConversationCreatingFn = (primaryKey, record) => {
      const _conversation = {
        ...record,
        name: Crypto.decryptAESorFail(
          record.name,
          this.findKeyPairById(record.id)
        ),
        description: Crypto.decryptAESorFail(
          record.description,
          this.findKeyPairById(record.id)
        ),
        imageURL: Crypto.decryptAESorFail(
          record.imageURL,
          this.findKeyPairById(record.id)
        ),
        bannerImageURL: Crypto.decryptAESorFail(
          record.bannerImageURL,
          this.findKeyPairById(record.id)
        ),
      }

      this._emit("conversationCreatedLDB", _conversation)
    }

    this._hookConversationUpdatingFn = (modifications, primaryKey, record) => {
      const _conversation = {
        ...record,
        name: Crypto.decryptAESorFail(
          record.name,
          this.findKeyPairById(record.id)
        ),
        description: Crypto.decryptAESorFail(
          record.description,
          this.findKeyPairById(record.id)
        ),
        imageURL: Crypto.decryptAESorFail(
          record.imageURL,
          this.findKeyPairById(record.id)
        ),
        bannerImageURL: Crypto.decryptAESorFail(
          record.bannerImageURL,
          this.findKeyPairById(record.id)
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

  private async _recoverUserConversations(
    type: ActiveUserConversationType
  ): Promise<Maybe<Array<Conversation> | "_401_">> {
    try {
      let AUCfirstSet = await this.listAllActiveUserConversationIds(
        {
          type,
        },
        true
      )

      if (AUCfirstSet instanceof QIError) {
        const error = this._handleUnauthorizedQIError(AUCfirstSet)
        if (error) throw "_401_"

        throw new Error(JSON.stringify(AUCfirstSet))
      }

      let { nextToken, items } = AUCfirstSet
      let activeIds = [...items]

      while (nextToken) {
        const set = await this.listAllActiveUserConversationIds(
          {
            type,
            nextToken,
          },
          true
        )

        if (set instanceof QIError) {
          const error = this._handleUnauthorizedQIError(set)
          if (error) throw "_401_"

          break
        }

        const { nextToken: token, items } = set

        activeIds = [...activeIds, ...items]

        if (token) nextToken = token
        else break
      }

      let conversationfirstSet = await this.listConversationsByIds(
        activeIds,
        true
      )

      if (conversationfirstSet instanceof QIError) {
        const error = this._handleUnauthorizedQIError(conversationfirstSet)
        if (error) throw "_401_"

        throw new Error(JSON.stringify(conversationfirstSet))
      }

      let { unprocessedKeys, items: conversations } = conversationfirstSet
      let conversationsItems = [...conversations]

      while (unprocessedKeys) {
        const set = await this.listConversationsByIds(unprocessedKeys, true)

        if (set instanceof QIError) {
          const error = this._handleUnauthorizedQIError(set)
          if (error) throw "_401_"

          break
        }

        const { unprocessedKeys: ids, items } = set

        conversationsItems = [...conversationsItems, ...items]

        if (ids) unprocessedKeys = ids
        else break
      }

      const currentUser = await this.getCurrentUser(true)

      if (currentUser instanceof QIError) {
        const error = this._handleUnauthorizedQIError(currentUser)
        if (error) throw "_401_"

        throw new Error(JSON.stringify(currentUser))
      }

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

      if (conversationsItems.length > 0) {
        const conversationsStored = await new Promise<LocalDBConversation[]>(
          (resolve, reject) => {
            Serpens.addAction(() => {
              this._storage.conversation
                .where("indexDid")
                .equals(Auth.account!.did)
                .toArray()
                .then(resolve)
                .catch(reject)
            })
          }
        )

        await this._storage.insertBulkSafe(
          "conversation",
          conversationsItems.map((conversation: Conversation) => {
            let conversationStored = conversationsStored.find((item) => {
              return item.id === conversation.id
            })

            let isConversationArchived = false

            if (currentUser.archivedConversations) {
              const index = currentUser.archivedConversations.findIndex(
                (id) => {
                  return id === conversation.id
                }
              )

              if (index > -1) isConversationArchived = true
            }

            return Converter.fromConversationToLocalDBConversation(
              conversation,
              Auth.account!.did,
              Auth.account!.organizationId,
              isConversationArchived,
              conversationStored ? conversationStored.lastMessageAuthor : null,
              conversationStored ? conversationStored.lastMessageText : null,
              conversationStored ? conversationStored.lastMessageRead : null
            )
          })
        )
      }

      return conversationsItems
    } catch (error) {
      if (typeof error === "string" && error === "_401_") {
        await Auth.fetchAuthToken()
        this.silentReset()

        return "_401_"
      }

      console.log("[ERROR]: recoverUserConversations() -> ", error)
    }

    return null
  }

  private async _recoverKeysFromConversations(): Promise<boolean | "_401_"> {
    try {
      let firstConversationMemberSet =
        await this.listConversationMemberByUserId(undefined, true)

      if (firstConversationMemberSet instanceof QIError) {
        const error = this._handleUnauthorizedQIError(
          firstConversationMemberSet
        )
        if (error) throw "_401_"

        throw new Error(JSON.stringify(firstConversationMemberSet))
      }

      let { nextToken, items } = firstConversationMemberSet
      let conversationMemberItems = [...items]

      while (nextToken) {
        const set = await this.listConversationMemberByUserId(nextToken, true)

        if (set instanceof QIError) {
          const error = this._handleUnauthorizedQIError(set)
          if (error) throw "_401_"

          break
        }

        const { nextToken: token, items } = set

        conversationMemberItems = [...conversationMemberItems, ...items]

        if (token) nextToken = token
        else break
      }

      console.log("user key pair ", this.getUserKeyPair())

      //now, from the private key of the user, we will decrypt all the information about the conversation member.
      //we will store these decrypted pairs public keys/private keys into the _keyPairsMap array.
      const _keyPairsMap: Array<KeyPairItem> = []
      let isError: boolean = false

      for (const conversationMember of conversationMemberItems) {
        const { encryptedConversationIVKey, encryptedConversationAESKey } =
          conversationMember
        const iv = Crypto.decryptStringOrFail(
          this.getUserKeyPair()!.privateKey,
          encryptedConversationIVKey
        )
        const AES = Crypto.decryptStringOrFail(
          this.getUserKeyPair()!.privateKey,
          encryptedConversationAESKey
        )

        _keyPairsMap.push({
          id: conversationMember.conversationId,
          AES,
          iv,
        })
      }

      if (isError)
        throw new Error("Failed to convert a public/private key pair.")

      this.setKeyPairMap(_keyPairsMap)

      console.log("key pair map is ", _keyPairsMap)

      return true
    } catch (error) {
      console.log("[ERROR]: recoverKeysFromConversations() -> ", error)
      if (typeof error === "string" && error === "_401_") {
        await Auth.fetchAuthToken()
        this.silentReset()

        return "_401_"
      }
    }

    return false
  }

  private async _recoverMessagesFromConversations(
    conversations: Array<Conversation>
  ): Promise<boolean | "_401_"> {
    try {
      for (const conversation of conversations) {
        const { id, lastMessageSentAt } = conversation

        //if the conversation hasn't any message it's useless to download the messages.
        if (!lastMessageSentAt) continue

        //let's see if the last message sent into the conversation is more recent than the last message stored in the database

        //messages important handling
        const messagesImportantFirstSet =
          await this.listMessagesImportantByUserConversationId(
            {
              conversationId: id,
            },
            true
          )

        if (messagesImportantFirstSet instanceof QIError) {
          const error = this._handleUnauthorizedQIError(
            messagesImportantFirstSet
          )
          if (error) throw "_401_"

          throw new Error(JSON.stringify(messagesImportantFirstSet))
        }

        let { nextToken, items } = messagesImportantFirstSet
        let messagesImportant = [...items]

        while (nextToken) {
          const set = await this.listMessagesImportantByUserConversationId(
            {
              conversationId: id,
              nextToken,
            },
            true
          )

          if (set instanceof QIError) {
            const error = this._handleUnauthorizedQIError(set)
            if (error) throw "_401_"

            break
          }

          const { nextToken: token, items } = set

          messagesImportant = [...messagesImportant, ...items]

          if (token) nextToken = token
          else break
        }

        //messages handling
        let lastMessageStored = await new Promise<LocalDBMessage | undefined>(
          (resolve, reject) => {
            Serpens.addAction(() => {
              this._storage.message
                .where("conversationId")
                .equals(id)
                .filter(
                  (element) =>
                    element.origin === "USER" &&
                    element.userDid === Auth.account!.did
                )
                .toArray()
                .then((array) => {
                  resolve(
                    array.length > 0
                      ? array.sort((a, b) => {
                          return (
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                          )
                        })[0]
                      : undefined
                  )
                })
                .catch(reject)
            })
          }
        )

        const canDownloadMessages =
          !lastMessageStored ||
          (lastMessageStored &&
            new Date(lastMessageStored.createdAt!).getTime() <
              new Date(lastMessageSentAt).getTime())

        //the check of history message is already done on backend side

        if (canDownloadMessages) {
          const messagesFirstSet = await this.listMessagesByConversationId(
            {
              id,
            },
            true
          )

          if (messagesFirstSet instanceof QIError) {
            const error = this._handleUnauthorizedQIError(messagesFirstSet)
            if (error) throw "_401_"

            throw new Error(JSON.stringify(messagesFirstSet))
          }

          let { nextToken, items } = messagesFirstSet
          let messages = [...items]

          while (nextToken) {
            const set = await this.listMessagesByConversationId(
              {
                id,
                nextToken,
              },
              true
            )

            if (set instanceof QIError) {
              const error = this._handleUnauthorizedQIError(set)
              if (error) throw "_401_"

              break
            }

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
            await new Promise((resolve, reject) => {
              Serpens.addAction(() =>
                this._storage.conversation
                  .where("[id+userDid]")
                  .equals([messages[0].conversationId, Auth.account!.did])
                  .modify((conversation: LocalDBConversation) => {
                    const lastMessage = messages[0] //messages are ordered from the most recent to the less recent message, so the first item is the last message sent
                    conversation.lastMessageAuthor = lastMessage.user.username
                    conversation.lastMessageText = lastMessage.content
                    conversation.lastMessageSentAt = lastMessage.createdAt
                  })
                  .then(resolve)
                  .catch(reject)
              )
            })

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

        //now we check if we have some messages that were edited (adding/removing a reaction or editing the text)
        //first, we get the last sync date from the current user

        let user = (await this._storage.get("user", "[did+organizationId]", [
          Auth.account!.did,
          Auth.account!.organizationId,
        ])) as LocalDBUser

        //we do a check only if lastSyncAt is !== null
        if (user.lastSyncAt) {
          const { lastSyncAt } = user

          const messagesUpdatedFirstSet = await this.listMessagesUpdated(
            {
              conversationId: id,
              greaterThanDate: lastSyncAt,
            },
            true
          )

          if (messagesUpdatedFirstSet instanceof QIError) {
            const error = this._handleUnauthorizedQIError(
              messagesUpdatedFirstSet
            )
            if (error) throw "_401_"

            throw new Error(JSON.stringify(messagesUpdatedFirstSet))
          }

          let { nextToken, items } = messagesUpdatedFirstSet
          let messagesUpdated = [...items]

          while (nextToken) {
            const set = await this.listMessagesUpdated(
              {
                conversationId: id,
                greaterThanDate: lastSyncAt,
                nextToken,
              },
              true
            )

            if (set instanceof QIError) {
              const error = this._handleUnauthorizedQIError(set)
              if (error) throw "_401_"

              break
            }

            const { nextToken: token, items } = set

            messagesUpdated = [...messagesUpdated, ...items]

            if (token) nextToken = token
            else break
          }

          //let's update the messages in the local table
          if (messagesUpdated.length > 0) {
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

            //it's possible this array is empty when the chat history settings has value 'false'
            this._storage.insertBulkSafe(
              "message",
              messagesUpdated.map((message) => {
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
          }
        }
      }

      return true
    } catch (error) {
      console.log("[ERROR]: recoverMessagesFromConversations() -> ", error)
      if (typeof error === "string" && error === "_401_") {
        await Auth.fetchAuthToken()
        this.silentReset()

        return "_401_"
      }
    }

    return false
  }

  private async _sync(syncingCounter: number): Promise<void> {
    this._isSyncing = true
    this._emit("syncing", this._syncingCounter)

    //first operation. Recover the list of the conversations in which the user is a member.
    //unactive conversations are the convos in which the user left the group or has been ejected
    const activeConversations = await this._recoverUserConversations(
      ActiveUserConversationType.Active
    )
    const unactiveConversations = await this._recoverUserConversations(
      ActiveUserConversationType.Canceled
    )

    console.log("activeConversations", activeConversations)
    console.log("unactiveConversations", unactiveConversations)

    if (!activeConversations || !unactiveConversations) {
      this._emit("syncError", { error: `error during conversation syncing.` })
      this.unsync()
      return
    }

    //_sync(..) is called internally by silentReset()
    if (activeConversations === "_401_" || unactiveConversations === "_401_")
      return

    console.log(
      "after check if (!activeConversations || !unactiveConversations)"
    )

    //second operation. Recover the list of conversation member objects, in order to retrieve the public & private keys of all conversations.
    const keysRecovered = await this._recoverKeysFromConversations()
    console.log("keysRecovered", keysRecovered)

    if (typeof keysRecovered === "boolean" && !keysRecovered) {
      this._emit("syncError", {
        error: `error during recovering of the keys from conversations.`,
      })
      this.unsync()
      return
    }

    //_sync(..) is called internally by silentReset()
    if (keysRecovered === "_401_") return

    console.log("after check if (!keysRecovered)")

    //third operation. For each conversation, we need to download the messages if the lastMessageSentAt of the conversation is != null
    //and the date of the last message stored in the local db is less recent than the lastMessageSentAt date.
    const messagesRecovered = await this._recoverMessagesFromConversations([
      ...activeConversations,
      ...unactiveConversations,
    ])

    console.log("messagesRecovered", messagesRecovered)

    if (!messagesRecovered) {
      this._emit("syncError", {
        error: `error during recovering of the messages from conversations.`,
      })
      this.unsync()
      return
    }

    //_sync(..) is called internally by silentReset()
    if (messagesRecovered === "_401_") return

    console.log("after check if (!messagesRecovered)")

    //let's setup an array of the conversations in the first sync cycle.
    //This will allow to map the conversations in every single cycle that comes after the first one.
    if (syncingCounter === 0) {
      console.log("inside check if (syncingCounter === 0)")

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

      console.log(
        "inside check if (syncingCounter === 0) this._conversationsMap is ",
        this._conversationsMap
      )
    } else {
      //this situation happens when a subscription between onAddMembersToConversation, onEjectMember, onLeaveConversation doesn't fire properly.
      //here we can check if there are differences between the previous sync and the current one
      //theoretically since we have subscriptions, we should be in a situation in which we don't have any difference
      //since the subscription role is to keep the array _conversationsMap synchronized.
      //But it can be also the opposite. So inside this block we will check if there are conversations that need
      //subscriptions to be added or the opposite (so subscriptions that need to be removed)

      console.log(
        "inside else syncingCounter is > 0, now its value is ",
        this._syncingCounter
      )

      const conversations = [...activeConversations, ...unactiveConversations]
      const flatConversationMap = this._conversationsMap.map(
        (item) => item.conversation
      )

      const { added, removed } = findAddedAndRemovedConversation(
        flatConversationMap,
        conversations
      )

      console.log("added and removed are ", added, removed)

      if (added.length > 0)
        for (const conversation of added) {
          this._conversationsMap.push({
            type: "ACTIVE",
            conversationId: conversation.id,
            conversation,
          })
          this._addSubscriptionsSync(conversation.id)
          this._emit("conversationNewMembers", {
            conversation,
            conversationId: conversation.id,
          })
        }

      if (removed.length > 0)
        for (const conversation of removed) {
          this._conversationsMap = this._conversationsMap.filter((item) => {
            return item.conversationId !== conversation.id
          })
          this._removeSubscriptionsSync(conversation.id)
        }
    }

    //we add the internal events for the local database
    if (!this._hookMessageCreated) this._onMessageCreatedLDB()
    if (!this._hookMessageUpdated) this._onMessageUpdatedLDB()
    if (!this._hookMessageDeleted) this._onMessageDeletedLDB()
    if (!this._hookConversationCreated) this._onConversationCreatedLDB()
    if (!this._hookConversationUpdated) this._onConversationUpdatedLDB()

    this._isSyncing = false

    console.log(
      "ready to emit sync or syncUpdate, this._syncingCounter is ",
      this._syncingCounter
    )

    syncingCounter === 0
      ? this._emit("sync")
      : this._emit("syncUpdate", this._syncingCounter)

    this._syncingCounter++

    console.log("let's update the last sync date...")

    let user = (await this._storage.get("user", "[did+organizationId]", [
      Auth.account!.did,
      Auth.account!.organizationId,
    ])) as LocalDBUser

    await new Promise((resolve, reject) => {
      Serpens.addAction(() => {
        this._storage.user
          .update(user, {
            lastSyncAt: new Date(),
          })
          .then(resolve)
          .catch(reject)
      })
    })

    console.log("calling another _sync()")

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
    let operation: Maybe<"add_new_members" | "create_conversation"> = null

    if (response instanceof QIError) {
      this._emit("addMembersToConversationSubscriptionError", response)
      return
    }

    try {
      const keypairMap = this.getKeyPairMap()
      const alreadyMember = keypairMap.find((item) => {
        return item.id === response.conversationId
      })

      operation = alreadyMember ? "add_new_members" : "create_conversation"

      if (!alreadyMember) {
        //we need to update the _keyPairsMap with the new keys of the new conversation
        const { conversationId, items } = response
        const item = items.find(
          (item) => item.userId === Auth.account?.dynamoDBUserID
        )
        const { encryptedConversationIVKey, encryptedConversationAESKey } =
          item!
        //these pair is encrypted with the public key of the current user, so we need to decrypt them
        const conversationIVKey = Crypto.decryptStringOrFail(
          this._userKeyPair!.privateKey,
          encryptedConversationIVKey
        )
        const conversationAESKey = Crypto.decryptStringOrFail(
          this._userKeyPair!.privateKey,
          encryptedConversationAESKey
        )
        //this add a key pair only if it doesn't exist. if it does, then internally skip this operation
        this.addKeyPairItem({
          id: conversationId,
          AES: conversationAESKey,
          iv: conversationIVKey,
        })

        //we update also the _unsubscribeSyncSet array using the uuid emitted by the subscription
        //in order to map the unsubscribe function with the conversation
        const index = this._unsubscribeSyncSet.findIndex((item) => {
          return item.uuid === uuid
        })

        if (index > -1)
          this._unsubscribeSyncSet[index].conversationId = conversationId

        //now we store the conversation in the local database
        const responseConversation = await this.listConversationsByIds(
          [conversationId],
          true
        )

        if (responseConversation instanceof QIError) {
          const error = this._handleUnauthorizedQIError(responseConversation)
          if (error) {
            await Auth.fetchAuthToken()
            this.silentReset()

            return
          }

          this._emit("syncError", {
            error: responseConversation,
          })
          this.unsync()

          throw responseConversation
        }

        const { items: itemsConversation } = responseConversation
        const conversation = itemsConversation[0]

        //we need to check if the conversation was already inside the _conversationsMap array. If it exists then we update the array
        //otherwise we add a new element
        const indexMap = this._conversationsMap.findIndex(
          (conversationItem) => {
            return conversationItem.conversationId === conversation.id
          }
        )

        //this is an additional check that it's used to avoid to add the subscriptions to a conversation that potentially
        //could have them already. This could happen potentially if the _sync() is executed
        //immediately before the _onAddMembersToConversationSync() in the javascript event loop
        const subscriptionConversationCheck = {
          conversationWasActive: false,
        }

        if (indexMap > -1) {
          //it should never be ACTIVE at this point, but this is for more safety
          if (this._conversationsMap[indexMap].type === "ACTIVE")
            subscriptionConversationCheck.conversationWasActive = true

          this._conversationsMap[indexMap].type = "ACTIVE"
          this._conversationsMap[indexMap].conversation = conversation
        } else
          this._conversationsMap.push({
            conversation,
            conversationId: conversation.id,
            type: "ACTIVE",
          })

        const currentUser = await this.getCurrentUser(true)

        if (currentUser instanceof QIError) {
          const error = this._handleUnauthorizedQIError(currentUser)
          if (error) {
            await Auth.fetchAuthToken()
            this.silentReset()

            return
          }

          this._emit("syncError", {
            error: currentUser,
          })
          this.unsync()

          throw currentUser
        }

        //stores/update the conversations into the local db
        let isConversationArchived = false

        if (currentUser.archivedConversations) {
          const index = currentUser.archivedConversations.findIndex((id) => {
            return id === conversationId
          })

          if (index > -1) isConversationArchived = true
        }

        await this._storage.insertBulkSafe("conversation", [
          Converter.fromConversationToLocalDBConversation(
            conversation,
            Auth.account!.did,
            Auth.account!.organizationId,
            isConversationArchived,
            null,
            null,
            null
          ),
        ])

        //let's remove all the subscriptions previously added
        if (subscriptionConversationCheck.conversationWasActive) {
          this._removeSubscriptionsSync(conversationId)
          this._conversationsMap[index].type = "ACTIVE" //assign again "type" the value "ACTIVE" because _removeSubscriptionsSync() turns type to "CANCELED"
        }

        //let's add the subscriptions in order to keep synchronized this conversation
        this._addSubscriptionsSync(conversationId)

        this._emit("conversationCreated", {
          conversation,
          conversationId,
        })
      } else {
        //the user is already a member of this conversation, we need to emit a different event
        const { conversationId, items } = response
        const responseConversation = await this.listConversationsByIds(
          [conversationId],
          true
        )

        if (responseConversation instanceof QIError) {
          const error = this._handleUnauthorizedQIError(responseConversation)
          if (error) {
            await Auth.fetchAuthToken()
            this.silentReset()

            return
          }

          this._emit("syncError", {
            error: responseConversation,
          })
          this.unsync()

          throw responseConversation
        }

        const { items: itemsConversation } = responseConversation
        const conversation = itemsConversation[0]

        this._emit("conversationNewMembers", {
          items,
          conversation,
          conversationId,
        })
      }
    } catch (error) {
      console.log("[ERROR]: _onAddMembersToConversationSync() -> ", error)
      if (operation === "create_conversation")
        this._emit("conversationCreatedError", error)
      else if (operation === "add_new_members")
        this._emit("conversationNewMembersError", error)
      else this._emit("addMembersToConversationSubscriptionError", error)
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
          message: {
            ...response,
            reactions: response.reactions
              ? response.reactions.map((r) => {
                  return {
                    userId: r.userId,
                    createdAt: r.createdAt,
                    content: Crypto.decryptAESorFail(
                      r.content,
                      this.findKeyPairById(response.conversationId)
                    ),
                  }
                })
              : null,
          },
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
          message: {
            ...response,
            reactions: response.reactions
              ? response.reactions.map((r) => {
                  return {
                    userId: r.userId,
                    createdAt: r.createdAt,
                    content: Crypto.decryptAESorFail(
                      r.content,
                      this.findKeyPairById(response.conversationId)
                    ),
                  }
                })
              : null,
          },
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

        const conversation = await this._storage.get(
          "conversation",
          "[id+userDid]",
          [response.conversationId, Auth.account!.did]
        )
        await new Promise((resolve, reject) => {
          Serpens.addAction(() => {
            this._storage.conversation
              .update(conversation, {
                deletedAt: null,
                lastMessageAuthor: response.user.username,
                lastMessageSentAt: new Date(),
                lastMessageText: response.content,
              })
              .then(resolve)
              .catch(reject)
          })
        })

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
            conversationStored ? conversationStored.isArchived : false,
            conversationStored ? conversationStored.lastMessageAuthor : null,
            conversationStored ? conversationStored.lastMessageText : null,
            conversationStored ? conversationStored.lastMessageRead : null
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
      this._emit("conversationUnmutedError", error)
    }
  }

  private _onRequestTradeSync(
    response: QIError | ConversationTradingPool,
    source: OperationResult<
      {
        onRequestTrade: ConversationTradingPoolGraphQL
      },
      SubscriptionOnRequestTradeArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    try {
      if (!(response instanceof QIError)) {
        this._emit("requestTrade", {
          conversationTradingPool: response,
        })
      }
    } catch (error) {
      console.log("[ERROR]: _onRequestTradeSync() -> ", error)
      this._emit("requestTradeError", error)
    }
  }

  private _onUpdateRequestTradeSync(
    response: QIError | ConversationTradingPool,
    source: OperationResult<
      {
        onUpdateRequestTrade: ConversationTradingPoolGraphQL
      },
      SubscriptionOnUpdateRequestTradeArgs & {
        jwt: string
      }
    >,
    uuid: string
  ) {
    try {
      if (!(response instanceof QIError)) {
        this._emit("updateRequestTrade", {
          conversationTradingPool: response,
        })
      }
    } catch (error) {
      console.log("[ERROR]: _onUpdateRequestTradeSync() -> ", error)
      this._emit("updateRequestTradeError", error)
    }
  }

  private _addSubscriptionsSync(conversationId: string) {
    //add reaction(conversationId)
    const onAddReaction = this.onAddReaction(
      conversationId,
      (
        response: QIError | Message,
        source: OperationResult<
          { onAddReaction: MessageGraphQL },
          SubscriptionOnAddReactionArgs & { jwt: string }
        >,
        uuid: string
      ) => {
        this._onAddReactionSync(response, source, uuid)
      },
      true
    )

    if (!(onAddReaction instanceof QIError)) {
      const { unsubscribe, uuid } = onAddReaction
      this._unsubscribeSyncSet.push({
        type: "onAddReaction",
        unsubscribe,
        uuid,
        conversationId,
      })
    } else {
      const error = this._handleUnauthorizedQIError(onAddReaction)
      if (error) {
        ;(async () => {
          await Auth.fetchAuthToken()
          this.silentReset()
        })()

        return
      }

      this._emit("syncError", {
        error: onAddReaction,
      })
      this.unsync()

      return
    }

    //remove reaction(conversationId)
    const onRemoveReaction = this.onRemoveReaction(
      conversationId,
      (
        response: QIError | Message,
        source: OperationResult<
          { onRemoveReaction: MessageGraphQL },
          SubscriptionOnRemoveReactionArgs & { jwt: string }
        >,
        uuid: string
      ) => {
        this._onRemoveReactionSync(response, source, uuid)
      },
      true
    )

    if (!(onRemoveReaction instanceof QIError)) {
      const { unsubscribe, uuid } = onRemoveReaction
      this._unsubscribeSyncSet.push({
        type: "onRemoveReaction",
        unsubscribe,
        uuid,
        conversationId,
      })
    } else {
      const error = this._handleUnauthorizedQIError(onRemoveReaction)
      if (error) {
        ;(async () => {
          await Auth.fetchAuthToken()
          this.silentReset()
        })()

        return
      }

      this._emit("syncError", {
        error: onRemoveReaction,
      })
      this.unsync()

      return
    }

    //send message(conversationId)
    const onSendMessage = this.onSendMessage(
      conversationId,
      (
        response: Message | QIError,
        source: OperationResult<
          { onSendMessage: MessageGraphQL },
          SubscriptionOnSendMessageArgs & { jwt: string }
        >,
        uuid: string
      ) => {
        this._onSendMessageSync(response, source, uuid)
      },
      true
    )

    if (!(onSendMessage instanceof QIError)) {
      const { unsubscribe, uuid } = onSendMessage
      this._unsubscribeSyncSet.push({
        type: "onSendMessage",
        unsubscribe,
        uuid,
        conversationId,
      })
    } else {
      const error = this._handleUnauthorizedQIError(onSendMessage)
      if (error) {
        ;(async () => {
          await Auth.fetchAuthToken()
          this.silentReset()
        })()

        return
      }

      this._emit("syncError", {
        error: onSendMessage,
      })
      this.unsync()

      return
    }

    //edit message(conversationId)
    const onEditMessage = this.onEditMessage(
      conversationId,
      (
        response: QIError | Message,
        source: OperationResult<
          { onEditMessage: MessageGraphQL },
          SubscriptionOnEditMessageArgs & { jwt: string }
        >,
        uuid: string
      ) => {
        this._onEditMessageSync(response, source, uuid)
      },
      true
    )

    if (!(onEditMessage instanceof QIError)) {
      const { unsubscribe, uuid } = onEditMessage
      this._unsubscribeSyncSet.push({
        type: "onEditMessage",
        unsubscribe,
        uuid,
        conversationId,
      })
    } else {
      const error = this._handleUnauthorizedQIError(onEditMessage)
      if (error) {
        ;(async () => {
          await Auth.fetchAuthToken()
          this.silentReset()
        })()

        return
      }

      this._emit("syncError", {
        error: onEditMessage,
      })
      this.unsync()

      return
    }

    //delete message(conversationId)
    const onDeleteMessage = this.onDeleteMessage(
      conversationId,
      (
        response: QIError | Message,
        source: OperationResult<
          { onDeleteMessage: MessageGraphQL },
          SubscriptionOnDeleteMessageArgs & { jwt: string }
        >,
        uuid: string
      ) => {
        this._onDeleteMessageSync(response, source, uuid)
      },

      true
    )

    if (!(onDeleteMessage instanceof QIError)) {
      const { unsubscribe, uuid } = onDeleteMessage
      this._unsubscribeSyncSet.push({
        type: "onDeleteMessage",
        unsubscribe,
        uuid,
        conversationId,
      })
    } else {
      const error = this._handleUnauthorizedQIError(onDeleteMessage)
      if (error) {
        ;(async () => {
          await Auth.fetchAuthToken()
          this.silentReset()
        })()

        return
      }

      this._emit("syncError", {
        error: onDeleteMessage,
      })
      this.unsync()

      return
    }

    //delete batch messages(conversationId)
    const onBatchDeleteMessages = this.onBatchDeleteMessages(
      conversationId,
      (
        response: QIError | { conversationId: string; messagesIds: string[] },
        source: OperationResult<
          { onBatchDeleteMessages: BatchDeleteMessagesResultGraphQL },
          SubscriptionOnBatchDeleteMessagesArgs & { jwt: string }
        >,
        uuid: string
      ) => {
        this._onBatchDeleteMessagesSync(response, source, uuid)
      },
      true
    )

    if (!(onBatchDeleteMessages instanceof QIError)) {
      const { unsubscribe, uuid } = onBatchDeleteMessages
      this._unsubscribeSyncSet.push({
        type: "onBatchDeleteMessages",
        unsubscribe,
        uuid,
        conversationId,
      })
    } else {
      const error = this._handleUnauthorizedQIError(onBatchDeleteMessages)
      if (error) {
        ;(async () => {
          await Auth.fetchAuthToken()
          this.silentReset()
        })()

        return
      }

      this._emit("syncError", {
        error: onBatchDeleteMessages,
      })
      this.unsync()

      return
    }

    //update settings group(conversationId)
    const onUpdateConversationGroup = this.onUpdateConversationGroup(
      conversationId,
      (
        response: QIError | Conversation,
        source: OperationResult<
          { onUpdateConversationGroup: ConversationGraphQL },
          SubscriptionOnUpdateConversationGroupArgs & { jwt: string }
        >,
        uuid: string
      ) => {
        this._onUpdateConversationGroupSync(response, source, uuid)
      },
      true
    )

    if (!(onUpdateConversationGroup instanceof QIError)) {
      const { unsubscribe, uuid } = onUpdateConversationGroup
      this._unsubscribeSyncSet.push({
        type: "onUpdateConversationGroup",
        unsubscribe,
        uuid,
        conversationId,
      })
    } else {
      const error = this._handleUnauthorizedQIError(onUpdateConversationGroup)
      if (error) {
        ;(async () => {
          await Auth.fetchAuthToken()
          this.silentReset()
        })()

        return
      }

      this._emit("syncError", {
        error: onUpdateConversationGroup,
      })
      this.unsync()

      return
    }

    //eject member(conversationId)
    const onEjectMember = this.onEjectMember(
      conversationId,
      (
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
      ) => {
        this._onEjectMemberSync(response, source, uuid)
      },
      true
    )

    if (!(onEjectMember instanceof QIError)) {
      const { unsubscribe, uuid } = onEjectMember
      this._unsubscribeSyncSet.push({
        type: "onEjectMember",
        unsubscribe,
        uuid,
        conversationId,
      })
    } else {
      const error = this._handleUnauthorizedQIError(onEjectMember)
      if (error) {
        ;(async () => {
          await Auth.fetchAuthToken()
          this.silentReset()
        })()

        return
      }

      this._emit("syncError", {
        error: onEjectMember,
      })
      this.unsync()

      return
    }

    //leave group/conversation(conversationId)
    const onLeaveConversation = this.onLeaveConversation(
      conversationId,
      (
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
      ) => {
        this._onLeaveConversationSync(response, source, uuid)
      },
      true
    )

    if (!(onLeaveConversation instanceof QIError)) {
      const { unsubscribe, uuid } = onLeaveConversation
      this._unsubscribeSyncSet.push({
        type: "onLeaveConversation",
        unsubscribe,
        uuid,
        conversationId,
      })
    } else {
      const error = this._handleUnauthorizedQIError(onLeaveConversation)
      if (error) {
        ;(async () => {
          await Auth.fetchAuthToken()
          this.silentReset()
        })()

        return
      }

      this._emit("syncError", {
        error: onLeaveConversation,
      })
      this.unsync()

      return
    }

    //mute conversation(conversationId)
    const onMuteConversation = this.onMuteConversation(
      conversationId,
      (
        response: QIError | Conversation,
        source: OperationResult<
          { onMuteConversation: ConversationGraphQL },
          SubscriptionOnMuteConversationArgs & { jwt: string }
        >,
        uuid: string
      ) => {
        this._onMuteConversationSync(response, source, uuid)
      },
      true
    )

    if (!(onMuteConversation instanceof QIError)) {
      const { unsubscribe, uuid } = onMuteConversation
      this._unsubscribeSyncSet.push({
        type: "onMuteConversation",
        unsubscribe,
        uuid,
        conversationId,
      })
    } else {
      const error = this._handleUnauthorizedQIError(onMuteConversation)
      if (error) {
        ;(async () => {
          await Auth.fetchAuthToken()
          this.silentReset()
        })()

        return
      }

      this._emit("syncError", {
        error: onMuteConversation,
      })
      this.unsync()

      return
    }

    //unmute conversation(conversationId)
    const onUnmuteConversation = this.onUnmuteConversation(
      conversationId,
      (
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
      ) => {
        this._onUnmuteConversationSync(response, source, uuid)
      },
      true
    )

    if (!(onUnmuteConversation instanceof QIError)) {
      const { unsubscribe, uuid } = onUnmuteConversation
      this._unsubscribeSyncSet.push({
        type: "onUnmuteConversation",
        unsubscribe,
        uuid,
        conversationId,
      })
    } else {
      const error = this._handleUnauthorizedQIError(onUnmuteConversation)
      if (error) {
        ;(async () => {
          await Auth.fetchAuthToken()
          this.silentReset()
        })()

        return
      }

      this._emit("syncError", {
        error: onUnmuteConversation,
      })
      this.unsync()

      return
    }

    const onRequestTrade = this.onRequestTrade(
      conversationId,
      (
        response: QIError | ConversationTradingPool,
        source: OperationResult<
          {
            onRequestTrade: ConversationTradingPoolGraphQL
          },
          SubscriptionOnRequestTradeArgs & {
            jwt: string
          }
        >,
        uuid: string
      ) => {
        this._onRequestTradeSync(response, source, uuid)
      },
      true
    )

    if (!(onRequestTrade instanceof QIError)) {
      const { unsubscribe, uuid } = onRequestTrade
      this._unsubscribeSyncSet.push({
        type: "onRequestTrade",
        unsubscribe,
        uuid,
        conversationId,
      })
    } else {
      const error = this._handleUnauthorizedQIError(onRequestTrade)
      if (error) {
        ;(async () => {
          await Auth.fetchAuthToken()
          this.silentReset()
        })()

        return
      }

      this._emit("syncError", {
        error: onRequestTrade,
      })
      this.unsync()

      return
    }

    const onUpdateRequestTrade = this.onUpdateRequestTrade(
      conversationId,
      (
        response: QIError | ConversationTradingPool,
        source: OperationResult<
          {
            onUpdateRequestTrade: ConversationTradingPoolGraphQL
          },
          SubscriptionOnUpdateRequestTradeArgs & {
            jwt: string
          }
        >,
        uuid: string
      ) => {
        this._onUpdateRequestTradeSync(response, source, uuid)
      },
      true
    )

    if (!(onUpdateRequestTrade instanceof QIError)) {
      const { unsubscribe, uuid } = onRequestTrade
      this._unsubscribeSyncSet.push({
        type: "onUpdateRequestTrade",
        unsubscribe,
        uuid,
        conversationId,
      })
    } else {
      const error = this._handleUnauthorizedQIError(onUpdateRequestTrade)
      if (error) {
        ;(async () => {
          await Auth.fetchAuthToken()
          this.silentReset()
        })()

        return
      }

      this._emit("syncError", {
        error: onRequestTrade,
      })
      this.unsync()

      return
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
        console.log(
          "[ERROR]: unsubscribe() failed for conversation item -> ",
          item.uuid,
          item.type,
          conversationId
        )
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
      this._hookMessageCreated = true
      this._storage.message.hook("creating", this._hookMessageCreatingFn!)
    } catch (error) {
      console.log(error)
      this._hookMessageCreated = false
      this._emit("messageCreatedLDBError", error)
    }
  }

  private _onMessageDeletedLDB() {
    try {
      this._hookMessageDeleted = true
      this._storage.message.hook("deleting", (primaryKey, record) => {
        const _message = {
          ...record,
          content: Crypto.decryptAESorFail(
            record.content,
            this.findKeyPairById(record.conversationId)
          ),
          reactions: record.reactions
            ? record.reactions.map((reaction) => {
                return {
                  ...reaction,
                  content: Crypto.decryptAESorFail(
                    reaction.content,
                    this.findKeyPairById(record.conversationId)
                  ),
                }
              })
            : null,
          createdAt: new Date(record.createdAt),
          updatedAt: record.updatedAt ? new Date(record.updatedAt) : null,
          deletedAt: record.deletedAt ? new Date(record.deletedAt) : null,
        }

        _message.messageRoot = record.messageRoot
          ? {
              ...record.messageRoot,
              content: Crypto.decryptAESorFail(
                record.messageRoot.content,
                this.findKeyPairById(record.conversationId)
              ),
              reactions: record.messageRoot.reactions
                ? record.messageRoot.reactions.map((reaction) => {
                    return {
                      ...reaction,
                      content: Crypto.decryptAESorFail(
                        reaction.content,
                        this.findKeyPairById(record.conversationId)
                      ),
                    }
                  })
                : null,
              createdAt: new Date(record.messageRoot.createdAt),
              updatedAt: record.messageRoot.updatedAt
                ? new Date(record.messageRoot.updatedAt)
                : null,
              deletedAt: record.messageRoot.deletedAt
                ? new Date(record.messageRoot.deletedAt)
                : null,
            }
          : null

        this._emit("messageDeletedLDB", _message)
      })
    } catch (error) {
      console.log(error)
      this._hookMessageDeleted = false
      this._emit("messageDeletedLDBError", error)
    }
  }

  private _onMessageUpdatedLDB() {
    try {
      this._hookMessageUpdated = true
      this._storage.message.hook("updating", this._hookMessageUpdatingFn!)
    } catch (error) {
      console.log(error)
      this._hookMessageUpdated = false
      this._emit("messageUpdatedLDBError", error)
    }
  }

  private _onConversationCreatedLDB() {
    try {
      this._hookConversationCreated = true
      this._storage.conversation.hook(
        "creating",
        this._hookConversationCreatingFn!
      )
    } catch (error) {
      console.log(error)
      this._hookConversationCreated = false
      this._emit("conversationCreatedLDBError", error)
    }
  }

  private _onConversationUpdatedLDB() {
    try {
      this._hookConversationUpdated = true
      this._storage.conversation.hook(
        "updating",
        this._hookConversationUpdatingFn!
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
  async blockUser(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError>
  async blockUser(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError>
  async blockUser(
    id?: unknown,
    overrideHandlingUnauthorizedQIError?: unknown
  ): Promise<User | QIError> {
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
    args: AddMembersToConversationArgs,
    overrideHandlingUnauthorizedQIError?: boolean
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
          encryptedConversationAESKey: item.encryptedConversationAESKey,
          encryptedConversationIVKey: item.encryptedConversationIVKey,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        })
      }),
    }

    return listConversationMembers
  }

  async pinMessage(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError>
  async pinMessage(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError>
  async pinMessage(
    id?: unknown,
    overrideHandlingUnauthorizedQIError?: unknown
  ): Promise<Message | QIError> {
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
            user: {
              id: response.messageRoot.user!.id,
              username: response.messageRoot.user!.username
                ? response.messageRoot.user!.username
                : "",
              avatarURL: response.messageRoot.user!.avatarUrl
                ? response.messageRoot.user!.avatarUrl
                : "",
              imageSettings: response.messageRoot.user!.imageSettings
                ? JSON.parse(response.messageRoot.user!.imageSettings)
                : null,
            },
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
            chatParent: this,
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
      user: {
        id: response.user!.id,
        username: response.user!.username ? response.user!.username : "",
        avatarURL: response.user!.avatarUrl ? response.user!.avatarUrl : "",
        imageSettings: response.user!.imageSettings
          ? JSON.parse(response.user!.imageSettings)
          : null,
      },
      order: response.order,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
      chatParent: this,
    })
  }

  async addReactionToMessage(
    args: AddReactionToMessageArgs,
    overrideHandlingUnauthorizedQIError?: boolean
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
          reactionContent: Crypto.encryptAESorFail(
            args.reaction,
            this.findKeyPairById(args.conversationId)
          ),
          conversationId: args.conversationId,
        },
      }
    )

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
            user: {
              id: response.messageRoot.user!.id,
              username: response.messageRoot.user!.username
                ? response.messageRoot.user!.username
                : "",
              avatarURL: response.messageRoot.user!.avatarUrl
                ? response.messageRoot.user!.avatarUrl
                : "",
              imageSettings: response.messageRoot.user!.imageSettings
                ? JSON.parse(response.messageRoot.user!.imageSettings)
                : null,
            },
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
            chatParent: this,
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
      user: {
        id: response.user!.id,
        username: response.user!.username ? response.user!.username : "",
        avatarURL: response.user!.avatarUrl ? response.user!.avatarUrl : "",
        imageSettings: response.user!.imageSettings
          ? JSON.parse(response.user!.imageSettings)
          : null,
      },
      order: response.order,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
      chatParent: this,
    })
  }

  async addReportToConversation(
    args: AddReportToConversationArgs,
    overrideHandlingUnauthorizedQIError?: boolean
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
    args: AddReportToMessageArgs,
    overrideHandlingUnauthorizedQIError?: boolean
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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

  async archiveConversation(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError>
  async archiveConversation(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError>
  async archiveConversation(
    id?: unknown,
    overrideHandlingUnauthorizedQIError?: unknown
  ): Promise<User | QIError> {
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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

  async archiveConversations(
    ids: Array<string>,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError> {
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
    args: CreateConversationGroupArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    { keypairItem: KeyPairItem; conversation: Conversation } | QIError
  > {
    const AES = Crypto.generateBase64Key_AES256()
    const iv = Crypto.generateBase64IV_128Bit()

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
          name: Crypto.encryptAES_CBC(args.name, AES, iv),
          description: Crypto.encryptAES_CBC(args.description, AES, iv),
          bannerImageURL: Crypto.encryptAES_CBC(args.bannerImageURL, AES, iv),
          imageURL: Crypto.encryptAES_CBC(args.imageURL, AES, iv),
          imageSettings: JSON.stringify(args.imageSettings),
        },
      }
    )

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

    const conversationGroup: {
      keypairItem: KeyPairItem
      conversation: Conversation
    } = {
      keypairItem: {
        id: response.id,
        AES,
        iv,
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
        chatParent: this,
      }),
    }

    return conversationGroup
  }

  async createConversationOneToOne(
    args: CreateConversationOneToOneArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    QIError | { keypairItem: KeyPairItem; conversation: Conversation }
  > {
    const AES = Crypto.generateBase64Key_AES256()
    const iv = Crypto.generateBase64IV_128Bit()

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
          name: Crypto.encryptAES_CBC(args.name, AES, iv),
          description: Crypto.encryptAES_CBC(args.description, AES, iv),
          bannerImageURL: Crypto.encryptAES_CBC(args.bannerImageURL, AES, iv),
          imageURL: Crypto.encryptAES_CBC(args.imageURL, AES, iv),
          imageSettings: JSON.stringify(args.imageSettings),
        },
      }
    )

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

    const conversationItem: {
      keypairItem: KeyPairItem
      conversation: Conversation
    } = {
      keypairItem: {
        id: response.id,
        AES,
        iv,
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
        chatParent: this,
      }),
    }

    return conversationItem
  }

  async deleteBatchConversationMessages(
    args: DeleteBatchConversationMessagesArgs,
    overrideHandlingUnauthorizedQIError?: boolean
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

    return {
      conversationId: response.conversationId,
      messagesIds: response.messagesIds,
    }
  }

  async deleteMessage(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError> {
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
            user: {
              id: response.messageRoot.user!.id,
              username: response.messageRoot.user!.username
                ? response.messageRoot.user!.username
                : "",
              avatarURL: response.messageRoot.user!.avatarUrl
                ? response.messageRoot.user!.avatarUrl
                : "",
              imageSettings: response.messageRoot.user!.imageSettings
                ? JSON.parse(response.messageRoot.user!.imageSettings)
                : null,
            },
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
            chatParent: this,
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
      user: {
        id: response.user!.id,
        username: response.user!.username ? response.user!.username : "",
        avatarURL: response.user!.avatarUrl ? response.user!.avatarUrl : "",
        imageSettings: response.user!.imageSettings
          ? JSON.parse(response.user!.imageSettings)
          : null,
      },
      order: response.order,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
      chatParent: this,
    })
  }

  async deleteRequestTrade(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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

  async editMessage(
    args: EditMessageArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | Message> {
    const response = await this._mutation<
      MutationEditMessageArgs,
      { editMessage: MessageGraphQL },
      MessageGraphQL
    >("editMessage", editMessage, "_mutation() -> editMessage()", {
      input: {
        messageId: args.id,
        content: Crypto.encryptAESorFail(
          args.content,
          this.findKeyPairById(args.conversationId)
        ),
        conversationId: args.conversationId,
      },
    })

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
            user: {
              id: response.messageRoot.user!.id,
              username: response.messageRoot.user!.username
                ? response.messageRoot.user!.username
                : "",
              avatarURL: response.messageRoot.user!.avatarUrl
                ? response.messageRoot.user!.avatarUrl
                : "",
              imageSettings: response.messageRoot.user!.imageSettings
                ? JSON.parse(response.messageRoot.user!.imageSettings)
                : null,
            },
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
            chatParent: this,
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
      user: {
        id: response.user!.id,
        username: response.user!.username ? response.user!.username : "",
        avatarURL: response.user!.avatarUrl ? response.user!.avatarUrl : "",
        imageSettings: response.user!.imageSettings
          ? JSON.parse(response.user!.imageSettings)
          : null,
      },
      order: response.order,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
      chatParent: this,
    })
  }

  async ejectMember(
    args: EjectMemberArgs,
    overrideHandlingUnauthorizedQIError?: boolean
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
        chatParent: this,
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
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    { conversationId: string; items: Array<{ id: string }> } | QIError
  > {
    const response = await this._mutation<
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

    const listConversations: {
      conversationId: string
      items: Array<{ id: string }>
    } = {
      conversationId: response.conversationId,
      items: response.items,
    }

    return listConversations
  }

  async leaveConversation(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    | { conversationId: string; conversation: Conversation; memberOut: User }
    | QIError
  >
  async leaveConversation(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    | { conversationId: string; conversation: Conversation; memberOut: User }
    | QIError
  >
  async leaveConversation(
    id?: unknown,
    overrideHandlingUnauthorizedQIError?: unknown
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
        chatParent: this,
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
    args: MuteConversationArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | Conversation>
  async muteConversation(
    args: unknown,
    overrideHandlingUnauthorizedQIError?: unknown
  ): Promise<Conversation | QIError> {
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
      chatParent: this,
    })
  }

  async unlockUser(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | User>
  async unlockUser(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | User>
  async unlockUser(
    id?: unknown,
    overrideHandlingUnauthorizedQIError?: unknown
  ): Promise<QIError | User> {
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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

  async unpinMessage(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | Message>
  async unpinMessage(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | Message>
  async unpinMessage(
    id?: unknown,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | Message> {
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
            user: {
              id: response.messageRoot.user!.id,
              username: response.messageRoot.user!.username
                ? response.messageRoot.user!.username
                : "",
              avatarURL: response.messageRoot.user!.avatarUrl
                ? response.messageRoot.user!.avatarUrl
                : "",
              imageSettings: response.messageRoot.user!.imageSettings
                ? JSON.parse(response.messageRoot.user!.imageSettings)
                : null,
            },
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
            chatParent: this,
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
      user: {
        id: response.user!.id,
        username: response.user!.username ? response.user!.username : "",
        avatarURL: response.user!.avatarUrl ? response.user!.avatarUrl : "",
        imageSettings: response.user!.imageSettings
          ? JSON.parse(response.user!.imageSettings)
          : null,
      },
      order: response.order,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
      chatParent: this,
    })
  }

  async removeReactionFromMessage(
    args: RemoveReactionFromMessageArgs,
    overrideHandlingUnauthorizedQIError?: boolean
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
          reactionContent: Crypto.encryptAESorFail(
            args.reaction,
            this.findKeyPairById(args.conversationId)
          ),
          messageId: args.messageId,
          conversationId: args.conversationId,
        },
      }
    )

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
            user: {
              id: response.messageRoot.user!.id,
              username: response.messageRoot.user!.username
                ? response.messageRoot.user!.username
                : "",
              avatarURL: response.messageRoot.user!.avatarUrl
                ? response.messageRoot.user!.avatarUrl
                : "",
              imageSettings: response.messageRoot.user!.imageSettings
                ? JSON.parse(response.messageRoot.user!.imageSettings)
                : null,
            },
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
            chatParent: this,
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
      user: {
        id: response.user!.id,
        username: response.user!.username ? response.user!.username : "",
        avatarURL: response.user!.avatarUrl ? response.user!.avatarUrl : "",
        imageSettings: response.user!.imageSettings
          ? JSON.parse(response.user!.imageSettings)
          : null,
      },
      order: response.order,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
      chatParent: this,
    })
  }

  async requestTrade(
    args: RequestTradeArgs,
    overrideHandlingUnauthorizedQIError?: boolean
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
    args: UpdateRequestTradeArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | ConversationTradingPool> {
    const response = await this._mutation<
      MutationUpdateRequestTradeArgs,
      { updateRequestTrade: ConversationTradingPoolGraphQL },
      ConversationTradingPoolGraphQL
    >(
      "updateRequestTrade",
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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

  async sendMessage(
    args: SendMessageArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | Message> {
    const response = await this._mutation<
      MutationSendMessageArgs,
      { sendMessage: MessageGraphQL },
      MessageGraphQL
    >("sendMessage", sendMessage, "_mutation() -> sendMessage()", {
      input: {
        content: Crypto.encryptAESorFail(
          this._getMessageContent(args.content, (args as SendMessageArgs).type),
          this.findKeyPairById((args as SendMessageArgs).conversationId)
        ),
        conversationId: (args as SendMessageArgs).conversationId,
        type: (args as SendMessageArgs).type,
        messageRootId: (args as SendMessageArgs).messageRootId,
      },
    })

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
            user: {
              id: response.messageRoot.user!.id,
              username: response.messageRoot.user!.username
                ? response.messageRoot.user!.username
                : "",
              avatarURL: response.messageRoot.user!.avatarUrl
                ? response.messageRoot.user!.avatarUrl
                : "",
              imageSettings: response.messageRoot.user!.imageSettings
                ? JSON.parse(response.messageRoot.user!.imageSettings)
                : null,
            },
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
            chatParent: this,
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
      user: {
        id: response.user!.id,
        username: response.user!.username ? response.user!.username : "",
        avatarURL: response.user!.avatarUrl ? response.user!.avatarUrl : "",
        imageSettings: response.user!.imageSettings
          ? JSON.parse(response.user!.imageSettings)
          : null,
      },
      order: response.order,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
      chatParent: this,
    })
  }

  async unarchiveConversation(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | User>
  async unarchiveConversation(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | User>
  async unarchiveConversation(
    id?: unknown,
    overrideHandlingUnauthorizedQIError?: unknown
  ): Promise<QIError | User> {
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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

  async unarchiveConversations(
    ids: Array<string>,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError> {
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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

  async unmuteConversation(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | Conversation>
  async unmuteConversation(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | Conversation>
  async unmuteConversation(
    id?: unknown,
    overrideHandlingUnauthorizedQIError?: unknown
  ): Promise<QIError | Conversation> {
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
      chatParent: this,
    })
  }

  async updateConversationGroup(
    args: UpdateConversationGroupInputArgs,
    overrideHandlingUnauthorizedQIError?: boolean
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
          description: Crypto.encryptAESorFail(
            args.description,
            this.findKeyPairById(args.conversationId)
          ),
          imageURL: Crypto.encryptAESorFail(
            new URL(args.imageURL).toString(),
            this.findKeyPairById(args.conversationId)
          ),
          bannerImageURL: Crypto.encryptAESorFail(
            new URL(args.bannerImageURL).toString(),
            this.findKeyPairById(args.conversationId)
          ),
          name: Crypto.encryptAESorFail(
            args.name,
            this.findKeyPairById(args.conversationId)
          ),
          settings: JSON.stringify(args.settings),
        },
      }
    )

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
      chatParent: this,
    })
  }

  async updateUser(
    args: UpdateUserArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | User> {
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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

  async markImportantMessage(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError>
  async markImportantMessage(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError>
  async markImportantMessage(
    id?: unknown,
    overrideHandlingUnauthorizedQIError?: unknown
  ): Promise<Message | QIError> {
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
            user: {
              id: response.messageRoot.user!.id,
              username: response.messageRoot.user!.username
                ? response.messageRoot.user!.username
                : "",
              avatarURL: response.messageRoot.user!.avatarUrl
                ? response.messageRoot.user!.avatarUrl
                : "",
              imageSettings: response.messageRoot.user!.imageSettings
                ? JSON.parse(response.messageRoot.user!.imageSettings)
                : null,
            },
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
            chatParent: this,
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
      user: {
        id: response.user!.id,
        username: response.user!.username ? response.user!.username : "",
        avatarURL: response.user!.avatarUrl ? response.user!.avatarUrl : "",
        imageSettings: response.user!.imageSettings
          ? JSON.parse(response.user!.imageSettings)
          : null,
      },
      order: response.order,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
      chatParent: this,
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

  async unmarkImportantMessage(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | Message>
  async unmarkImportantMessage(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | Message>
  async unmarkImportantMessage(
    id?: unknown,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | Message> {
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
            user: {
              id: response.messageRoot.user!.id,
              username: response.messageRoot.user!.username
                ? response.messageRoot.user!.username
                : "",
              avatarURL: response.messageRoot.user!.avatarUrl
                ? response.messageRoot.user!.avatarUrl
                : "",
              imageSettings: response.messageRoot.user!.imageSettings
                ? JSON.parse(response.messageRoot.user!.imageSettings)
                : null,
            },
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
            chatParent: this,
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
      user: {
        id: response.user!.id,
        username: response.user!.username ? response.user!.username : "",
        avatarURL: response.user!.avatarUrl ? response.user!.avatarUrl : "",
        imageSettings: response.user!.imageSettings
          ? JSON.parse(response.user!.imageSettings)
          : null,
      },
      order: response.order,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
      chatParent: this,
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

  async pinConversation(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Conversation | QIError>
  async pinConversation(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Conversation | QIError>
  async pinConversation(
    id?: unknown,
    overrideHandlingUnauthorizedQIError?: unknown
  ): Promise<Conversation | QIError> {
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
      chatParent: this,
    })
  }

  async unpinConversation(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | boolean>
  async unpinConversation(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | boolean>
  async unpinConversation(
    id?: unknown,
    overrideHandlingUnauthorizedQIError?: unknown
  ): Promise<QIError | boolean> {
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

    return true
  }

  /*
    Query
  */

  async listAllActiveUserConversationIds(
    args: ListAllActiveUserConversationIdsArgs,
    overrideHandlingUnauthorizedQIError?: boolean
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

    const activeUserConversationIds = {
      items: response.items,
      nextToken: response.nextToken ? response.nextToken : undefined,
    }

    return activeUserConversationIds
  }

  /**
   * Retrieves the conversation members from the conversation by its ID.
   * @returns A Promise that resolves to an array of ConversationMember objects or a QIError object.
   */
  async listConversationMembersByConversationId(
    conversationId: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<ConversationMember[] | QIError> {
    const response = await this._query<
      QueryGetConversationByIdArgs,
      {
        getConversationById: ConversationGraphQL
      },
      ConversationGraphQL
    >(
      "getConversationById",
      getMembersFromConversationById,
      "_query() -> listConversationMembersByConversationId()",
      {
        conversationId,
      }
    )

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

    const listConversationMembers: Array<ConversationMember> =
      // TODO why response.members is of type array and not { items: Array }?
      (response.members as any).items.map((item) => {
        return new ConversationMember({
          ...this._parentConfig!,
          id: item!.id,
          conversationId: item!.conversationId,
          userId: item!.userId,
          type: item!.type,
          encryptedConversationAESKey: item!.encryptedConversationAESKey,
          encryptedConversationIVKey: item!.encryptedConversationIVKey,
          createdAt: item!.createdAt,
          updatedAt: item!.updatedAt,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        })
      })

    return listConversationMembers
  }

  async listConversationMemberByUserId(
    nextToken?: string | undefined,
    overrideHandlingUnauthorizedQIError?: boolean
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
          encryptedConversationIVKey: item.encryptedConversationIVKey,
          encryptedConversationAESKey: item.encryptedConversationAESKey,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
        })
      }),
    }

    return listConversationMember
  }

  async listUsersByIds(
    ids: string[],
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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

  async listConversationsByIds(
    ids: string[],
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

    const listConversations: {
      unprocessedKeys?: Maybe<string[]>
      items: Array<Conversation>
    } = {
      unprocessedKeys: response ? response.unprocessedKeys : null,
      items: response
        ? response.items.map((item) => {
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
              chatParent: this,
            })
          })
        : [],
    }

    return listConversations
  }

  async listMessagesByConversationId(
    args: ListMessagesByConversationIdArgs,
    overrideHandlingUnauthorizedQIError?: boolean
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
                user: {
                  id: item.messageRoot.user!.id,
                  username: item.messageRoot.user!.username
                    ? item.messageRoot.user!.username
                    : "",
                  avatarURL: item.messageRoot.user!.avatarUrl
                    ? item.messageRoot.user!.avatarUrl
                    : "",
                  imageSettings: item.messageRoot.user!.imageSettings
                    ? JSON.parse(item.messageRoot.user!.imageSettings)
                    : null,
                },
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
                chatParent: this,
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
          user: {
            id: item.user!.id,
            username: item.user!.username ? item.user!.username : "",
            avatarURL: item.user!.avatarUrl ? item.user!.avatarUrl : "",
            imageSettings: item.user!.imageSettings
              ? JSON.parse(item.user!.imageSettings)
              : null,
          },
          order: item.order,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt ? item.updatedAt : null,
          deletedAt: item.deletedAt ? item.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
          chatParent: this,
        })
      }),
    }

    return listMessages
  }

  async listMessagesByRangeOrder(
    args: ListMessagesByRangeOrderArgs,
    overrideHandlingUnauthorizedQIError?: boolean
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
                user: {
                  id: item.messageRoot.user!.id,
                  username: item.messageRoot.user!.username
                    ? item.messageRoot.user!.username
                    : "",
                  avatarURL: item.messageRoot.user!.avatarUrl
                    ? item.messageRoot.user!.avatarUrl
                    : "",
                  imageSettings: item.messageRoot.user!.imageSettings
                    ? JSON.parse(item.messageRoot.user!.imageSettings)
                    : null,
                },
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
                chatParent: this,
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
          user: {
            id: item.user!.id,
            username: item.user!.username ? item.user!.username : "",
            avatarURL: item.user!.avatarUrl ? item.user!.avatarUrl : "",
            imageSettings: item.user!.imageSettings
              ? JSON.parse(item.user!.imageSettings)
              : null,
          },
          order: item.order,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt ? item.updatedAt : null,
          deletedAt: item.deletedAt ? item.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
          chatParent: this,
        })
      }),
    }

    return listMessages
  }

  async listMessagesUpdated(
    args: ListMessagesUpdatedArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    QIError | { items: Message[]; nextToken?: Maybe<string> | undefined }
  > {
    const response = await this._query<
      QueryListMessagesUpdatedArgs,
      { listMessagesByRangeOrder: ListMessagesUpdatedGraphQL },
      ListMessagesUpdatedGraphQL
    >(
      "listMessagesUpdated",
      listMessagesUpdated,
      "_query() -> listMessagesUpdated()",
      {
        input: {
          conversationId: args.conversationId,
          greaterThanDate: args.greaterThanDate,
          nextToken: args.nextToken,
        },
      }
    )

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
                user: {
                  id: item.messageRoot.user!.id,
                  username: item.messageRoot.user!.username
                    ? item.messageRoot.user!.username
                    : "",
                  avatarURL: item.messageRoot.user!.avatarUrl
                    ? item.messageRoot.user!.avatarUrl
                    : "",
                  imageSettings: item.messageRoot.user!.imageSettings
                    ? JSON.parse(item.messageRoot.user!.imageSettings)
                    : null,
                },
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
                chatParent: this,
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
          user: {
            id: item.user!.id,
            username: item.user!.username ? item.user!.username : "",
            avatarURL: item.user!.avatarUrl ? item.user!.avatarUrl : "",
            imageSettings: item.user!.imageSettings
              ? JSON.parse(item.user!.imageSettings)
              : null,
          },
          order: item.order,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt ? item.updatedAt : null,
          deletedAt: item.deletedAt ? item.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
          chatParent: this,
        })
      }),
    }

    return listMessages
  }

  async listMessagesImportantByUserConversationId(
    args: ListMessagesImportantByUserConversationIdArgs,
    overrideHandlingUnauthorizedQIError?: boolean
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
                  user: {
                    id: item.message!.messageRoot.user!.id,
                    username: item.message!.messageRoot.user!.username
                      ? item.message!.messageRoot.user!.username
                      : "",
                    avatarURL: item.message!.messageRoot.user!.avatarUrl
                      ? item.message!.messageRoot.user!.avatarUrl
                      : "",
                    imageSettings: item.message!.messageRoot.user!.imageSettings
                      ? JSON.parse(
                          item.message!.messageRoot.user!.imageSettings
                        )
                      : null,
                  },
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
                  chatParent: this,
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
            user: {
              id: item.user!.id,
              username: item.user!.username ? item.user!.username : "",
              avatarURL: item.user!.avatarUrl ? item.user!.avatarUrl : "",
              imageSettings: item.user!.imageSettings
                ? JSON.parse(item.user!.imageSettings)
                : null,
            },
            order: item.message!.order,
            createdAt: item.message!.createdAt,
            updatedAt: item.message!.updatedAt ? item.message!.updatedAt : null,
            deletedAt: item.message!.deletedAt ? item.message!.deletedAt : null,
            client: this._client!,
            realtimeClient: this._realtimeClient!,
            chatParent: this,
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
    nextToken?: string | undefined,
    overrideHandlingUnauthorizedQIError?: boolean
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
            chatParent: this,
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
    args: FindUsersByUsernameOrAddressArgs,
    overrideHandlingUnauthorizedQIError?: boolean
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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

  async getCurrentUser(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | User> {
    const response = await this._query<
      null,
      {
        getCurrentUser: UserGraphQL
      },
      UserGraphQL
    >("getCurrentUser", getCurrentUser, "_query() -> getCurrentUser()", null)

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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

  async getConversationById(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Conversation | QIError> {
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
      chatParent: this,
    })
  }

  async listTradesByConversationId(
    args: ListTradesByConversationIdArgs,
    overrideHandlingUnauthorizedQIError?: boolean
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
    conversationTradingPoolId: string,
    overrideHandlingUnauthorizedQIError?: boolean
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

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

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
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): SubscriptionGarbage | QIError {
    const key = "onSendMessage"
    const metasubscription = this._subscription<
      SubscriptionOnSendMessageArgs,
      { onSendMessage: MessageGraphQL }
    >(onSendMessage, key, { conversationId })

    if (metasubscription instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(metasubscription)
        if (error) {
          ;(async () => {
            await Auth.fetchAuthToken()
          })()
        }
      }

      return metasubscription
    }

    const { subscribe, uuid } = metasubscription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onSendMessage: MessageGraphQL },
        MessageGraphQL
      >("onSendMessage", result)

      if (r instanceof QIError) {
        if (!overrideHandlingUnauthorizedQIError) {
          const error = this._handleUnauthorizedQIError(r)
          if (error) {
            ;(async () => {
              await Auth.fetchAuthToken()
            })()
          }
        }

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
                user: {
                  id: r.messageRoot.user!.id,
                  username: r.messageRoot.user!.username
                    ? r.messageRoot.user!.username
                    : "",
                  avatarURL: r.messageRoot.user!.avatarUrl
                    ? r.messageRoot.user!.avatarUrl
                    : "",
                  imageSettings: r.messageRoot.user!.imageSettings
                    ? JSON.parse(r.messageRoot.user!.imageSettings)
                    : null,
                },
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
                chatParent: this,
              })
            : null,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "TRADE_PROPOSAL" | "RENT")
            : null,
          user: {
            id: r.user!.id,
            username: r.user!.username ? r.user!.username : "",
            avatarURL: r.user!.avatarUrl ? r.user!.avatarUrl : "",
            imageSettings: r.user!.imageSettings
              ? JSON.parse(r.user!.imageSettings)
              : null,
          },
          order: r.order,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
          chatParent: this,
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
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage {
    const key = "onEditMessage"
    const metasubscription = this._subscription<
      SubscriptionOnEditMessageArgs,
      { onEditMessage: MessageGraphQL }
    >(onEditMessage, key, { conversationId })

    if (metasubscription instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(metasubscription)
        if (error) {
          ;(async () => {
            await Auth.fetchAuthToken()
          })()
        }
      }

      return metasubscription
    }

    const { subscribe, uuid } = metasubscription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onEditMessage: MessageGraphQL },
        MessageGraphQL
      >("onEditMessage", result)

      if (r instanceof QIError) {
        if (!overrideHandlingUnauthorizedQIError) {
          const error = this._handleUnauthorizedQIError(r)
          if (error) {
            ;(async () => {
              await Auth.fetchAuthToken()
            })()
          }
        }

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
                user: {
                  id: r.messageRoot.user!.id,
                  username: r.messageRoot.user!.username
                    ? r.messageRoot.user!.username
                    : "",
                  avatarURL: r.user!.avatarUrl ? r.user!.avatarUrl : "",
                  imageSettings: r.user!.imageSettings
                    ? JSON.parse(r.user!.imageSettings)
                    : null,
                },
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
                chatParent: this,
              })
            : null,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "TRADE_PROPOSAL" | "RENT")
            : null,
          user: {
            id: r.user!.id,
            username: r.user!.username ? r.user!.username : "",
            avatarURL: r.user!.avatarUrl ? r.user!.avatarUrl : "",
            imageSettings: r.user!.imageSettings
              ? JSON.parse(r.user!.imageSettings)
              : null,
          },
          order: r.order,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
          chatParent: this,
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
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage {
    const key = "onBatchDeleteMessages"
    const metasubscription = this._subscription<
      SubscriptionOnBatchDeleteMessagesArgs,
      { onBatchDeleteMessages: BatchDeleteMessagesResultGraphQL }
    >(onBatchDeleteMessages, key, { conversationId })

    if (metasubscription instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(metasubscription)
        if (error) {
          ;(async () => {
            await Auth.fetchAuthToken()
          })()
        }
      }

      return metasubscription
    }

    const { subscribe, uuid } = metasubscription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onBatchDeleteMessages: BatchDeleteMessagesResultGraphQL },
        BatchDeleteMessagesResultGraphQL
      >("onBatchDeleteMessages", result)

      if (r instanceof QIError) {
        if (!overrideHandlingUnauthorizedQIError) {
          const error = this._handleUnauthorizedQIError(r)
          if (error) {
            ;(async () => {
              await Auth.fetchAuthToken()
            })()
          }
        }

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
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage {
    const key = "onDeleteMessage"
    const metasubscription = this._subscription<
      SubscriptionOnDeleteMessageArgs,
      { onDeleteMessage: MessageGraphQL }
    >(onDeleteMessage, key, { conversationId })

    if (metasubscription instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(metasubscription)
        if (error) {
          ;(async () => {
            await Auth.fetchAuthToken()
          })()
        }
      }

      return metasubscription
    }

    const { subscribe, uuid } = metasubscription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onDeleteMessage: MessageGraphQL },
        MessageGraphQL
      >("onDeleteMessage", result)

      if (r instanceof QIError) {
        if (!overrideHandlingUnauthorizedQIError) {
          const error = this._handleUnauthorizedQIError(r)
          if (error) {
            ;(async () => {
              await Auth.fetchAuthToken()
            })()
          }
        }

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
                user: {
                  id: r.messageRoot.user!.id,
                  username: r.messageRoot.user!.username
                    ? r.messageRoot.user!.username
                    : "",
                  avatarURL: r.user!.avatarUrl ? r.user!.avatarUrl : "",
                  imageSettings: r.user!.imageSettings
                    ? JSON.parse(r.user!.imageSettings)
                    : null,
                },
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
                chatParent: this,
              })
            : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "TRADE_PROPOSAL" | "RENT")
            : null,
          user: {
            id: r.user!.id,
            username: r.user!.username ? r.user!.username : "",
            avatarURL: r.user!.avatarUrl ? r.user!.avatarUrl : "",
            imageSettings: r.user!.imageSettings
              ? JSON.parse(r.user!.imageSettings)
              : null,
          },
          order: r.order,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
          chatParent: this,
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
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage {
    const key = "onAddReaction"
    const metasubscription = this._subscription<
      SubscriptionOnAddReactionArgs,
      { onAddReaction: MessageGraphQL }
    >(onAddReaction, key, { conversationId })

    if (metasubscription instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(metasubscription)
        if (error) {
          ;(async () => {
            await Auth.fetchAuthToken()
          })()
        }
      }

      return metasubscription
    }

    const { subscribe, uuid } = metasubscription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onAddReaction: MessageGraphQL },
        MessageGraphQL
      >("onAddReaction", result)

      if (r instanceof QIError) {
        if (!overrideHandlingUnauthorizedQIError) {
          const error = this._handleUnauthorizedQIError(r)
          if (error) {
            ;(async () => {
              await Auth.fetchAuthToken()
            })()
          }
        }

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
                user: {
                  id: r.messageRoot.user!.id,
                  username: r.messageRoot.user!.username
                    ? r.messageRoot.user!.username
                    : "",
                  avatarURL: r.user!.avatarUrl ? r.user!.avatarUrl : "",
                  imageSettings: r.user!.imageSettings
                    ? JSON.parse(r.user!.imageSettings)
                    : null,
                },
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
                chatParent: this,
              })
            : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "TRADE_PROPOSAL" | "RENT")
            : null,
          user: {
            id: r.user!.id,
            username: r.user!.username ? r.user!.username : "",
            avatarURL: r.user!.avatarUrl ? r.user!.avatarUrl : "",
            imageSettings: r.user!.imageSettings
              ? JSON.parse(r.user!.imageSettings)
              : null,
          },
          order: r.order,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
          chatParent: this,
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
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage {
    const key = "onRemoveReaction"
    const metasubscription = this._subscription<
      SubscriptionOnRemoveReactionArgs,
      { onRemoveReaction: MessageGraphQL }
    >(onRemoveReaction, key, { conversationId })

    if (metasubscription instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(metasubscription)
        if (error) {
          ;(async () => {
            await Auth.fetchAuthToken()
          })()
        }
      }

      return metasubscription
    }

    const { subscribe, uuid } = metasubscription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onRemoveReaction: MessageGraphQL },
        MessageGraphQL
      >("onRemoveReaction", result)

      if (r instanceof QIError) {
        if (!overrideHandlingUnauthorizedQIError) {
          const error = this._handleUnauthorizedQIError(r)
          if (error) {
            ;(async () => {
              await Auth.fetchAuthToken()
            })()
          }
        }

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
                user: {
                  id: r.messageRoot.user!.id,
                  username: r.messageRoot.user!.username
                    ? r.messageRoot.user!.username
                    : "",
                  avatarURL: r.user!.avatarUrl ? r.user!.avatarUrl : "",
                  imageSettings: r.user!.imageSettings
                    ? JSON.parse(r.user!.imageSettings)
                    : null,
                },
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
                chatParent: this,
              })
            : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "TRADE_PROPOSAL" | "RENT")
            : null,
          user: {
            id: r.user!.id,
            username: r.user!.username ? r.user!.username : "",
            avatarURL: r.user!.avatarUrl ? r.user!.avatarUrl : "",
            imageSettings: r.user!.imageSettings
              ? JSON.parse(r.user!.imageSettings)
              : null,
          },
          order: r.order,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
          chatParent: this,
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
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage {
    const key = "onAddPinMessage"
    const metasubscription = this._subscription<
      SubscriptionOnAddPinMessageArgs,
      { onAddPinMessage: MessageGraphQL }
    >(onAddPinMessage, key, { conversationId })

    if (metasubscription instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(metasubscription)
        if (error) {
          ;(async () => {
            await Auth.fetchAuthToken()
          })()
        }
      }

      return metasubscription
    }

    const { subscribe, uuid } = metasubscription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onAddPinMessage: MessageGraphQL },
        MessageGraphQL
      >("onAddPinMessage", result)

      if (r instanceof QIError) {
        if (!overrideHandlingUnauthorizedQIError) {
          const error = this._handleUnauthorizedQIError(r)
          if (error) {
            ;(async () => {
              await Auth.fetchAuthToken()
            })()
          }
        }

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
                user: {
                  id: r.messageRoot.user!.id,
                  username: r.messageRoot.user!.username
                    ? r.messageRoot.user!.username
                    : "",
                  avatarURL: r.messageRoot.user!.avatarUrl
                    ? r.messageRoot.user!.avatarUrl
                    : "",
                  imageSettings: r.messageRoot.user!.imageSettings
                    ? JSON.parse(r.messageRoot.user!.imageSettings)
                    : null,
                },
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
                chatParent: this,
              })
            : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "TRADE_PROPOSAL" | "RENT")
            : null,
          user: {
            id: r.user!.id,
            username: r.user!.username ? r.user!.username : "",
            avatarURL: r.user!.avatarUrl ? r.user!.avatarUrl : "",
            imageSettings: r.user!.imageSettings
              ? JSON.parse(r.user!.imageSettings)
              : null,
          },
          order: r.order,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
          chatParent: this,
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
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage {
    const key = "onRemovePinMessage"
    const metasubscription = this._subscription<
      SubscriptionOnRemovePinMessageArgs,
      { onRemovePinMessage: MessageGraphQL }
    >(onRemovePinMessage, key, { conversationId })

    if (metasubscription instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(metasubscription)
        if (error) {
          ;(async () => {
            await Auth.fetchAuthToken()
          })()
        }
      }

      return metasubscription
    }

    const { subscribe, uuid } = metasubscription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onRemovePinMessage: MessageGraphQL },
        MessageGraphQL
      >("onRemovePinMessage", result)

      if (r instanceof QIError) {
        if (!overrideHandlingUnauthorizedQIError) {
          const error = this._handleUnauthorizedQIError(r)
          if (error) {
            ;(async () => {
              await Auth.fetchAuthToken()
            })()
          }
        }

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
                user: {
                  id: r.messageRoot.user!.id,
                  username: r.messageRoot.user!.username
                    ? r.messageRoot.user!.username
                    : "",
                  avatarURL: r.user!.avatarUrl ? r.user!.avatarUrl : "",
                  imageSettings: r.user!.imageSettings
                    ? JSON.parse(r.user!.imageSettings)
                    : null,
                },
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
                chatParent: this,
              })
            : null,
          messageRootId: r.messageRootId ? r.messageRootId : null,
          type: r.type
            ? (r.type as "TEXTUAL" | "ATTACHMENT" | "TRADE_PROPOSAL" | "RENT")
            : null,
          user: {
            id: r.user!.id,
            username: r.user!.username ? r.user!.username : "",
            avatarURL: r.user!.avatarUrl ? r.user!.avatarUrl : "",
            imageSettings: r.user!.imageSettings
              ? JSON.parse(r.user!.imageSettings)
              : null,
          },
          order: r.order,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt ? r.updatedAt : null,
          deletedAt: r.deletedAt ? r.deletedAt : null,
          client: this._client!,
          realtimeClient: this._realtimeClient!,
          chatParent: this,
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
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage {
    const key = "onUpdateConversationGroup"
    const metasubscription = this._subscription<
      SubscriptionOnUpdateConversationGroupArgs,
      { onUpdateConversationGroup: ConversationGraphQL }
    >(onUpdateConversationGroup, key, { id })

    if (metasubscription instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(metasubscription)
        if (error) {
          ;(async () => {
            await Auth.fetchAuthToken()
          })()
        }
      }

      return metasubscription
    }

    const { subscribe, uuid } = metasubscription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onUpdateConversationGroup: ConversationGraphQL },
        ConversationGraphQL
      >("onUpdateConversationGroup", result)

      if (r instanceof QIError) {
        if (!overrideHandlingUnauthorizedQIError) {
          const error = this._handleUnauthorizedQIError(r)
          if (error) {
            ;(async () => {
              await Auth.fetchAuthToken()
            })()
          }
        }

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
          chatParent: this,
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
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage {
    const key = "onEjectMember"
    const metasubscription = this._subscription<
      SubscriptionOnEjectMemberArgs,
      { onEjectMember: MemberOutResultGraphQL }
    >(onEjectMember, key, { conversationId })

    if (metasubscription instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(metasubscription)
        if (error) {
          ;(async () => {
            await Auth.fetchAuthToken()
          })()
        }
      }

      return metasubscription
    }

    const { subscribe, uuid } = metasubscription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onEjectMember: MemberOutResultGraphQL },
        MemberOutResultGraphQL
      >("onEjectMember", result)

      if (r instanceof QIError) {
        if (!overrideHandlingUnauthorizedQIError) {
          const error = this._handleUnauthorizedQIError(r)
          if (error) {
            ;(async () => {
              await Auth.fetchAuthToken()
            })()
          }
        }

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
            chatParent: this,
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
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage {
    const key = "onLeaveConversation"
    const metasubscription = this._subscription<
      SubscriptionOnLeaveConversationArgs,
      { onLeaveConversation: MemberOutResultGraphQL }
    >(onLeaveConversation, key, { conversationId })

    if (metasubscription instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(metasubscription)
        if (error) {
          ;(async () => {
            await Auth.fetchAuthToken()
          })()
        }
      }

      return metasubscription
    }

    const { subscribe, uuid } = metasubscription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onLeaveConversation: MemberOutResultGraphQL },
        MemberOutResultGraphQL
      >("onLeaveConversation", result)

      if (r instanceof QIError) {
        if (!overrideHandlingUnauthorizedQIError) {
          const error = this._handleUnauthorizedQIError(r)
          if (error) {
            ;(async () => {
              await Auth.fetchAuthToken()
            })()
          }
        }

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
            chatParent: this,
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
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage {
    const key = "onAddPinConversation"
    const metasubscription = this._subscription<
      SubscriptionOnAddPinConversationArgs,
      { onAddPinConversation: ConversationGraphQL }
    >(onAddPinConversation, key, { conversationId })

    if (metasubscription instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(metasubscription)
        if (error) {
          ;(async () => {
            await Auth.fetchAuthToken()
          })()
        }
      }

      return metasubscription
    }

    const { subscribe, uuid } = metasubscription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onAddPinConversation: ConversationGraphQL },
        ConversationGraphQL
      >("onAddPinConversation", result)

      if (r instanceof QIError) {
        if (!overrideHandlingUnauthorizedQIError) {
          const error = this._handleUnauthorizedQIError(r)
          if (error) {
            ;(async () => {
              await Auth.fetchAuthToken()
            })()
          }
        }

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
          chatParent: this,
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
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage {
    const key = "onRemovePinConversation"
    const metasubscription = this._subscription<
      SubscriptionOnRemovePinConversationArgs,
      { onRemovePinConversation: ConversationGraphQL }
    >(onRemovePinConversation, key, { conversationId })

    if (metasubscription instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(metasubscription)
        if (error) {
          ;(async () => {
            await Auth.fetchAuthToken()
          })()
        }
      }

      return metasubscription
    }

    const { subscribe, uuid } = metasubscription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onRemovePinConversation: ConversationGraphQL },
        ConversationGraphQL
      >("onRemovePinConversation", result)

      if (r instanceof QIError) {
        if (!overrideHandlingUnauthorizedQIError) {
          const error = this._handleUnauthorizedQIError(r)
          if (error) {
            ;(async () => {
              await Auth.fetchAuthToken()
            })()
          }
        }

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
          chatParent: this,
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
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage {
    const key = "onMuteConversation"
    const metasubscription = this._subscription<
      SubscriptionOnMuteConversationArgs,
      { onMuteConversation: ConversationGraphQL }
    >(onMuteConversation, key, { conversationId })

    if (metasubscription instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(metasubscription)
        if (error) {
          ;(async () => {
            await Auth.fetchAuthToken()
          })()
        }
      }

      return metasubscription
    }

    const { subscribe, uuid } = metasubscription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onMuteConversation: ConversationGraphQL },
        ConversationGraphQL
      >("onMuteConversation", result)

      if (r instanceof QIError) {
        if (!overrideHandlingUnauthorizedQIError) {
          const error = this._handleUnauthorizedQIError(r)
          if (error) {
            ;(async () => {
              await Auth.fetchAuthToken()
            })()
          }
        }

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
          chatParent: this,
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
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage {
    const key = "onUnmuteConversation"
    const metasubscription = this._subscription<
      SubscriptionOnUnmuteConversationArgs,
      { onUnmuteConversation: ConversationGraphQL }
    >(onUnmuteConversation, key, { conversationId })

    if (metasubscription instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(metasubscription)
        if (error) {
          ;(async () => {
            await Auth.fetchAuthToken()
          })()
        }
      }

      return metasubscription
    }

    const { subscribe, uuid } = metasubscription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onUnmuteConversation: ConversationGraphQL },
        ConversationGraphQL
      >("onUnmuteConversation", result)

      if (r instanceof QIError) {
        if (!overrideHandlingUnauthorizedQIError) {
          const error = this._handleUnauthorizedQIError(r)
          if (error) {
            ;(async () => {
              await Auth.fetchAuthToken()
            })()
          }
        }

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
          chatParent: this,
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
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage {
    const key = "onAddMembersToConversation"
    const metasubscription = this._subscription<
      null,
      { onAddMembersToConversation: ListConversationMembersGraphQL }
    >(onAddMembersToConversation, key, null)

    if (metasubscription instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(metasubscription)
        if (error) {
          ;(async () => {
            await Auth.fetchAuthToken()
          })()
        }
      }

      return metasubscription
    }

    const { subscribe, uuid } = metasubscription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onAddMembersToConversation: ListConversationMembersGraphQL },
        ListConversationMembersGraphQL
      >("onAddMembersToConversation", result)

      if (r instanceof QIError) {
        if (!overrideHandlingUnauthorizedQIError) {
          const error = this._handleUnauthorizedQIError(r)
          if (error) {
            ;(async () => {
              await Auth.fetchAuthToken()
            })()
          }
        }

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
              encryptedConversationAESKey: item.encryptedConversationAESKey,
              encryptedConversationIVKey: item.encryptedConversationIVKey,
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
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage {
    const key = "onUpdateUser"
    const metasubscription = this._subscription<
      SubscriptionOnUpdateUserArgs,
      { onUpdateUser: UserGraphQL }
    >(onUpdateUser, key, { id })

    if (metasubscription instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(metasubscription)
        if (error) {
          ;(async () => {
            await Auth.fetchAuthToken()
          })()
        }
      }

      return metasubscription
    }

    const { subscribe, uuid } = metasubscription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onUpdateUser: UserGraphQL },
        UserGraphQL
      >("onUpdateUser", result)

      if (r instanceof QIError) {
        if (!overrideHandlingUnauthorizedQIError) {
          const error = this._handleUnauthorizedQIError(r)
          if (error) {
            ;(async () => {
              await Auth.fetchAuthToken()
            })()
          }
        }

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
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage {
    const key = "onRequestTrade"
    const metasubscription = this._subscription<
      SubscriptionOnRequestTradeArgs,
      { onRequestTrade: ConversationTradingPoolGraphQL }
    >(onRequestTrade, key, { conversationId })

    if (metasubscription instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(metasubscription)
        if (error) {
          ;(async () => {
            await Auth.fetchAuthToken()
          })()
        }
      }

      return metasubscription
    }

    const { subscribe, uuid } = metasubscription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onRequestTrade: ConversationTradingPoolGraphQL },
        ConversationTradingPoolGraphQL
      >("onRequestTrade", result)

      if (r instanceof QIError) {
        if (!overrideHandlingUnauthorizedQIError) {
          const error = this._handleUnauthorizedQIError(r)
          if (error) {
            ;(async () => {
              await Auth.fetchAuthToken()
            })()
          }
        }

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
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage {
    const key = "onDeleteRequestTrade"
    const metasubscription = this._subscription<
      SubscriptionOnDeleteRequestTradeArgs,
      { onDeleteRequestTrade: ConversationTradingPoolGraphQL }
    >(onDeleteRequestTrade, key, { conversationId })

    if (metasubscription instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(metasubscription)
        if (error) {
          ;(async () => {
            await Auth.fetchAuthToken()
          })()
        }
      }

      return metasubscription
    }

    const { subscribe, uuid } = metasubscription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onDeleteRequestTrade: ConversationTradingPoolGraphQL },
        ConversationTradingPoolGraphQL
      >("onDeleteRequestTrade", result)

      if (r instanceof QIError) {
        if (!overrideHandlingUnauthorizedQIError) {
          const error = this._handleUnauthorizedQIError(r)
          if (error) {
            ;(async () => {
              await Auth.fetchAuthToken()
            })()
          }
        }

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
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage {
    const key = "onUpdateRequestTrade"
    const metasubscription = this._subscription<
      SubscriptionOnUpdateRequestTradeArgs,
      { onUpdateRequestTrade: ConversationTradingPoolGraphQL }
    >(onUpdateRequestTrade, key, { conversationId })

    if (metasubscription instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(metasubscription)
        if (error) {
          ;(async () => {
            await Auth.fetchAuthToken()
          })()
        }
      }

      return metasubscription
    }

    const { subscribe, uuid } = metasubscription
    const { unsubscribe } = subscribe((result) => {
      const r = this._handleResponse<
        typeof key,
        { onUpdateRequestTrade: ConversationTradingPoolGraphQL },
        ConversationTradingPoolGraphQL
      >("onUpdateRequestTrade", result)

      if (r instanceof QIError) {
        if (!overrideHandlingUnauthorizedQIError) {
          const error = this._handleUnauthorizedQIError(r)
          if (error) {
            ;(async () => {
              await Auth.fetchAuthToken()
            })()
          }
        }

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

  /** Chat shortcut methods */

  async createConversation(
    type: "ONE_TO_ONE" | "GROUP",
    args: CreateConversationOneToOneArgs | CreateConversationGroupArgs,
    members: Array<User>
  ): Promise<QIError | Conversation> {
    if (!Auth.account)
      throw new Error("You must be logged in order to use this method.")
    if (type === "ONE_TO_ONE" && "bannerImageX" in args.imageSettings)
      throw new Error(
        "If you specific a type 'ONE_TO_ONE' the param 'args' can not be a CreateConversationGroupArgs."
      )
    else if (type === "GROUP" && !("bannerImageX" in args.imageSettings))
      throw new Error(
        "If you specific a type 'GROUP' the param 'args' can not be a CreateConversationOneToOneArgs."
      )
    if (type === "ONE_TO_ONE" && members.length !== 2)
      throw new Error("A 'ONE_TO_ONE' conversation must have two members.")
    if (
      members.findIndex(
        (member) => member.id === Auth.account!.dynamoDBUserID
      ) === -1
    )
      throw new Error(
        "The current user must be included in the 'members' array param."
      )

    //after we have checked the arguments properly, we need to perform the following operations:
    //1) we need to get the public key of every member we want to add in the conversation
    //2) we need to create the conversation (so the relative mutation) and obtain a public/private key pair of the conversation
    //3) we need to encrypt the public/private key of the conversation with the public key of each member we want to add in the conversation
    //4) we need to call the addmemberstoconversation mutation in order to add the members

    //let's go

    //1)
    //this is an array of public keys in .pem format
    const membersPublicKeys = members.map((member) => {
      return {
        publicKeyPem: member.e2ePublicKey,
        memberId: member.id,
        encryptedConversationAESKey: null,
        encrypteConversationIVKey: null,
      }
    })

    //2)
    //we create the conversation. Please to take note of the variable this._syncRunning. We use this variable (a boolean) to override the standard behavior of the 401 handling.
    //If the sync() is running, means we need to handle the 401 in a particular way because in case of that we need to reset silently the sync
    //If instead we are not in that scenario, we can not override this behavior, and in fact the this._syncRunning value in that case will be 'false'.
    const newConversation =
      type === "ONE_TO_ONE"
        ? await this.createConversationOneToOne(
            args as CreateConversationOneToOneArgs,
            this._syncRunning
          )
        : await this.createConversationGroup(
            args as CreateConversationGroupArgs,
            this._syncRunning
          )

    //handling of QIError in case we are running sync()
    if (this._syncRunning && newConversation instanceof QIError) {
      const error = this._handleUnauthorizedQIError(newConversation)
      if (error) {
        await Auth.fetchAuthToken()
        this.silentReset()
      }

      return newConversation
    } else if (newConversation instanceof QIError) return newConversation

    //3)
    //we need to obtain the key/pair of the conversation, convert them to .pem format and encrypt these keys using the public key of every member we want to add

    const conversationKeyPairItem = newConversation.keypairItem
    const conversation = newConversation.conversation

    const membersToAdd = membersPublicKeys.map((member) => {
      const memberPublicKey = Crypto.convertPublicKeyPemToRSA(
        member.publicKeyPem!
      )

      return {
        memberId: member.memberId,
        encryptedConversationIVKey: Crypto.encryptStringOrFail(
          memberPublicKey,
          conversationKeyPairItem.iv
        ),
        encryptedConversationAESKey: Crypto.encryptStringOrFail(
          memberPublicKey,
          conversationKeyPairItem.AES
        ),
      }
    })

    //4)
    //let's add the members to the conversation

    const addMembersToConversation = await this.addMembersToConversation(
      {
        id: conversation.id,
        members: membersToAdd,
      },
      this._syncRunning
    )

    //handling of QIError in case we are running sync()
    if (this._syncRunning && addMembersToConversation instanceof QIError) {
      const error = this._handleUnauthorizedQIError(addMembersToConversation)
      if (error) {
        await Auth.fetchAuthToken()
        this.silentReset()
      }

      return addMembersToConversation
    } else if (addMembersToConversation instanceof QIError)
      return addMembersToConversation

    return conversation
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

  /** Override connect() */

  async connect(force = false): Promise<void> {
    //let's take all the information related to our keys into _userKeyPair object. These are the public and private key of the current user.
    //To do that, let's do a query on the local user table. If the _userKeyPair is already set, we skip this operation.
    if (!this._canChat)
      throw new Error(
        "The client can not connect. Tip: probably you need to complete of the user settings calling checkPIN()"
      )

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

    return super.connect(force)
  }

  disconnect() {
    super.disconnect()

    //disabling all the hooks of Dexie - IndexedDB
    if (this._hookMessageCreatingFn)
      this._storage.message
        .hook("creating")
        .unsubscribe(this._hookMessageCreatingFn)

    if (this._hookMessageUpdatingFn)
      this._storage.message
        .hook("updating")
        .unsubscribe(this._hookMessageUpdatingFn)

    if (this._hookConversationCreatingFn)
      this._storage.conversation
        .hook("creating")
        .unsubscribe(this._hookConversationCreatingFn)

    if (this._hookConversationUpdatingFn)
      this._storage.conversation
        .hook("updating")
        .unsubscribe(this._hookConversationUpdatingFn)

    this._hookMessageCreated = false
    this._hookMessageUpdated = false
    this._hookConversationCreated = false
    this._hookConversationUpdated = false

    this._emit("disconnect")
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
        "This client can not start to chat. Are you missing to pairing the keys?"
      )

    //we're running sync
    this._syncRunning = true

    //let's call the detective message scan method
    Chat._detectiveMessage.scan()

    //add member to conversation. This event is global, basically the user is always listening if
    //someone wants to add him into a conversation.
    const onAddMembersToConversation = this.onAddMembersToConversation(
      (
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
      ) => {
        this._onAddMembersToConversationSync(response, source, uuid)
      },

      true
    )

    if (!(onAddMembersToConversation instanceof QIError)) {
      const { unsubscribe, uuid } = onAddMembersToConversation
      this._unsubscribeSyncSet.push({
        type: "onAddMembersToConversation",
        unsubscribe,
        uuid,
        conversationId: "", //this value is updated inside the callback fired by the subscription
      })
    } else {
      const error = this._handleUnauthorizedQIError(onAddMembersToConversation)
      if (error) {
        await Auth.fetchAuthToken()
        this.silentReset()

        return
      }

      this._emit("syncError", {
        error: onAddMembersToConversation,
      })
      this.unsync()

      return
    }

    //let's call all the logics
    await this._sync(this._syncingCounter)

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
  unsync(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this._syncTimeout) clearTimeout(this._syncTimeout)
        this._isSyncing = false
        this._syncingCounter = 0
        for (const { conversationId } of this._conversationsMap.filter(
          (conversation) => conversation.type === "ACTIVE"
        )) {
          this._removeSubscriptionsSync(conversationId)
        }
        this._unsubscribeSyncSet = [] //subscription mapping array
        this._conversationsMap = [] //conversations array
        this._keyPairsMap = [] //conversations public/private keys
        this._userKeyPair = null //user private/public key
        this._syncRunning = false
        Chat._detectiveMessage.clear()
        resolve()
      } catch (error) {
        console.log("unsync() error:", error)
        reject(error)
      }
    })
  }

  /**
   * Check if the current Chat object is currently syncing with the backend.
   * @returns {boolean} isSyncing
   */
  isSyncing(): boolean {
    return this._isSyncing
  }

  /** read local database */

  async fetchLocalDBMessages(
    conversationId: string,
    page: number,
    numberElements: number
  ): Promise<LocalDBMessage[]> {
    if (!Auth.account) throw new Error("Account must be initialized.")
    if (page < 0 || numberElements <= 0) return []

    const offset = (page - 1) * numberElements

    try {
      const messages: LocalDBMessage[] = []
      const allMessages = await new Promise<LocalDBMessage[]>(
        (resolve, reject) => {
          Serpens.addAction(() =>
            this._storage.message
              .orderBy("createdAt")
              .offset(offset)
              .limit(numberElements)
              .filter(
                (element) =>
                  element.conversationId === conversationId &&
                  element.userDid === Auth.account!.did &&
                  typeof element.deletedAt !== "undefined" &&
                  !element.deletedAt
              )
              .toArray()
              .then(resolve)
              .catch(reject)
          )
        }
      )

      for (let message of allMessages) {
        try {
          const _message = {
            ...message,
            content: Crypto.decryptAESorFail(
              message.content,
              this.findKeyPairById(conversationId)
            ),
            reactions: message.reactions
              ? message.reactions.map((reaction) => {
                  return {
                    ...reaction,
                    content: Crypto.decryptAESorFail(
                      reaction.content,
                      this.findKeyPairById(conversationId)
                    ),
                  }
                })
              : null,
            createdAt: new Date(message.createdAt),
            updatedAt: message.updatedAt ? new Date(message.updatedAt) : null,
            deletedAt: message.deletedAt ? new Date(message.deletedAt) : null,
          }

          _message.messageRoot = message.messageRoot
            ? {
                ...message.messageRoot,
                content: Crypto.decryptAESorFail(
                  message.messageRoot.content,
                  this.findKeyPairById(conversationId)
                ),
                reactions: message.messageRoot.reactions
                  ? message.messageRoot.reactions.map((reaction) => {
                      return {
                        ...reaction,
                        content: Crypto.decryptAESorFail(
                          reaction.content,
                          this.findKeyPairById(conversationId)
                        ),
                      }
                    })
                  : null,
                createdAt: new Date(message.messageRoot.createdAt),
                updatedAt: message.messageRoot.updatedAt
                  ? new Date(message.messageRoot.updatedAt)
                  : null,
                deletedAt: message.messageRoot.deletedAt
                  ? new Date(message.messageRoot.deletedAt)
                  : null,
              }
            : null

          messages.push(_message)
        } catch (error) {
          console.log(
            "[ERROR]: fetchLocalDBMessages() item -> ",
            message,
            error
          )
          continue
        }
      }

      return messages
    } catch (error) {
      console.log("[ERROR]: fetchLocalDBMessages() -> ", error)
      return []
    }
  }

  async fetchLocalDBConversations(
    page: number,
    numberElements: number
  ): Promise<LocalDBConversation[]> {
    if (!Auth.account) throw new Error("Account must be initialized.")
    if (page < 0 || numberElements <= 0) return []

    const offset = (page - 1) * numberElements
    const conversations: LocalDBConversation[] = []

    try {
      const allConversations = await new Promise<LocalDBConversation[]>(
        (resolve, reject) => {
          Serpens.addAction(() =>
            this._storage.conversation
              .orderBy("lastMessageSentAt")
              .reverse()
              .offset(offset)
              .limit(numberElements)
              .filter(
                (element) =>
                  element.userDid === Auth.account!.did &&
                  typeof element.deletedAt !== "undefined" &&
                  !element.deletedAt
              )
              .toArray()
              .then(resolve)
              .catch(reject)
          )
        }
      )

      for (let conversation of allConversations) {
        try {
          const keyPair = this.findKeyPairById(conversation.id)
          if (!keyPair) continue

          conversations.push({
            ...conversation,
            name: Crypto.decryptAESorFail(conversation.name, keyPair),
            description: Crypto.decryptAESorFail(
              conversation.description,
              keyPair
            ),
            imageURL: Crypto.decryptAESorFail(conversation.imageURL, keyPair),
            bannerImageURL: Crypto.decryptAESorFail(
              conversation.bannerImageURL,
              keyPair
            ),
            lastMessageText: conversation.lastMessageText
              ? Crypto.decryptAESorFail(conversation.lastMessageText, keyPair)
              : null,
          })
        } catch (error) {
          console.log(
            "[ERROR]: fetchLocalDBConversations() item -> ",
            conversation,
            error
          )
          continue
        }
      }
    } catch (error) {
      console.log("[ERROR]: fetchLocalDBConversations() -> ", error)
      return []
    }

    return conversations
  }

  async searchTermsOnLocalDB(
    query: string,
    options?: Partial<{ conversationId: string }>
  ): Promise<Array<LocalDBMessage>> {
    if (!Auth.account) throw new Error("Account must be initialized.")

    try {
      const searchResult: LocalDBMessage[] = []

      await this._storage.message
        .filter((message) => {
          const isInConversation = options?.conversationId
            ? message.conversationId === options.conversationId
            : true
          const isFromUser = message.origin === "USER"
          const isTextual = message.type === "TEXTUAL"
          const isNotDeleted = !message.deletedAt

          return isInConversation && isFromUser && isTextual && isNotDeleted
        })
        .each((message) => {
          const conversaitionKeyPair = this.findKeyPairById(
            message.conversationId
          )
          if (!conversaitionKeyPair) return

          const decryptedMessage = {
            ...message,
            content: Crypto.decryptAESorFail(
              message.content,
              conversaitionKeyPair
            ),
            reactions: message.reactions
              ? message.reactions.map((reaction) => ({
                  ...reaction,
                  content: Crypto.decryptAESorFail(
                    reaction.content,
                    conversaitionKeyPair
                  ),
                }))
              : null,
            createdAt: new Date(message.createdAt),
            updatedAt: message.updatedAt ? new Date(message.updatedAt) : null,
            deletedAt: message.deletedAt ? new Date(message.deletedAt) : null,
          }

          if (!decryptedMessage.content.includes(query)) return

          decryptedMessage.messageRoot = message.messageRoot
            ? {
                ...message.messageRoot,
                content: Crypto.decryptAESorFail(
                  message.messageRoot.content,
                  conversaitionKeyPair
                ),
                reactions: message.messageRoot.reactions
                  ? message.messageRoot.reactions.map((reaction) => ({
                      ...reaction,
                      content: Crypto.decryptAESorFail(
                        reaction.content,
                        conversaitionKeyPair
                      ),
                    }))
                  : null,
                createdAt: new Date(message.messageRoot.createdAt),
                updatedAt: message.messageRoot.updatedAt
                  ? new Date(message.messageRoot.updatedAt)
                  : null,
                deletedAt: message.messageRoot.deletedAt
                  ? new Date(message.messageRoot.deletedAt)
                  : null,
              }
            : null

          searchResult.push(decryptedMessage)
        })

      return searchResult
    } catch (e) {
      throw e
    }
  }

  /** delete operations local database */

  async softDeleteConversationOnLocalDB(conversationId: string): Promise<void> {
    if (!Auth.account) throw new Error("Account must be initialized.")

    try {
      await new Promise((resolve, reject) => {
        Serpens.addAction(() =>
          this._storage.conversation
            .where("[id+userDid]")
            .equals([conversationId, Auth.account!.did])
            .modify((conversation: LocalDBConversation) => {
              conversation.deletedAt = new Date()
            })
            .then(resolve)
            .catch(reject)
        )
      })
    } catch (error) {
      throw error
    }
  }

  async truncateTableOnLocalDB(tableName: "message" | "user" | "conversation") {
    if (!Auth.account) throw new Error("Account must be initialized.")

    await this._storage.truncate(tableName)
  }

  /** update operations local database */

  async readMessage(conversationId: string): Promise<void> {
    if (!Auth.account) throw new Error("Account must be initialized.")

    try {
      await new Promise((resolve, reject) => {
        Serpens.addAction(() =>
          this._storage.conversation
            .where("[id+userDid]")
            .equals([conversationId, Auth.account!.did])
            .modify((conversation: LocalDBConversation) => {
              conversation.lastMessageRead = new Date()
            })
            .then(resolve)
            .catch(reject)
        )
      })
    } catch (error) {
      throw error
    }
  }

  /** transfer keys logic */
  async storePIN(pin: string): Promise<boolean> {
    if (pin.length !== 5) throw new Error("PIN length must be of five digits.")
    if (isNaN(Number(pin))) throw new Error("PIN must be numerical.")

    const existingUser = await new Promise<LocalDBUser | undefined>(
      (resolve, reject) => {
        Serpens.addAction(() => {
          if (!Auth.account) throw new Error("Account is not setup correctly.")

          this._storage.user
            .where("[did+organizationId]")
            .equals([Auth.account!.did, Auth.account!.organizationId])
            .first()
            .then(resolve)
            .catch(reject)
        })
      }
    )

    if (!existingUser) throw new Error("User is not setup correctly.")
    if (
      existingUser.e2eEncryptedPrivateKey === "" ||
      !existingUser.e2eEncryptedPrivateKey
    )
      throw new Error(
        "The private key of this user must be setup before to call this method."
      )

    try {
      const { response } = await this._clientEngine.fetch<ApiResponse<{}>>(
        this._clientEngine.backendUrl("/user/pin/keys/store"),
        {
          method: "POST",
          body: {
            pin,
            encryptedKey: existingUser.e2eEncryptedPrivateKey,
          },
        }
      )
      if (!response || !response.data) throw new Error("Response is invalid.")

      return true
    } catch (error: any) {
      console.error(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      return false
    }
  }

  async checkPIN(pin: string): Promise<boolean> {
    if (pin.length !== 5) throw new Error("PIN length must be of five digits.")
    if (isNaN(Number(pin))) throw new Error("PIN must be numerical.")

    const existingUser = await new Promise<LocalDBUser | undefined>(
      (resolve, reject) => {
        Serpens.addAction(() => {
          if (!Auth.account) throw new Error("Account is not setup correctly.")

          this._storage.user
            .where("[did+organizationId]")
            .equals([Auth.account!.did, Auth.account!.organizationId])
            .first()
            .then(resolve)
            .catch(reject)
        })
      }
    )

    if (!existingUser) throw new Error("User is not setup correctly.")

    try {
      const { response } = await this._clientEngine.fetch<
        ApiResponse<{ encryptedKey: string }>
      >(this._clientEngine.backendUrl("/user/pin/keys/check"), {
        method: "POST",
        body: {
          pin,
        },
      })
      if (!response || !response.data) throw new Error("Response is invalid.")

      await new Promise((resolve, reject) => {
        Serpens.addAction(() => {
          this._storage.user
            .update(existingUser, {
              e2eEncryptedPrivateKey: response.data[0].encryptedKey,
            })
            .then(resolve)
            .catch(reject)
        })
      })

      return true
    } catch (error: any) {
      console.error(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      return false
    }
  }

  async isPINStored() {
    try {
      const { response } = await this._clientEngine.fetch<
        ApiResponse<{ stored: boolean }>
      >(this._clientEngine.backendUrl("/user/is/pin/keys/stored"), {
        method: "GET",
      })
      if (!response || !response.data) throw new Error("Response is invalid.")

      return true
    } catch (error: any) {
      console.error(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      return false
    }
  }

  /** handling of "ability to chat" based on _canChat, a property that becomes false if the system notices the current user has done another signin in another device */

  clientCanChat(): boolean {
    return this._canChat === true
  }

  setCanChat(canChat: boolean) {
    this._canChat = canChat
    this._emit("canChat", { canChat })
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
          {} as ConnectedWallet,
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
