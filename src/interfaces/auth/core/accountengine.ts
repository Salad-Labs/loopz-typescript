import { ConnectedWallet } from "@privy-io/react-auth"
import {
  AddGroupFrom,
  ReceiveMessageFrom,
  UserOnlineStatus,
} from "../../../enums"
import { Maybe } from "../../../types"

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
    imageSettings,
    city,
    country,
    instagramPublicUrl,
    xPublicUrl,
    tiktokPublicUrl,
    personalWebsiteUrl,
  }: {
    username: Maybe<string>
    avatarFile: Maybe<File>
    bannerImageFile: Maybe<File>
    bio: Maybe<string>
    imageSettings: Maybe<{ imageX: number; imageY: number; imageZoom: number }>
    city: Maybe<string>
    country: Maybe<string>
    lat: Maybe<number>
    lng: Maybe<number>
    instagramPublicUrl: Maybe<string>
    xPublicUrl: Maybe<string>
    tiktokPublicUrl: Maybe<string>
    personalWebsiteUrl: Maybe<string>
    isCreator: Maybe<boolean>
  }): Promise<
    Maybe<{
      username: Maybe<string>
      avatarUrl: Maybe<string>
      bannerImageUrl: Maybe<string>
      bio: Maybe<string>
      imageSettings: Maybe<{
        imageX: number
        imageY: number
        imageZoom: number
      }>
      city: Maybe<string>
      country: Maybe<string>
      lat: Maybe<number>
      lng: Maybe<number>
      instagramPublicUrl: Maybe<string>
      xPublicUrl: Maybe<string>
      tiktokPublicUrl: Maybe<string>
      personalWebsiteUrl: Maybe<string>
      isCreator: Maybe<boolean>
    }>
  >
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
