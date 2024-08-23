import { ProposalStatusName } from "./proposalstatusname"
import { ProposalStatusValue } from "./proposalstatusvalue"
/**
 * Represents a ProposalStatus object that consists of a mapping between ProposalStatusName and ProposalStatusValue.
 */
type ProposalStatus = Record<ProposalStatusName, ProposalStatusValue>

export { ProposalStatus }
