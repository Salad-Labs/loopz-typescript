import { useContext } from "react"
import { LoopzContext } from "../context/loopzcontext"

// TODO transform in internal to know when instance is ready and not expose
export const useLoopz = () => {
  const context = useContext(LoopzContext)
  if (!context)
    throw new Error("useLoopz() must be used within a <LoopzProvider />.")

  return context
}
