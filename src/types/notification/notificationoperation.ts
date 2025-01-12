import { NotificationActionType } from "../../enums/notification"

export type NotificationOperation = {
  type: NotificationActionType
  payload?: string
}
