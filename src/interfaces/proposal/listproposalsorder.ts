/**
 * Defines the order in which to list proposals based on a specified field and direction.
 * @interface ListProposalsOrder
 */
export interface ListProposalsOrder {
  /**
   * @property {("creationDate" | "expirationDate" | "assetsOffered" | "assetsWanted")} field - The field to order the proposals by.
   */
  field: "creationDate" | "expirationDate" | "assetsOffered" | "assetsWanted"
  /**
   * @property {("ASC" | "DESC")} [direction] - The direction in which to order the proposals (optional, defaults to "ASC").
   */
  direction?: "ASC" | "DESC"
}
