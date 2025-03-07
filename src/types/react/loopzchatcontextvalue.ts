export type LoopzChatContextValue = {
  canChat: boolean
  isConnecting: boolean
  isConnected: boolean
  isSyncing: boolean
  isSynced: boolean
  setCanChat: (canChat: boolean) => void
  setIsConnected: (isConnected: boolean) => void
  setIsSynced: (isSynched: boolean) => void
}
