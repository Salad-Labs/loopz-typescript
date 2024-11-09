export abstract class Serpens {
  private static _queue: Array<() => any> = []
  private static _isProcessing = false

  /**
   * Adds an action to the queue
   * @param action The action to add to the queue
   * @returns The position of the action in the queue, starting from 1
   */
  public static addAction<T extends () => any>(action: T) {
    const queuePosition = Serpens._queue.push(action)
    Serpens._processQueue()

    return queuePosition
  }

  private static async _processQueue() {
    if (Serpens._isProcessing || Serpens._queue.length === 0) {
      return
    }

    Serpens._isProcessing = true

    while (Serpens._queue.length > 0) {
      const action = Serpens._queue.shift()
      if (!action) break

      try {
        await action()
      } catch {
        // If the action throws an error we don't want to break the queue so we must continue to the next action
        // TODO possible improvement: add error handling.
        // TODO Maybe instead of _queue as an array of function, use an array of objects { action: async () => {}, errorHandler: () => {} }
        continue
      }
    }

    Serpens._isProcessing = false
  }
}
