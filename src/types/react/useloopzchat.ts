import { LoopzChatContextValue } from "./loopzchatcontextvalue"
import { LoopzChatEventHandlers } from "./loopzchateventhandlers"

export type UseLoopzChat = (
  eventHandlers?: LoopzChatEventHandlers
) => LoopzChatContextValue & {
  // TODO add remaining functions signatures
  connect(): Promise<void>
  reconnect(): Promise<void>
  disconnect(): void
  sync(): Promise<void>
  unsync(): Promise<void>
}
