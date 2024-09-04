import { ApiKeyAuthorized, Maybe } from "./types/base"
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

/**
 * Represents a class for interacting with proposals through HTTP requests.
 * @class Proposal
 * @extends Client
 */
export class Proposal extends Client {
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

  /**
   * Returns the message that needs to be signed, which is used by nfttrader.io for verification.
   * @returns {string} The message to sign powered by nfttrader.io
   */
  static get _MESSAGE_TO_SIGN(): string {
    return `This is the message to sign powered by nfttrader.io`
  }

  /**
   * Constructor for creating an instance of a class that requires an API key for authorization.
   * @param {ApiKeyAuthorized} config - The configuration object containing the API key.
   * @returns None
   */
  constructor(config: ApiKeyAuthorized) {
    super(config.devMode)
    this._apiKey = config.apiKey
  }

  /**
   * Creates a new proposal object and inserts it into the backend.
   * @param {P} proposal - The proposal object to be inserted, which can be either a ProposalObject or ProposalReplyObject.
   * @returns A Promise that resolves to a string or null.
   * @throws {Error} If signedMessage is required but not provided.
   */
  private async _createProposal<
    P extends CreateProposal & Partial<Pick<IProposal, "parentId">>
  >(proposal: P): Promise<boolean> {
    try {
      const { response, statusCode } = await this._fetch<ApiResponse<boolean>>(
        `${this.backendUrl()}/proposal/insert`,
        {
          method: "POST",
          body: proposal,
          headers: {
            "x-api-key": `${this._apiKey}`,
            Authorization: `Bearer ${this._authToken}`,
          },
        }
      )

      if (statusCode !== 200 || !response || !response.data) return false

      return true
    } catch (error) {
      console.warn(error)
    }

    return false
  }

  /**
   * Retrieves a proposal instance with the given ID and optional creator address.
   * @param {string} id - The ID of the proposal instance to retrieve.
   * @param {string} [did] - The creator address associated with the proposal instance. If provided, the API checks if the creatorAddress is the creator of the proposal.
   * @returns {Promise<Maybe<IProposal>>} A promise that resolves to the retrieved proposal instance, or null if not found.
   * @throws {Error} If the "id" parameter is invalid or if an error occurs during the retrieval process.
   */
  async get(id: string, did?: string): Promise<Maybe<IProposal>> {
    if (!id) throw new Error('Invalid parameter "id".')

    try {
      const { response } = await this._fetch<ApiResponse<IProposal>>(
        `${this.backendUrl()}/proposal/${id}` + `${did ? `/${did}` : ``}`,
        {
          method: "GET",
          headers: {
            "x-api-key": `${this._apiKey}`,
          },
        }
      )

      if (!response || !response.data) return null

      const { data } = response

      return data[0]
    } catch (error) {
      console.warn(error)
    }

    return null
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
    const filtersInput = filtersOptions ? { ...filtersOptions } : null

    let filters = null
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
      const { response } = await this._fetch<
        ApiResponse<ListProposalsResponse>
      >(
        `${this.backendUrl()}/proposals/${skipUrl}/${takeUrl}${
          did ? `/${did}` : ``
        }`,
        {
          method: "POST",
          body,
          headers: {
            "x-api-key": `${this._apiKey}`,
          },
        }
      )

      if (!response || response.data) return null

      const { data } = response

      return data[0]
    } catch (error) {
      console.warn(error)
    }

    return null
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
    try {
      await this._fetch(`${this.backendUrl()}/proposal/${id}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this._authToken}`,
          "x-api-key": `${this._apiKey}`,
        },
        body: {
          creatorAddress,
        },
      })
    } catch (error) {
      console.warn(error)
    }
  }
}
