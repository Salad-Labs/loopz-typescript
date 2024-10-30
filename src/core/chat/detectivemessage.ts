import { Auth } from "@src/index"
import { Account, Message } from ".."
import { Maybe } from "../../types"
import { DexieStorage } from "../app"
import { LocalDBDetectiveMessageCollector } from "../app/database"
import { v4 as uuid } from "uuid"

export class DetectiveMessage {
  private _storage: DexieStorage

  private _detectiveMessageTimeout: Maybe<NodeJS.Timeout> = null

  private _currentConversationId: Maybe<string> = null

  private _detectiveMessageCanRun: boolean = true

  static readonly DETECTIVE_MESSAGE_TIME = 60000

  constructor(storage: DexieStorage) {
    this._storage = storage
    this._detectiveMessageCanRun = this._storage.isStorageEnabled()

    if (!this._detectiveMessageCanRun)
      console.log("[detective message]: I am disabled :(")
  }

  async collect(message: Message, did: string, organizationId: string) {
    if (!this._detectiveMessageCanRun) return

    try {
      await this._storage.insertBulkSafe("detectivemessagecollector", [
        {
          did,
          organizationId,
          conversationId: message.conversationId,
          messageId: message.id,
          order: message.order,
          createdAt: new Date(),
        },
      ])
    } catch (error) {
      console.log(error)
    }
  }

  observe(conversationId: string, userId: string) {}

  async scan() {
    //we get the messages stored of the current user
    const clues = await this._storage.transaction(
      "rw",
      "detectivemessagecollector",
      async (tx) => {
        return (await this._storage.detectivemessagecollector.toArray()).sort(
          (a, b) => a.order - b.order
        )
      }
    )

    //if we have at least one record, we start to evaluate the elements
    if (clues.length > 0) {
      //we obtain the conversation ids, in this way we can grouping the messages by their conversation id
      const conversationIds = this._getUniquePropertyValues(
        clues,
        "conversationId"
      )
      const conversationMessages: Array<{
        conversationId: string
        elements: Array<{
          order: number
          clue: LocalDBDetectiveMessageCollector
        }>
      }> = []

      for (let i = 0; i < conversationIds.length; i++) {
        conversationMessages.push({
          conversationId: conversationIds[i],
          elements: [],
        })
      }

      for (let i = 0; i < conversationMessages.length; i++) {
        for (let j = 0; j < clues.length; j++) {
          if (
            conversationMessages[i].conversationId === clues[j].conversationId
          ) {
            conversationMessages[i].elements.push({
              order: clues[j].order,
              clue: clues[j],
            })
          }
        }
      }

      //once we have grouped these elements, we need to understand if there are messages that are missing.
      for (let i = 0; i < conversationMessages.length; i++) {
        let sequences = this._findMissingOrderSequences(
          conversationMessages[i].elements
        )

        if (!sequences) continue

        //once we have the sequences of missing messages, we populate the table "detectivemessagequeue"
        for (let j = 0; j < sequences.length; j++) {
          let itemsForQueue: Array<{
            id: string
            did: string
            organizationId: string
            conversationId: string
            queue: Array<number>
            createdAt: Date
          }> = []
          let queue: Array<number> = []

          for (let k = 0; k < sequences[j].length; k++)
            queue.push(sequences[j][k].order)

          //we insert the elements in the queue only if it's populated
          if (queue.length > 0) {
            itemsForQueue.push({
              id: uuid(),
              did: Auth.account!.did,
              organizationId: Auth.account!.organizationId,
              conversationId: conversationMessages[i].conversationId,
              queue,
              createdAt: new Date(),
            })

            await this._storage.insertBulkSafe(
              "detectivemessagequeue",
              itemsForQueue
            )
          }

          //now that we have inserted the elements (or not), we can delete the clues from the detectivemessagecollector table, except for the last
        }
      }
    }

    this._detectiveMessageTimeout = setTimeout(
      this.scan,
      DetectiveMessage.DETECTIVE_MESSAGE_TIME
    )
  }

  private _findMissingOrderSequences(
    sequence: Array<{
      order: number
      clue: LocalDBDetectiveMessageCollector
    }>
  ): Maybe<
    Array<Array<{ order: number; clue: LocalDBDetectiveMessageCollector }>>
  > {
    const min = this._findLowestOrder(sequence)
    const max = this._findHighestOrder(sequence)

    if (!min || !max) return null

    const sequenceSet = new Set(sequence.map((item) => item.order))
    const missingOrderSequences: number[][] = []
    const missingSequences: Array<
      Array<{ order: number; clue: LocalDBDetectiveMessageCollector }>
    > = []
    let currentOrderSequence: number[] = []
    let currentSequence: Array<{
      order: number
      clue: LocalDBDetectiveMessageCollector
    }> = []

    try {
      for (let i = min.order; i <= max.order; i++) {
        if (!sequenceSet.has(i)) {
          currentOrderSequence.push(i)
        } else if (currentOrderSequence.length > 0) {
          // Aggiungi la sequenza corrente a missingSequences e resetta
          missingOrderSequences.push(currentOrderSequence)
          currentOrderSequence = []
        }
      }

      for (let i = 0; i < missingOrderSequences.length; i++) {
        for (let j = 0; j < missingOrderSequences[i].length; j++) {
          let order = missingOrderSequences[i][j]
          let element = sequence.find((item) => {
            return item.order === order
          })

          if (!element) throw "element is undefined"

          currentSequence.push(element)
        }

        missingSequences.push(currentSequence)
        currentSequence = []
      }

      return missingSequences
    } catch (error) {
      console.log(error)
      return null
    }
  }

  private _getUniquePropertyValues<T>(array: T[], property: keyof T): string[] {
    const uniqueValues = new Set<string>()

    array.forEach((item) => {
      const value = item[property]
      if (typeof value === "string") {
        uniqueValues.add(value)
      }
    })

    return Array.from(uniqueValues)
  }

  private _findLowestOrder<T extends { order: number }>(
    array: T[]
  ): T | undefined {
    if (array.length === 0) return undefined

    return array.reduce((lowest, current) =>
      current.order < lowest.order ? current : lowest
    )
  }

  private _findHighestOrder<T extends { order: number }>(
    array: T[]
  ): T | undefined {
    if (array.length === 0) return undefined

    return array.reduce((highest, current) =>
      current.order > highest.order ? current : highest
    )
  }

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
