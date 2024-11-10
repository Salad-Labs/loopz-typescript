export abstract class Serpens {
  private static _queue: Array<() => any> = []
  private static _isProcessing = false

  /**
   * Adds an action to the queue
   * @param action The action to add to the queue
   * @returns A promise resolved with the action return value, fulfilled when the action in the queue gets executed
   */
  public static addAction<T>(action: Function): Promise<T> {
    const actionPromise = new Promise<T>((resolve, reject) => {
      Serpens._queue.push(async () => {
        try {
          const result = await action()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
    })

    Serpens._processQueue()

    return actionPromise
  }

  private static async _processQueue() {
    if (Serpens._isProcessing || Serpens._queue.length === 0) {
      return
    }

    Serpens._isProcessing = true

    while (Serpens._queue.length > 0) {
      const action = Serpens._queue.shift()
      if (!action) continue

      await action()
    }

    Serpens._isProcessing = false
  }
}
