import { LoopzChatContextValue } from "./loopzchatcontextvalue"

export type UseLoopzChat = () => Omit<
  LoopzChatContextValue,
  "setIsConnected" | "setIsSynced"
> & {
  // TODO add remaining functions signatures
  connect(): Promise<void>
  reconnect(): Promise<void>
  disconnect(): void
  sync(): Promise<void>
}
