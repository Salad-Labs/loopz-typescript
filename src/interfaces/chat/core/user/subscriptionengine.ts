import { OperationResult } from "@urql/core"
import { User, QIError } from "../../../../core/chat"
import { SubscriptionGarbage } from "../../../../types/chat/subscriptiongarbage"
import { User as UserGraphQL } from "../../../../graphql/generated/graphql"

/**
 * Interface for a user subscription engine that allows for updating user information.
 * @interface UserSubscriptionEngine
 */
export interface UserSubscriptionEngine {
  onUpdateUser(
    callback: (
      response: QIError | User,
      source: OperationResult<{ onUpdateUser: UserGraphQL }, { jwt: string }>,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage
}
