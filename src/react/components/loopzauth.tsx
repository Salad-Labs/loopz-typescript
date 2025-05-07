"use client"

import React, { FC, ReactNode, useCallback, useEffect, useState } from "react"
import { Auth, Maybe, useLoopz } from "../../"
import { LoopzAuthContext } from "../context"
import LoopzEmailForm from "./loopzemailform"
import { LoopzAuthConfig } from "src/types/react/loopzauthconfig"
import {
  BACKEND_URLS,
  CLIENT_DB_KEY_REFRESH_TOKEN,
  CLIENT_DB_KEY_TOKEN,
} from "src/constants/app"
import { jwtDecode } from "jwt-decode" // Aggiungiamo questa libreria
import fetchApi from "src/core/utilities/fetchapi"

interface JwtPayload {
  email: string
  exp: number
  iat: number
}

export const LoopzAuth: FC<
  { devMode: boolean; children: ReactNode } & LoopzAuthConfig
> = ({ devMode, children, intl, apiKey }) => {
  const ENDPOINT = devMode ? BACKEND_URLS.development : BACKEND_URLS.production

  const { instance, initialized } = useLoopz()

  const [authToken, setAuthToken] = useState<Maybe<string>>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [code, setCode] = useState<string>("")
  const [step, setStep] = useState<"email" | "code">("email")
  const [success, setSuccess] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Maybe<string>>("")

  const verifyToken = (token: string): boolean => {
    try {
      // Decodifica il token senza verificare la firma (che può essere fatta solo lato server)
      const decoded = jwtDecode<JwtPayload>(token)

      // Verifica che il token contenga una email e non sia scaduto
      if (!decoded.email) return false

      // Verifica la data di scadenza del token
      const currentTime = Date.now() / 1000
      if (decoded.exp && decoded.exp < currentTime) return false

      return true
    } catch (error) {
      // Se il token non è un JWT valido, jwt_decode lancerà un'eccezione
      console.error("Invalid token:", error)
      return false
    }
  }

  const requestOtpCode = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, response } = await fetchApi(
        `${ENDPOINT}/auth/request-code`,
        {
          method: "POST",
          body: JSON.stringify({ email }),
        }
      )

      if (response.ok) {
        setSuccess(
          intl?.successRequestOtpCode
            ? intl.successRequestOtpCode
            : "Verification code sent to your email"
        )
        setStep("code")
      } else {
        setError(
          data.message ??
            intl?.failedSendRequestOtpCode ??
            "Failed to send verification code"
        )
      }
    } catch (err) {
      console.log(err)
      setError(
        intl?.networkError
          ? intl.networkError
          : "Network error. Please try again."
      )

      Auth._emit("__onLoginError", err)
    } finally {
      setLoading(false)
    }
  }, [email])

  const verifyOtpCode = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, response } = await fetchApi(
        `${ENDPOINT}/auth/verify-code`,
        {
          method: "POST",
          body: JSON.stringify({ email, code }),
          headers: {
            "x-api-key": apiKey,
          },
        }
      )

      if (response.ok) {
        // Save JWT token to localStorage
        localStorage.setItem(CLIENT_DB_KEY_TOKEN, data.token)
        localStorage.setItem(CLIENT_DB_KEY_REFRESH_TOKEN, data.refreshToken)

        setSuccess(
          intl?.authSuccess ? intl.authSuccess : "Authentication successfull"
        )

        Auth._emit("__onLoginComplete", {
          user: {
            email: data.email,
          },
          authToken: data.token,
          id: data.did,
        })
      } else {
        setError(
          data.message ??
            intl?.invalidOtpCode ??
            "Failed to send verification code"
        )
      }
    } catch (err) {
      setError(
        intl?.networkError
          ? intl.networkError
          : "Network error. Please try again."
      )

      Auth._emit("__onLoginError", err)
    } finally {
      setLoading(false)
    }
  }, [email, code])

  const logout = useCallback(() => {
    setAuthToken(null)
    setIsAuthenticated(false)
    setShowEmailForm(false)
    setEmail("")
    setCode("")
    setStep("email")
    setSuccess("")
    setLoading(false)
    setError(null)

    Auth._emit("__onLogoutComplete", true)
  }, [])

  useEffect(() => {
    if (initialized) {
      instance.auth.on("__authenticate", () => {
        setShowEmailForm(true)
      })

      instance.auth.on(
        "__onAccountReady",
        () => {
          console.log("emitting auth...")
          Auth._emit("auth")
        },
        true
      )

      const token = localStorage.getItem(CLIENT_DB_KEY_TOKEN)

      if (token) {
        const isValidToken = verifyToken(token)

        if (isValidToken) {
          setAuthToken(token)
          setIsAuthenticated(true)
        } else {
          // Se il token non è valido, cancellalo
          if (token) localStorage.removeItem("authToken")
          setAuthToken(null)
          setIsAuthenticated(false)
        }
      }

      instance.auth.on("logout", () => {
        logout()
      })
    }
  }, [initialized])

  useEffect(() => {
    if (isAuthenticated) {
      Auth._emit("__tryRebuildAccountOnRefresh")
    }
  }, [authToken, isAuthenticated])

  if (!initialized) return null

  return (
    <LoopzAuthContext.Provider value={null}>
      <>
        {showEmailForm && (
          <>
            <LoopzEmailForm
              handleRequestCode={async (e: React.FormEvent) => {
                e.preventDefault()
                requestOtpCode()
              }}
              handleVerifyCode={async (e: React.FormEvent) => {
                e.preventDefault()
                verifyOtpCode()
              }}
              setEmail={setEmail}
              setCode={setCode}
              setStep={setStep}
              email={email}
              code={code}
              step={step}
              translations={
                {
                  stepEmailAuthLabel: intl?.stepEmailAuthLabel
                    ? intl.stepEmailAuthLabel
                    : "Email Authentication",
                  stepVerificationCodeLabel: intl?.stepVerificationCodeLabel
                    ? intl.stepVerificationCodeLabel
                    : "Enter Verification Code",
                  emailAddressFieldLabel: intl?.emailAddressFieldLabel
                    ? intl.emailAddressFieldLabel
                    : "Email Address",
                  buttonSendingVerificationLabel:
                    intl?.buttonSendingVerificationLabel
                      ? intl.buttonSendingVerificationLabel
                      : "Sending...",
                  buttonSendVerificationLabel: intl?.buttonSendVerificationLabel
                    ? intl.buttonSendVerificationLabel
                    : "Send Verification Code",
                  sixDigitLabel: intl?.sixDigitLabel
                    ? intl.sixDigitLabel
                    : "6-Digit Verification Code",
                  sixDigitDescriptionLabel: intl?.sixDigitDescriptionLabel
                    ? intl?.sixDigitDescriptionLabel
                    : "Please enter the 6-digit code sent to",
                  backLabel: intl?.backLabel ? intl.backLabel : "Back",
                  buttonVerifyingCodeLabel: intl?.buttonSendingVerificationLabel
                    ? intl.buttonSendingVerificationLabel
                    : "Verifying...",
                  buttonVerifyCodeLabel: intl?.buttonVerifyCodeLabel
                    ? intl.buttonVerifyCodeLabel
                    : "Verify Code",
                  resendVerificationCodeLabel: intl?.resendVerificationCodeLabel
                    ? intl.resendVerificationCodeLabel
                    : "Resend Verification Code",
                } as any
              }
              loading={loading}
              error={error}
              success={success}
            />
          </>
        )}
      </>
      <>{children}</>
    </LoopzAuthContext.Provider>
  )
}
