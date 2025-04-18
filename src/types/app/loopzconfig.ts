import { PrivyClientConfig } from "@privy-io/react-auth"
import { DexieStorage } from "../../core/app"

export type LoopzConfig = {
  apiKey: string
  privyAppId: string
  privyClientConfig: PrivyClientConfig
  storage: DexieStorage
}
