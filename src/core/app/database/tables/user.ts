import { Maybe, Network } from "../../../../types"

export interface LocalDBUser {
  did: string //primary key
  organizationId: string //primary key
  username: string
  email: string
  bio: string
  avatarUrl: string
  imageSettings: Maybe<{
    imageX: number
    imageY: number
    imageZoom: number
  }>
  isVerified: boolean
  isPfpNft: boolean
  pfp: Maybe<{
    collectionAddress: string
    tokenId: string
    networkId: Network
  }>
  wallet: {
    address: string
    connectorType: string
    imported: boolean
    recoveryMethod: string
    clientType: string
  }
  apple: Maybe<{
    subject: Maybe<string>
    email: Maybe<string>
  }>
  discord: Maybe<{
    subject: Maybe<string>
    email: Maybe<string>
    username: Maybe<string>
  }>
  farcaster: Maybe<{
    fid: Maybe<number>
    displayName: Maybe<string>
    ownerAddress: Maybe<string>
    pfp: Maybe<string>
    username: Maybe<string>
    signerPublicKey: Maybe<string>
  }>
  github: Maybe<{
    subject: Maybe<string>
    email: Maybe<string>
    name: Maybe<string>
    username: Maybe<string>
  }>
  google: Maybe<{
    subject: Maybe<string>
    email: Maybe<string>
    name: Maybe<string>
  }>
  instagram: Maybe<{
    subject: Maybe<string>
    username: Maybe<string>
  }>
  linkedin: Maybe<{
    subject: Maybe<string>
    email: Maybe<string>
    name: Maybe<string>
    vanityName: Maybe<string>
  }>
  spotify: Maybe<{
    subject: Maybe<string>
    email: Maybe<string>
    name: Maybe<string>
  }>
  telegram: Maybe<{
    firstName: Maybe<string>
    lastName: Maybe<string>
    photoUrl: Maybe<string>
    userId: Maybe<string>
    username: Maybe<string>
  }>
  tiktok: Maybe<{
    name: Maybe<string>
    subject: Maybe<string>
    username: Maybe<string>
  }>
  twitter: Maybe<{
    name: Maybe<string>
    subject: Maybe<string>
    profilePictureUrl: Maybe<string>
    username: Maybe<string>
  }>
  proposalNotificationPush: boolean
  proposalNotificationSystem: boolean
  orderNotificationPush: boolean
  orderNotificationSystem: boolean
  followNotificationPush: boolean
  followNotificationSystem: boolean
  collectionNotificationPush: boolean
  collectionNotificationSystem: boolean
  generalNotificationPush: boolean
  generalNotificationSystem: boolean
  accountSuspended: boolean
  allowNotification: boolean
  allowNotificationSound: boolean
  visibility: boolean
  onlineStatus: "OFFLINE" | "ONLINE" | "BUSY"
  allowReadReceipt: boolean
  allowReceiveMessageFrom: "NO_ONE" | "ONLY_FOLLOWED" | "EVERYONE"
  allowAddToGroupsFrom: "EVERYONE" | "ONLY_FOLLOWED"
  allowGroupsSuggestion: boolean
  e2ePublicKey: string
  e2eEncryptedPrivateKey: string
  createdAt: Date
  updatedAt: Maybe<Date>
}
