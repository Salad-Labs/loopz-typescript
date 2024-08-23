import { Maybe } from "../../types/base"
import { ListProposalsFilters } from "../../interfaces/proposal/listproposalsfilters"
import { validateListProposalsFiltersField } from "./validatelistproposalsfiltersfield"

/**
 * Validates the list of proposal filters to ensure they are in the correct format.
 * @param {Maybe<ListProposalsFilters> | undefined} filters - The list of proposal filters to validate.
 * @throws {Error} If the filters parameter is invalid.
 * @returns None
 */
export function validateListProposalsFilters(
  filters?: Maybe<ListProposalsFilters>
) {
  if (filters === null || filters === undefined) return
  if (
    filters.constructor !== new Object().constructor ||
    !Object.keys(filters).length
  )
    throw new Error('invalid parameter "filters"')

  for (const filter in filters)
    validateListProposalsFiltersField(
      filter as keyof ListProposalsFilters,
      filters[filter as keyof ListProposalsFilters]
    )
}
