import { Maybe } from "../../types"
import { LocalDBConversation, LocalDBMessage } from "../../core/app/database"
import { Conversation, Message } from "../chat"

export class Converter {
  static fromConversationToLocalDBConversation(
    conversation: Conversation,
    userDid: string,
    organizationId: string,
    isArchived: boolean,
    lastMessageAuthor: Maybe<string>,
    lastMessageText: Maybe<string>,
    lastMessageRead: Maybe<Date>
  ): LocalDBConversation {
    return {
      id: conversation.id,
      userDid,
      indexDid: userDid, //used to query more efficently this table into recoverUserConversations()
      organizationId,
      name: conversation.name,
      description: conversation.description ? conversation.description : "",
      imageURL: conversation.imageURL ? conversation.imageURL : "",
      bannerImageURL: conversation.bannerImageURL
        ? conversation.bannerImageURL
        : "",
      imageSettings: conversation.imageSettings
        ? JSON.parse(conversation.imageSettings)
        : null,
      settings: JSON.stringify(conversation.settings),
      isArchived,
      lastMessageSentAt: conversation.lastMessageSentAt
        ? conversation.lastMessageSentAt
        : new Date("1970-01-01T00:00:00Z"),
      lastMessageAuthor,
      lastMessageText,
      lastMessageRead,
      hasLastMessageSentAt: conversation.lastMessageSentAt ? true : false,
      type: conversation.type as "GROUP" | "ONE_TO_ONE",
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      deletedAt: null,
    }
  }

  static fromMessageToLocalDBMessage(
    message: Message | Omit<Message, "messageRoot">,
    userDid: string,
    organizationId: string,
    isImportant: boolean,
    origin: "SYSTEM" | "USER"
  ): LocalDBMessage {
    return {
      id: message.id,
      userId: message.userId,
      userDid,
      user: {
        id: message.user.id,
        username: message.user.username,
        avatarURL: message.user.avatarURL,
        imageSettings: message.user.imageSettings
          ? message.user.imageSettings
          : null,
      },
      organizationId,
      conversationId: message.conversationId,
      content: message.content,
      reactions: message.reactions
        ? message.reactions.map((reaction) => {
            return {
              content: reaction.content,
              userId: reaction.userId,
              createdAt: reaction.createdAt,
            }
          })
        : [],
      isImportant,
      type: message.type!,
      origin,
      messageRoot:
        "messageRoot" in message && message.messageRoot
          ? Converter.fromMessageToLocalDBMessage(
              message.messageRoot,
              userDid,
              organizationId,
              false,
              "USER"
            )
          : null,
      messageRootId: "messageRootId" in message ? message.messageRootId : null,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      deletedAt: message.deletedAt,
    }
  }
}
