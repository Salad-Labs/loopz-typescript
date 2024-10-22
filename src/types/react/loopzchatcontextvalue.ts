export type LoopzChatContextValue = (
  | {
      isConnecting: true
      isConnected: false
      isSynching: false
      isSynched: false
    }
  | {
      isConnecting: false
      isConnected: false
      isSynching: false
      isSynched: false
    }
  | {
      isConnecting: false
      isConnected: true
      isSynching: true
      isSynched: false
    }
  | {
      isConnecting: false
      isConnected: true
      isSynching: false
      isSynched: true
    }
  | {
      isConnecting: false
      isConnected: true
      isSynching: false
      isSynched: false
    }
) & {
  setIsConnected: (isConnected: boolean) => void
  setIsSynched: (isSynched: boolean) => void
}
