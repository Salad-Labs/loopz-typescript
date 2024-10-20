export type LoopzProviderAuthConfig = {
  onSendEmailOTPCode?: (email: string) => any
  onSendEmailOTPCodeAfterAuth?: (email: string) => any
  onSendPhoneOTPCode?: (phone: string) => any
  onSendPhoneOTPCodeAfterAuth?: (phone: string) => any
}
