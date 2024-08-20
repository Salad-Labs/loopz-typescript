import { ConnectedWallet } from "@privy-io/react-auth"
import { Maybe, Network } from "@src/types"

export interface AccountEngine {
  destroyLastUserLoggedKey(): void
  storeLastUserLoggedKey(): void
  getActiveWallets(): Array<ConnectedWallet>
  setActiveWallets(wallets: Array<ConnectedWallet>): void
  emptyActiveWallets(wallets: Array<ConnectedWallet>): void
  getCurrentNetwork(): Network
  changeNetwork(chainId: number | `0x${string}`): Promise<void>
  getEmbeddedWallet(): Maybe<ConnectedWallet>
  setEmbeddedWallet(wallet: ConnectedWallet): void
}
