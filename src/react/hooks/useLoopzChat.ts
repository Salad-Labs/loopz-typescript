import { useContext } from "react"
import { UseLoopzChat } from "@src/types/react/useloopzchat"
import { LoopzChatContext } from "../context/loopzchatcontext"

export const useLoopzChat: UseLoopzChat = () => {
  const context = useContext(LoopzChatContext)
  if (!context)
    throw new Error("useLoopzChat() must be used within a <LoopzProvider />.")

  // TODO implement functions

  return context
}
