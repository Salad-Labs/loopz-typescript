"use client"

import React, { FC, ReactNode, useCallback, useEffect, useState } from "react"
import { LoopzAuthContext } from "../context/loopzauthcontext"
import { useLoopz } from "../hooks"
import { LoopzAuthContextValue } from "@src/types/react/loopzauthcontextvalue"

export const LoopzAuthProvider: FC<{
  onSendEmailOTPCode?: Function
  onSendEmailOTPCodeAfterAuth?: Function
  onSendPhoneOTPCode?: Function
  onSendPhoneOTPCodeAfterAuth?: Function
  children?: ReactNode
}> = ({
  onSendEmailOTPCode,
  onSendPhoneOTPCode,
  onSendEmailOTPCodeAfterAuth,
  onSendPhoneOTPCodeAfterAuth,
  children,
}) => {
  const { instance, initialized } = useLoopz()

  const [authStatus, setAuthStatus] = useState<LoopzAuthContextValue>({
    isLoading: true,
    isAuthenticated: false,
    account: null,
  })

  const handleAuth = useCallback(() => {
    if (!initialized) return

    const isAuthenticated = instance.auth.isAuthenticated() ?? false
    const currentAccount = instance.auth.getCurrentAccount() ?? null

    setAuthStatus({
      isLoading: false,
      isAuthenticated: isAuthenticated,
      account: isAuthenticated ? currentAccount : null,
    } as LoopzAuthContextValue)
  }, [initialized, instance])

  const handleSendEmailOTPCode = useCallback(
    async (email: string) => {
      if (!initialized) return
      if (!onSendEmailOTPCode)
        throw new Error(
          "onSendEmailOTPCode is required to allow sendEmailOTPCode to function properly"
        )

      try {
        await Promise.resolve(onSendEmailOTPCode(email))
        instance.auth._emit("__onEmailOTPCodeSent", email)
      } catch (error) {
        console.error(error)
        instance.auth._emit("__onEmailOTPCodeSentError", error)
      }
    },
    [onSendEmailOTPCode]
  )

  const handleSendPhoneOTPCode = useCallback(
    async (phone: string) => {
      if (!initialized) return
      if (!onSendPhoneOTPCode)
        throw new Error(
          "onSendPhoneOTPCode is required to allow sendPhoneOTPCode to function properly"
        )

      try {
        await Promise.resolve(onSendPhoneOTPCode(phone))
        instance.auth._emit("__onSMSOTPCodeSent", phone)
      } catch (error) {
        console.error(error)
        instance.auth._emit("__onSMSOTPCodeSentError", error)
      }
    },
    [onSendEmailOTPCode]
  )

  const handleSendEmailOTPCodeAfterAuth = useCallback(
    async (email: string) => {
      if (!initialized) return
      if (!onSendEmailOTPCodeAfterAuth)
        throw new Error(
          "onSendEmailOTPCodeAfterAuth is required to allow sendEmailOTPCodeAfterAuth to function properly"
        )

      try {
        await Promise.resolve(onSendEmailOTPCodeAfterAuth(email))
        instance.auth._emit("__onEmailOTPCodeAfterAuthSent", email)
      } catch (error) {
        console.error(error)
        instance.auth._emit("__onEmailOTPCodeAfterAuthSentError", error)
      }
    },
    [onSendEmailOTPCodeAfterAuth]
  )

  const handleSendPhoneOTPCodeAfterAuth = useCallback(
    async (email: string) => {
      if (!initialized) return
      if (!onSendPhoneOTPCodeAfterAuth)
        throw new Error(
          "onSendPhoneOTPCodeAfterAuth is required to allow sendPhoneOTPCodeAfterAuth to function properly"
        )

      try {
        await Promise.resolve(onSendPhoneOTPCodeAfterAuth(email))
        instance.auth._emit("__onSMSOTPCodeAfterAuthSent", email)
      } catch (error) {
        console.error(error)
        instance.auth._emit("__onSMSOTPCodeSentAfterAuthError", error)
      }
    },
    [onSendPhoneOTPCodeAfterAuth]
  )

  useEffect(() => {
    if (!initialized) return

    instance.auth.on("auth", handleAuth)
    instance.auth.on("onAuthError", handleAuth)
    instance.auth.on("__logout", handleAuth)

    return () => {
      instance.auth.off("auth", handleAuth)
      instance.auth.off("onAuthError", handleAuth)
      instance.auth.off("__logout", handleAuth)
    }
  }, [initialized, instance, handleAuth])

  useEffect(() => {
    if (!initialized) return

    instance.auth.on("__sendEmailOTPCode", handleSendEmailOTPCode)
    instance.auth.on("__sendSMSOTPCode", handleSendPhoneOTPCode)
    instance.auth.on(
      "__sendEmailOTPCodeAfterAuth",
      handleSendEmailOTPCodeAfterAuth
    )
    instance.auth.on(
      "__sendSMSOTPCodeAfterAuth",
      handleSendPhoneOTPCodeAfterAuth
    )

    return () => {
      instance.auth.off("__sendEmailOTPCode", handleSendEmailOTPCode)
      instance.auth.off("__sendSMSOTPCode", handleSendPhoneOTPCode)
      instance.auth.off(
        "__sendEmailOTPCodeAfterAuth",
        handleSendEmailOTPCodeAfterAuth
      )
      instance.auth.off(
        "__sendSMSOTPCodeAfterAuth",
        handleSendPhoneOTPCodeAfterAuth
      )
    }
  }, [
    initialized,
    instance,
    handleSendEmailOTPCode,
    handleSendPhoneOTPCode,
    handleSendEmailOTPCodeAfterAuth,
    handleSendPhoneOTPCodeAfterAuth,
  ])

  return (
    <LoopzAuthContext.Provider value={authStatus}>
      {children}
    </LoopzAuthContext.Provider>
  )
}
