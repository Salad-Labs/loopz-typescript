export interface TrackingEvent {
  userId: string
  actionId: string
  timestamp: number
  data: any
  source: "on-chain" | "off-chain" | "hybrid"
}
