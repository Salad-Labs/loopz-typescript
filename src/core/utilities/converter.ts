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
      organizationId,
      name: conversation.name,
      description: conversation.description ? conversation.description : "",
      imageURL: new URL(
        conversation.imageURL ? conversation.imageURL : ""
      ).toString(),
      bannerImageURL: new URL(
        conversation.bannerImageURL ? conversation.bannerImageURL : ""
      ).toString(),
      imageSettings: conversation.imageSettings
        ? JSON.parse(conversation.imageSettings)
        : null,
      settings: JSON.stringify(conversation.settings),
      isArchived,
      lastMessageSentAt: conversation.lastMessageSentAt,
      lastMessageAuthor,
      lastMessageText,
      lastMessageRead,
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
      messageRoot: Converter.fromMessageToLocalDBMessage(
        "messageRoot" in message ? message : message,
        userDid,
        organizationId,
        false,
        "USER"
      ),
      messageRootId: message.messageRootId,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      deletedAt: message.deletedAt,
    }
  }
}
