import { NotificationSubType, NotificationType } from "../../enums/notification"
import { NotificationOperation } from "./notificationoperation"
import { Collector } from "../../interfaces"

export type NotificationItem = {
  id: number
  type: NotificationType
  subType: NotificationSubType
  operation?: NotificationOperation
  user?: Collector
  message?: string
  date: number
  isUnread: boolean
}
