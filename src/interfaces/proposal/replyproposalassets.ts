import { AssetItem } from "../../types/proposal/builder"
/**
 * Represents the assets associated with a reply proposal, including wanted and offered items.
 */
export interface ReplyProposalAssets {
  /**
   * @property {AssetItem[]} [wanted] - the wanted assets.
   */
  wanted?: AssetItem[]
  /**
   * @property {AssetItem[]} [offered] - the offered assets.
   */
  offered?: AssetItem[]
}
