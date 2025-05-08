"use client"

import { useContext, useEffect } from "react"
import { ChatEvents } from "../../types"
import { LoopzContext } from "../context/loopzcontext"

export const useLoopzChatEvent = (
  event: ChatEvents,
  listener?: (...args: any[]) => any
) => {
  const loopzContext = useContext(LoopzContext)
  if (!loopzContext)
    throw new Error(
      "useLoopzChatEvent() must be used within a <LoopzProvider />."
    )

  const { initialized, instance } = loopzContext

  useEffect(() => {
    if (!initialized || !listener) return

    instance.chat.on(event, listener)
    return () => instance.chat.off(event, listener)
  }, [event, listener])
}
