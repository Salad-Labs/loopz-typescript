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
            chatParent: this.chatParent,
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
      chatParent: this.chatParent,
    })
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
            chatParent: this.chatParent,
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
      chatParent: this.chatParent,
    })
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
            chatParent: this.chatParent,
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
      chatParent: this.chatParent,
    })
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
            user: {
              id: response.messageRoot.user!.id,
              username: response.messageRoot.user!.username
                ? response.messageRoot.user!.username
                : "",
              avatarURL: response.messageRoot.user!.avatarUrl
                ? response.messageRoot.user!.avatarUrl
                : "",
              imageSettings: response.user!.imageSettings
                ? JSON.parse(response.user!.imageSettings)
                : null,
            },
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
            chatParent: this.chatParent,
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
      chatParent: this.chatParent,
    })
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
            chatParent: this.chatParent,
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
      chatParent: this.chatParent,
    })
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
            chatParent: this.chatParent,
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
      chatParent: this.chatParent,
    })

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
              avatarURL: response.user!.avatarUrl
                ? response.user!.avatarUrl
                : "",
              imageSettings: response.user!.imageSettings
                ? JSON.parse(response.user!.imageSettings)
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
            chatParent: this.chatParent,
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
      chatParent: this.chatParent,
    })

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

    return new Conversation({
      ...this._parentConfig!,
      id: response.conversation!.id,
      name: response.conversation!.name,
      description: response.conversation!.description
        ? response.conversation!.description
        : null,
      imageURL: response.conversation!.imageURL
        ? response.conversation!.imageURL
        : null,
      bannerImageURL: response.conversation!.bannerImageURL
        ? response.conversation!.bannerImageURL
        : null,
      imageSettings: response.conversation!.imageSettings
        ? response.conversation!.imageSettings
        : null,
      settings: response.conversation!.settings
        ? JSON.parse(response.conversation!.settings)
        : null,
      membersIds: response.conversation!.membersIds
        ? response.conversation!.membersIds
        : null,
      mutedBy: response.conversation!.mutedBy
        ? response.conversation!.mutedBy
        : null,
      type: response.conversation!.type,
      lastMessageSentAt: response.conversation!.lastMessageSentAt
        ? response.conversation!.lastMessageSentAt
        : null,
      ownerId: response.conversation!.ownerId
        ? response.conversation!.ownerId
        : null,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt ? response.updatedAt : null,
      deletedAt: response.deletedAt ? response.deletedAt : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
      chatParent: this.chatParent,
    })
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

    return new User({
      ...this._parentConfig!,
      id: response.user!.id,
      username: response.user!.username ? response.user!.username : null,
      did: response.user!.did,
      address: response.user!.address,
      email: response.user!.email ? response.user!.email : null,
      bio: response.user!.bio ? response.user!.bio : null,
      avatarUrl: response.user!.avatarUrl
        ? new URL(response.user!.avatarUrl)
        : null,
      imageSettings: response.user!.imageSettings
        ? response.user!.imageSettings
        : null,
      isVerified: response.user!.isVerified ? response.user!.isVerified : false,
      isPfpNft: response.user!.isPfpNft ? response.user!.isPfpNft : false,
      blacklistIds: response.user!.blacklistIds
        ? response.user!.blacklistIds
        : null,
      allowNotification: response.user!.allowNotification
        ? response.user!.allowNotification
        : false,
      allowNotificationSound: response.user!.allowNotificationSound
        ? response.user!.allowNotificationSound
        : false,
      visibility: response.user!.visibility ? response.user!.visibility : false,
      archivedConversations: response.user!.archivedConversations
        ? response.user!.archivedConversations
        : null,
      onlineStatus: response.user!.onlineStatus
        ? response.user!.onlineStatus
        : null,
      allowReadReceipt: response.user!.allowReadReceipt
        ? response.user!.allowReadReceipt
        : false,
      allowReceiveMessageFrom: response.user!.allowReceiveMessageFrom
        ? response.user!.allowReceiveMessageFrom
        : null,
      allowAddToGroupsFrom: response.user!.allowAddToGroupsFrom
        ? response.user!.allowAddToGroupsFrom
        : null,
      allowGroupsSuggestion: response.user!.allowGroupsSuggestion
        ? response.user!.allowGroupsSuggestion
        : false,
      e2ePublicKey: response.user!.e2ePublicKey
        ? response.user!.e2ePublicKey
        : null,
      e2eSecret: response.user!.e2eSecret ? response.user!.e2eSecret : null,
      e2eSecretIV: response.user!.e2eSecretIV
        ? response.user!.e2eSecretIV
        : null,
      createdAt: new Date(response.user!.createdAt),
      updatedAt: response.user!.updatedAt
        ? new Date(response.user!.updatedAt)
        : null,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  getContentDecrypted(): Maybe<string> {
    if (!this.conversationId) return null
    return Crypto.decryptAESorFail(
      this.content,
      this.chatParent.findKeyPairById(this.conversationId)
    )
  }
}
