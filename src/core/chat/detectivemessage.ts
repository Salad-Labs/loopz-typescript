import { Maybe } from "../../types"
import { DexieStorage } from "../app"
import { LocalDBMessage } from "../app/database"

export class DetectiveMessage {
  private _storage: DexieStorage

  private _detectiveMessageTimeout: Maybe<NodeJS.Timeout> = null

  private _currentConversationId: Maybe<string> = null

  private _detectiveMessageCanRun: boolean = true

  static readonly DETECTIVE_MESSAGE_TIME = 60000

  constructor(storage: DexieStorage) {
    this._storage = storage
    this._detectiveMessageCanRun = this._storage.isStorageEnabled()

    if (!this._detectiveMessageCanRun) {
      console.log("[detective message]: I am disabled :(")
    }
  }

  async addMessage(message: LocalDBMessage) {
    if (!this._detectiveMessageCanRun) {
      return
    }

    this._storage.insertBulkSafe()
  }

  observe(conversationId: string, userId: string) {}

  /**
   * RULES detective message
   */

  //table on IndexedDB should contain a primary key made by the conversationId, userId, messageId, version
  //structure of the table should be conversationId, userId, messageId, version, createdAt

  //every time a message comes, insert a data with the version and the id of the message inside the db or local storage for each conversation
  //it takes into consideration the last message validated, in order to check with the server the messages with a version number greater than the version registered
  //it saves the messages under a form of a list of version number
  //[9] - [10] - [13] - [14] - [15] | {8} <- this is the last message validated ?? maybe this part is useless because we store simply the list of the messages
  //[11] and [12] are missing. Ok, let's check if the server has these messages
  //it starts to communicate with the server only if the client explicitly is on the conversation
  //if it has some results already in the queue list, it sends them on the server once the client starts to observe a conversation
  //it activates a timeout and cyclely communicate with the server only if the client is explicitly on the conversation
  //once it gets the desired messages from the server, it store them on the local db
}
