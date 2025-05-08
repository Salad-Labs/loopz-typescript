import { PrivyClientConfig } from "@privy-io/react-auth"
import { DexieStorage } from "../../core/app"
import { Intl } from "./intl"

export type LoopzConfig = {
  apiKey: string
  privyAppId: string
  privyClientConfig: PrivyClientConfig
  storage: DexieStorage
  intl: Intl
}
