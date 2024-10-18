"use client"

import React, { FC, ReactNode, useCallback, useEffect, useState } from "react"
import { LoopzAccountContext } from "../context/loopzaccountcontext"
import { useLoopz } from "../hooks"
import { LoopzAccountHookValue } from "@src/index"

export const LoopzAccountProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { instance, initialized } = useLoopz()

  const [authStatus, setAuthStatus] = useState<LoopzAccountHookValue>({
    isLoading: true,
    isAuthenticated: false,
    account: null,
  })

  const setAuthenticated = useCallback(() => {
    if (!initialized) throw new Error("Loopz has not been initialized yet")

    const account = instance.auth.getCurrentAccount()
    if (!account)
      throw new Error(
        "Cannot set authenticated account as it's not authenticated"
      )

    setAuthStatus({
      isLoading: false,
      isAuthenticated: true,
      account,
    })
  }, [initialized, instance])

  const setUnauthenticated = useCallback(() => {
    if (!initialized) throw new Error("Loopz has not been initialized yet")

    setAuthStatus({
      isLoading: false,
      isAuthenticated: false,
      account: null,
    })
  }, [initialized, instance])

  useEffect(() => {
    if (!initialized) return

    instance.auth.on("auth", setAuthenticated)
    instance.auth.on("onAuthError", setUnauthenticated)
    instance.auth.on("__logout", setUnauthenticated)

    return () => {
      instance.auth.off("auth", setAuthenticated)
      instance.auth.off("onAuthError", setUnauthenticated)
      instance.auth.off("__logout", setUnauthenticated)
    }
  }, [initialized, instance, setAuthenticated, setUnauthenticated])

  return (
    <LoopzAccountContext.Provider value={authStatus}>
      {children}
    </LoopzAccountContext.Provider>
  )
}
