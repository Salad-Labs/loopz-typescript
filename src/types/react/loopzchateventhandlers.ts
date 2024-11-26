import { Conversation, Message } from "../../"
import { LocalDBConversation, LocalDBMessage } from "../../core/app"

type STDErrorListener = (error: Error) => any

export type LoopzChatEventHandlers = Partial<{
  // sync
  onSyncing: (syncingCounter: number) => any
  onSync: () => any
  onSyncError: (e: { error: string }) => any
  onSyncUpdate: (syncingCounter: number) => any
  // messages
  onMessageCreatedLDB: (message: LocalDBMessage) => any
  onMessageCreatedLDBError: STDErrorListener
  onMessageDeletedLDB: (message: LocalDBMessage) => any
  onMessageDeletedLDBError: STDErrorListener
  onMessageUpdatedLDB: (message: LocalDBMessage) => any
  onMessageUpdatedLDBError: STDErrorListener
  onMessageReceived: (params: {
    message: Message
    conversationId: string
  }) => any
  onMessageReceivedError: STDErrorListener
  onMessageUpdated: (params: {
    message: Message
    conversationId: string
  }) => any
  onMessageUpdatedError: STDErrorListener
  onMessageDeleted: (params: {
    message: Message
    conversationId: string
  }) => any
  onMessageDeletedError: STDErrorListener
  onBatchMessagesDeleted: (params: { messagesIds: Array<string[]> }) => any
  onBatchMessagesDeletedError: STDErrorListener
  // conversations
  onConversationCreatedLDB: (conversation: LocalDBConversation) => any
  onConversationCreatedLDBError: STDErrorListener
  onConversationUpdatedLDB: (conversation: LocalDBConversation) => any
  onConversationUpdatedLDBError: STDErrorListener
  onConversationGroupUpdated: (params: { conversation: Conversation }) => any
  onConversationGroupUpdatedError: STDErrorListener
  onConversationMuted: (params: { conversation: Conversation }) => any
  onConversationMutedError: STDErrorListener
  onConversationUnmuted: (params: { conversation: Conversation }) => any
  onConversationUnmutedError: STDErrorListener
  onConversationNewMembers: (params: {
    conversation: Conversation
    conversationId: string
  }) => any
  onConversationNewMembersError: STDErrorListener
  onMemberEjectedError: STDErrorListener
  onMemberLeftError: STDErrorListener
  // reactions
  onReactionAdded: (params: { message: Message; conversationId: string }) => any
  onReactionAddedError: STDErrorListener
  onReactionRemoved: (params: {
    message: Message
    conversationId: string
  }) => any
  onReactionRemovedError: STDErrorListener
}>
