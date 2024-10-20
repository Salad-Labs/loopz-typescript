import { Account, AuthInfo, LinkAccountInfo } from "../.."
import { AuthLinkMethod } from "../auth/authlinkmethod"
import { LoopzAuthContextValue } from "./loopzauthcontextvalue"

export type UseLoopzAuth = () => LoopzAuthContextValue & {
  authenticate(): Promise<{ auth: AuthInfo; account: Account }>
  link(method: AuthLinkMethod): Promise<LinkAccountInfo>
  sendEmailOTPCode(email: string): Promise<{ email: string }>
  sendEmailOTPCodeAfterAuth(email: string): Promise<{ email: string }>
  sendPhoneOTPCode(phone: string): Promise<{ phone: string }>
  sendPhoneOTPCodeAfterAuth(phone: string): Promise<{ phone: string }>
  unlink(method: AuthLinkMethod): Promise<boolean>
  logout(): Promise<boolean>
}
