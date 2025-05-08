"use client"

import React, { FC } from "react"
import { Maybe } from "../../types"

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
  translations: {
    stepEmailAuthLabel: string
    stepVerificationCodeLabel: string
    emailAddressFieldLabel: string
    buttonSendingVerificationLabel: string
    buttonSendVerificationLabel: string
    sixDigitLabel: string
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
  translations,
  loading,
  error,
  success,
}) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {step === "email"
          ? `${translations.stepEmailAuthLabel}`
          : `${translations.stepVerificationCodeLabel}`}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      {step === "email" ? (
        <form onSubmit={handleRequestCode}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              {translations.emailAddressFieldLabel}
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="your@email.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading
              ? `${translations.buttonSendingVerificationLabel}`
              : `${translations.buttonSendVerificationLabel}`}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode}>
          <div className="mb-4">
            <label
              htmlFor="code"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              {translations.sixDigitLabel}
            </label>
            <input
              type="text"
              id="code"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              required
              autoComplete="one-time-code"
              placeholder="123456"
              maxLength={6}
              pattern="\d{6}"
            />
            <p className="mt-1 text-sm text-gray-600">
              {translations.sixDigitDescriptionLabel} {email}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep("email")}
              className="py-2 px-4 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {translations.backLabel}
            </button>
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className={`flex-1 py-2 px-4 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
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
            className="mt-4 w-full py-2 px-4 rounded-md text-blue-600 font-medium hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {`${translations.resendVerificationCodeLabel}`}
          </button>
        </form>
      )}
    </div>
  )
}

export default LoopzEmailForm
