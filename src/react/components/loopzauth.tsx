"use client"

import React, { FC, ReactNode, useCallback, useEffect, useState } from "react"
import { Auth, Maybe, useLoopz } from "../../"
import { LoopzAuthContext } from "../context"
import LoopzEmailForm from "./loopzemailform"
import { LoopzAuthConfig } from "../../types/react/loopzauthconfig"
import {
  BACKEND_URLS,
  CLIENT_DB_KEY_REFRESH_TOKEN,
  CLIENT_DB_KEY_TOKEN,
} from "../../constants/app"
import { jwtDecode } from "jwt-decode"
import fetchApi from "../../core/utilities/fetchapi"

interface JwtPayload {
  email: string
  exp: number
  iat: number
}

export const LoopzAuth: FC<
  { devMode: boolean; children: ReactNode } & LoopzAuthConfig
> = ({ devMode, children, intl, apiKey, logoURL, tosURL, privacyURL }) => {
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

  const [isFormVisible, setIsFormVisible] = useState<boolean>(false)

  const verifyToken = (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token)

      if (!decoded.email) return false

      const currentTime = Date.now() / 1000
      if (decoded.exp && decoded.exp < currentTime) return false

      return true
    } catch (error) {
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

      if (Auth && typeof Auth._emit === "function") {
        Auth._emit("__onLoginError", err)
      }
    } finally {
      setLoading(false)
    }
  }, [email, ENDPOINT, intl])

  const verifyOtpCode = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: r, response } = await fetchApi(
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
        const { data } = r
        // Save JWT token to localStorage
        localStorage.setItem(CLIENT_DB_KEY_TOKEN, data.token)
        localStorage.setItem(CLIENT_DB_KEY_REFRESH_TOKEN, data.refreshToken)

        setSuccess(
          intl?.authSuccess ? intl.authSuccess : "Authentication successful"
        )

        if (Auth && typeof Auth._emit === "function") {
          Auth._emit("__onLoginComplete", {
            user: {
              email: data.email,
              id: data.did,
            },
            authToken: data.token,
          })
        }

        setTimeout(() => {
          closeEmailForm()
        }, 1500)
      } else {
        setError(
          r.data.message ??
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

      if (Auth && typeof Auth._emit === "function") {
        Auth._emit("__onLoginError", err)
      }
    } finally {
      setLoading(false)
    }
  }, [email, code, ENDPOINT, apiKey, intl])

  const closeEmailForm = useCallback(() => {
    setIsFormVisible(false)
    if (typeof document === "undefined") return
    document.body.style.overflow = "auto"

    setTimeout(() => {
      setShowEmailForm(false)
      setEmail("")
      setCode("")
      setStep("email")
      setSuccess("")
      setError(null)
    }, 300)

    Auth._emit("__onLoginError", {
      error: "user_exit_auth_flow",
    })
  }, [])

  const logout = useCallback(() => {
    setAuthToken(null)
    setIsAuthenticated(false)
    closeEmailForm()
    setLoading(false)

    if (Auth && typeof Auth._emit === "function") {
      Auth._emit("__onLogoutComplete", true)
    }
  }, [closeEmailForm])

  const handleAuthenticate = useCallback(() => {
    try {
      if (typeof document === "undefined") return
      document.body.style.overflow = "hidden"
      setShowEmailForm(true)

      setTimeout(() => {
        setIsFormVisible(true)
      }, 50)
    } catch (error) {
      console.error("Error handling authentication:", error)
    }
  }, [])

  useEffect(() => {
    if (initialized && instance) {
      if (instance.auth && typeof instance.auth.on === "function") {
        instance.auth.on("__authenticate", handleAuthenticate)

        instance.auth.on(
          "__onAccountReady",
          () => {
            console.log("emitting auth...")
            if (Auth && typeof Auth._emit === "function") {
              Auth._emit("auth")
            }
          },
          true
        )

        instance.auth.on("logout", logout)
      }

      try {
        const token = localStorage.getItem(CLIENT_DB_KEY_TOKEN)

        if (token) {
          const isValidToken = verifyToken(token)

          if (isValidToken) {
            setAuthToken(token)
            setIsAuthenticated(true)
          } else {
            localStorage.removeItem(CLIENT_DB_KEY_TOKEN)
            setAuthToken(null)
            setIsAuthenticated(false)
          }
        }
      } catch (error) {
        console.error("Error checking token:", error)
      }
    }

    return () => {
      if (
        initialized &&
        instance &&
        instance.auth &&
        typeof instance.auth.off === "function"
      ) {
        instance.auth.off("__authenticate", handleAuthenticate)
        instance.auth.off("logout", logout)
      }
    }
  }, [initialized, instance, handleAuthenticate, logout])

  useEffect(() => {
    if (isAuthenticated && Auth && typeof Auth._emit === "function") {
      console.log("eeeeeeee")
      Auth._emit("__tryRebuildAccountOnRefresh")
    } else if (Auth && typeof Auth._emit === "function") {
      Auth._emit("__onLoginError")
    }
  }, [authToken, isAuthenticated])

  if (!initialized) return null

  return (
    <LoopzAuthContext.Provider value={null}>
      {showEmailForm && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            zIndex: 9999999,
          }}
        >
          <div
            className={`absolute inset-0 bg-black/40 backdrop-blur-2xl transition-opacity duration-300 ${
              isFormVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeEmailForm}
          ></div>

          <div
            className={`relative transform transition-all duration-300 ease-out ${
              isFormVisible
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-4"
            }`}
            style={{
              width: 360,
            }}
          >
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
              logoURL={logoURL}
              tosURL={tosURL}
              privacyURL={privacyURL}
              translations={{
                titleApp: intl?.titleApp ? intl?.titleApp : "App",
                stepVerificationCodeLabel: intl?.stepVerificationCodeLabel
                  ? intl.stepVerificationCodeLabel
                  : "Enter Verification Code",
                stepVerificationCodeDescriptionLabel:
                  intl?.stepVerificationCodeDescriptionLabel
                    ? intl.stepVerificationCodeDescriptionLabel
                    : "We've sent you an email with an OTP code. Please check and enter your code below.",
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
              }}
              loading={loading}
              error={error}
              success={success}
              onClose={closeEmailForm}
              onBack={() => {
                setSuccess("")
                setError(null)
                setCode("")
              }}
            />
          </div>
        </div>
      )}
      {children}
    </LoopzAuthContext.Provider>
  )
}
