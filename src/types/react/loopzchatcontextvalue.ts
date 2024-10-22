export type LoopzChatContextValue = (
  | { isLoading: true; isConnected: false; isSynched: false }
  | { isLoading: false; isConnected: false; isSynched: false }
  | { isLoading: false; isConnected: true; isSynched: false }
  | { isLoading: false; isConnected: true; isSynched: true }
) & {
  setIsConnected: (isConnected: boolean) => void
  setIsSynched: (isSynched: boolean) => void
}
