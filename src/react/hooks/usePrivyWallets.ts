import { useWallets, getEmbeddedConnectedWallet } from "@privy-io/react-auth"
import { Auth, Order } from "../../"
import { useEffect } from "react"

export const usePrivyWallets = () => {
  const order = Order.getInstance()
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
