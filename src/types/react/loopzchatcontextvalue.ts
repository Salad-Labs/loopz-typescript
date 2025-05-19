export type LoopzChatContextValue = {
  canChat: boolean
  isConnecting: boolean
  isConnected: boolean
  isSyncing: boolean
  isSynced: boolean
  chatStatusRef: React.MutableRefObject<
    | {
        canChat: boolean
        isConnecting: boolean
        isConnected: boolean
        isSyncing: boolean
        isSynced: boolean
        isAuthenticated: boolean
      }
    | undefined
  >
  setCanChat: (canChat: boolean) => void
  setIsConnected: (isConnected: boolean) => void
  setIsSynced: (isSynced: boolean) => void
  setIsSyncing: (isSyncing: boolean) => void
}
