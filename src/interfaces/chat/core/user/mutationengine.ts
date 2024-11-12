import { QIError } from "../../../../core/chat/qierror"
import { User } from "../../../../core/chat/user"

/**
 * Interface for a User Mutation Engine that defines methods for blocking and unlocking users.
 * @interface UserMutationEngine
 */
export interface UserMutationEngine {
  blockUser(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError>
  blockUser(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError>
  unlockUser(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError>
  unlockUser(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError>
}
