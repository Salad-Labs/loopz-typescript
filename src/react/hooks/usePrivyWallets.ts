import { useWallets } from "@privy-io/react-auth"
import { Trade } from "@src/trade"
import { useEffect } from "react"

export const usePrivyWallets = (trade: Trade) => {
  const { ready, wallets } = useWallets()

  useEffect(() => {
    if (ready && wallets) {
      trade.on("__onAccountReady", () => {
        if (wallets && wallets.length > 0) {
          const account = trade.getCurrentAccount()
          if (account) account.setActiveWallets(wallets)
        }
      })
    }
  }, [ready, wallets])
}
