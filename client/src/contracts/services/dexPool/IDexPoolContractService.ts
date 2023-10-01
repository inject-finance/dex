import { PoolAddress } from '@/common/types/Pool'
import { PositionAmount } from '@/common/types/Position'
import { TokenPair } from '@/common/types/Token'
import { UserAddress } from '@/common/types/User'
import { type ContractTransaction } from 'ethers'

export interface IDexPoolContractService {
  init(address: string): Promise<void>
  approvePositionAmount({
    amount,
    address
  }: PositionAmount & PoolAddress): Promise<ContractTransaction | undefined>

  approveRemoveLiquidityAmount(
    shares: number,
    poolAddress: string
  ): Promise<ContractTransaction | undefined>

  getAllowance({ address }: UserAddress): Promise<number>

  getShares({ tokenA, tokenB }: TokenPair): Promise<number>

  totalSupply({ tokenA, tokenB }: TokenPair): Promise<number>
}
