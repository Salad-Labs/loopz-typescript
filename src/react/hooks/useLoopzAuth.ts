import { useCallback, useContext } from "react"
import { LoopzAuthContext } from "../context/loopzauthcontext"
import { UseLoopzAuth } from "../../types/react/useloopzauth"
import { useLoopz } from "./useLoopz"
import { AuthLinkMethod } from "@src/types/auth/authlinkmethod"

export const useLoopzAuth: UseLoopzAuth = () => {
  const { initialized, instance } = useLoopz()
  const context = useContext(LoopzAuthContext)
  if (!context)
    throw new Error("useLoopzAuth() must be used within a <LoopzProvider />.")

  const authenticate = useCallback(() => {
    // TODO separate checks and for each throw specific error (every function)
    if (!initialized || context.isAuthenticated || context.isLoading) return

    // TODO make context has the same values as those returned from authenticate()
    return instance.auth.authenticate()
  }, [initialized, context, instance])

  const link = useCallback(
    (method: AuthLinkMethod) => {
      if (!initialized || !context.isAuthenticated || context.isLoading) return

      return instance.auth.link(method)
    },
    [initialized, context, instance]
  )

  const sendEmailOTPCode = useCallback(
    (email: string) => {
      if (!initialized) return

      return instance.auth.sendEmailOTPCode(email)
    },
    [initialized, instance]
  )

  const sendEmailOTPCodeAfterAuth = useCallback(
    (email: string) => {
      if (!initialized) return

      return instance.auth.sendEmailOTPCodeAfterAuth(email)
    },
    [initialized, instance]
  )

  const sendPhoneOTPCode = useCallback(
    (phone: string) => {
      if (!initialized) return

      return instance.auth.sendPhoneOTPCode(phone)
    },
    [initialized, instance]
  )

  const sendPhoneOTPCodeAfterAuth = useCallback(
    (phone: string) => {
      if (!initialized) return

      return instance.auth.sendPhoneOTPCodeAfterAuth(phone)
    },
    [initialized, instance]
  )

  const unlink = useCallback(
    (method: AuthLinkMethod) => {
      if (!initialized || !context.isAuthenticated || context.isLoading) return

      return instance.auth.unlink(method)
    },
    [initialized, context, instance]
  )

  const logout = useCallback(() => {
    if (!initialized || !context.isAuthenticated || context.isLoading) return

    return instance.auth.logout()
  }, [initialized, context, instance])

  return {
    ...context,
    authenticate,
    link,
    sendEmailOTPCode,
    sendEmailOTPCodeAfterAuth,
    sendPhoneOTPCode,
    sendPhoneOTPCodeAfterAuth,
    unlink,
    logout,
  }
}
