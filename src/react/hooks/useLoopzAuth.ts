import { useCallback, useContext } from "react"
import { LoopzAuthContext } from "../context/loopzauthcontext"
import { UseLoopzAuth } from "../../types/react/useloopzauth"
import { AuthLinkMethod } from "../../types/auth/authlinkmethod"
import { NotInitializedError } from "../../errors/NotInitializedError"
import { LoadingError } from "../../errors/AuthLoadingError"
import { UnauthenticatedError } from "../../errors/UnauthenticatedError"
import { LoopzContext } from "../context/loopzcontext"

export const useLoopzAuth: UseLoopzAuth = () => {
  const loopzContext = useContext(LoopzContext)
  const authContext = useContext(LoopzAuthContext)
  if (!loopzContext || !authContext)
    throw new Error("useLoopzAuth() must be used within a <LoopzProvider />.")

  const { initialized, instance } = loopzContext
  const { isAuthenticated, isLoading, account, auth } = authContext

  const authenticate = useCallback(() => {
    if (!initialized) throw new NotInitializedError()
    if (isLoading) throw new LoadingError("authenticate()", "Auth")

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
      if (isLoading) throw new LoadingError("link()", "Auth")

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
      if (isLoading) throw new LoadingError("unlink()", "Auth")

      return instance.auth.unlink(method)
    },
    [initialized, isAuthenticated, isLoading, instance]
  )

  const logout = useCallback(() => {
    if (!initialized) throw new NotInitializedError()
    if (!isAuthenticated) throw new UnauthenticatedError()
    if (isLoading) throw new LoadingError("logout()", "Auth")

    return instance.auth.logout()
  }, [initialized, isAuthenticated, isLoading, instance])

  return {
    ...authContext,
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
