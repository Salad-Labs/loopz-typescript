import { Account, AuthInfo } from "../.."
import { LoopzAuthProviderContextValue } from "./loopzauthprovidercontextvalue"

export type UseLoopzAuth = () => LoopzAuthProviderContextValue & {
  authenticate(): Promise<{ auth: AuthInfo; account: Account }>
  logout(): void
}
