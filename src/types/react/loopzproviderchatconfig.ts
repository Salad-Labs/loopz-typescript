export type LoopzProviderChatConfig = (
  | ({ autoConnect: true } & ({ autoSync: true } | { autoSync?: false }))
  | {
      autoConnect?: false
      autoSync?: false
    }
) & { syncingTime?: number }
