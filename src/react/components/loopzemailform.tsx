"use client"

import React, { FC } from "react"
import { Maybe } from "../../types"
import { XMarkIcon } from "@heroicons/react/24/outline"

const LoopzEmailForm: FC<{
  handleRequestCode: (e: React.FormEvent) => void
  handleVerifyCode: (e: React.FormEvent) => void
  setEmail: React.Dispatch<React.SetStateAction<string>>
  setCode: React.Dispatch<React.SetStateAction<string>>
  setStep: React.Dispatch<React.SetStateAction<"email" | "code">>
  email: string
  code: string
  step: "email" | "code"
  loading: boolean
  error: Maybe<string>
  success: string
  logoURL: string
  tosURL: string
  privacyURL: string
  onClose?: () => void
  onBack?: () => void
  translations: {
    titleApp: string
    stepVerificationCodeLabel: string
    stepVerificationCodeDescriptionLabel: string
    emailAddressFieldLabel: string
    buttonSendingVerificationLabel: string
    buttonSendVerificationLabel: string
    sixDigitDescriptionLabel: string
    backLabel: string
    buttonVerifyingCodeLabel: string
    buttonVerifyCodeLabel: string
    resendVerificationCodeLabel: string
  }
}> = ({
  handleRequestCode,
  handleVerifyCode,
  setEmail,
  setCode,
  setStep,
  email,
  code,
  step,
  logoURL,
  tosURL,
  privacyURL,
  translations,
  loading,
  error,
  success,
  onClose,
  onBack,
}) => {
  return (
    <div
      className="w-full p-6 shadow-2xl relative overflow-hidden"
      style={{
        backgroundColor: "rgb(31,31,30)",
        borderRadius: "24px",
      }}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}

      <div className="flex flex-col w-full">
        <div className="text-center w-full text-white font-normal">
          {translations.titleApp}
        </div>

        <div
          className="flex items-center justify-center w-full"
          style={{
            marginTop: "35px",
            marginBottom: "35px",
          }}
        >
          <img
            src={logoURL}
            style={{
              maxHeight: "90px",
              maxWidth: "180px",
            }}
          />
        </div>
      </div>

      {step === "code" && (
        <div
          className="flex flex-col items-center justify-center gap-y-2"
          style={{
            marginBottom: "50px",
          }}
        >
          <h2 className="text-lg font-normal text-center text-white">
            {`${translations.stepVerificationCodeLabel}`}
          </h2>
          <p className="text-white font-normal text-xs text-center">
            {`${translations.stepVerificationCodeDescriptionLabel}`}
          </p>
        </div>
      )}

      {error && (
        <div
          className="mb-4 p-3 bg-red-50 text-xs border-l-4 border-red-500 text-red-700 rounded-md animate-fadeIn"
          style={{
            marginBottom: "35px",
          }}
        >
          {error}
        </div>
      )}

      {step === "email" ? (
        <form onSubmit={handleRequestCode} className="space-y-4">
          <div className="space-y-2">
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 text-sm border border-solid text-white placeholder:text-gray-200 focus:outline-none transition-shadow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="your@email.com"
              autoFocus
              style={{
                backgroundColor: "transparent",
                borderColor: "#b0b0b0",
                borderRadius: "16px",
              }}
              onFocus={(event) => {
                const target = event.target
                target.style.borderColor = "#fff"
              }}
              onBlur={(event) => {
                const target = event.target
                target.style.borderColor = "#909090"
              }}
            />
            <div
              className="w-full text-center text-white text-xs"
              style={{ marginTop: "15px" }}
            >
              By logging in, you agree to the{" "}
              <a
                className="font-semibold text-white"
                href={tosURL}
                target="_blank"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                className="font-semibold text-white"
                href={privacyURL}
                target="_blank"
              >
                Privacy Policy
              </a>
              .
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg bg-primary-blue hover:bg-primary-dark-blue text-white font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading
              ? `${translations.buttonSendingVerificationLabel}`
              : `${translations.buttonSendVerificationLabel}`}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                id="code"
                className="w-full px-4 py-3 text-white border border-solid focus:outline-none text-lg tracking-widest text-center otp-code"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                required
                autoComplete="one-time-code"
                placeholder="123456"
                maxLength={6}
                pattern="\d{6}"
                autoFocus
                style={{
                  backgroundColor: "transparent",
                  borderColor: "#b0b0b0",
                  borderRadius: "16px",
                }}
                onFocus={(event) => {
                  const target = event.target
                  target.style.borderColor = "#fff"
                }}
                onBlur={(event) => {
                  const target = event.target
                  target.style.borderColor = "#909090"
                }}
              />
              <style type="text/css">
                {`
                  .otp-code::placeholder {
                    color: gray;
                  }
                `}
              </style>
              <div
                className="absolute bottom-full left-0 mb-1 text-sm whitespace-nowrap"
                style={{
                  color: "#909090",
                }}
              >
                {translations.sixDigitDescriptionLabel}{" "}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setStep("email")
                if (onBack) onBack()
              }}
              className="py-3 px-4 rounded-lg text-black font-medium bg-white hover:bg-white transition-colors"
            >
              {translations.backLabel}
            </button>
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className={`flex-1 py-3 px-4 rounded-lg text-white bg-primary-blue hover:bg-primary-dark-blue ${
                loading || code.length !== 6
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
            >
              {loading
                ? `${translations.buttonVerifyingCodeLabel}`
                : `${translations.buttonVerifyCodeLabel}`}
            </button>
          </div>

          <button
            type="button"
            onClick={handleRequestCode}
            className="w-full py-2 px-4 rounded-md text-blue-600 font-medium hover:text-blue-800 focus:outline-none focus:underline transition-all duration-200"
          >
            {`${translations.resendVerificationCodeLabel}`}
          </button>
        </form>
      )}
      <div
        className="flex items-center justify-center gap-x-2 w-full text-center text-white text-xs"
        style={{
          marginTop: "20px",
        }}
      >
        Powered by{" "}
        <a href="https://www.saladlabs.xyz/portfolio/sdk/" target="_blank">
          <img
            src="https://s3.eu-west-1.amazonaws.com/media.loopz.xyz/static/logo-loopz.svg"
            style={{ height: "15px" }}
          />
        </a>
      </div>
    </div>
  )
}

export default LoopzEmailForm
