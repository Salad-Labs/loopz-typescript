import { useWallets, getEmbeddedConnectedWallet } from "@privy-io/react-auth"
import { Auth } from "@src/index"
import { Order } from "@src/order"
import { useEffect } from "react"

export const usePrivyWallets = (order: Order) => {
  const { ready, wallets } = useWallets()

  useEffect(() => {
    if (ready && wallets) {
      order.on("__onAccountReady", () => {
        if (wallets.length <= 0 || !Auth.account) return

        Auth.account.setActiveWallets(wallets)
        const embeddedWallet = getEmbeddedConnectedWallet(wallets)

        if (embeddedWallet) Auth.account.setEmbeddedWallet(embeddedWallet)
      })
    }
  }, [ready, wallets])
}
