import { LoopzChatContextValue } from "./loopzchatcontextvalue"

// TODO change return value to one with functions signatures
export type UseLoopzChat = () => Omit<LoopzChatContextValue, "setIsConnected">
