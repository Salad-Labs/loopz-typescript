export type LoopzChatContextValue = (
  | {
      canChat: false
      isConnecting: false
      isConnected: false
      isSyncing: false
      isSynced: false
    }
  | ({ canChat: true } & (
      | {
          isConnecting: true
          isConnected: false
          isSyncing: false
          isSynced: false
        }
      | {
          isConnecting: false
          isConnected: false
          isSyncing: false
          isSynced: false
        }
      | {
          isConnecting: false
          isConnected: true
          isSyncing: true
          isSynced: false
        }
      | {
          isConnecting: false
          isConnected: true
          isSyncing: false
          isSynced: true
        }
      | {
          isConnecting: false
          isConnected: true
          isSyncing: false
          isSynced: false
        }
    ))
) & {
  setCanChat: (canChat: boolean) => void
  setIsConnected: (isConnected: boolean) => void
  setIsSynced: (isSynched: boolean) => void
}
