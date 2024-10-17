import { PrivyClientConfig } from "@privy-io/react-auth"
import { DexieStorage } from "../../core/app"

/**
 * Represents the configuration for authentication.
 */
export type AuthConfig = {
  storage: DexieStorage
  privyAppId: string
  privyConfig: PrivyClientConfig
}
