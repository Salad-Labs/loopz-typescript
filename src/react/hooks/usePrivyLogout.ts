import { useLogout, usePrivy } from "@privy-io/react-auth"
import { Auth } from "@src/auth"
import { useEffect, useRef } from "react"

export const usePrivyLogout = (auth: Auth) => {
  const initialized = useRef<boolean>(false)
  const { ready } = usePrivy()
  const { logout } = useLogout({
    onSuccess: () => {
      Auth._emit("__onLogoutComplete", true)
    },
  })

  useEffect(() => {
    if (!initialized.current && ready) {
      initialized.current = true

      auth.on("__logout", () => {
        logout()
      })
    }
  }, [ready])
}
