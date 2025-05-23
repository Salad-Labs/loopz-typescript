import { KeyPairItem } from "../../../types/chat/keypairitem"
import { SubscriptionGarbage } from "../../../types/chat/subscriptiongarbage"
import { Maybe } from "../../../types/base"
import forge from "node-forge"

/**
 * Interface for an Engine that defines methods for connecting, reconnecting, collecting garbage,
 * refreshing JWT token, and getting API related information.
 * @interface IEngine
 */
export interface IEngine {
  connect(): Promise<void>
  reconnect(): Promise<void>
  getApiURL(): Maybe<string>
  getRealtimeApiURL(): Maybe<string>
  addKeyPairItem(newItem: KeyPairItem): Array<KeyPairItem>
  removeKeyPairItem(id: string): Array<KeyPairItem>
  setKeyPairMap(map: Array<KeyPairItem>): void
  getKeyPairMap(): Array<KeyPairItem>
  findKeyPairById(id: string): Maybe<{ AES: string; iv: string }>
  setUserKeyPair(userKeyPair: forge.pki.rsa.KeyPair): void
  getUserKeyPair(): Maybe<forge.pki.rsa.KeyPair>
}
