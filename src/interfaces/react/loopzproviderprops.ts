import { LoopzProviderAuthConfig } from "@src/types/react/loopzproviderauthconfig"
import { LoopzProviderChatConfig } from "@src/types/react/loopzproviderchatconfig"
import { LoopzProviderConfig } from "@src/types/react/loopzproviderconfig"
import { ReactNode } from "react"

export interface LoopzProviderProps {
  config: LoopzProviderConfig
  authConfig?: LoopzProviderAuthConfig
  chatConfig?: LoopzProviderChatConfig
  /**
   * @default false
   */
  devMode?: boolean
  /**
   * @default true
   */
  enableStorage?: boolean
  children: ReactNode
}
