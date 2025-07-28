export enum RequirementType {
  // Trading
  TOTAL_TRADES = "total_trades",
  VOLUME_TRADED = "volume_traded",
  PROFIT_GENERATED = "profit_generated",
  UNIQUE_TOKENS_TRADED = "unique_tokens_traded",

  // Time-based
  DAYS_ACTIVE = "days_active",
  CONSECUTIVE_DAYS = "consecutive_days",
  ACCOUNT_AGE_DAYS = "account_age_days",

  // Social
  REFERRALS_COUNT = "referrals_count",
  SOCIAL_SHARES = "social_shares",
  COMMUNITY_VOTES = "community_votes",

  // On-chain activity
  GAS_SPENT = "gas_spent",
  CONTRACTS_DEPLOYED = "contracts_deployed",
  NFT_OWNED = "nft_owned",

  // Platform specific
  XP_EARNED = "xp_earned",
  LEVEL_REACHED = "level_reached",
  CHALLENGES_COMPLETED = "challenges_completed",

  // Custom
  CUSTOM = "custom",
}
