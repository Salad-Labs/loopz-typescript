import { LoopzConfig } from "@src/types/app/loopzconfig"
import { ReactNode } from "react"

export interface LoopzProviderProps {
  config: Omit<LoopzConfig, "storage">
  children: ReactNode
  devMode?: boolean
}
