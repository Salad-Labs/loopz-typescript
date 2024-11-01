import { usePrivy } from "@privy-io/react-auth"
import { Auth } from "../.."
import { useEffect, useRef } from "react"

export const usePrivyUnlinkAccount = () => {
  const auth = Auth.getInstance()

  const initialized = useRef<boolean>(false)
  const {
    user,
    ready,
    unlinkEmail,
    unlinkApple,
    unlinkDiscord,
    unlinkFarcaster,
    unlinkGithub,
    unlinkGoogle,
    unlinkInstagram,
    unlinkLinkedIn,
    unlinkPhone,
    unlinkSpotify,
    unlinkTelegram,
    unlinkTiktok,
    unlinkTwitter,
    unlinkWallet,
  } = usePrivy()

  useEffect(() => {
    if (!initialized.current && ready && user) {
      initialized.current = true

      auth.on(
        "__unlink",
        (
          method:
            | "apple"
            | "discord"
            | "email"
            | "farcaster"
            | "github"
            | "google"
            | "instagram"
            | "linkedin"
            | "phone"
            | "spotify"
            | "tiktok"
            | "twitter"
            | "wallet"
            | "telegram"
        ) => {
          if (method === "apple" && user.apple)
            unlinkApple(user.apple.subject)
              .then(() => {
                Auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                Auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "discord" && user.discord)
            unlinkDiscord(user.discord.subject)
              .then(() => {
                Auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                Auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "email" && user.email)
            unlinkEmail(user.email.address)
              .then(() => {
                Auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                Auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "farcaster" && user.farcaster)
            unlinkFarcaster(user.farcaster.fid!)
              .then(() => {
                Auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                Auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "github" && user.github)
            unlinkGithub(user.github.subject)
              .then(() => {
                Auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                Auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "google" && user.google)
            unlinkGoogle(user.google.subject)
              .then(() => {
                Auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                Auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "instagram" && user.instagram)
            unlinkInstagram(user.instagram.subject)
              .then(() => {
                Auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                Auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "linkedin" && user.linkedin)
            unlinkLinkedIn(user.linkedin.subject)
              .then(() => {
                Auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                Auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "phone" && user.phone)
            unlinkPhone(user.phone.number)
              .then(() => {
                Auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                Auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "spotify" && user.spotify)
            unlinkSpotify(user.spotify.subject)
              .then(() => {
                Auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                Auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "tiktok" && user.tiktok)
            unlinkTiktok(user.tiktok.subject)
              .then(() => {
                Auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                Auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "twitter" && user.twitter)
            unlinkTwitter(user.twitter.subject)
              .then(() => {
                Auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                Auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "wallet" && user.wallet)
            unlinkWallet(user.wallet.address)
              .then(() => {
                Auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                Auth._emit("__onUnlinkAccountError", error)
              })
          if (method === "telegram" && user.telegram)
            unlinkTelegram(user.telegram.telegramUserId)
              .then(() => {
                Auth._emit("__onUnlinkAccountComplete", true)
              })
              .catch((error) => {
                Auth._emit("__onUnlinkAccountError", error)
              })
        }
      )
    }
  }, [ready, user])
}
