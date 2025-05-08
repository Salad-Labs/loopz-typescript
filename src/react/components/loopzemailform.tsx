"use client"

import React, { FC } from "react"
import { Maybe } from "../../types"
import { XMarkIcon } from "@heroicons/react/24/outline" // Assicurati di avere heroicons installato o usa un'icona alternativa

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
  onClose?: () => void
  translations: {
    titleApp: string
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
  onClose,
}) => {
  return (
    <div
      className="w-full p-6 rounded-xl shadow-2xl relative overflow-hidden"
      style={{
        backgroundColor: "rgb(31,31,30)",
      }}
    >
      {/* Pulsante di chiusura */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          {/* Se stai usando heroicons */}
          <XMarkIcon className="h-5 w-5" />
          {/* In alternativa puoi usare un semplice simbolo × */}
          {/* <span className="text-xl">&times;</span> */}
        </button>
      )}

      <span>{translations.titleApp}</span>

      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {step === "email"
          ? `${translations.stepEmailAuthLabel}`
          : `${translations.stepVerificationCodeLabel}`}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md animate-fadeIn">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md animate-fadeIn">
          {success}
        </div>
      )}

      {step === "email" ? (
        <form onSubmit={handleRequestCode} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              {translations.emailAddressFieldLabel}
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="your@email.com"
              autoFocus
            />
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
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              {translations.sixDigitLabel}
            </label>
            <div className="relative">
              <input
                type="text"
                id="code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg tracking-widest text-center"
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
              />
              <div className="absolute bottom-full left-0 mb-1 text-sm text-gray-600 whitespace-nowrap">
                {translations.sixDigitDescriptionLabel}{" "}
                <span className="font-medium">{email}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep("email")}
              className="py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {translations.backLabel}
            </button>
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className={`flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 ${
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
            className="w-full py-2 px-4 rounded-md text-blue-600 font-medium hover:text-blue-800 focus:outline-none focus:underline transition-colors"
          >
            {`${translations.resendVerificationCodeLabel}`}
          </button>
        </form>
      )}
    </div>
  )
}

export default LoopzEmailForm
