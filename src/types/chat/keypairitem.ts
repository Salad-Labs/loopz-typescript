import forge from "node-forge"

/**
 * Represents an item containing an ID and a RSA Key Pair generated using the node-forge library.
 */
export type KeyPairItem = {
  /**
   * @property {string} id - the id of the key.
   */
  id: string
  /**
   * @property {string} AES - the AES key associated.
   */
  AES: string
  /**
   * @property {string} iv - the iv key associated.
   */
  iv: string
}
