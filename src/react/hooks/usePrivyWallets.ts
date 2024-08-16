import { useWallets } from "@privy-io/react-auth"
import { Trade } from "@src/trade"
import { useEffect, useRef } from "react"

export const usePrivyWallets = (trade: Trade) => {
  const initialized = useRef<boolean>(false)
  const { ready, wallets } = useWallets()

  useEffect(() => {
    if (!initialized.current && ready) {
      const account = trade.getCurrentAccount()
      console.log(account)
      if (account) account.setWallets(wallets)
    }
  }, [ready])
}
