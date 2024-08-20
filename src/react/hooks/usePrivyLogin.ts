import { useLogin, usePrivy } from "@privy-io/react-auth"
import { Auth } from "@src/auth"
import { useEffect, useRef } from "react"

export const usePrivyLogin = (auth: Auth) => {
  const initialized = useRef<boolean>(false)
  const { ready, authenticated, getAccessToken } = usePrivy()
  const disableLogin = !ready || (ready && authenticated)

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
        auth._emit("__onOAuthAuthenticatedDesktop", {
          user,
          isNewUser,
          wasAlreadyAuthenticated,
          loginMethod,
          linkedAccount,
          authToken,
        })
      else
        auth._emit("__onLoginComplete", {
          user,
          isNewUser,
          wasAlreadyAuthenticated,
          loginMethod,
          linkedAccount,
          authToken,
        })
    },
    onError: (error) => {
      auth._emit("__onLoginError", error)
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
      auth._emit("__onPrivyReady")
    }

    //account is setup when the client did the login or after the refresh of the page it has rebuilt the account
    //object (and it can do it only if it has a jwt token valid)
    if (authenticated && auth.getCurrentAccount()) {
      console.log("emitting auth...")
      auth._emit("auth")
    } else if (!authenticated && ready) {
      console.log("client logout...")
      //to prevent loop
      if (!auth.isLoggingOut()) auth.logout()
    }
  }, [ready, disableLogin, authenticated])
}
