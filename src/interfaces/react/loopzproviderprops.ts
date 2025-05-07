import { LoopzAuthConfig } from "../../types/react/loopzauthconfig"
import { LoopzProviderChatConfig } from "../../types/react/loopzproviderchatconfig"
import { LoopzProviderConfig } from "../../types/react/loopzproviderconfig"
import { ReactNode } from "react"

export interface LoopzProviderProps {
  config: LoopzProviderConfig
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
