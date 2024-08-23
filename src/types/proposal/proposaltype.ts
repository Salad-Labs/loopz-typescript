import { ProposalTypeName } from "./proposaltypename"
import { ProposalTypeValue } from "./proposaltypevalue"

/**
 * Represents a ProposalType object that maps ProposalTypeName to ProposalTypeValue.
 */
type ProposalType = Record<ProposalTypeName, ProposalTypeValue>

export { ProposalType }
