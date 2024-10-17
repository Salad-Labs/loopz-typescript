export interface CollectibleMetadata {
  contract: {
    address: string
  }
  id: {
    tokenId: string
    tokenMetadata: {
      tokenType: string
    }
  }
  title: string
  description: string
  tokenUri: {
    gateway: string
    raw: string
  }
  media: [
    {
      gateway: string
      raw: string
    }
  ]
  metadata: {
    name: string
    symbol: string
    description: string
    image: string
    attributes: [
      {
        value: string
        trait_type: string
      },
      {
        value: string
        trait_type: string
      },
      {
        value: string
        trait_type: string
      },
      {
        value: string
        trait_type: string
      },
      {
        value: string
        trait_type: string
      },
      {
        value: string
        trait_type: string
      }
    ]
  }
  timeLastUpdated: Date
  contractMetadata: {
    name: string
    symbol: string
    tokenType: string
    contractDeployer: string
    deployedBlockNumber: number
    openSea: object
  }
  isOwner: boolean
  owner: string
  loopzAdditionalInfoCollection: {
    name: string | null
    statusVerification: number
    address: string
    imageUrl: string | null
    networkId: string
    abi: Array<any>
    type: string
    symbol: string | null
    description: string | null
    percentageRoyalties: string | null
    tokenType: string | null
    explorerURL: string | null
    createdAt: Date
  }
}
