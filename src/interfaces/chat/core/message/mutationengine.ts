import { Message, MessageReport, QIError } from "../../../../core/chat"
import {
  AddReactionToMessageArgs,
  AddReportToMessageArgs,
  EditMessageArgs,
  RemoveReactionFromMessageArgs,
} from "../../../../types/chat/schema/args"

/**
 * Interface for a message mutation engine that defines methods for mutating messages.
 * @interface MessageMutationEngine
 */
export interface MessageMutationEngine {
  pinMessage(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError>
  pinMessage(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError>
  addReactionToMessage(
    args: AddReactionToMessageArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError>
  addReportToMessage(
    args: AddReportToMessageArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<MessageReport | QIError>
  editMessage(
    args: EditMessageArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError>
  unpinMessage(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError>
  unpinMessage(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError>
  removeReactionFromMessage(
    args: RemoveReactionFromMessageArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError>
  markImportantMessage(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError>
  markImportantMessage(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError>
  unmarkImportantMessage(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError>
  unmarkImportantMessage(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError>
}
