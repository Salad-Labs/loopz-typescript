export interface SocialMetrics {
  // Connessioni
  followers?: number
  following?: number

  // Reputazione
  reputationScore: number
  trustLevel: "low" | "medium" | "high" | "verified"
  endorsements: number

  // Attività social
  daoParticipation: number
  proposalsCreated: number
  votesCount: number

  // Community
  communitiesJoined: string[]
  contributionScore: number
}
