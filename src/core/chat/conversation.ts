import {
  addMembersToConversation,
  addPinToConversation,
  addReportToConversation,
  archiveConversation,
  deleteConversationMessage,
  ejectMember,
  leaveConversation,
  muteConversation,
  removePinFromConversation,
  sendMessage,
  unarchiveConversation,
  unmuteConversation,
  updateConversationGroup,
} from "../../constants/chat/mutations"
import {
  MutationAddMembersToConversationArgs,
  ListConversationMembers as ListConversationMembersGraphQL,
  Conversation as ConversationGraphQL,
  Message as MessageGraphQL,
  Reaction as ReactionGraphQL,
  ConversationMember as ConversationMemberGraphQL,
  MutationAddReportToConversationArgs,
  ConversationReport as ConversationReportGraphQL,
  MutationArchiveConversationArgs,
  MutationDeleteConversationMessageArgs,
  MutationEjectMemberArgs,
  MutationMuteConversationArgs,
  MutationSendMessageArgs,
  MutationUpdateConversationGroupArgs,
  MutationLeaveConversationArgs,
  MutationUnarchiveConversationArgs,
  MutationUnmuteConversationArgs,
  MutationAddPinToConversationArgs,
  MutationRemovePinFromConversationArgs,
  User as UserGraphQL,
  MemberOutResult as MemberOutResultGraphQL,
  QueryGetConversationByIdArgs,
} from "../../graphql/generated/graphql"
import {
  ConversationMutationEngine,
  ConversationQueryEngine,
} from "../../interfaces/chat/core/conversation"
import { ConversationInitConfig } from "../../types/chat/core/conversation"
import { ConversationSchema } from "../../interfaces/chat/schema"
import {
  AddMembersToConversationArgs,
  AddReportToConversationArgs,
  CreateConversationGroupArgs,
  EjectMemberArgs,
  MuteConversationArgs,
  SendMessageArgs,
  UpdateConversationGroupInputArgs,
} from "../../types/chat/schema/args"
import { Maybe } from "../../types/base"
import { ConversationMember } from "./conversationmember"
import { ConversationReport } from "./conversationreport"
import { Engine } from "./engine"
import { Message } from "./message"
import { QIError } from "./qierror"
import { User } from "./user"
import { Crypto } from "./crypto"
import {
  getMembersFromConversationById,
  getMessagesFromConversationById,
  getOwnerFromConversationById,
} from "../../constants/chat/queries"
import { EngineInitConfig } from "../../types"
import { Reaction } from "./reaction"
import { Auth, Chat } from "../.."

/**
 * Represents a conversation in a chat application.
 * @class Conversation
 * @extends Engine
 * @implements ConversationSchema, ConversationQueryEngine, ConversationMutationEngine
 */

export class Conversation
  extends Engine
  implements
    ConversationSchema,
    ConversationQueryEngine,
    ConversationMutationEngine
{
  /**
   * @property {string} id - The unique identifier of the chat entity.
   */
  readonly id: string
  /**
   * @property {string} name - The name of the chat entity.
   */
  readonly name: string
  /**
   * @property {Maybe<string>} description - The description of the chat entity, if available.
   */
  readonly description: Maybe<string>
  /**
   * @property {Maybe<string>} imageURL - The URL of the image associated with the chat entity, if available.
   */
  readonly imageURL: Maybe<string>
  /**
   * @property {Maybe<string>} bannerImageURL - The URL of the banner image associated with the chat entity, if available.
   */
  readonly bannerImageURL: Maybe<string>
  /**
   * @property {Maybe<string>} imageSettings - The images property of the conversation (bannerImage and image).
   */
  readonly imageSettings: Maybe<string>
  /**
   * @property {Maybe<string>} settings - The settings of the chat entity, if available.
   */
  readonly settings: Maybe<string>
  /**
   * @property {Maybe<Array<string>>} membersIds - An array of member IDs in the chat group.
   */
  readonly membersIds: Maybe<Array<string>>
  /**
   * @property {Maybe<Array<{userId: string, createdAt: Date}>>} mutedBy - An array of member IDs in the conversation.
   */
  readonly mutedBy: Maybe<Array<{ userId: string; createdAt: Date }>>
  /**
   * @property {"GROUP" | "ONE_TO_ONE" | "COMMUNITY"} type - The type of chat group.
   */
  readonly type: "GROUP" | "ONE_TO_ONE" | "COMMUNITY"
  /**
   * @property {Maybe<Date>} lastMessageSentAt - The date when the last message was sent in the chat group.
   */
  readonly lastMessageSentAt: Maybe<Date>
  /**
   * @property {Date} createdAt - The id of the creator of the group
   */
  readonly ownerId: Maybe<string>
  /**
   * @property {Maybe<string>} publicConversationAESKey - The public AES key of the conversation, if available.
   */
  readonly publicConversationAESKey: Maybe<string>
  /**
   * @property {Maybe<string>} publicConversationIVKey - The public IV key of the conversation, if available.
   */
  readonly publicConversationIVKey: Maybe<string>
  /**
   * @property {Date} createdAt - The date when the chat group was created.
   */
  readonly createdAt: Date
  /**
   * @property {Maybe<Date>} updatedAt - The date when the chat group was last updated.
   */
  readonly updatedAt: Maybe<Date>
  /**
   * @property {Maybe<Date>} deletedAt -The date when the chat group was last deleted.
   */
  readonly deletedAt: Maybe<Date>
  /**
   * @property {Chat} chatParent -The chat parent object that has generated this object.
   */
  readonly chatParent: Chat

  /**
   * Constructor for creating a Conversation object with the provided configuration.
   * @param {ConversationInitConfig & EngineInitConfig} config - The configuration object containing conversation and engine initialization settings.
   * @returns None
   */
  constructor(config: ConversationInitConfig & EngineInitConfig) {
    super({
      storage: config.storage,
      devMode: config.devMode,
    })

    this.id = config.id
    this.name = config.name
    this.description = config.description
    this.imageURL = config.imageURL
    this.bannerImageURL = config.bannerImageURL
    this.imageSettings = config.imageSettings
    this.settings = config.settings
    this.membersIds = config.membersIds
    this.mutedBy = config.mutedBy
    this.type = config.type
    this.lastMessageSentAt = config.lastMessageSentAt
    this.ownerId = config.ownerId
    this.publicConversationAESKey = config.publicConversationAESKey
    this.publicConversationIVKey = config.publicConversationIVKey
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

  private _makeConversationMember(
    conversationMember: ConversationMemberGraphQL
  ) {
    return new ConversationMember({
      ...this._parentConfig!,
      id: conversationMember.id,
      conversationId: conversationMember.conversationId,
      userId: conversationMember.userId,
      type: conversationMember.type,
      encryptedConversationAESKey:
        conversationMember.encryptedConversationAESKey,
      encryptedConversationIVKey: conversationMember.encryptedConversationIVKey,
      createdAt: conversationMember.createdAt,
      updatedAt: conversationMember.updatedAt,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  private _makeConversationReport(
    conversationReport: ConversationReportGraphQL
  ) {
    return new ConversationReport({
      ...this._parentConfig!,
      id: conversationReport.id,
      description: conversationReport.description
        ? conversationReport.description
        : null,
      userId: conversationReport.userId ? conversationReport.userId : null,
      createdAt: conversationReport.createdAt,
      updatedAt: conversationReport.updatedAt,
      client: this._client!,
      realtimeClient: this._realtimeClient!,
    })
  }

  createPublicConversation?(
    args: CreateConversationGroupArgs & {
      conversationKeys: {
        conversationAESKey: string
        conversationIVKey: string
      }
    },
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<{ conversationId: string; conversation: Conversation } | QIError> {
    throw new Error("Method not implemented.")
  }
  joinConversation?(
    args: {
      conversationId: string
      encryptedConversationAESKey: string
      encryptedConversationIVKey: string
    },
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Conversation | QIError> {
    throw new Error("Method not implemented.")
  }

  /**
   * Ejects a member from the conversation based on the provided userId.
   * @param {Pick<EjectMemberArgs, "userId">} args - An object containing the userId of the member to eject.
   * @returns {Promise<{
        conversationId: string
        conversation: Conversation
        memberOut: User
      } | QIError>} - A Promise that resolves to an object that contains Conversation, the conversation id and the user that was ejected if successful, or a QIError object if there was an error.
   */
  async ejectMember(
    args: Pick<EjectMemberArgs, "userId">,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    | {
        conversationId: string
        conversation: Conversation
        memberOut: User
      }
    | QIError
  > {
    const response = await this._mutation<
      MutationEjectMemberArgs,
      { ejectMember: MemberOutResultGraphQL },
      MemberOutResultGraphQL
    >("ejectMember", ejectMember, "_mutation() -> ejectMember()", {
      input: {
        conversationId: this.id,
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
      conversation: this._makeConversation(response.conversation),
      memberOut: this._makeUser(response.memberOut),
    }
  }

  /**
   * Asynchronously adds members to a conversation.
   * @param {Pick<AddMembersToConversationArgs, "membersIds">} args - An object containing the member IDs to add to the conversation.
   * @returns {Promise<QIError | { conversationId: string; items: ConversationMember[] }>} A promise that resolves to either a QIError object if there was an error, or an object containing the conversation ID and an array of ConversationMember objects.
   */
  async addMembersToConversation(
    args: Pick<AddMembersToConversationArgs, "members">,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    | QIError
    | {
        conversationId: string
        items: ConversationMember[]
        membersIds: Array<string>
      }
  > {
    const response = await this._mutation<
      MutationAddMembersToConversationArgs,
      { addMembersToConversation: ListConversationMembersGraphQL },
      ListConversationMembersGraphQL
    >(
      "addMembersToConversation",
      addMembersToConversation,
      "_mutation() -> addMembers()",
      {
        input: {
          conversationId: this.id,
          members: args.members,
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

    const listConversations: {
      conversationId: string
      items: Array<ConversationMember>
      membersIds: Array<string>
    } = {
      conversationId: response.conversationId,
      items: response.items.map((item) => {
        return this._makeConversationMember(item)
      }),
      membersIds: response.membersIds,
    }

    return listConversations
  }

  /**
   * Adds a report to the conversation with the provided description.
   * @param {Pick<AddReportToConversationArgs, "description">} args - An object containing the description of the report.
   * @returns {Promise<QIError | ConversationReport>} A promise that resolves to either a QIError if there was an error, or a ConversationReport object.
   */
  async addReportToConversation(
    args: Pick<AddReportToConversationArgs, "description">,
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
          conversationId: this.id,
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

    return this._makeConversationReport(response)
  }

  /**
   * Archives a conversation by calling the archiveConversation mutation.
   * If an id is provided, it throws an error.
   * If no id is provided, it archives the conversation associated with the current instance.
   * @returns {Promise<User | QIError>} A Promise that resolves to a Conversation object if successful,
   * or a QIError object if an error occurs.
   */
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
    if (id)
      throw new Error(
        "id argument can not be defined. Consider to use archiveConversation() instead."
      )

    const response = await this._mutation<
      MutationArchiveConversationArgs,
      { archiveConversation: UserGraphQL },
      UserGraphQL
    >(
      "archiveConversation",
      archiveConversation,
      "_mutation() -> archiveConversation()",
      {
        conversationId: this.id,
      }
    )

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

    return this._makeUser(response)
  }

  /**
   * Deletes a message with the given ID from the conversation.
   * @param {string} id - The ID of the message to delete.
   * @returns {Promise<QIError | Message>} A promise that resolves to either a QIError if the deletion fails,
   * or a Message object representing the deleted message.
   */
  async deleteMessage(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | Message> {
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

    return this._makeMessage(response)
  }

  /**
   * Asynchronously leaves the current conversation.
   * If an id is provided, it throws an error.
   * @returns {Promise<{
        conversationId: string
        conversation: Conversation
        memberOut: User
      } | QIError>} A Promise that resolves to a Conversation object if successful, or a QIError object if an error occurs.
   */
  async leaveConversation(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    | {
        conversationId: string
        conversation: Conversation
        memberOut: User
      }
    | QIError
  >
  async leaveConversation(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    | {
        conversationId: string
        conversation: Conversation
        memberOut: User
      }
    | QIError
  >
  async leaveConversation(
    id?: unknown,
    overrideHandlingUnauthorizedQIError?: unknown
  ): Promise<
    | {
        conversationId: string
        conversation: Conversation
        memberOut: User
      }
    | QIError
  > {
    if (id)
      throw new Error(
        "id argument can not be null or undefined. Consider to use leaveConversation() instead."
      )

    const response = await this._mutation<
      MutationLeaveConversationArgs,
      { leaveConversation: MemberOutResultGraphQL },
      MemberOutResultGraphQL
    >(
      "leaveConversation",
      leaveConversation,
      "_mutation() -> leaveConversation()",
      {
        conversationId: this.id,
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
      conversation: this._makeConversation(response.conversation),
      memberOut: this._makeUser(response.memberOut),
    }
  }

  /**
   * Mutes a conversation for a specified duration.
   * @param {MuteConversationArgs} args - An object containing the duration to mute the conversation for.
   * @returns {Promise<Conversation | QIError>} - A Promise that resolves to a Conversation object if successful, or a QIError object if there was an error.
   */
  async muteConversation(
    args: MuteConversationArgs,
    overrideHandlingUnauthorizedQIError?: boolean
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
        conversationId: this.id,
      }
    )

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

    return this._makeConversation(response)
  }

  /**
   * Sends a message with the specified content and type.
   * @param {Pick<SendMessageArgs, "content" | "type">} args - An object containing the message content and type.
   * @returns {Promise<QIError | Message>} A promise that resolves to either a QIError if there was an error sending the message, or a Message object if the message was sent successfully.
   */
  async sendMessage(
    args: Pick<SendMessageArgs, "content" | "type">,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<QIError | Message> {
    let content: string

    if (typeof args.content === "object") content = JSON.stringify(args.content)
    else content = args.content

    const response = await this._mutation<
      MutationSendMessageArgs,
      { sendMessage: MessageGraphQL },
      MessageGraphQL
    >("sendMessage", sendMessage, "_mutation() -> sendMessage()", {
      input: {
        content: Crypto.encryptAESorFail(
          content,
          this.chatParent.findKeyPairById(this.id)
        ),
        conversationId: this.id,
        type: args.type,
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
   * Asynchronously unarchives a conversation based on the current conversation's object.
   * If an id is provided, it throws an error.
   * @returns {Promise<User | QIError>} A Promise that resolves to a Conversation object if successful, or a QIError object if there was an error.
   */
  async unarchiveConversation(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError>
  async unarchiveConversation(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError>
  async unarchiveConversation(
    id?: unknown,
    overrideHandlingUnauthorizedQIError?: unknown
  ): Promise<User | QIError> {
    if (id)
      throw new Error(
        "id argument can not be defined. Consider to use unarchiveConversation() instead."
      )

    const response = await this._mutation<
      MutationUnarchiveConversationArgs,
      { unarchiveConversation: UserGraphQL },
      UserGraphQL
    >(
      "unarchiveConversation",
      unarchiveConversation,
      "_mutation() -> unarchiveConversation()",
      {
        conversationId: this.id,
      }
    )

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

    return this._makeUser(response)
  }

  /**
   * Asynchronously unmutes a conversation.
   * If an id is provided, it throws an error.
   * @returns {Promise<Conversation | QIError>} A Promise that resolves to a Conversation object if successful, or a QIError object if there was an error.
   */
  async unmuteConversation(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Conversation | QIError>
  async unmuteConversation(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Conversation | QIError>
  async unmuteConversation(
    id?: unknown,
    overrideHandlingUnauthorizedQIError?: unknown
  ): Promise<Conversation | QIError> {
    if (id)
      throw new Error(
        "id argument can not be defined. Consider to use unarchiveConversation() instead."
      )

    const response = await this._mutation<
      MutationUnmuteConversationArgs,
      { unmuteConversation: ConversationGraphQL },
      ConversationGraphQL
    >(
      "unmuteConversation",
      unmuteConversation,
      "_mutation() -> unmuteConversation()",
      {
        conversationId: this.id,
      }
    )

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

    return this._makeConversation(response)
  }

  /**
   * Updates a conversation group with the provided arguments.
   * @param {Pick<UpdateConversationGroupInputArgs, "bannerImageURL" | "description" | "imageURL" | "name" | "settings">} args - The arguments to update the conversation group.
   * @returns {Promise<Conversation | QIError>} A promise that resolves to a Conversation object if successful, or a QIError object if there was an error.
   */
  async updateConversationGroup(
    args: Pick<
      UpdateConversationGroupInputArgs,
      "bannerImageURL" | "description" | "imageURL" | "name" | "settings"
    >,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Conversation | QIError> {
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
          conversationId: this.id,
          description: Crypto.encryptAESorFail(
            args.description,
            this.chatParent.findKeyPairById(this.id)
          ),
          imageURL: new URL(
            Crypto.encryptAESorFail(
              args.imageURL,
              this.chatParent.findKeyPairById(this.id)
            )
          ).toString(),
          bannerImageURL: new URL(
            Crypto.encryptAESorFail(
              args.bannerImageURL,
              this.chatParent.findKeyPairById(this.id)
            )
          ).toString(),
          name: Crypto.encryptAESorFail(
            args.name,
            this.chatParent.findKeyPairById(this.id)
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

    return this._makeConversation(response)
  }

  /**
   * Asynchronously pins a conversation.
   * If an id is provided, it throws an error.
   * @returns {Promise<Conversation | QIError>} A Promise that resolves to the pinned conversation or an error.
   */
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
    if (id)
      throw new Error(
        "id argument can not be defined. Consider to use pinConversation() instead."
      )

    const response = await this._mutation<
      MutationAddPinToConversationArgs,
      { addPinToConversation: ConversationGraphQL },
      ConversationGraphQL
    >(
      "addPinToConversation",
      addPinToConversation,
      "_mutation() -> pinConversation()",
      {
        conversationId: this.id,
      }
    )

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

    return this._makeConversation(response)
  }

  /**
   * Asynchronously unpins a conversation.
   * If an id is provided, it throws an error.
   * @returns {Promise<Conversation | QIError>} A Promise that resolves to the unpinned conversation or an error.
   */
  async unpinConversation(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<boolean | QIError>
  async unpinConversation(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<boolean | QIError>
  async unpinConversation(
    id?: unknown,
    overrideHandlingUnauthorizedQIError?: unknown
  ): Promise<boolean | QIError> {
    if (id)
      throw new Error(
        "id argument can not be defined. Consider to use unpinConversation() instead."
      )

    const response = await this._mutation<
      MutationRemovePinFromConversationArgs,
      { removePinFromConversation: ConversationGraphQL },
      ConversationGraphQL
    >(
      "removePinFromConversation",
      removePinFromConversation,
      "_mutation() -> unpinConversation()",
      {
        conversationId: this.id,
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

  /**
   * Retrieves the owner information from a conversation and returns a User object.
   * @returns A Promise that resolves to a User object if successful, or a QIError object if there was an error.
   */
  async owner(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError> {
    const response = await this._query<
      null,
      {
        getConversationById: ConversationGraphQL
      },
      ConversationGraphQL
    >(
      "getConversationById",
      getOwnerFromConversationById,
      "_query() -> owner()",
      null
    )

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

    return this._makeUser(response.owner!)
  }

  /**
   * Retrieves the conversation members from the conversation by its ID.
   * @returns A Promise that resolves to an array of ConversationMember objects or a QIError object.
   */
  async members(
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
      "_query() -> members()",
      {
        conversationId: this.id,
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
        return this._makeConversationMember(item)
      })

    return listConversationMembers
  }

  /**
   * Retrieves a list of messages from a conversation.
   * @returns A Promise that resolves to an array of Message objects or a QIError object.
   */
  async messages(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message[] | QIError> {
    const response = await this._query<
      null,
      {
        getConversationById: ConversationGraphQL
      },
      ConversationGraphQL
    >(
      "getConversationById",
      getMessagesFromConversationById,
      "_query() -> messages()",
      null
    )

    if (response instanceof QIError) {
      if (!overrideHandlingUnauthorizedQIError) {
        const error = this._handleUnauthorizedQIError(response)
        if (error) await Auth.fetchAuthToken()
      }

      return response
    }

    const listMessages: Array<Message> = response.messages!.map((item) => {
      return this._makeMessage(item!)
    })

    return listMessages
  }

  getImageURLDecrypted(): Maybe<string> {
    if (!this.imageURL) return null
    return Crypto.decryptAESorFail(
      this.imageURL,
      this.chatParent.findKeyPairById(this.id)
    )
  }

  getBannerImageURLDecrypted(): Maybe<string> {
    if (!this.bannerImageURL) return null
    return Crypto.decryptAESorFail(
      this.bannerImageURL,
      this.chatParent.findKeyPairById(this.id)
    )
  }

  getNameDecrypted(): string {
    return Crypto.decryptAESorFail(
      this.name,
      this.chatParent.findKeyPairById(this.id)
    )
  }

  getDescriptionDecrypted(): Maybe<string> {
    if (!this.description) return null
    return Crypto.decryptAESorFail(
      this.description,
      this.chatParent.findKeyPairById(this.id)
    )
  }
}
