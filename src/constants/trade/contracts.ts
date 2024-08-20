const erc721Abi = [
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes", name: "_data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
]
const erc20Abi = [
  {
    inputs: [{ internalType: "uint256", name: "chainId_", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "src", type: "address" },
      { indexed: true, internalType: "address", name: "guy", type: "address" },
      { indexed: false, internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: true,
    inputs: [
      { indexed: true, internalType: "bytes4", name: "sig", type: "bytes4" },
      { indexed: true, internalType: "address", name: "usr", type: "address" },
      { indexed: true, internalType: "bytes32", name: "arg1", type: "bytes32" },
      { indexed: true, internalType: "bytes32", name: "arg2", type: "bytes32" },
      { indexed: false, internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "LogNote",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "src", type: "address" },
      { indexed: true, internalType: "address", name: "dst", type: "address" },
      { indexed: false, internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    constant: true,
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "usr", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "usr", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "burn",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "guy", type: "address" }],
    name: "deny",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "usr", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "src", type: "address" },
      { internalType: "address", name: "dst", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "move",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "nonces",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "holder", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "nonce", type: "uint256" },
      { internalType: "uint256", name: "expiry", type: "uint256" },
      { internalType: "bool", name: "allowed", type: "bool" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
    ],
    name: "permit",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "usr", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "pull",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "usr", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "push",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "guy", type: "address" }],
    name: "rely",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "dst", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "src", type: "address" },
      { internalType: "address", name: "dst", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "version",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "wards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
]
const erc1155Abi = [
  {
    name: "balanceOf",
    type: "function",
    inputs: [
      {
        name: "owner",
        type: "address",
      },
      {
        name: "id",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "view",
  },
  {
    name: "supportsInterface",
    type: "function",
    inputs: [
      {
        name: "id",
        type: "bytes4",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "view",
  },
  {
    name: "changeBouncerAdmin",
    type: "function",
    inputs: [
      {
        name: "newBouncerAdmin",
        type: "address",
      },
    ],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "name",
    type: "function",
    inputs: [],
    outputs: [
      {
        name: "_name",
        type: "string",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "pure",
  },
  {
    name: "getApproved",
    type: "function",
    inputs: [
      {
        name: "id",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "operator",
        type: "address",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "view",
  },
  {
    name: "approve",
    type: "function",
    inputs: [
      {
        name: "operator",
        type: "address",
      },
      {
        name: "id",
        type: "uint256",
      },
    ],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "uri",
    type: "function",
    inputs: [
      {
        name: "id",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "view",
  },
  {
    name: "burnFrom",
    type: "function",
    inputs: [
      {
        name: "from",
        type: "address",
      },
      {
        name: "id",
        type: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "init",
    type: "function",
    inputs: [
      {
        name: "metaTransactionContract",
        type: "address",
      },
      {
        name: "admin",
        type: "address",
      },
      {
        name: "bouncerAdmin",
        type: "address",
      },
    ],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "transferFrom",
    type: "function",
    inputs: [
      {
        name: "from",
        type: "address",
      },
      {
        name: "to",
        type: "address",
      },
      {
        name: "id",
        type: "uint256",
      },
    ],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "approveFor",
    type: "function",
    inputs: [
      {
        name: "sender",
        type: "address",
      },
      {
        name: "operator",
        type: "address",
      },
      {
        name: "id",
        type: "uint256",
      },
    ],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "collectionIndexOf",
    type: "function",
    inputs: [
      {
        name: "id",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "view",
  },
  {
    name: "safeBatchTransferFrom",
    type: "function",
    inputs: [
      {
        name: "from",
        type: "address",
      },
      {
        name: "to",
        type: "address",
      },
      {
        name: "ids",
        type: "uint256[]",
      },
      {
        name: "values",
        type: "uint256[]",
      },
      {
        name: "data",
        type: "bytes",
      },
    ],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "safeTransferFrom",
    type: "function",
    inputs: [
      {
        name: "from",
        type: "address",
      },
      {
        name: "to",
        type: "address",
      },
      {
        name: "id",
        type: "uint256",
      },
    ],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "extractERC721",
    type: "function",
    inputs: [
      {
        name: "id",
        type: "uint256",
      },
      {
        name: "to",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "newId",
        type: "uint256",
      },
    ],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "isBouncer",
    type: "function",
    inputs: [
      {
        name: "who",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "view",
  },
  {
    name: "balanceOfBatch",
    type: "function",
    inputs: [
      {
        name: "owners",
        type: "address[]",
      },
      {
        name: "ids",
        type: "uint256[]",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256[]",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "view",
  },
  {
    name: "creatorOf",
    type: "function",
    inputs: [
      {
        name: "id",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "view",
  },
  {
    name: "ownerOf",
    type: "function",
    inputs: [
      {
        name: "id",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "owner",
        type: "address",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "view",
  },
  {
    name: "isSuperOperator",
    type: "function",
    inputs: [
      {
        name: "who",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "view",
  },
  {
    name: "getAdmin",
    type: "function",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "view",
  },
  {
    name: "balanceOf",
    type: "function",
    inputs: [
      {
        name: "owner",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "view",
  },
  {
    name: "setMetaTransactionProcessor",
    type: "function",
    inputs: [
      {
        name: "metaTransactionProcessor",
        type: "address",
      },
      {
        name: "enabled",
        type: "bool",
      },
    ],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "rarity",
    type: "function",
    inputs: [
      {
        name: "id",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "view",
  },
  {
    name: "changeAdmin",
    type: "function",
    inputs: [
      {
        name: "newAdmin",
        type: "address",
      },
    ],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "isPackIdUsed",
    type: "function",
    inputs: [
      {
        name: "creator",
        type: "address",
      },
      {
        name: "packId",
        type: "uint40",
      },
      {
        name: "numFTs",
        type: "uint16",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "symbol",
    type: "function",
    inputs: [],
    outputs: [
      {
        name: "_symbol",
        type: "string",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "pure",
  },
  {
    name: "getBouncerAdmin",
    type: "function",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "view",
  },
  {
    name: "setApprovalForAll",
    type: "function",
    inputs: [
      {
        name: "operator",
        type: "address",
      },
      {
        name: "approved",
        type: "bool",
      },
    ],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "setSuperOperator",
    type: "function",
    inputs: [
      {
        name: "superOperator",
        type: "address",
      },
      {
        name: "enabled",
        type: "bool",
      },
    ],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "burn",
    type: "function",
    inputs: [
      {
        name: "id",
        type: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "transferCreatorship",
    type: "function",
    inputs: [
      {
        name: "sender",
        type: "address",
      },
      {
        name: "original",
        type: "address",
      },
      {
        name: "to",
        type: "address",
      },
    ],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "safeTransferFrom",
    type: "function",
    inputs: [
      {
        name: "from",
        type: "address",
      },
      {
        name: "to",
        type: "address",
      },
      {
        name: "id",
        type: "uint256",
      },
      {
        name: "data",
        type: "bytes",
      },
    ],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "setBouncer",
    type: "function",
    inputs: [
      {
        name: "bouncer",
        type: "address",
      },
      {
        name: "enabled",
        type: "bool",
      },
    ],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "isCollection",
    type: "function",
    inputs: [
      {
        name: "id",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "view",
  },
  {
    name: "mint",
    type: "function",
    inputs: [
      {
        name: "creator",
        type: "address",
      },
      {
        name: "packId",
        type: "uint40",
      },
      {
        name: "hash",
        type: "bytes32",
      },
      {
        name: "supply",
        type: "uint256",
      },
      {
        name: "rarity",
        type: "uint8",
      },
      {
        name: "owner",
        type: "address",
      },
      {
        name: "data",
        type: "bytes",
      },
    ],
    outputs: [
      {
        name: "id",
        type: "uint256",
      },
    ],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "collectionOf",
    type: "function",
    inputs: [
      {
        name: "id",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "view",
  },
  {
    name: "tokenURI",
    type: "function",
    inputs: [
      {
        name: "id",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "view",
  },
  {
    name: "wasEverMinted",
    type: "function",
    inputs: [
      {
        name: "id",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "view",
  },
  {
    name: "isMetaTransactionProcessor",
    type: "function",
    inputs: [
      {
        name: "who",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "view",
  },
  {
    name: "isApprovedForAll",
    type: "function",
    inputs: [
      {
        name: "owner",
        type: "address",
      },
      {
        name: "operator",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "isOperator",
        type: "bool",
      },
    ],
    payable: false,
    constant: true,
    stateMutability: "view",
  },
  {
    name: "updateERC721",
    type: "function",
    inputs: [
      {
        name: "from",
        type: "address",
      },
      {
        name: "id",
        type: "uint256",
      },
      {
        name: "packId",
        type: "uint40",
      },
      {
        name: "hash",
        type: "bytes32",
      },
      {
        name: "newRarity",
        type: "uint8",
      },
      {
        name: "to",
        type: "address",
      },
      {
        name: "data",
        type: "bytes",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "setApprovalForAllFor",
    type: "function",
    inputs: [
      {
        name: "sender",
        type: "address",
      },
      {
        name: "operator",
        type: "address",
      },
      {
        name: "approved",
        type: "bool",
      },
    ],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "mintMultiple",
    type: "function",
    inputs: [
      {
        name: "creator",
        type: "address",
      },
      {
        name: "packId",
        type: "uint40",
      },
      {
        name: "hash",
        type: "bytes32",
      },
      {
        name: "supplies",
        type: "uint256[]",
      },
      {
        name: "rarityPack",
        type: "bytes",
      },
      {
        name: "owner",
        type: "address",
      },
      {
        name: "data",
        type: "bytes",
      },
    ],
    outputs: [
      {
        name: "ids",
        type: "uint256[]",
      },
    ],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "safeTransferFrom",
    type: "function",
    inputs: [
      {
        name: "from",
        type: "address",
      },
      {
        name: "to",
        type: "address",
      },
      {
        name: "id",
        type: "uint256",
      },
      {
        name: "value",
        type: "uint256",
      },
      {
        name: "data",
        type: "bytes",
      },
    ],
    outputs: [],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "extractERC721From",
    type: "function",
    inputs: [
      {
        name: "sender",
        type: "address",
      },
      {
        name: "id",
        type: "uint256",
      },
      {
        name: "to",
        type: "address",
      },
    ],
    outputs: [
      {
        name: "newId",
        type: "uint256",
      },
    ],
    payable: false,
    constant: false,
    stateMutability: "nonpayable",
  },
  {
    name: "CreatorshipTransfer",
    type: "event",
    inputs: [
      {
        name: "original",
        type: "address",
        indexed: true,
      },
      {
        name: "from",
        type: "address",
        indexed: true,
      },
      {
        name: "to",
        type: "address",
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    name: "BouncerAdminChanged",
    type: "event",
    inputs: [
      {
        name: "oldBouncerAdmin",
        type: "address",
        indexed: false,
      },
      {
        name: "newBouncerAdmin",
        type: "address",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    name: "Bouncer",
    type: "event",
    inputs: [
      {
        name: "bouncer",
        type: "address",
        indexed: false,
      },
      {
        name: "enabled",
        type: "bool",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    name: "MetaTransactionProcessor",
    type: "event",
    inputs: [
      {
        name: "metaTransactionProcessor",
        type: "address",
        indexed: false,
      },
      {
        name: "enabled",
        type: "bool",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    name: "Extraction",
    type: "event",
    inputs: [
      {
        name: "fromId",
        type: "uint256",
        indexed: true,
      },
      {
        name: "toId",
        type: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    name: "AssetUpdate",
    type: "event",
    inputs: [
      {
        name: "fromId",
        type: "uint256",
        indexed: true,
      },
      {
        name: "toId",
        type: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    name: "Transfer",
    type: "event",
    inputs: [
      {
        name: "_from",
        type: "address",
        indexed: true,
      },
      {
        name: "_to",
        type: "address",
        indexed: true,
      },
      {
        name: "_tokenId",
        type: "uint256",
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    name: "Approval",
    type: "event",
    inputs: [
      {
        name: "_owner",
        type: "address",
        indexed: true,
      },
      {
        name: "_approved",
        type: "address",
        indexed: true,
      },
      {
        name: "_tokenId",
        type: "uint256",
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    name: "ApprovalForAll",
    type: "event",
    inputs: [
      {
        name: "_owner",
        type: "address",
        indexed: true,
      },
      {
        name: "_operator",
        type: "address",
        indexed: true,
      },
      {
        name: "_approved",
        type: "bool",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    name: "TransferSingle",
    type: "event",
    inputs: [
      {
        name: "operator",
        type: "address",
        indexed: true,
      },
      {
        name: "from",
        type: "address",
        indexed: true,
      },
      {
        name: "to",
        type: "address",
        indexed: true,
      },
      {
        name: "id",
        type: "uint256",
        indexed: false,
      },
      {
        name: "value",
        type: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    name: "TransferBatch",
    type: "event",
    inputs: [
      {
        name: "operator",
        type: "address",
        indexed: true,
      },
      {
        name: "from",
        type: "address",
        indexed: true,
      },
      {
        name: "to",
        type: "address",
        indexed: true,
      },
      {
        name: "ids",
        type: "uint256[]",
        indexed: false,
      },
      {
        name: "values",
        type: "uint256[]",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    name: "URI",
    type: "event",
    inputs: [
      {
        name: "value",
        type: "string",
        indexed: false,
      },
      {
        name: "id",
        type: "uint256",
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    name: "SuperOperator",
    type: "event",
    inputs: [
      {
        name: "superOperator",
        type: "address",
        indexed: false,
      },
      {
        name: "enabled",
        type: "bool",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    name: "AdminChanged",
    type: "event",
    inputs: [
      {
        name: "oldAdmin",
        type: "address",
        indexed: false,
      },
      {
        name: "newAdmin",
        type: "address",
        indexed: false,
      },
    ],
    anonymous: false,
  },
]

export { erc721Abi, erc20Abi, erc1155Abi }
