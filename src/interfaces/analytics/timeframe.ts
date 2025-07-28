export interface TimeFrame {
  start: Date
  end: Date
  granularity?: "hour" | "day" | "week" | "month"
}
