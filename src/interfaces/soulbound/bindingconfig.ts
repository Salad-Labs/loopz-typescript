import { CustomBindingRule } from "./custombindingrule"
import { VerificationType } from "./verificationtype"

export interface BindingConfig {
  allowTransfer: boolean
  burnEnabled: boolean
  updateFrequency: number // Minimo tempo tra aggiornamenti
  requiredVerifications: VerificationType[]
  customRules?: CustomBindingRule[]
}
