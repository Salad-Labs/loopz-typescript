import { TimeFrame } from "./timeframe"

export interface AnalyticsFilter {
  networks?: number[] // chainIds
  protocols?: string[]
  tokenAddresses?: string[]
  categories?: string[]
  minValue?: number
  maxValue?: number
  timeframe?: TimeFrame
}
