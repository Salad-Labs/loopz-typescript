export interface MerkleTreeData {
  root: string
  leaves: { address: string; amount: string; index: number }[]
  tree: any // MerkleTree instance
}
