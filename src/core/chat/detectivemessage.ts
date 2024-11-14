import { Auth, Chat, Serpens } from "../.."
import { Converter, getUniquePropertyValues, Message, QIError } from ".."
import { Maybe } from "../../types"
import { DexieStorage } from "../app"
import {
  LocalDBDetectiveMessageCollector,
  LocalDBDetectiveMessageQueue,
} from "../app/database"
import { v4 as uuid } from "uuid"

export class DetectiveMessage {
  private _isScanRunning: boolean = false

  private _isObserveRunning: boolean = false

  private _detectiveMessageTimeout: Maybe<NodeJS.Timeout> = null

  private _detectiveMessageObserveTimeout: Maybe<NodeJS.Timeout> = null

  private _currentConversationId: Maybe<string> = null

  private static _storage: DexieStorage

  private static _detectiveMessageCanRun: boolean = true

  private static _config: Maybe<{ storage: DexieStorage }> = null

  private static _instance: Maybe<DetectiveMessage> = null

  static readonly DETECTIVE_MESSAGE_SCAN_TIME: number = 60000

  static readonly DETECTIVE_MESSAGE_OBSERVE_TIME: number = 10000

  private constructor() {
    if (!!!DetectiveMessage._config)
      throw new Error(
        "DetectiveMessage must be configured before getting the instance."
      )

    DetectiveMessage._instance = this
  }

  public static getInstance() {
    return DetectiveMessage._instance ?? new DetectiveMessage()
  }

  public static config(config: { storage: DexieStorage }) {
    if (!!DetectiveMessage._config)
      throw new Error("DetectiveMessage already configured.")

    DetectiveMessage._config = config
    DetectiveMessage._detectiveMessageCanRun =
      DetectiveMessage._config.storage.isStorageEnabled()
    DetectiveMessage._storage = DetectiveMessage._config.storage

    if (!this._detectiveMessageCanRun)
      console.log("[detective message]: I am disabled :(")
  }

  async collectClue(message: Message, did: string, organizationId: string) {
    if (!DetectiveMessage._detectiveMessageCanRun) return

    try {
      await DetectiveMessage._storage.insertBulkSafe(
        "detectivemessagecollector",
        [
          {
            id: uuid(),
            did,
            organizationId,
            conversationId: message.conversationId,
            messageId: message.id,
            order: message.order,
            createdAt: new Date(),
          },
        ]
      )
    } catch (error) {
      console.log(error)
    }
  }

  async observe(conversationId: string, chat: Chat) {
    if (!DetectiveMessage._detectiveMessageCanRun) return
    if (
      this._currentConversationId !== conversationId &&
      this._detectiveMessageObserveTimeout
    )
      clearTimeout(this._detectiveMessageObserveTimeout)

    //we assign the current conversation id
    this._currentConversationId = conversationId
    this._isObserveRunning = true

    //we get the messages from the queue. If we have some results, we filter for the conversation id
    const queues = await new Promise<LocalDBDetectiveMessageQueue[]>(
      (resolve, reject) => {
        Serpens.addAction(() => {
          DetectiveMessage._storage.detectivemessagequeue
            .toArray()
            .then((array) => {
              resolve(
                array.filter(
                  (element) =>
                    element.conversationId === this._currentConversationId
                )
              )
            })
            .catch(reject)
        })
      }
    )

    //if we have some elements in the queues, we can start to ask the server to request the missing messages
    //we don't check this part with an if (queues.length > 0) since the for..loop already checks that.
    for (let i = 0; i < queues.length; i++) {
      let queueItem = queues[i]

      //for a queue processed, we delete the item from the database
      if (queueItem.processed) {
        //now that we have the elements to remove, we remove them from the table
        await DetectiveMessage._storage.deleteBulk("detectivemessagequeue", [
          queueItem.id,
        ])
      } else {
        //for a queue not processed, we ask for the server the missing messages, and after we marked them as processed, in this way in the next iteration
        //these queues will be removed from the database
        try {
          const listMessagesFirsSet = await chat.listMessagesByRangeOrder(
            {
              id: conversationId,
              minOrder: queueItem.queue[0], //this element contains the min order value
              maxOrder: queueItem.queue[queueItem.queue.length - 1], //this element contains the max order value
            },
            true
          )

          if (listMessagesFirsSet instanceof QIError)
            throw new Error(JSON.stringify(listMessagesFirsSet))

          let { nextToken, items } = listMessagesFirsSet
          let messages = [...items]
          let isError = false

          while (nextToken) {
            const set = await chat.listMessagesByRangeOrder(
              {
                id: conversationId,
                minOrder: queueItem.queue[0], //this element contains the min order value
                maxOrder: queueItem.queue[queueItem.queue.length - 1], //this element contains the max order value
                nextToken,
              },
              true
            )

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
          await DetectiveMessage._storage.insertBulkSafe(
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
          await new Promise((resolve, reject) => {
            Serpens.addAction(() => {
              DetectiveMessage._storage.detectivemessagequeue
                .update(queueItem, {
                  processed: true,
                })
                .then(resolve)
                .catch(reject)
            })
          })
        } catch (error) {
          console.log(error)
          continue
        }
      }
    }

    //we call observe() recursively
    if (this._detectiveMessageObserveTimeout)
      clearTimeout(this._detectiveMessageObserveTimeout)

    this._detectiveMessageObserveTimeout = setTimeout(() => {
      this.observe(conversationId, chat)
    }, DetectiveMessage.DETECTIVE_MESSAGE_OBSERVE_TIME)
  }

  unobserve() {
    if (!DetectiveMessage._detectiveMessageCanRun) return
    if (this._detectiveMessageObserveTimeout)
      clearTimeout(this._detectiveMessageObserveTimeout)

    this._isObserveRunning = false
    this._currentConversationId = null
  }

  async scan() {
    if (!DetectiveMessage._detectiveMessageCanRun) return

    this._isScanRunning = true

    //we get the messages stored of the current user
    const clues = await new Promise<LocalDBDetectiveMessageCollector[]>(
      (resolve, reject) => {
        Serpens.addAction(() => {
          DetectiveMessage._storage.detectivemessagecollector
            .toArray()
            .then((array) => {
              resolve(array.sort((a, b) => a.order - b.order))
            })
            .catch(reject)
        })
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

            await DetectiveMessage._storage.insertBulkSafe(
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
          await DetectiveMessage._storage.deleteBulk(
            "detectivemessagecollector",
            elementsToRemove.map((element) => element.id)
          )
        }
      }
    }

    //we call scan() recursively
    if (this._detectiveMessageTimeout)
      clearTimeout(this._detectiveMessageTimeout)

    this._detectiveMessageTimeout = setTimeout(
      this.scan,
      DetectiveMessage.DETECTIVE_MESSAGE_SCAN_TIME
    )
  }

  stopScan() {
    if (!DetectiveMessage._detectiveMessageCanRun) return
    if (this._detectiveMessageTimeout)
      clearTimeout(this._detectiveMessageTimeout)

    this._isScanRunning = false

    console.warn(
      "Detective message, scan is disabled. If you wanna use it and this action was unintentional, this is a reminder to call again the scan() method in order to restore it."
    )
  }

  clear() {
    this.stopScan()
    this.unobserve()
    DetectiveMessage._storage.truncate("detectivemessagecollector")
    DetectiveMessage._storage.truncate("detectivemessagequeue")
  }

  isScanning(): boolean {
    return this._isScanRunning
  }

  isObserving(): boolean {
    return this._isObserveRunning
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
}
