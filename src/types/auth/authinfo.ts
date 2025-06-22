export type AuthInfo = {
  user: {
    email: string
    id: string
  }
  authToken: string
  referralCode?: string
}
