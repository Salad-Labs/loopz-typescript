/**
 * Represents the fees associated with trading NFTs, including both a flat fee and a percentage fee.
 */
type Fee = {
  /**
   * @property {string} flatFee - An array of objects representing flat fees.
   */
  flatFee: string
  /**
   * @property {number} percentageFee - An array of objects representing percentage fees.
   */
  percentageFee: number
}

export { Fee }
