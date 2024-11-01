import { useLogin, usePrivy } from "@privy-io/react-auth"
import { Auth } from "@src/auth"
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

  const { login } = useLogin({
    onComplete: async (
      user,
      isNewUser,
      wasAlreadyAuthenticated,
      loginMethod,
      linkedAccount
    ) => {
      const authToken = await getAccessToken()

      //need to try farcaster and telegram. LOO-37
      if (
        loginMethod === "apple" ||
        loginMethod === "discord" ||
        loginMethod === "github" ||
        loginMethod === "google" ||
        loginMethod === "instagram" ||
        loginMethod === "linkedin" ||
        loginMethod === "spotify" ||
        loginMethod === "tiktok" ||
        loginMethod === "twitter" ||
        loginMethod === "farcaster" ||
        loginMethod === "telegram"
      )
        //these services brings the user out of the current web page, so we should listen this event when the Auth object boots
        Auth._emit("__onOAuthAuthenticatedDesktop", {
          user,
          isNewUser,
          wasAlreadyAuthenticated,
          loginMethod,
          linkedAccount,
          authToken,
        })
      else
        Auth._emit("__onLoginComplete", {
          user,
          isNewUser,
          wasAlreadyAuthenticated,
          loginMethod,
          linkedAccount,
          authToken,
        })
    },
    onError: (error) => {
      Auth._emit("__onLoginError", error)
    },
  })

  useEffect(() => {
    if (!initialized.current && ready && !disableLogin) {
      initialized.current = true

      //__authenticate fires after the __onLoginComplete & __onLoginError are added in events queue.
      //__authenticate fires in authenticate() method of the auth object.
      auth.on("__authenticate", () => {
        login()
      })
      Auth._emit("__onPrivyReady")
    }

    //account is setup when the client did the login or after the refresh of the page it has rebuilt the account
    //object (and it can do it only if it has a jwt token valid)
    if (authenticated && ready) {
      auth.on(
        "__onAccountReady",
        () => {
          console.log("emitting auth...")
          Auth._emit("auth")
        },
        true
      )

      Auth._emit("__tryRebuildAccountOnRefresh")
    } else if (!authenticated && ready) {
      auth.logout()
      /**
       * //to prevent loop
          (async () => {
            if (auth.isAuthenticated()) {
              console.log("client logout...");
              await auth.logout();
            }
          })();
       * 
       */
    } else if (!ready) {
      console.log("client is not ready at all!")
    }
  }, [ready, disableLogin, authenticated])
}
