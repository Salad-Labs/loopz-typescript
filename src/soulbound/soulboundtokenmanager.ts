import { ethers, Contract, EventLog } from "ethers"
import {
  SoulBoundToken,
  TokenUpdateRequest,
  BindingConfig,
  MintRequest,
  VerificationProof,
  UserStats,
  ReputationData,
  AchievementData,
  BadgeData,
  SoulBoundTokenMetadata,
  ProgressData,
} from "../interfaces/soulbound"

// ABI del contratto SBT
const SBT_CONTRACT_ABI = [
  // Core functions
  "function mint(address to, string memory uri) external returns (uint256)",
  "function burn(uint256 tokenId) external",
  "function updateMetadata(uint256 tokenId, string memory newUri) external",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function totalSupply() external view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
  "function balanceOf(address owner) external view returns (uint256)",

  // Soul binding functions
  "function isSoulBound(uint256 tokenId) external view returns (bool)",
  "function bindToken(uint256 tokenId) external",
  "function unbindToken(uint256 tokenId, bytes calldata proof) external",

  // Access control
  "function grantUpdater(address account) external",
  "function revokeUpdater(address account) external",
  "function isUpdater(address account) external view returns (bool)",

  // Events
  "event Minted(address indexed to, uint256 indexed tokenId, string uri)",
  "event MetadataUpdated(uint256 indexed tokenId, string oldUri, string newUri)",
  "event TokenBound(uint256 indexed tokenId)",
  "event TokenUnbound(uint256 indexed tokenId)",
  "event Burned(uint256 indexed tokenId)",

  // Contract metadata
  "function name() external view returns (string)",
  "function symbol() external view returns (string)",
]

export class SoulBoundTokenManager {
  private provider: ethers.Provider
  private signer: ethers.Signer
  private contract: Contract
  private contractAddress: string
  private ipfsGateway: string
  private metadataCache: Map<number, SoulBoundTokenMetadata> = new Map()
  private bindingConfig: BindingConfig
  private updateQueue: Map<number, TokenUpdateRequest[]> = new Map()

  constructor(
    provider: ethers.Provider,
    signer: ethers.Signer,
    contractAddress: string,
    ipfsGateway: string = "https://ipfs.io/ipfs/",
    bindingConfig?: BindingConfig
  ) {
    this.provider = provider
    this.signer = signer
    this.contractAddress = contractAddress
    this.contract = new Contract(contractAddress, SBT_CONTRACT_ABI, signer)
    this.ipfsGateway = ipfsGateway
    this.bindingConfig = bindingConfig || this.getDefaultBindingConfig()

    this.setupEventListeners()
  }

  /**
   * Minta un nuovo Soul Bound Token
   */
  async mintSoulBoundToken(
    userAddress: string,
    metadata: SoulBoundTokenMetadata,
    verifications?: VerificationProof[]
  ): Promise<ethers.TransactionResponse> {
    // Valida metadata
    this.validateMetadata(metadata)

    // Verifica requisiti se specificati
    if (this.bindingConfig.requiredVerifications.length > 0) {
      await this.validateVerifications(verifications || [])
    }

    // Carica metadata su IPFS
    const uri = await this.uploadMetadataToIPFS(metadata)

    // Mint on-chain
    const tx = await this.contract.mint(userAddress, uri)

    // Attendi conferma per ottenere tokenId
    const receipt = await tx.wait()
    const mintEvent = receipt.logs.find(
      (log: any) =>
        log.topics[0] === ethers.id("Minted(address,uint256,string)")
    )

    if (mintEvent && mintEvent instanceof EventLog) {
      const tokenId = Number(mintEvent.args[1])

      // Salva in cache
      this.metadataCache.set(tokenId, metadata)

      // Auto-bind se configurato
      if (!this.bindingConfig.allowTransfer) {
        await this.bindToken(tokenId)
      }
    }

    return tx
  }

  /**
   * Aggiorna metadata del token
   */
  async updateTokenMetadata(
    tokenId: number,
    updates: Partial<SoulBoundTokenMetadata>
  ): Promise<ethers.TransactionResponse> {
    // Verifica ownership o permessi
    await this.verifyUpdatePermission(tokenId)

    // Ottieni metadata corrente
    const currentMetadata = await this.getTokenMetadata(tokenId)
    if (!currentMetadata) {
      throw new Error("Token not found")
    }

    // Verifica frequenza aggiornamenti
    const timeSinceLastUpdate = Date.now() - currentMetadata.lastUpdated
    if (timeSinceLastUpdate < this.bindingConfig.updateFrequency) {
      throw new Error(
        `Must wait ${Math.ceil(
          (this.bindingConfig.updateFrequency - timeSinceLastUpdate) / 1000
        )} seconds before next update`
      )
    }

    // Merge updates
    const updatedMetadata: SoulBoundTokenMetadata = {
      ...currentMetadata,
      ...updates,
      lastUpdated: Date.now(),
    }

    // Valida metadata aggiornata
    this.validateMetadata(updatedMetadata)

    // Upload su IPFS
    const newUri = await this.uploadMetadataToIPFS(updatedMetadata)

    // Aggiorna on-chain
    const tx = await this.contract.updateMetadata(tokenId, newUri)

    // Aggiorna cache
    this.metadataCache.set(tokenId, updatedMetadata)

    return tx
  }

  /**
   * Lega progressi al token
   */
  async bindProgress(
    tokenId: number,
    progressData: ProgressData
  ): Promise<ethers.TransactionResponse> {
    const metadata = await this.getTokenMetadata(tokenId)
    if (!metadata) {
      throw new Error("Token not found")
    }

    // Applica progress basato sulla categoria
    switch (progressData.category) {
      case "experience":
        metadata.experience += Number(progressData.value)
        metadata.level = this.calculateLevel(metadata.experience)
        break

      case "achievement":
        const achievement = progressData.value as AchievementData
        if (!metadata.achievements.find((a) => a.id === achievement.id)) {
          metadata.achievements.push(achievement)
        }
        break

      case "stats":
        this.updateStats(metadata.stats, progressData)
        break

      case "reputation":
        metadata.reputation = this.updateReputation(
          metadata.reputation,
          progressData
        )
        break

      case "custom":
        if (!metadata.customData) metadata.customData = {}
        metadata.customData[progressData.action] = progressData.value
        break
    }

    // Aggiorna metadata
    return this.updateTokenMetadata(tokenId, metadata)
  }

  /**
   * Ottiene token dell'utente
   */
  async getUserToken(userAddress: string): Promise<SoulBoundToken | null> {
    try {
      const balance = await this.contract.balanceOf(userAddress)
      if (balance === 0) return null

      // Prendi il primo token (SBT dovrebbe essere unico per utente)
      const tokenId = await this.contract.tokenOfOwnerByIndex(userAddress, 0)
      const metadata = await this.getTokenMetadata(Number(tokenId))

      if (!metadata) return null

      const uri = await this.contract.tokenURI(tokenId)
      const isBound = await this.contract.isSoulBound(tokenId)

      return {
        tokenId: Number(tokenId),
        owner: userAddress,
        metadata,
        uri,
        bound: isBound,
        createdAt: metadata.lastUpdated, // Approssimazione
        version: 1,
      }
    } catch (error) {
      console.error("Error getting user token:", error)
      return null
    }
  }

  /**
   * Ottiene metadata del token
   */
  async getTokenMetadata(
    tokenId: number
  ): Promise<SoulBoundTokenMetadata | null> {
    // Controlla cache
    if (this.metadataCache.has(tokenId)) {
      return this.metadataCache.get(tokenId)!
    }

    try {
      const uri = await this.contract.tokenURI(tokenId)
      const metadata = await this.fetchMetadataFromIPFS(uri)

      // Salva in cache
      this.metadataCache.set(tokenId, metadata)

      return metadata
    } catch (error) {
      console.error("Error fetching metadata:", error)
      return null
    }
  }

  /**
   * Bind token (rende non trasferibile)
   */
  private async bindToken(tokenId: number): Promise<void> {
    const isBound = await this.contract.isSoulBound(tokenId)
    if (!isBound) {
      const tx = await this.contract.bindToken(tokenId)
      await tx.wait()
    }
  }

  /**
   * Calcola reputazione
   */
  async calculateReputation(userAddress: string): Promise<ReputationData> {
    const token = await this.getUserToken(userAddress)
    if (!token) {
      return this.getDefaultReputation()
    }

    const metadata = token.metadata
    let score = 0

    // Fattori che contribuiscono alla reputazione
    // 1. Livello ed esperienza (max 200 punti)
    score += Math.min(200, metadata.level * 10)

    // 2. Achievement (max 200 punti)
    const achievementScore = metadata.achievements.reduce(
      (acc, achievement) => {
        const tierScores = {
          bronze: 10,
          silver: 20,
          gold: 40,
          platinum: 70,
          diamond: 100,
        }
        return acc + (tierScores[achievement.tier] || 0)
      },
      0
    )
    score += Math.min(200, achievementScore)

    // 3. Attività on-chain (max 200 punti)
    const activityScore = Math.min(
      200,
      Math.min(100, metadata.stats.transactionsCount) +
        Math.min(50, metadata.stats.daysActive / 10) +
        Math.min(50, metadata.stats.protocolsUsed.length * 10)
    )
    score += activityScore

    // 4. Social score (max 200 punti)
    score += Math.min(200, metadata.stats.socialScore * 2)

    // 5. Badge rari (max 200 punti)
    const badgeScore = metadata.badges.reduce((acc, badge) => {
      return acc + badge.rarity * 20
    }, 0)
    score += Math.min(200, badgeScore)

    // Normalizza a 0-1000
    score = Math.min(1000, score)

    // Determina trust level
    let trustLevel: ReputationData["trustLevel"]
    if (score >= 800) trustLevel = "elite"
    else if (score >= 500) trustLevel = "trusted"
    else if (score >= 200) trustLevel = "verified"
    else trustLevel = "beginner"

    return {
      score,
      trustLevel,
      violations: metadata.reputation?.violations || 0,
      endorsements: metadata.reputation?.endorsements || 0,
      lastCalculated: Date.now(),
    }
  }

  /**
   * Verifica requisiti per azioni specifiche
   */
  async verifyRequirements(
    userAddress: string,
    requirements: {
      minLevel?: number
      minReputation?: number
      requiredAchievements?: string[]
      requiredBadges?: string[]
      customRequirements?: ((metadata: SoulBoundTokenMetadata) => boolean)[]
    }
  ): Promise<{ verified: boolean; reasons: string[] }> {
    const token = await this.getUserToken(userAddress)
    if (!token) {
      return { verified: false, reasons: ["No Soul Bound Token found"] }
    }

    const metadata = token.metadata
    const reasons: string[] = []

    // Verifica livello
    if (requirements.minLevel && metadata.level < requirements.minLevel) {
      reasons.push(
        `Level ${requirements.minLevel} required (current: ${metadata.level})`
      )
    }

    // Verifica reputazione
    if (requirements.minReputation) {
      const reputation = await this.calculateReputation(userAddress)
      if (reputation.score < requirements.minReputation) {
        reasons.push(
          `Reputation ${requirements.minReputation} required (current: ${reputation.score})`
        )
      }
    }

    // Verifica achievement
    if (requirements.requiredAchievements) {
      const missingAchievements = requirements.requiredAchievements.filter(
        (reqId) => !metadata.achievements.find((a) => a.id === reqId)
      )
      if (missingAchievements.length > 0) {
        reasons.push(`Missing achievements: ${missingAchievements.join(", ")}`)
      }
    }

    // Verifica badge
    if (requirements.requiredBadges) {
      const missingBadges = requirements.requiredBadges.filter(
        (reqId) => !metadata.badges.find((b) => b.id === reqId)
      )
      if (missingBadges.length > 0) {
        reasons.push(`Missing badges: ${missingBadges.join(", ")}`)
      }
    }

    // Verifica custom
    if (requirements.customRequirements) {
      for (let i = 0; i < requirements.customRequirements.length; i++) {
        if (!requirements.customRequirements[i](metadata)) {
          reasons.push(`Custom requirement ${i + 1} not met`)
        }
      }
    }

    return {
      verified: reasons.length === 0,
      reasons,
    }
  }

  /**
   * Batch update per efficienza
   */
  async batchUpdateTokens(
    updates: TokenUpdateRequest[]
  ): Promise<ethers.TransactionResponse[]> {
    const transactions: ethers.TransactionResponse[] = []

    // Raggruppa per blocchi per evitare congestione
    const batchSize = 10
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize)

      const batchTxs = await Promise.all(
        batch.map((update) =>
          this.updateTokenMetadata(update.tokenId, update.updates)
        )
      )

      transactions.push(...batchTxs)

      // Attendi un po' tra i batch
      if (i + batchSize < updates.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    return transactions
  }

  /**
   * Esporta metadata per backup
   */
  async exportTokenData(tokenId: number): Promise<{
    metadata: SoulBoundTokenMetadata
    onChainData: {
      owner: string
      uri: string
      bound: boolean
    }
    timestamp: number
  }> {
    const metadata = await this.getTokenMetadata(tokenId)
    if (!metadata) {
      throw new Error("Token not found")
    }

    const owner = await this.contract.ownerOf(tokenId)
    const uri = await this.contract.tokenURI(tokenId)
    const bound = await this.contract.isSoulBound(tokenId)

    return {
      metadata,
      onChainData: {
        owner,
        uri,
        bound,
      },
      timestamp: Date.now(),
    }
  }

  /**
   * Helper Functions
   */

  private validateMetadata(metadata: SoulBoundTokenMetadata): void {
    if (!metadata.userId || !metadata.walletAddress) {
      throw new Error("userId and walletAddress are required")
    }

    if (!ethers.isAddress(metadata.walletAddress)) {
      throw new Error("Invalid wallet address")
    }

    if (metadata.level < 1) {
      throw new Error("Level must be at least 1")
    }

    if (metadata.experience < 0) {
      throw new Error("Experience cannot be negative")
    }
  }

  private async validateVerifications(
    verifications: VerificationProof[]
  ): Promise<void> {
    const required = this.bindingConfig.requiredVerifications.filter(
      (v) => v.required
    )

    for (const req of required) {
      const proof = verifications.find((v) => v.type === req.type)
      if (!proof) {
        throw new Error(`Missing required verification: ${req.type}`)
      }

      // Verifica scadenza
      if (req.expiresIn && Date.now() - proof.timestamp > req.expiresIn) {
        throw new Error(`Verification ${req.type} expired`)
      }

      // Verifica firma (in produzione, verificherebbe con provider)
      // await this.verifyProofSignature(proof);
    }
  }

  private async verifyUpdatePermission(tokenId: number): Promise<void> {
    const owner = await this.contract.ownerOf(tokenId)
    const signerAddress = await this.signer.getAddress()

    // Controlla se il signer è owner o updater autorizzato
    const isOwner = owner.toLowerCase() === signerAddress.toLowerCase()
    const isUpdater = await this.contract.isUpdater(signerAddress)

    if (!isOwner && !isUpdater) {
      throw new Error("Not authorized to update this token")
    }
  }

  private calculateLevel(experience: number): number {
    // Formula: level = floor(sqrt(experience / 100)) + 1
    return Math.floor(Math.sqrt(experience / 100)) + 1
  }

  private updateStats(stats: UserStats, progressData: ProgressData): void {
    const { action, value } = progressData

    switch (action) {
      case "transaction":
        stats.transactionsCount++
        break
      case "volume":
        stats.volumeTraded += BigInt(value)
        break
      case "protocol":
        if (!stats.protocolsUsed.includes(value)) {
          stats.protocolsUsed.push(value)
        }
        break
      case "nft":
        stats.nftsOwned = value
        break
      case "defi":
        stats.defiPositions = value
        break
      case "social":
        stats.socialScore = value
        break
      default:
        if (!stats.customStats) stats.customStats = {}
        stats.customStats[action] = value
    }
  }

  private updateReputation(
    current: ReputationData,
    progressData: ProgressData
  ): ReputationData {
    const { action, value } = progressData

    switch (action) {
      case "endorsement":
        return { ...current, endorsements: current.endorsements + 1 }
      case "violation":
        return { ...current, violations: current.violations + 1 }
      case "score":
        return { ...current, score: Math.min(1000, current.score + value) }
      default:
        return current
    }
  }

  private getDefaultBindingConfig(): BindingConfig {
    return {
      allowTransfer: false,
      burnEnabled: false,
      updateFrequency: 3600, // 1 ora
      requiredVerifications: [],
      customRules: [],
    }
  }

  private getDefaultReputation(): ReputationData {
    return {
      score: 0,
      trustLevel: "beginner",
      violations: 0,
      endorsements: 0,
      lastCalculated: Date.now(),
    }
  }

  private async uploadMetadataToIPFS(
    metadata: SoulBoundTokenMetadata
  ): Promise<string> {
    // In produzione, uploaderebbe su IPFS
    // Per demo, simula con hash
    const metadataString = JSON.stringify(metadata)
    const hash = ethers.keccak256(ethers.toUtf8Bytes(metadataString))
    return `ipfs://${hash.slice(2, 48)}`
  }

  private async fetchMetadataFromIPFS(
    uri: string
  ): Promise<SoulBoundTokenMetadata> {
    // In produzione, scaricherebbe da IPFS
    // Per demo, ritorna mock data
    const ipfsHash = uri.replace("ipfs://", "")

    // Simula metadata basato su hash
    return {
      userId: `user_${ipfsHash.slice(0, 8)}`,
      walletAddress: "0x" + ipfsHash.slice(8, 48),
      level: 1,
      experience: 0,
      achievements: [],
      stats: {
        transactionsCount: 0,
        volumeTraded: BigInt(0),
        daysActive: 0,
        protocolsUsed: [],
        nftsOwned: 0,
        defiPositions: 0,
        socialScore: 0,
      },
      badges: [],
      reputation: this.getDefaultReputation(),
      lastUpdated: Date.now(),
    }
  }

  private setupEventListeners(): void {
    // Ascolta eventi del contratto
    this.contract.on("MetadataUpdated", async (tokenId, oldUri, newUri) => {
      // Invalida cache
      this.metadataCache.delete(Number(tokenId))
      console.log(`Token ${tokenId} metadata updated`)
    })

    this.contract.on("Minted", (to, tokenId, uri) => {
      console.log(`New SBT minted to ${to}, tokenId: ${tokenId}`)
    })

    this.contract.on("TokenBound", (tokenId) => {
      console.log(`Token ${tokenId} is now soul bound`)
    })
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.contract.removeAllListeners()
    this.metadataCache.clear()
    this.updateQueue.clear()
  }
}
