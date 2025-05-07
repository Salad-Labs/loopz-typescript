import { useLogin, usePrivy } from "@privy-io/react-auth"
import { Auth } from "../../auth"
import { useEffect, useRef } from "react"
import { useFundWallet } from "@privy-io/react-auth"
import { Chain } from "viem"

export const usePrivyLogin = () => {
  const auth = Auth.getInstance()
  const initialized = useRef<boolean>(false)
  const { ready, authenticated, getAccessToken } = usePrivy()
  const disableLogin = !ready || (ready && authenticated)

  useFundWallet({
    onUserExited: (fundInfo: {
      address: string
      chain: Chain
      fundingMethod: any | "manual" | null
      balance: bigint | undefined
    }) => {
      auth.getCurrentAccount()?._emit("onFundExit", fundInfo)
    },
  })

  useLogin({
    onComplete: async ({
      user,
      isNewUser,
      wasAlreadyAuthenticated,
      loginMethod,
      loginAccount,
    }) => {},
    onError: (error) => {
      Auth._emit("__onLoginError", error)
    },
  })

  useEffect(() => {
    if (!initialized.current && ready && !disableLogin) {
      initialized.current = true
    }
    if (authenticated && ready) {
    } else if (!authenticated && ready) {
    } else if (!ready) {
    }
  }, [ready, disableLogin, authenticated])
}
