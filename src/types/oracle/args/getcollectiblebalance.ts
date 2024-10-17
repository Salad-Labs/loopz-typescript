type GetCollectibleBalanceArgs = {
  networkId: string
  address: string // User address that should be checked
  tokens: [
    {
      collection: string
      tokenId: string
      type: "ERC721" | "ERC1155"
      balance: number
    }
  ]
}

export { GetCollectibleBalanceArgs }
