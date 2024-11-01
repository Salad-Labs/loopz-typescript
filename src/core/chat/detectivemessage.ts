import { Auth, Chat } from "../.."
import { Converter, getUniquePropertyValues, Message, QIError } from ".."
import { Maybe } from "../../types"
import { DexieStorage } from "../app"
import {
  LocalDBDetectiveMessageCollector,
  LocalDBDetectiveMessageQueue,
} from "../app/database"
import { v4 as uuid } from "uuid"

export class DetectiveMessage {
  private _storage: DexieStorage

  private _detectiveMessageTimeout: Maybe<NodeJS.Timeout> = null

  private _detectiveMessageObserveTimeout: Maybe<NodeJS.Timeout> = null

  private _currentConversationId: Maybe<string> = null

  private _detectiveMessageCanRun: boolean = true

  static readonly DETECTIVE_MESSAGE_TIME: number = 60000

  static readonly DETECTIVE_MESSAGE_OBSERVE_TIME: number = 60000

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
          id: uuid(),
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

  async observe(conversationId: string, chat: Chat) {
    if (!this._detectiveMessageCanRun) return
    if (
      this._currentConversationId !== conversationId &&
      this._detectiveMessageObserveTimeout
    )
      clearTimeout(this._detectiveMessageObserveTimeout)

    //we assign the current conversation id
    this._currentConversationId = conversationId

    //we get the messages from the queue. If we have some results, we filter for the conversation id
    const queues = await this._storage.transaction(
      "r",
      "detectivemessagequeue",
      async (tx) => {
        return (await this._storage.detectivemessagequeue.toArray()).filter(
          (element) => element.conversationId === this._currentConversationId
        )
      }
    )

    //if we have some elements in the queues, we can start to ask the server to request the missing messages
    //we don't check this part with an if (queues.length > 0) since the for..loop already checks that.
    for (let i = 0; i < queues.length; i++) {
      let queueItem = queues[i]

      //for a queue processed, we delete the item from the database
      if (queueItem.processed) {
        //now that we have the elements to remove, we remove them from the table
        await this._storage.deleteBulk("detectivemessagequeue", [queueItem.id])
      } else {
        //for a queue not processed, we ask for the server the missing messages, and after we marked them as processed, in this way in the next iteration
        //these queues will be removed from the database
        try {
          const listMessagesFirsSet = await chat.listMessagesByRangeOrder({
            id: conversationId,
            minOrder: queueItem.queue[0], //this element contains the min order value
            maxOrder: queueItem.queue[queueItem.queue.length - 1], //this element contains the max order value
          })

          if (listMessagesFirsSet instanceof QIError)
            throw new Error(JSON.stringify(listMessagesFirsSet))

          let { nextToken, items } = listMessagesFirsSet
          let messages = [...items]
          let isError = false

          while (nextToken) {
            const set = await chat.listMessagesByRangeOrder({
              id: conversationId,
              minOrder: queueItem.queue[0], //this element contains the min order value
              maxOrder: queueItem.queue[queueItem.queue.length - 1], //this element contains the max order value
              nextToken,
            })

            if (set instanceof QIError) {
              isError = true
              break
            }

            const { nextToken: token, items } = set

            messages = [...messages, ...items]

            if (token) nextToken = token
            else break
          }

          if (isError) continue

          //if no error occured, then we store the messages in the local messages table
          await this._storage.insertBulkSafe(
            "message",
            messages.map((message) =>
              Converter.fromMessageToLocalDBMessage(
                message,
                Auth.account!.did,
                Auth.account!.organizationId,
                false,
                "USER"
              )
            )
          )

          //finally we mark the queue item as processed
          await this._storage.detectivemessagequeue.update(queueItem, {
            processed: true,
          })
        } catch (error) {
          console.log(error)
          continue
        }
      }
    }

    //after everything is completed, we call again the function recursively
    this._detectiveMessageObserveTimeout = setTimeout(() => {
      this.observe(conversationId, chat)
    }, DetectiveMessage.DETECTIVE_MESSAGE_OBSERVE_TIME)
  }

  unobserve() {
    if (!this._detectiveMessageCanRun) return
    if (this._detectiveMessageObserveTimeout)
      clearTimeout(this._detectiveMessageObserveTimeout)
  }

  async scan() {
    if (!this._detectiveMessageCanRun) return

    //we get the messages stored of the current user
    const clues = await this._storage.transaction(
      "r",
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
      const conversationIds = getUniquePropertyValues(clues, "conversationId")
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
          let itemsForQueue: Array<LocalDBDetectiveMessageQueue> = []
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
              processed: false,
              createdAt: new Date(),
            })

            await this._storage.insertBulkSafe(
              "detectivemessagequeue",
              itemsForQueue
            )
          }
        }

        //now that we have inserted the elements (or not), we can delete the clues from the detectivemessagecollector table,
        //except for the last (the element with the order value higher).
        //since conversationMessages has an "elements" property that contains all the clues sorted by "order" from the lowest to the highest,
        //this means the element to keep is the last, and the elements to remove are the remainings (except when there is only one clue in the array)

        const elementsToRemove: Array<LocalDBDetectiveMessageCollector> = []

        if (conversationMessages[i].elements.length > 1) {
          for (let j = 0; j < conversationMessages[i].elements.length; j++) {
            let element = conversationMessages[i].elements[j]

            if (j < conversationMessages[i].elements.length - 1)
              elementsToRemove.push(element.clue)
          }

          //now that we have the elements to remove, we remove them from the table
          await this._storage.deleteBulk(
            "detectivemessagecollector",
            elementsToRemove.map((element) => element.id)
          )
        }
      }
    }

    this._detectiveMessageTimeout = setTimeout(
      this.scan,
      DetectiveMessage.DETECTIVE_MESSAGE_TIME
    )
  }

  stopScan() {
    if (!this._detectiveMessageCanRun) return
    if (this._detectiveMessageTimeout)
      clearTimeout(this._detectiveMessageTimeout)
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
