import { NotificationActionType } from "@src/enums/notification"

export type NotificationOperation = {
  type: NotificationActionType
  payload?: string
}
