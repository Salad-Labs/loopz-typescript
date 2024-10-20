import { useCallback, useContext } from "react"
import { LoopzAuthContext } from "../context/loopzauthcontext"
import { UseLoopzAuth } from "../../types/react/useloopzauth"
import { useLoopz } from "./useLoopz"
import { AuthLinkMethod } from "@src/types/auth/authlinkmethod"
import { NotInitializedError } from "@src/errors/NotInitializedError"
import { AuthLoadingError } from "@src/errors/AuthLoadingError"
import { UnauthenticatedError } from "@src/errors/UnauthenticatedError"

export const useLoopzAuth: UseLoopzAuth = () => {
  const { initialized, instance } = useLoopz()
  const context = useContext(LoopzAuthContext)
  if (!context)
    throw new Error("useLoopzAuth() must be used within a <LoopzProvider />.")

  const { isAuthenticated, isLoading, account, auth } = context

  const authenticate = useCallback(() => {
    if (!initialized) throw new NotInitializedError()
    if (isLoading) throw new AuthLoadingError("authenticate()")

    return !isAuthenticated
      ? instance.auth.authenticate()
      : Promise.resolve({
          auth: auth!,
          account: account!,
        })
  }, [initialized, isLoading, isAuthenticated, auth, account, instance])

  const link = useCallback(
    (method: AuthLinkMethod) => {
      if (!initialized) throw new NotInitializedError()
      if (!isAuthenticated) throw new UnauthenticatedError()
      if (isLoading) throw new AuthLoadingError("link()")

      return instance.auth.link(method)
    },
    [initialized, isAuthenticated, isLoading, instance]
  )

  const sendEmailOTPCode = useCallback(
    (email: string) => {
      if (!initialized) throw new NotInitializedError()

      return instance.auth.sendEmailOTPCode(email)
    },
    [initialized, instance]
  )

  const sendEmailOTPCodeAfterAuth = useCallback(
    (email: string) => {
      if (!initialized) throw new NotInitializedError()

      return instance.auth.sendEmailOTPCodeAfterAuth(email)
    },
    [initialized, instance]
  )

  const sendPhoneOTPCode = useCallback(
    (phone: string) => {
      if (!initialized) throw new NotInitializedError()

      return instance.auth.sendPhoneOTPCode(phone)
    },
    [initialized, instance]
  )

  const sendPhoneOTPCodeAfterAuth = useCallback(
    (phone: string) => {
      if (!initialized) throw new NotInitializedError()

      return instance.auth.sendPhoneOTPCodeAfterAuth(phone)
    },
    [initialized, instance]
  )

  const unlink = useCallback(
    (method: AuthLinkMethod) => {
      if (!initialized) throw new NotInitializedError()
      if (!isAuthenticated) throw new UnauthenticatedError()
      if (isLoading) throw new AuthLoadingError("unlink()")

      return instance.auth.unlink(method)
    },
    [initialized, isAuthenticated, isLoading, instance]
  )

  const logout = useCallback(() => {
    if (!initialized) throw new NotInitializedError()
    if (!isAuthenticated) throw new UnauthenticatedError()
    if (isLoading) throw new AuthLoadingError("logout()")

    return instance.auth.logout()
  }, [initialized, isAuthenticated, isLoading, instance])

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
