import { Maybe } from "../../../../types"

export interface LocalDBConversation {
  id: string //primary key
  userDid: string //primary key
  indexDid: string
  organizationId: string
  name: string
  authorId: Maybe<string>
  description: string
  imageURL: string
  bannerImageURL: string
  imageSettings: Maybe<{
    imageX: number
    imageY: number
    imageZoom: number
  }>
  settings: string
  isArchived: boolean
  membersIds: Array<string>
  type: "ONE_TO_ONE" | "GROUP"
  lastMessageSentAt: Maybe<Date>
  lastMessageAuthor: Maybe<string>
  lastMessageAuthorId: Maybe<string>
  lastMessageText: Maybe<string>
  lastMessageSentId: Maybe<string>
  lastMessageSentOrder: Maybe<number>
  lastMessageReadId: Maybe<string>
  lastMessageReadOrder: Maybe<number>
  messagesToRead: number
  hasLastMessageSentAt: boolean
  createdAt: Date
  updatedAt: Maybe<Date>
  deletedAt: Maybe<Date>
}
