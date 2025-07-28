export interface ActionValidation {
  minAmount?: bigint
  allowedTokens?: string[]
  requiresKYC?: boolean
  customValidator?: (params: any) => Promise<boolean>
}
