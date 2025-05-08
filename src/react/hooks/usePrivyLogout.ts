import { usePrivy } from "@privy-io/react-auth"
import { useEffect, useRef } from "react"

export const usePrivyLogout = () => {
  const initialized = useRef<boolean>(false)
  const { ready } = usePrivy()

  useEffect(() => {
    if (!initialized.current && ready) {
      initialized.current = true
    }
  }, [ready])
}
