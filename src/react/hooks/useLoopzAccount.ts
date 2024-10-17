import { useContext } from "react"
import { LoopzAccountContext } from "../context/loopzaccountcontext"
import { LoopzAccountHookValue } from "../../index"

export const useLoopzAccount: () => LoopzAccountHookValue = () => {
  const context = useContext(LoopzAccountContext)
  if (!context)
    throw new Error(
      "useLoopzAccount() must be used within a <LoopzAccountProvider />."
    )

  return context
}
