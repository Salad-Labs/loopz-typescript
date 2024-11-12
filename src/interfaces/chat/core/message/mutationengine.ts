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
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<Message | QIError>
  pinMessage(
    id: string,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<Message | QIError>
  addReactionToMessage(
    args: AddReactionToMessageArgs,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<Message | QIError>
  addReportToMessage(
    args: AddReportToMessageArgs,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<MessageReport | QIError>
  editMessage(
    args: EditMessageArgs,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<Message | QIError>
  unpinMessage(
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<Message | QIError>
  unpinMessage(
    id: string,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<Message | QIError>
  removeReactionFromMessage(
    args: RemoveReactionFromMessageArgs,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<Message | QIError>
  markImportantMessage(
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<Message | QIError>
  markImportantMessage(
    id: string,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<Message | QIError>
  unmarkImportantMessage(
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<Message | QIError>
  unmarkImportantMessage(
    id: string,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<Message | QIError>
}
