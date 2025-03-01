import { Maybe } from "../../../../types"

export interface LocalDBConversation {
  id: string //primary key
  userDid: string //primary key
  indexDid: string
  organizationId: string
  name: string
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
  type: "ONE_TO_ONE" | "GROUP"
  lastMessageSentAt: Maybe<Date>
  messageToRead: number
  lastMessageAuthor: Maybe<string>
  lastMessageText: Maybe<string>
  hasLastMessageSentAt: boolean
  createdAt: Date
  updatedAt: Maybe<Date>
  deletedAt: Maybe<Date>
}
