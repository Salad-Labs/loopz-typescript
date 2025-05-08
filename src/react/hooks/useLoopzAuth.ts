import { useCallback, useContext } from "react"
import { LoopzAuthProviderContext } from "../context/loopzauthprovidercontext"
import { UseLoopzAuth } from "../../types/react/useloopzauth"
import { NotInitializedError } from "../../errors/NotInitializedError"
import { LoadingError } from "../../errors/AuthLoadingError"
import { UnauthenticatedError } from "../../errors/UnauthenticatedError"
import { LoopzContext } from "../context/loopzcontext"

export const useLoopzAuth: UseLoopzAuth = () => {
  const loopzContext = useContext(LoopzContext)
  const authContext = useContext(LoopzAuthProviderContext)
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

  const logout = useCallback(() => {
    if (!initialized) throw new NotInitializedError()
    if (!isAuthenticated) throw new UnauthenticatedError()
    if (isLoading) throw new LoadingError("logout()", "Auth")

    return instance.auth.logout()
  }, [initialized, isAuthenticated, isLoading, instance])

  return {
    ...authContext,
    authenticate,
    logout,
  }
}
