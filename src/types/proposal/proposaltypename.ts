/**
 * Defines a custom type `ProposalTypeName` that can only have one of the specified values: "A1", "A2", "B1", "B2", "C1", or "R1".
 * This type is used to restrict the possible values that a variable of type `ProposalTypeName` can hold.
 */
type ProposalTypeName = "A1" | "A2" | "B1" | "B2" | "C1" | "R1"

export { ProposalTypeName }
