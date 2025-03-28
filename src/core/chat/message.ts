import {
  addImportantToMessage,
  addPinToMessage,
  addReactionToMessage,
  addReportToMessage,
  editMessage,
  removeImportantFromMessage,
  removePinFromMessage,
  removeReactionFromMessage,
} from "../../constants/chat/mutations"
import {
  getConversationFromMessageById,
  getUserFromMessageById,
} from "../../constants/chat/queries"
import {
  MutationAddPinToMessageArgs,
  Message as MessageGraphQL,
  MessageReport as MessageReportGraphQL,
  MutationAddReactionToMessageArgs,
  MutationAddReportToMessageArgs,
  MutationEditMessageArgs,
  MutationRemovePinFromMessageArgs,
  MutationRemoveReactionFromMessageArgs,
  MutationAddImportantToMessageArgs,
  MutationRemoveImportantFromMessageArgs,
  Conversation as ConversationGraphQL,
  Reaction as ReactionGraphQL,
  User as UserGraphQL,
} from "../../graphql/generated/graphql"
import { MessageMutationEngine } from "../../interfaces/chat/core/message"
import { EngineInitConfig, MessageInitConfig } from "../../types"
import { MessageSchema } from "../../interfaces/chat/schema"
import {
  AddReactionToMessageArgs,
  AddReportToMessageArgs,
  EditMessageArgs,
  RemoveReactionFromMessageArgs,
} from "../../types/chat/schema/args"
import { Maybe } from "../../types/base"
import { Conversation } from "./conversation"
import { Engine } from "./engine"
import { MessageReport } from "./messagereport"
import { QIError } from "./qierror"
import { Reaction } from "./reaction"
import { User } from "./user"
import { Crypto } from "./crypto"
import { Converter } from "../utilities"
import { Auth, Chat } from "../.."

/**
 * Represents a Message object that can be used to interact with messages in a chat application.
 * @class Message
 * @extends Engine
 * @implements MessageSchema, MessageMutationEngine
 */

export class Message
  extends Engine
  implements MessageSchema, MessageMutationEngine
{
  /**
   * @property {string} id - The unique identifier of the message.
   */
  readonly id: string
  /**
   * @property {string} content - The content of the message.
   */
  readonly content: string
  /**
   * @property {string} conversationId - The ID of the conversation the message belongs to.
   */
  readonly conversationId: string
  /**
   * @property {Maybe<Array<Reaction>>} reactions - The reactions related to this message.
   */
  readonly reactions: Maybe<Array<Reaction>>
  /**
   *  @property {string} userId - The ID of the user who sent the message.
   */
  readonly userId: string
  /**
   * @property {Maybe<Omit<MessageSchema, "messageRoot">>} messageRoot - The root message in a thread.
   */
  readonly messageRoot: Maybe<Omit<Message, "messageRoot">>
  /**
   * @property {Maybe<string>} messageRootId - The ID of the root message in a thread.
   */
  readonly messageRootId: Maybe<string>
  /**
   * @property {Maybe<"TEXTUAL" | "ATTACHMENT" | "TRADE_PROPOSAL" | "RENT">} type - The type of the message.
   */
  readonly type: Maybe<"TEXTUAL" | "ATTACHMENT" | "TRADE_PROPOSAL" | "RENT">
  /**
   * @property {id: string; username: string; avatarURL: string; imageSettings: Maybe<string>} user - The user, author of the message
   */
  readonly user: {
    id: string
    username: string
    avatarURL: string
    imageSettings: Maybe<{
      imageX: number
      imageY: number
      imageZoom: number
    }>
  }
  /**
   * @property {Maybe<number>} order - The order of the message.
   */
  readonly order: number
  /**
   * @property {Date} createdAt - The creation date
   */
  readonly createdAt: Date
  /**
   * @property {Date} createdAt - The last date in which the message was updated
   */
  readonly updatedAt: Maybe<Date>
  /**
   * @property {Date} createdAt - The deletion's date of the message
   */
  readonly deletedAt: Maybe<Date>
  /**
   * @property {Chat} chatParent -The chat parent object that has generated this object.
   */
  readonly chatParent: Chat

  /**
   * Constructor for creating a new message instance with the provided configuration.
   * @param {MessageInitConfig & EngineInitConfig} config - The configuration object containing message and engine initialization settings.
   * @returns None
   */
  constructor(config: MessageInitConfig & EngineInitConfig) {
    super({
      storage: config.storage,
      devMode: config.devMode,
    })

    this.id = config.id
    this.content = config.content
    this.conversationId = config.conversationId
    this.reactions = config.reactions
    this.userId = config.userId
    this.messageRoot = config.messageRoot
    this.messageRootId = config.messageRootId
    this.type = config.type
    this.user = config.user
    this.order = config.order
    this.createdAt = config.createdAt
    this.updatedAt = config.updatedAt
    this.deletedAt = config.deletedAt

    this._client = config.client
    this._realtimeClient = config.realtimeClient
    this.chatParent = config.chatParent
  }

  private _makeConversation(conversation: ConversationGraphQL) {
    return new Conversation({
      ...this._parentConfig!,
      id: conversation.id,
      name: conversation.name,
      description: conversation.description ? conversation.description : null,
      imageURL: conversation.imageURL ? conversation.imageURL : null,
      bannerImageURL: conversation.bannerImageURL
        ? conversation.bannerImageURL
        : null,
      imageSettings: conversation.imageSettings
        ? conversation.imageSettings
        : null,
      settings: conversation.settings ? conversation.settings : null,
      membersIds: conversation.membersIds ? conversation.membersIds : null,
      mutedBy: conversation.mutedBy ? conversation.mutedBy : null,
      type: conversation.type,
      lastMessageSentAt: conversation.lastMessageSentAt
        ? conversation.lastMessageSentAt
        : null,
      ownerId: conversation.ownerId ? conversation.ownerId : null,
      publicConversationAESKey: conversation.publicConversationAESKey
        ? conversation.publicConversationAESKey
        : null,
      publicConversationIVKey: conversation.publicConversationIVKey
        ? conversation.publicConversationIVKey
        : null,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt ? conversation.updatedAt : null,
      deletedAt: conversation.deletedAt ? conversation.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
      chatParent: this.chatParent,
    })
  }

  private _makeUser(user: UserGraphQL) {
    return new User({
      ...this._parentConfig!,
      id: user.id,
      username: user.username ? user.username : null,
      did: user.did,
      address: user.address,
      email: user.email ? user.email : null,
      bio: user.bio ? user.bio : null,
      avatarUrl: user.avatarUrl ? new URL(user.avatarUrl) : null,
      imageSettings: user.imageSettings ? user.imageSettings : null,
      isVerified: user.isVerified ? user.isVerified : false,
      isPfpNft: user.isPfpNft ? user.isPfpNft : false,
      blacklistIds: user.blacklistIds ? user.blacklistIds : null,
      allowNotification: user.allowNotification
        ? user.allowNotification
        : false,
      allowNotificationSound: user.allowNotificationSound
        ? user.allowNotificationSound
        : false,
      visibility: user.visibility ? user.visibility : false,
      archivedConversations: user.archivedConversations
        ? user.archivedConversations
        : null,
      onlineStatus: user.onlineStatus ? user.onlineStatus : null,
      allowReadReceipt: user.allowReadReceipt ? user.allowReadReceipt : false,
      allowReceiveMessageFrom: user.allowReceiveMessageFrom
        ? user.allowReceiveMessageFrom
        : null,
      allowAddToGroupsFrom: user.allowAddToGroupsFrom
        ? user.allowAddToGroupsFrom
        : null,
      allowGroupsSuggestion: user.allowGroupsSuggestion
        ? user.allowGroupsSuggestion
        : false,
      e2ePublicKey: user.e2ePublicKey ? user.e2ePublicKey : null,
      e2eSecret: user.e2eSecret ? user.e2eSecret : null,
      e2eSecretIV: user.e2eSecretIV ? user.e2eSecretIV : null,
      createdAt: new Date(user.createdAt),
      updatedAt: user.updatedAt ? new Date(user.updatedAt) : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  private _makeReaction(reaction: ReactionGraphQL) {
    return new Reaction({
      ...this._parentConfig!,
      userId: reaction.userId,
      content: reaction.content,
      createdAt: reaction.createdAt,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  private _makeMessage(message: MessageGraphQL) {
    return new Message({
      ...this._parentConfig!,
      id: message.id,
      content: message.content,
      conversationId: message.conversationId,
      reactions: message.reactions
        ? message.reactions.map((reaction) => {
            return this._makeReaction(reaction)
          })
        : null,
      userId: message.userId,
      messageRoot: message.messageRoot
        ? new Message({
            ...this._parentConfig!,
            id: message.messageRoot.id,
            content: message.messageRoot.content,
            conversationId: message.messageRoot.conversationId,
            reactions: message.messageRoot.reactions
              ? message.messageRoot.reactions.map((reaction) => {
                  return this._makeReaction(reaction)
                })
              : null,
            userId: message.messageRoot.userId,
            messageRoot: null,
            messageRootId: null,
            type: message.messageRoot.type
              ? (message.messageRoot.type as
                  | "TEXTUAL"
                  | "ATTACHMENT"
                  | "TRADE_PROPOSAL"
                  | "RENT")
              : null,
            user: {
              id: message.messageRoot.user!.id,
              username: message.messageRoot.user!.username
                ? message.messageRoot.user!.username
                : "",
              avatarURL: message.messageRoot.user!.avatarUrl
                ? message.messageRoot.user!.avatarUrl
                : "",
              imageSettings: message.messageRoot.user!.imageSettings
                ? JSON.parse(message.messageRoot.user!.imageSettings)
                : null,
            },
            order: message.messageRoot.order,
            createdAt: message.messageRoot.createdAt,
            updatedAt: message.messageRoot.updatedAt
              ? message.messageRoot.updatedAt
              : null,
            deletedAt: message.messageRoot.deletedAt
              ? message.messageRoot.deletedAt
              : null,
            client: this._client!,
            realtimeClient: this._realtimeClient!,
            chatParent: this.chatParent,
          })
        : null,
      messageRootId: message.messageRootId ? message.messageRootId : null,
      type: message.type
        ? (message.type as "TEXTUAL" | "ATTACHMENT" | "TRADE_PROPOSAL" | "RENT")
        : null,
      user: {
        id: message.user!.id,
        username: message.user!.username ? message.user!.username : "",
        avatarURL: message.user!.avatarUrl ? message.user!.avatarUrl : "",
        imageSettings: message.user!.imageSettings
          ? JSON.parse(message.user!.imageSettings)
          : null,
      },
      order: message.order,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt ? message.updatedAt : null,
      deletedAt: message.deletedAt ? message.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
      chatParent: this.chatParent,
    })
  }

  private _makeMessageReport(messageReport: MessageReportGraphQL) {
    return new MessageReport({
      ...this._parentConfig!,
      id: messageReport.id,
      description: messageReport.description,
      userId: messageReport.userId ? messageReport.userId : null,
      createdAt: messageReport.createdAt,
      updatedAt: messageReport.updatedAt,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  /**
   * Asynchronously pins this message to the conversation.
   * If id is provided, it throws an error.
   * @returns {Promise<Message | QIError>} A promise that resolves to the pinned message or an error.
   */
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
    if (id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use pinMessage() instead."
      )

    const response = await this._mutation<
      MutationAddPinToMessageArgs,
      { addPinToMessage: MessageGraphQL },
      MessageGraphQL
    >("addPinToMessage", addPinToMessage, "_mutation() -> pinMessage()", {
      messageId: this.id,
    })

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

    return this._makeMessage(response)
  }

  /**
   * Asynchronously adds a reaction to a message in a conversation.
   * @param {Pick<AddReactionToMessageArgs, "reaction" | "conversationId">} args - An object containing the reaction content and conversation ID.
   * @returns {Promise<Message | QIError>} A promise that resolves to a Message object if successful, or a QIError object if there was an error.
   */
  async addReactionToMessage(
    args: Pick<AddReactionToMessageArgs, "reaction" | "conversationId">,
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
          messageId: this.id,
          reactionContent: Crypto.encryptAESorFail(
            args.reaction,
            this.chatParent.findKeyPairById(args.conversationId)
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

    return this._makeMessage(response)
  }

  /**
   * Asynchronously adds a report to a message with the provided description.
   * @param {Pick<AddReportToMessageArgs, "description">} args - An object containing the description of the report.
   * @returns {Promise<QIError | MessageReport>} A promise that resolves to a QIError if an error occurs, or a MessageReport object if successful.
   */
  async addReportToMessage(
    args: Pick<AddReportToMessageArgs, "description">,
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
          messageId: this.id,
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

    return this._makeMessageReport(response)
  }

  /**
   * Edits a message in a conversation with the provided content and conversation ID.
   * @param {Pick<EditMessageArgs, "content" | "conversationId">} args - An object containing the content of the message and the conversation ID.
   * @returns {Promise<Message | QIError>} - A promise that resolves to the edited message or an error.
   */
  async editMessage(
    args: Pick<EditMessageArgs, "content" | "conversationId">,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError> {
    const response = await this._mutation<
      MutationEditMessageArgs,
      { editMessage: MessageGraphQL },
      MessageGraphQL
    >("editMessage", editMessage, "_mutation() -> editMessage()", {
      input: {
        messageId: this.id,
        content: Crypto.encryptAESorFail(
          args.content,
          this.chatParent.findKeyPairById(args.conversationId)
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

    return this._makeMessage(response)
  }

  /**
   * Asynchronously unpins this message.
   * If id is provided, it throws an error.
   * @returns {Promise<Message | QIError>} A promise that resolves to the unpinned message or an error.
   */
  async unpinMessage(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError>
  async unpinMessage(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError>
  async unpinMessage(
    id?: unknown,
    overrideHandlingUnauthorizedQIError?: unknown
  ): Promise<Message | QIError> {
    if (id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use unpinMessage() instead."
      )

    const response = await this._mutation<
      MutationRemovePinFromMessageArgs,
      { removePinFromMessage: MessageGraphQL },
      MessageGraphQL
    >(
      "removePinFromMessage",
      removePinFromMessage,
      "_mutation() -> unpinMessage()",
      {
        messageId: this.id,
      }
    )

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

    return this._makeMessage(response)
  }

  /**
   * Asynchronously removes a reaction from a message.
   * @param {Pick<RemoveReactionFromMessageArgs, "reaction" | "conversationId">} args - An object containing the reaction and conversation ID.
   * @returns {Promise<Message | QIError>} A promise that resolves with the updated message after removing the reaction, or a QIError if an error occurs.
   */
  async removeReactionFromMessage(
    args: Pick<RemoveReactionFromMessageArgs, "reaction" | "conversationId">,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError> {
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
            this.chatParent.findKeyPairById(args.conversationId)
          ),
          messageId: this.id,
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

    return this._makeMessage(response)
  }

  /**
   * Asynchronously marks this message as important.
   * If id is provided, it throws an error.
   * @returns {Promise<Message | QIError>} A promise that resolves to the marked message or an error.
   */
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
    if (id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use markImportantMessage() instead."
      )

    const response = await this._mutation<
      MutationAddImportantToMessageArgs,
      { addImportantToMessage: MessageGraphQL },
      MessageGraphQL
    >(
      "addImportantToMessage",
      addImportantToMessage,
      "_mutation() -> markImportantMessage()",
      {
        messageId: this.id,
      }
    )

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

    const message = this._makeMessage(response)

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

  /**
   * Asynchronously unmarks an important message by removing the important flag from it.
   * If id is provided, it throws an error.
   * @param {string | unknown} [id] - The id of the message to unmark as important.
   * @returns {Promise<Message | QIError>} A promise that resolves to the unmarked message or an error.
   */
  async unmarkImportantMessage(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError>
  async unmarkImportantMessage(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError>
  async unmarkImportantMessage(
    id?: unknown,
    overrideHandlingUnauthorizedQIError?: unknown
  ): Promise<Message | QIError> {
    if (id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use unmarkImportantMessage() instead."
      )

    const response = await this._mutation<
      MutationRemoveImportantFromMessageArgs,
      { removeImportantFromMessage: MessageGraphQL },
      MessageGraphQL
    >(
      "removeImportantFromMessage",
      removeImportantFromMessage,
      "_mutation() -> removeImportantFromMessage()",
      {
        messageId: this.id,
      }
    )

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

    const message = this._makeMessage(response)

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

  /**
   * Asynchronously fetches a conversation from the server based on the message ID.
   * @returns A Promise that resolves to a Conversation object if successful, or a QIError object if there was an error.
   */
  async conversation(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Conversation | QIError> {
    const response = await this._query<
      null,
      {
        getMessageById: MessageGraphQL
      },
      MessageGraphQL
    >(
      "getMessageById",
      getConversationFromMessageById,
      "_query() -> conversation()",
      null
    )

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

    return this._makeConversation(response.conversation!)
  }

  /**
   * Retrieves user information from the server and returns a User object.
   * @returns {Promise<User | QIError>} A promise that resolves to a User object if successful, or a QIError object if there was an error.
   */
  async author(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError> {
    const response = await this._query<
      null,
      {
        getMessageById: MessageGraphQL
      },
      MessageGraphQL
    >("getMessageById", getUserFromMessageById, "_query() -> user()", null)

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

    return this._makeUser(response.user!)
  }

  getContentDecrypted(): Maybe<string> {
    if (!this.conversationId) return null
    return Crypto.decryptAESorFail(
      this.content,
      this.chatParent.findKeyPairById(this.conversationId)
    )
  }
}
