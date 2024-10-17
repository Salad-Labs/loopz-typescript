"use client"

import { ILoopzContext } from "../../interfaces/react/iloopzcontext"
import { Maybe } from "@src/types"
import { createContext } from "react"

export const LoopzContext = createContext<Maybe<ILoopzContext>>(null)
