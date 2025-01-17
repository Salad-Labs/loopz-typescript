import { ConnectedWallet } from "@privy-io/react-auth"
import {
  AddGroupFrom,
  ReceiveMessageFrom,
  UserOnlineStatus,
} from "../../../enums"
import { Maybe, Network } from "../../../types"

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
    avatarFile,
    bannerImageFile,
    bio,
    imageSettings: { imageX, imageY, imageZoom },
  }: {
    username: string
    avatarFile: Maybe<File>
    bannerImageFile: Maybe<File>
    bio: string
    imageSettings: { imageX: number; imageY: number; imageZoom: number }
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
