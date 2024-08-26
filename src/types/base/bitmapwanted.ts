/**
 * Represents a type that defines a bitmap pattern with three digits, each digit being either 0, 1, or 2.
 * If update -> update validateListProposalsFiltersField under Bitmap fields check -> check bitmap length
 */
type BitmapWanted = `${0 | 1 | 2}${0 | 1 | 2}${0 | 1 | 2}`

export { BitmapWanted }
