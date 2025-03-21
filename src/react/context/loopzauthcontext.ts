"use client"

import { LoopzAuthContextValue } from "../../types/react/loopzauthcontextvalue"
import { Maybe } from "../../types"
import { createContext } from "react"

export const LoopzAuthContext =
  createContext<Maybe<LoopzAuthContextValue>>(null)
