"use client"

import { useWallets, getEmbeddedConnectedWallet } from "@privy-io/react-auth"
import { Order } from "@src/order"
import { useEffect } from "react"

export const usePrivyWallets = (order: Order) => {
  const { ready, wallets } = useWallets()

  useEffect(() => {
    if (ready && wallets) {
      order.on("__onAccountReady", () => {
        if (wallets.length > 0) {
          const account = order.getCurrentAccount()
          if (account) {
            account.setActiveWallets(wallets)
            const embeddedWallet = getEmbeddedConnectedWallet(wallets)

            if (embeddedWallet) account.setEmbeddedWallet(embeddedWallet)
          }
        }
      })
    }
  }, [ready, wallets])
}
