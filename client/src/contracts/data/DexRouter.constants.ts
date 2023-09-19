export const DexRouterConstants = {
  address: '0x9a46ed7D68b939386c53E4Bb67BBdcDC9DCDdff4',
  abi: [
    {
      inputs: [
        {
          internalType: 'address',
          name: '_factory',
          type: 'address'
        },
        {
          internalType: 'address',
          name: '_weth',
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
          indexed: false,
          internalType: 'address',
          name: '_sender',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'address',
          name: '_token',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: '_amountToken',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'address',
          name: '_poolAddress',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: '_shares',
          type: 'uint256'
        }
      ],
      name: 'LogAddLiquidityETH',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: '_sender',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'address',
          name: '_tokenA',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'address',
          name: '_tokenB',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amountA',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amountB',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'poolAddress',
          type: 'address'
        }
      ],
      name: 'LogAddTokenToTokenLiquidity',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: '_sender',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'address',
          name: '_tokenA',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'address',
          name: '_tokenB',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: '_shares',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: '_amountA',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: '_amountB',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'poolAddress',
          type: 'address'
        }
      ],
      name: 'LogRemoveLiquidity',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: '_sender',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'address',
          name: '_token',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: '_shares',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: '_amountToken',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: '_amountETH',
          type: 'uint256'
        }
      ],
      name: 'LogRemoveLiquidityETH',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: '_sender',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: '_amountIn',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'address',
          name: '_tokenOut',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'address',
          name: '_poolAddress',
          type: 'address'
        }
      ],
      name: 'LogSwapETHForTokens',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: '_sender',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: '_amountIn',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'address',
          name: '_tokenIn',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'address',
          name: '_poolAddress',
          type: 'address'
        }
      ],
      name: 'LogSwapTokensForETH',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: '_sender',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'address',
          name: '_tokenIn',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'address',
          name: '_tokenOut',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'address',
          name: '_poolAddress',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: '_fees',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: '_amountIn',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: '_amountOut',
          type: 'uint256'
        }
      ],
      name: 'LogSwapTokensWithFees',
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
      inputs: [],
      name: 'WETH',
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
      name: '_ownerFees',
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
          name: '_token',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: '_amountTokenDesired',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_amountTokenMin',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_amountETHMin',
          type: 'uint256'
        }
      ],
      name: 'addLiquidityETH',
      outputs: [
        {
          internalType: 'uint256',
          name: 'amountToken',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'amountETH',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'shares',
          type: 'uint256'
        }
      ],
      stateMutability: 'payable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_tokenA',
          type: 'address'
        },
        {
          internalType: 'address',
          name: '_tokenB',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: '_amountADesired',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_amountBDesired',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_amountAMin',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_amountBMin',
          type: 'uint256'
        }
      ],
      name: 'addTokenToTokenLiquidity',
      outputs: [
        {
          internalType: 'uint256',
          name: 'amountA',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'amountB',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'liquidity',
          type: 'uint256'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'factory',
      outputs: [
        {
          internalType: 'contract IPoolFactory',
          name: '',
          type: 'address'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_tokenIn',
          type: 'address'
        },
        {
          internalType: 'address',
          name: '_tokenOut',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: '_amountIn',
          type: 'uint256'
        }
      ],
      name: 'getTokenAmountOut',
      outputs: [
        {
          internalType: 'uint256',
          name: 'amountOut',
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
          name: '_tokenA',
          type: 'address'
        },
        {
          internalType: 'address',
          name: '_tokenB',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: '_amountIn',
          type: 'uint256'
        }
      ],
      name: 'getTokenPairRatio',
      outputs: [
        {
          internalType: 'uint256',
          name: 'amountOut',
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
          name: '_token0',
          type: 'address'
        },
        {
          internalType: 'address',
          name: '_token1',
          type: 'address'
        }
      ],
      name: 'getTokenPairReserves',
      outputs: [
        {
          internalType: 'uint256',
          name: 'amount0',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'amount1',
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
      inputs: [
        {
          internalType: 'address',
          name: '_tokenA',
          type: 'address'
        },
        {
          internalType: 'address',
          name: '_tokenB',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: '_shares',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_amountAMin',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_amountBMin',
          type: 'uint256'
        },
        {
          internalType: 'address',
          name: '_to',
          type: 'address'
        }
      ],
      name: 'removeLiquidity',
      outputs: [
        {
          internalType: 'uint256',
          name: 'amountA',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'amountB',
          type: 'uint256'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_token',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: '_shares',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_amountTokenMin',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_amountETHMin',
          type: 'uint256'
        },
        {
          internalType: 'address',
          name: '_to',
          type: 'address'
        }
      ],
      name: 'removeLiquidityETH',
      outputs: [
        {
          internalType: 'uint256',
          name: 'amountToken',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'amountETH',
          type: 'uint256'
        }
      ],
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
          internalType: 'address',
          name: '_factory',
          type: 'address'
        }
      ],
      name: 'setNewPoolFactory',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_tokenOut',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: '_minAmountOut',
          type: 'uint256'
        }
      ],
      name: 'swapETHForTokens',
      outputs: [],
      stateMutability: 'payable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_tokenIn',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: '_amountIn',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_minAmountOut',
          type: 'uint256'
        }
      ],
      name: 'swapTokensForETH',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_tokenIn',
          type: 'address'
        },
        {
          internalType: 'address',
          name: '_tokenOut',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: '_amountIn',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: '_minAmountOut',
          type: 'uint256'
        }
      ],
      name: 'swapTokensWithFees',
      outputs: [],
      stateMutability: 'nonpayable',
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
      stateMutability: 'payable',
      type: 'receive'
    }
  ]
}
