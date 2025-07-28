import { ethers, Contract, BigNumberish } from "ethers"
import { keccak256, solidityPacked, getAddress } from "ethers"
import MerkleTree from "merkletreejs"
import {
  AirdropConfig,
  AirdropRecipient,
  ClaimStatus,
  AirdropInfo,
  EligibilityCriteria,
  MerkleTreeData,
} from "../interfaces/airdrop"

// ABI semplificato del contratto Airdrop
const AIRDROP_CONTRACT_ABI = [
  "function claim(uint256 index, address account, uint256 amount, bytes32[] calldata merkleProof) external",
  "function isClaimed(uint256 index) external view returns (bool)",
  "function merkleRoot() external view returns (bytes32)",
  "function token() external view returns (address)",
  "function owner() external view returns (address)",
  "function pause() external",
  "function unpause() external",
  "function withdraw() external",
  "event Claimed(uint256 index, address account, uint256 amount)",
  "constructor(address token_, bytes32 merkleRoot_)",
]

// Factory contract ABI per deploy
const AIRDROP_FACTORY_ABI = [
  "function deployAirdrop(address token, bytes32 merkleRoot) external returns (address)",
  "event AirdropDeployed(address indexed airdrop, address indexed token, bytes32 merkleRoot)",
]

export class AirdropManager {
  private provider: ethers.Provider
  private signer: ethers.Signer
  private factoryAddress?: string
  private airdrops: Map<string, AirdropInfo> = new Map()
  private merkleData: Map<string, MerkleTreeData> = new Map()
  private ipfsGateway: string = "https://ipfs.io/ipfs/"

  constructor(
    provider: ethers.Provider,
    signer: ethers.Signer,
    factoryAddress?: string
  ) {
    this.provider = provider
    this.signer = signer
    this.factoryAddress = factoryAddress
  }

  /**
   * Crea un nuovo airdrop
   */
  async createAirdrop(config: AirdropConfig): Promise<string> {
    // Valida configurazione
    this.validateConfig(config)

    // Genera lista destinatari basata sui criteri
    const recipients = await this.generateRecipientList(config)

    if (recipients.length === 0) {
      throw new Error("No eligible recipients found")
    }

    // Genera Merkle Tree
    const merkleData = this.generateMerkleTree(recipients)

    // Deploy contratto airdrop
    const contractAddress = await this.deployAirdropContract(
      config.tokenAddress,
      merkleData.root
    )

    // Trasferisci token al contratto
    await this.fundAirdropContract(
      contractAddress,
      config.tokenAddress,
      config.totalAmount
    )

    // Salva airdrop info
    const airdropId = this.generateAirdropId()
    const airdropInfo: AirdropInfo = {
      id: airdropId,
      config: {
        ...config,
        merkleRoot: merkleData,
      },
      status: "pending",
      totalClaimed: BigInt(0),
      claimCount: 0,
      recipients: recipients.length,
      createdAt: Date.now(),
      contractAddress,
    }

    this.airdrops.set(airdropId, airdropInfo)
    this.merkleData.set(airdropId, merkleData)

    // Pubblica dati su IPFS (opzionale)
    if (config.metadata) {
      await this.publishToIPFS(airdropId, recipients, merkleData)
    }

    // Attiva airdrop se start time è passato
    if (config.startTime <= Date.now() / 1000) {
      airdropInfo.status = "active"
    }

    return airdropId
  }

  /**
   * Verifica eligibilità per un airdrop
   */
  async checkEligibility(
    userAddress: string,
    airdropId: string
  ): Promise<{
    eligible: boolean
    amount?: bigint
    proof?: string[]
    reasons?: string[]
  }> {
    const airdrop = this.airdrops.get(airdropId)
    if (!airdrop) {
      throw new Error("Airdrop not found")
    }

    const merkleData = this.merkleData.get(airdropId)
    if (!merkleData) {
      throw new Error("Merkle data not found")
    }

    // Verifica se l'utente è nella lista
    const normalizedAddress = getAddress(userAddress)
    const recipient = merkleData.leaves.find(
      (leaf) => getAddress(leaf.address) === normalizedAddress
    )

    if (!recipient) {
      // Verifica criteri dinamici
      const dynamicEligibility = await this.checkDynamicEligibility(
        userAddress,
        airdrop.config
      )

      return {
        eligible: false,
        reasons: dynamicEligibility.reasons,
      }
    }

    // Genera proof
    const leaf = this.generateLeaf(
      recipient.address,
      recipient.amount,
      recipient.index
    )
    const proof = merkleData.tree.getHexProof(leaf)

    // Verifica se già claimato
    if (airdrop.contractAddress) {
      const claimed = await this.isAlreadyClaimed(
        airdrop.contractAddress,
        recipient.index
      )

      if (claimed) {
        return {
          eligible: false,
          reasons: ["Already claimed"],
        }
      }
    }

    return {
      eligible: true,
      amount: BigInt(recipient.amount),
      proof,
    }
  }

  /**
   * Claim airdrop
   */
  async claimAirdrop(
    airdropId: string,
    userAddress?: string,
    antiSybilProof?: any
  ): Promise<ethers.TransactionResponse> {
    const airdrop = this.airdrops.get(airdropId)
    if (!airdrop) {
      throw new Error("Airdrop not found")
    }

    if (airdrop.status !== "active") {
      throw new Error(`Airdrop is ${airdrop.status}`)
    }

    // Verifica tempo
    const now = Date.now() / 1000
    if (now < airdrop.config.startTime) {
      throw new Error("Airdrop not started yet")
    }
    if (now > airdrop.config.endTime) {
      throw new Error("Airdrop ended")
    }

    // Usa indirizzo del signer se non specificato
    const claimAddress = userAddress || (await this.signer.getAddress())

    // Verifica anti-sybil se abilitato
    if (airdrop.config.antiSybilEnabled && !antiSybilProof) {
      throw new Error("Anti-sybil proof required")
    }

    // Verifica eligibilità e ottieni proof
    const eligibility = await this.checkEligibility(claimAddress, airdropId)
    if (!eligibility.eligible) {
      throw new Error(`Not eligible: ${eligibility.reasons?.join(", ")}`)
    }

    // Trova indice del recipient
    const merkleData = this.merkleData.get(airdropId)
    const recipient = merkleData!.leaves.find(
      (leaf) => getAddress(leaf.address) === getAddress(claimAddress)
    )

    if (!recipient) {
      throw new Error("Recipient not found in merkle tree")
    }

    // Esegui claim on-chain
    const airdropContract = new Contract(
      airdrop.contractAddress!,
      AIRDROP_CONTRACT_ABI,
      this.signer
    )

    const tx = await airdropContract.claim(
      recipient.index,
      claimAddress,
      recipient.amount,
      eligibility.proof!
    )

    // Aggiorna stato locale (il listener aggiornerà lo stato completo)
    this.setupClaimListener(airdropId, airdrop.contractAddress!)

    return tx
  }

  /**
   * Genera Merkle Tree per distribuzione
   */
  generateMerkleTree(recipients: AirdropRecipient[]): MerkleTreeData {
    // Ordina e indicizza recipients
    const sortedRecipients = recipients
      .map((r, index) => ({ ...r, index }))
      .sort((a, b) => a.address.localeCompare(b.address))

    // Genera leaves
    const leaves = sortedRecipients.map((recipient) => {
      const leaf = this.generateLeaf(
        recipient.address,
        recipient.amount.toString(),
        recipient.index!
      )
      return {
        address: recipient.address,
        amount: recipient.amount.toString(),
        index: recipient.index!,
        leaf,
      }
    })

    // Crea Merkle Tree
    const tree = new MerkleTree(
      leaves.map((l) => l.leaf),
      keccak256,
      { sortPairs: true }
    )

    return {
      root: tree.getHexRoot(),
      leaves: leaves.map((l) => ({
        address: l.address,
        amount: l.amount,
        index: l.index,
      })),
      tree,
    }
  }

  /**
   * Genera leaf per Merkle Tree
   */
  private generateLeaf(address: string, amount: string, index: number): string {
    return keccak256(
      solidityPacked(
        ["uint256", "address", "uint256"],
        [index, address, amount]
      )
    )
  }

  /**
   * Genera lista destinatari basata sui criteri
   */
  private async generateRecipientList(
    config: AirdropConfig
  ): Promise<AirdropRecipient[]> {
    let eligibleAddresses: Set<string> = new Set()
    let addressData: Map<string, any> = new Map()

    // Processa ogni criterio
    for (const criteria of config.eligibilityCriteria) {
      const addresses = await this.processEligibilityCriteria(criteria)

      if (eligibleAddresses.size === 0) {
        // Primo criterio, aggiungi tutti
        addresses.forEach((addr) => {
          eligibleAddresses.add(addr.address)
          addressData.set(addr.address, addr.data)
        })
      } else {
        // Interseca con criteri esistenti (AND logic)
        const newSet = new Set(addresses.map((a) => a.address))
        eligibleAddresses = new Set(
          [...eligibleAddresses].filter((x) => newSet.has(x))
        )
      }
    }

    // Converti in array di recipients
    const recipients: AirdropRecipient[] = []
    const addressArray = Array.from(eligibleAddresses)

    // Calcola importi basati sulla strategia
    for (const address of addressArray) {
      const amount = await this.calculateRecipientAmount(
        address,
        config,
        addressData.get(address),
        addressArray.length
      )

      recipients.push({
        address,
        amount,
        metadata: addressData.get(address),
      })
    }

    // Applica limite partecipanti se specificato
    if (config.maxParticipants && recipients.length > config.maxParticipants) {
      // Ordina per importo (i più grandi prima) e prendi i top N
      recipients.sort((a, b) => Number(b.amount - a.amount))
      return recipients.slice(0, config.maxParticipants)
    }

    return recipients
  }

  /**
   * Processa un singolo criterio di eligibilità
   */
  private async processEligibilityCriteria(
    criteria: EligibilityCriteria
  ): Promise<{ address: string; data: any }[]> {
    switch (criteria.type) {
      case "minBalance": {
        // Query on-chain per bilanciamenti minimi
        const tokenContract = new Contract(
          criteria.contractAddress!,
          ["function balanceOf(address) view returns (uint256)"],
          this.provider
        )

        // In produzione, useresti eventi o snapshot
        // Per demo, simuliamo alcuni indirizzi
        const potentialAddresses = await this.getPotentialAddresses()
        const eligible: any = []

        for (const addr of potentialAddresses) {
          try {
            const balance = await tokenContract.balanceOf(addr)
            if (balance >= criteria.value) {
              eligible.push({ address: addr, data: { balance } })
            }
          } catch (e) {
            // Skip invalid addresses
          }
        }

        return eligible
      }

      case "minTransactions": {
        // Query transaction count
        const eligible: any = []
        const potentialAddresses = await this.getPotentialAddresses()

        for (const addr of potentialAddresses) {
          const txCount = await this.provider.getTransactionCount(addr)
          if (txCount >= criteria.value) {
            eligible.push({ address: addr, data: { txCount } })
          }
        }

        return eligible
      }

      case "soulBoundToken": {
        // Verifica possesso SBT
        const sbtContract = new Contract(
          criteria.contractAddress!,
          ["function balanceOf(address) view returns (uint256)"],
          this.provider
        )

        const potentialAddresses = await this.getPotentialAddresses()
        const eligible: any = []

        for (const addr of potentialAddresses) {
          try {
            const balance = await sbtContract.balanceOf(addr)
            if (balance > 0) {
              eligible.push({ address: addr, data: { hasSBT: true } })
            }
          } catch (e) {
            // Skip
          }
        }

        return eligible
      }

      case "snapshot": {
        // Carica snapshot da IPFS o storage
        const snapshotData = await this.loadSnapshot(criteria.value)
        return snapshotData.map((item) => ({
          address: item.address,
          data: item,
        }))
      }

      case "whitelist": {
        // Lista diretta di indirizzi
        return criteria.value.map((address: string) => ({
          address,
          data: { whitelisted: true },
        }))
      }

      case "custom": {
        // Logica custom definita dall'utente
        if (criteria.value.customChecker) {
          return await criteria.value.customChecker(this.provider)
        }
        return []
      }

      default:
        return []
    }
  }

  /**
   * Calcola importo per destinatario
   */
  private async calculateRecipientAmount(
    address: string,
    config: AirdropConfig,
    metadata: any,
    totalRecipients: number
  ): Promise<bigint> {
    const totalAmount = config.totalAmount

    switch (config.distributionStrategy) {
      case "equal": {
        // Distribuzione uguale
        return totalAmount / BigInt(totalRecipients)
      }

      case "weighted": {
        // Distribuzione pesata basata su criteri
        let weight = 1

        // Esempio: peso basato su balance
        if (metadata?.balance) {
          const balance = BigInt(metadata.balance)
          // Normalizza peso (esempio: 1-10)
          weight = Math.min(10, Math.max(1, Number(balance / BigInt(10 ** 18))))
        }

        // Calcola totale pesi (semplificato per demo)
        const totalWeight = totalRecipients * 5 // Media stimata
        return (totalAmount * BigInt(weight)) / BigInt(totalWeight)
      }

      case "tiered": {
        // Sistema a livelli
        let tier = 1

        if (metadata?.txCount > 100) tier = 3
        else if (metadata?.txCount > 50) tier = 2

        const tierAmounts = {
          1: totalAmount / BigInt(totalRecipients),
          2: (totalAmount / BigInt(totalRecipients)) * BigInt(2),
          3: (totalAmount / BigInt(totalRecipients)) * BigInt(3),
        }

        return tierAmounts[tier as keyof typeof tierAmounts]
      }

      case "custom": {
        // Formula custom
        if (config.metadata?.customFormula) {
          return config.metadata.customFormula(
            address,
            metadata,
            totalAmount,
            totalRecipients
          )
        }
        return totalAmount / BigInt(totalRecipients)
      }

      default:
        return totalAmount / BigInt(totalRecipients)
    }
  }

  /**
   * Deploy contratto airdrop
   */
  private async deployAirdropContract(
    tokenAddress: string,
    merkleRoot: string
  ): Promise<string> {
    if (this.factoryAddress) {
      // Usa factory
      const factory = new Contract(
        this.factoryAddress,
        AIRDROP_FACTORY_ABI,
        this.signer
      )

      const tx = await factory.deployAirdrop(tokenAddress, merkleRoot)
      const receipt = await tx.wait()

      // Estrai indirizzo dai log
      const event = receipt.logs.find(
        (log: any) =>
          log.topics[0] ===
          ethers.id("AirdropDeployed(address,address,bytes32)")
      )

      if (!event) {
        throw new Error("Airdrop deployment failed")
      }

      return ethers.getAddress("0x" + event.topics[1].slice(26))
    } else {
      // Deploy diretto (bytecode richiesto)
      throw new Error(
        "Direct deployment not implemented. Please provide factory address."
      )
    }
  }

  /**
   * Trasferisce token al contratto airdrop
   */
  private async fundAirdropContract(
    airdropAddress: string,
    tokenAddress: string,
    amount: bigint
  ): Promise<void> {
    const tokenContract = new Contract(
      tokenAddress,
      [
        "function transfer(address to, uint256 amount) returns (bool)",
        "function approve(address spender, uint256 amount) returns (bool)",
      ],
      this.signer
    )

    const tx = await tokenContract.transfer(airdropAddress, amount)
    await tx.wait()
  }

  /**
   * Verifica se già claimato
   */
  private async isAlreadyClaimed(
    contractAddress: string,
    index: number
  ): Promise<boolean> {
    const contract = new Contract(
      contractAddress,
      AIRDROP_CONTRACT_ABI,
      this.provider
    )

    return await contract.isClaimed(index)
  }

  /**
   * Setup listener per eventi claim
   */
  private setupClaimListener(airdropId: string, contractAddress: string): void {
    const contract = new Contract(
      contractAddress,
      AIRDROP_CONTRACT_ABI,
      this.provider
    )

    contract.on("Claimed", async (index, account, amount, event) => {
      const airdrop = this.airdrops.get(airdropId)
      if (airdrop) {
        airdrop.claimCount++
        airdrop.totalClaimed += BigInt(amount)

        // Controlla se completato
        if (airdrop.claimCount >= airdrop.recipients) {
          airdrop.status = "completed"
        }
      }
    })
  }

  /**
   * Ottiene stato claim per utente
   */
  async getClaimStatus(
    airdropId: string,
    userAddress: string
  ): Promise<ClaimStatus> {
    const airdrop = this.airdrops.get(airdropId)
    if (!airdrop || !airdrop.contractAddress) {
      return { claimed: false, amount: BigInt(0) }
    }

    const merkleData = this.merkleData.get(airdropId)
    if (!merkleData) {
      return { claimed: false, amount: BigInt(0) }
    }

    const recipient = merkleData.leaves.find(
      (leaf) => getAddress(leaf.address) === getAddress(userAddress)
    )

    if (!recipient) {
      return { claimed: false, amount: BigInt(0) }
    }

    const claimed = await this.isAlreadyClaimed(
      airdrop.contractAddress,
      recipient.index
    )

    return {
      claimed,
      amount: BigInt(recipient.amount),
      timestamp: claimed ? Date.now() : undefined,
    }
  }

  /**
   * Ottiene informazioni airdrop
   */
  getAirdropInfo(airdropId: string): AirdropInfo | null {
    return this.airdrops.get(airdropId) || null
  }

  /**
   * Lista tutti gli airdrop
   */
  listAirdrops(filter?: {
    status?: AirdropInfo["status"]
    tokenAddress?: string
    active?: boolean
  }): AirdropInfo[] {
    let airdrops = Array.from(this.airdrops.values())

    if (filter) {
      if (filter.status) {
        airdrops = airdrops.filter((a) => a.status === filter.status)
      }

      if (filter.tokenAddress) {
        airdrops = airdrops.filter(
          (a) =>
            a.config.tokenAddress.toLowerCase() ===
            filter.tokenAddress!.toLowerCase()
        )
      }

      if (filter.active !== undefined) {
        const now = Date.now() / 1000
        airdrops = airdrops.filter((a) => {
          const isActive =
            a.status === "active" &&
            now >= a.config.startTime &&
            now <= a.config.endTime
          return filter.active ? isActive : !isActive
        })
      }
    }

    return airdrops
  }

  /**
   * Cancella un airdrop (solo owner)
   */
  async cancelAirdrop(airdropId: string): Promise<void> {
    const airdrop = this.airdrops.get(airdropId)
    if (!airdrop) {
      throw new Error("Airdrop not found")
    }

    if (airdrop.status === "completed" || airdrop.status === "cancelled") {
      throw new Error(`Cannot cancel ${airdrop.status} airdrop`)
    }

    // Pause contratto on-chain
    if (airdrop.contractAddress) {
      const contract = new Contract(
        airdrop.contractAddress,
        AIRDROP_CONTRACT_ABI,
        this.signer
      )

      await contract.pause()

      // Recupera fondi non claimati
      if (airdrop.totalClaimed < airdrop.config.totalAmount) {
        await contract.withdraw()
      }
    }

    airdrop.status = "cancelled"
  }

  /**
   * Esporta dati airdrop per analisi
   */
  async exportAirdropData(airdropId: string): Promise<{
    config: AirdropConfig
    recipients: AirdropRecipient[]
    claims: { address: string; claimed: boolean; timestamp?: number }[]
    statistics: {
      totalAmount: string
      totalClaimed: string
      claimRate: number
      averageClaim: string
    }
  }> {
    const airdrop = this.airdrops.get(airdropId)
    const merkleData = this.merkleData.get(airdropId)

    if (!airdrop || !merkleData) {
      throw new Error("Airdrop not found")
    }

    // Raccogli stato claim per ogni recipient
    const claims = await Promise.all(
      merkleData.leaves.map(async (leaf) => {
        const status = await this.getClaimStatus(airdropId, leaf.address)
        return {
          address: leaf.address,
          claimed: status.claimed,
          timestamp: status.timestamp,
        }
      })
    )

    const recipients = merkleData.leaves.map((leaf) => ({
      address: leaf.address,
      amount: BigInt(leaf.amount),
      index: leaf.index,
    }))

    const statistics = {
      totalAmount: airdrop.config.totalAmount.toString(),
      totalClaimed: airdrop.totalClaimed.toString(),
      claimRate: airdrop.claimCount / airdrop.recipients,
      averageClaim:
        airdrop.claimCount > 0
          ? (airdrop.totalClaimed / BigInt(airdrop.claimCount)).toString()
          : "0",
    }

    return {
      config: airdrop.config,
      recipients,
      claims,
      statistics,
    }
  }

  /**
   * Valida configurazione airdrop
   */
  private validateConfig(config: AirdropConfig): void {
    if (!ethers.isAddress(config.tokenAddress)) {
      throw new Error("Invalid token address")
    }

    if (config.totalAmount <= 0) {
      throw new Error("Total amount must be positive")
    }

    if (config.startTime >= config.endTime) {
      throw new Error("End time must be after start time")
    }

    if (config.eligibilityCriteria.length === 0) {
      throw new Error("At least one eligibility criteria required")
    }

    if (config.claimDeadline && config.claimDeadline <= config.endTime) {
      throw new Error("Claim deadline must be after end time")
    }
  }

  /**
   * Verifica criteri dinamici
   */
  private async checkDynamicEligibility(
    userAddress: string,
    config: AirdropConfig
  ): Promise<{ eligible: boolean; reasons: string[] }> {
    const reasons: string[] = []

    for (const criteria of config.eligibilityCriteria) {
      const result = await this.processEligibilityCriteria(criteria)
      const found = result.find(
        (r) => getAddress(r.address) === getAddress(userAddress)
      )

      if (!found) {
        reasons.push(`Failed ${criteria.type} criteria`)
      }
    }

    return {
      eligible: reasons.length === 0,
      reasons,
    }
  }

  /**
   * Helper functions
   */
  private generateAirdropId(): string {
    return `airdrop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private async getPotentialAddresses(): Promise<string[]> {
    // In produzione, questo recupererebbe da eventi, graph, o database
    // Per demo, ritorna alcuni indirizzi di esempio
    return [
      "0x742d35Cc6634C0532925a3b844Bc9e7595f8fA5e",
      "0x53d284357ec70cE289D6D64134DfAc8E511c8a3D",
      "0xfe9e8709d3215310075d67e3ed32a371104cf68c",
    ]
  }

  private async loadSnapshot(snapshotId: string): Promise<any[]> {
    // In produzione, caricheresti da IPFS o storage
    return []
  }

  private async publishToIPFS(
    airdropId: string,
    recipients: AirdropRecipient[],
    merkleData: MerkleTreeData
  ): Promise<string> {
    // In produzione, pubblicheresti su IPFS
    console.log(`Publishing airdrop ${airdropId} to IPFS...`)
    return "QmXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }
}
