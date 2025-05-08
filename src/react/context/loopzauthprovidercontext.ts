"use client"

import { LoopzAuthProviderContextValue } from "../../types/react/loopzauthprovidercontextvalue"
import { Maybe } from "../../types"
import { createContext } from "react"

export const LoopzAuthProviderContext =
  createContext<Maybe<LoopzAuthProviderContextValue>>(null)
