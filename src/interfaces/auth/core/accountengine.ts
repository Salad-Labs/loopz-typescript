import { ConnectedWallet } from "@privy-io/react-auth"
import { AddGroupFrom, ReceiveMessageFrom, UserOnlineStatus } from "@src/enums"
import { Maybe, Network } from "@src/types"

export interface AccountEngine {
  destroyLastUserLoggedKey(): void
  storeLastUserLoggedKey(): void
  getActiveWallets(): Array<ConnectedWallet>
  setActiveWallets(wallets: Array<ConnectedWallet>): void
  emptyActiveWallets(wallets: Array<ConnectedWallet>): void
  getCurrentNetwork(noCaip?: boolean): string
  changeNetwork(chainId: number | `0x${string}`): Promise<void>
  getEmbeddedWallet(): Maybe<ConnectedWallet>
  setEmbeddedWallet(wallet: ConnectedWallet): void
  updateData({
    username,
    avatarUrl,
    bio,
    pfp: { networkId, collectionAddress, tokenId },
  }: {
    username: string
    avatarUrl: URL
    bio: string
    pfp: {
      networkId: Network
      collectionAddress: string
      tokenId: string
    }
  }): Promise<void>
  updateSettings(
    setting:
      | "proposalNotificationPush"
      | "proposalNotificationSystem"
      | "orderNotificationPush"
      | "orderNotificationSystem"
      | "followNotificationPush"
      | "followNotificationSystem"
      | "collectionNotificationPush"
      | "collectionNotificationSystem"
      | "generalNotificationPush"
      | "generalNotificationSystem",
    enabled: boolean
  ): Promise<void>
  updateChatSettings(settings: {
    allowNotification: boolean
    allowNotificationSound: boolean
    visibility: boolean
    onlineStatus: UserOnlineStatus
    allowReadReceipt: boolean
    allowReceiveMessageFrom: ReceiveMessageFrom
    allowAddToGroupsFrom: AddGroupFrom
    allowGroupsSuggestion: boolean
  }): Promise<void>
  exportPersonalKeys(
    download: boolean,
    callback?: (fileContent: string) => any
  ): Promise<void>
}
