import { type Token } from '@/common/types/Token'
import { UserAddress } from '@/common/types/User'
import { type ContractTransaction } from 'ethers'

export interface IRouterContractService {
  init: () => Promise<void>
  swap: (
    tokenA: Token,
    tokenB: Token
  ) => Promise<ContractTransaction | undefined>
  getTokensOutAmount: (tokenA: Token, tokenB: Token) => Promise<number>
  addLiquidity: (
    tokenA: Token,
    tokenB: Token
  ) => Promise<ContractTransaction | undefined>
  getTokenPairRatio: (tokenA: Token, tokenB: Token) => Promise<number>
  getReserves: (
    tokenA: Token,
    tokenB: Token
  ) => Promise<
    | {
        reserveA: number
        reserveB: number
      }
    | {
        reserveA: number
        reserveB: number
      }
  >
  removeLiquidity(
    tokenA: Token,
    tokenB: Token,
    { address }: UserAddress,
    shares: number
  ): Promise<ContractTransaction | undefined>
}
