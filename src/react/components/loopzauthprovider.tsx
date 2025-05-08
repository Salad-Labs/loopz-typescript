"use client"

import React, { FC, ReactNode, useCallback, useEffect, useState } from "react"
import { LoopzAuthProviderContext } from "../context/loopzauthprovidercontext"
import { useLoopz } from "../hooks"
import { LoopzAuthProviderContextValue } from "../../types/react/loopzauthprovidercontextvalue"

export const LoopzAuthProvider: FC<{
  children?: ReactNode
}> = ({ children }) => {
  const { instance, initialized } = useLoopz()

  const [authStatus, setAuthStatus] = useState<LoopzAuthProviderContextValue>({
    isLoading: true,
    isAuthenticated: false,
    account: null,
    auth: null,
  })

  const handleAuth = useCallback(() => {
    if (!initialized) return

    const isAuthenticated = instance.auth.isAuthenticated()
    const authInfo = instance.auth.getAuthInfo()
    const currentAccount = instance.auth.getCurrentAccount()

    setAuthStatus({
      isLoading: false,
      isAuthenticated: isAuthenticated,
      auth: isAuthenticated ? authInfo : null,
      account: isAuthenticated ? currentAccount : null,
    } as LoopzAuthProviderContextValue)
  }, [initialized, instance])

  useEffect(() => {
    if (!initialized) return

    instance.auth.on("auth", handleAuth)
    instance.auth.on("onAuthError", handleAuth)
    instance.auth.on("logout", handleAuth)

    return () => {
      instance.auth.off("auth", handleAuth)
      instance.auth.off("onAuthError", handleAuth)
      instance.auth.off("logout", handleAuth)
    }
  }, [initialized, instance, handleAuth])

  useEffect(() => {
    if (!initialized) return
  }, [initialized, instance])

  return (
    <LoopzAuthProviderContext.Provider value={authStatus}>
      {children}
    </LoopzAuthProviderContext.Provider>
  )
}
