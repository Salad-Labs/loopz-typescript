"use client"

import { LoopzChatContextValue } from "../../types/react/loopzchatcontextvalue"
import { Maybe } from "../../types"
import { createContext } from "react"

export const LoopzChatContext =
  createContext<Maybe<LoopzChatContextValue>>(null)
