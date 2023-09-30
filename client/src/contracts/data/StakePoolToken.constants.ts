export const StakePoolTokenConstants = {
  abi: [
    {
      inputs: [
        {
          internalType: 'address',
          name: '_injectToken',
          type: 'address'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'constructor'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: '_from',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: '_tokensClaimed',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'address',
          name: '_poolAddress',
          type: 'address'
        }
      ],
      name: 'LogClaimRewards',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: '_from',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: '_amountStaked',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'address',
          name: '_poolAddress',
          type: 'address'
        }
      ],
      name: 'LogStakeToken',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'previousOwner',
          type: 'address'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'newOwner',
          type: 'address'
        }
      ],
      name: 'OwnershipTransferred',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'account',
          type: 'address'
        }
      ],
      name: 'Paused',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'account',
          type: 'address'
        }
      ],
      name: 'Unpaused',
      type: 'event'
    },
    {
      inputs: [],
      name: 'MONTH',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'YEAR',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_amount',
          type: 'uint256'
        },
        {
          internalType: 'address',
          name: '_stakingPoolAddress',
          type: 'address'
        }
      ],
      name: 'addStakingPoolReserves',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'addressStaked',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_poolAddress',
          type: 'address'
        }
      ],
      name: 'claimRewards',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'factor',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_poolAddress',
          type: 'address'
        },
        {
          internalType: 'address',
          name: '_account',
          type: 'address'
        }
      ],
      name: 'getTotalRewards',
      outputs: [
        {
          internalType: 'uint256',
          name: 'totalRewards',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'injectToken',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'maxDuration',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'pause',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'paused',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'penalty',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'poolInfo',
      outputs: [
        {
          internalType: 'uint256',
          name: 'interestRate',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'monthlyIncrease',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'totalStakers',
          type: 'uint256'
        },
        {
          internalType: 'bool',
          name: 'isActive',
          type: 'bool'
        },
        {
          internalType: 'uint256',
          name: 'poolReserves',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'minReserve',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'minStakeAmount',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_amount',
          type: 'uint256'
        },
        {
          internalType: 'address',
          name: '_stakingPoolAddress',
          type: 'address'
        }
      ],
      name: 'removeStakingPoolReserves',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_newMaxDuration',
          type: 'uint256'
        }
      ],
      name: 'setMaxDuration',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_increase',
          type: 'uint256'
        },
        {
          internalType: 'address',
          name: '_poolAddress',
          type: 'address'
        }
      ],
      name: 'setMonthlyIncrease',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_penalty',
          type: 'uint256'
        }
      ],
      name: 'setPenalizationFee',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_poolAddress',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: '_interesRate',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_initialDeposit',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_minReserve',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_minStakeAmount',
          type: 'uint256'
        }
      ],
      name: 'setStakingPool',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        },
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'stakeInfo',
      outputs: [
        {
          internalType: 'uint256',
          name: 'start',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'end',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'stakeAmount',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'totalSupply',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'totalClaimed',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_stakeAmount',
          type: 'uint256'
        },
        {
          internalType: 'contract ITokenPool',
          name: '_poolAddress',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: '_duration',
          type: 'uint256'
        }
      ],
      name: 'stakeToken',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'stakingPoolExists',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'newOwner',
          type: 'address'
        }
      ],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_poolAddress',
          type: 'address'
        },
        {
          internalType: 'bool',
          name: '_status',
          type: 'bool'
        }
      ],
      name: 'turnOnOffPool',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'unpause',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    }
  ]
}
