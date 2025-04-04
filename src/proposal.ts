import { Maybe } from "./types/base"
import {
  IProposal,
  ListProposalsFilters,
  ListProposalsOrder,
  ListProposalsResponse,
} from "./interfaces/proposal"
import { CreateProposal, ProposalStatus, ProposalType } from "./types/proposal"
import { validateListProposalsFilters } from "./core/utilities"
import { PROPOSAL_STATUS } from "./constants/proposal/proposalstatus"
import { PROPOSAL_TYPE } from "./constants/proposal/proposaltype"
import { Client } from "./core/client"
import { ApiResponse } from "./types/base/apiresponse"
import { Auth } from "."

/**
 * Represents a class for interacting with proposals through HTTP requests.
 * @class Proposal
 * @extends Client
 */
export class Proposal {
  private static _config: Maybe<{ devMode: boolean }> = null

  private static _instance: Maybe<Proposal> = null
  private static _client: Maybe<Client>

  /**
   * Get the PROPOSAL_STATUS constant object.
   * @returns {ProposalStatus} The constant object PROPOSAL_STATUS.
   */
  static get PROPOSAL_STATUS(): ProposalStatus {
    return { ...PROPOSAL_STATUS }
  }

  /**
   * Returns a copy of the PROPOSAL_STATUS object as a constant ProposalType.
   * @returns {ProposalType} A copy of the PROPOSAL_STATUS object.
   */
  static get PROPOSAL_TYPE(): ProposalType {
    return { ...PROPOSAL_TYPE }
  }

  /** static methods */

  static config(config: { devMode: boolean }) {
    if (Proposal._config) throw new Error("Proposal already configured")

    Proposal._config = config
  }

  static getInstance() {
    return Proposal._instance ?? new Proposal()
  }

  private constructor() {
    if (!Proposal._config)
      throw new Error("Proposal must be configured before getting the instance")

    Proposal._client = new Client(Proposal._config.devMode)
    Proposal._instance = this
  }

  /**
   * Creates a new proposal object and inserts it into the backend.
   * @param {CreateProposal} proposal - The proposal object to be inserted, which must be a CreateProposal.
   * @returns A Promise that resolves to a string or null.
   * @throws {Error} If signedMessage is required but not provided.
   */
  private async _createProposal(proposal: CreateProposal): Promise<boolean> {
    if (!Proposal._config || !Proposal._instance || !Proposal._client)
      throw new Error("Proposal has not been configured")

    try {
      const { response, statusCode } = await Proposal._client.fetch<
        ApiResponse<boolean>
      >(Proposal._client.backendUrl("/proposal/insert"), {
        method: "POST",
        body: proposal,
      })

      if (statusCode !== 200 || !response || !response.data) return false

      return true
    } catch (error: any) {
      console.warn(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      return false
    }
  }

  /** public instance methods */

  /**
   * Retrieves a proposal instance with the given ID and optional creator address.
   * @param {string} id - The ID of the proposal instance to retrieve.
   * @param {string} [did] - The creator address associated with the proposal instance. If provided, the API checks if the creatorAddress is the creator of the proposal.
   * @returns {Promise<Maybe<IProposal>>} A promise that resolves to the retrieved proposal instance, or null if not found.
   * @throws {Error} If the "id" parameter is invalid or if an error occurs during the retrieval process.
   */
  async get(id: string, did?: string): Promise<Maybe<IProposal>> {
    if (!Proposal._config || !Proposal._instance || !Proposal._client)
      throw new Error("Proposal has not been configured")
    if (!id) throw new Error('Invalid parameter "id".')

    try {
      const { response } = await Proposal._client.fetch<ApiResponse<IProposal>>(
        Proposal._client.backendUrl(`/proposal/${id}${did ? `/${did}` : ``}`)
      )

      if (!response || !response.data) return null

      const { data } = response

      return data[0]
    } catch (error: any) {
      console.warn(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      return null
    }
  }

  /**
   * Retrieves a list of proposals based on the provided filters, order options, skip, take, and creator address.
   * @param {ListProposalsFilters} filtersOptions - The filters to apply to the list of proposals.
   * @param {ListProposalsOrder} orderOptions - The order in which the proposals should be listed.
   * @param {number} skip - The number of proposals to skip.
   * @param {number} take - The number of proposals to retrieve.
   * @param {string} creatorAddress - The address of the proposal creator.
   * @returns {Promise<ListProposalsResponse>} A promise that resolves to a ListProposalsResponse object containing the list of proposals and total count.
   */
  async list(
    filtersOptions?: ListProposalsFilters,
    orderOptions?: ListProposalsOrder,
    skip?: number,
    take?: number,
    did?: string
  ): Promise<Maybe<ListProposalsResponse>> {
    if (!Proposal._config || !Proposal._instance || !Proposal._client)
      throw new Error("Proposal has not been configured")

    const filtersInput = filtersOptions ? { ...filtersOptions } : null

    let filters: any = null
    if (filtersInput) {
      try {
        validateListProposalsFilters(filtersInput)
      } catch (e) {
        throw e
      }
      const { collections, status, type, offers } = filtersInput
      delete filtersInput.collections
      delete filtersInput.status
      delete filtersInput.type
      delete filtersInput.offers

      if (collections) filters = { ...(filters ?? {}), collections }

      if (status || typeof status === "number")
        // status can be a number equal to zero (active), so it's better to check typeof
        filters = {
          ...(filters ?? {}),
          status:
            typeof status === "string"
              ? Proposal.PROPOSAL_STATUS[status]
              : status,
        }
      if (type || typeof type === "number")
        // type can be a number equal to zero (A1), so it's better to check typeof
        filters = {
          ...(filters ?? {}),
          type: typeof type === "string" ? Proposal.PROPOSAL_TYPE[type] : type,
        }

      if (offers) filters = { ...(filters ?? {}), offers }

      filters = Object.fromEntries(
        Object.entries({ ...(filters ?? {}), ...filtersInput }).filter(
          ([_name, value]) => value !== undefined && value !== null
        )
      )
    }

    const order = orderOptions ? { ...orderOptions } : null
    const skipUrl = skip && skip >= 0 ? skip : 0
    const takeUrl = take && take > 0 ? take : 10
    const body = {
      filters: filters ? (Object.keys(filters).length ? filters : null) : null,
      order,
    }

    try {
      const { response } = await Proposal._client.fetch<
        ApiResponse<ListProposalsResponse>
      >(
        Proposal._client.backendUrl(
          `/proposals/${skipUrl}/${takeUrl}${did ? `/${did}` : ``}`
        ),
        {
          method: "POST",
          body,
        }
      )

      if (!response || response.data) return null

      const { data } = response

      return data[0]
    } catch (error: any) {
      console.warn(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }

      return null
    }
  }

  /**
   * Creates a new proposal using the provided proposal object and signed message.
   * @param {CreateProposal} proposal - The proposal object containing the proposal data.
   * @returns A new proposal created using the provided data.
   */
  async create(proposal: CreateProposal, signedMessage: string) {
    return this._createProposal(proposal)
  }

  /**
   * Deletes a proposal with the given ID.
   * @param {string} id - The ID of the proposal to delete.
   * @param {string} creatorAddress - The address of the creator of the proposal.
   * @returns {Promise<void>} A promise that resolves when the proposal is successfully deleted.
   * @throws {Error} If the signedMessage is required but not provided.
   */
  async delete(id: string, creatorAddress: string): Promise<void> {
    if (!Proposal._config || !Proposal._instance || !Proposal._client)
      throw new Error("Proposal has not been configured")

    try {
      await Proposal._client.fetch(
        Proposal._client.backendUrl(`/proposal/${id}/delete`),
        {
          method: "DELETE",
          body: {
            creatorAddress,
          },
        }
      )
    } catch (error: any) {
      console.warn(error)

      if ("statusCode" in error && error.statusCode === 401) {
        await Auth.getInstance().logout()
      }
    }
  }
}
