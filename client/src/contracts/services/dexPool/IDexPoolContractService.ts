import { TokenPair } from '@/common/types/Token'
import { User, UserAddress } from '@/common/types/User'
import { type ContractTransaction } from 'ethers'

export interface IDexPoolContractService {
  init(address: string): Promise<void>
  approveAmountToStake({
    sharesToStake,
    poolAddress,
    account
  }: {
    sharesToStake: number
    poolAddress: string
    account: User
  } & TokenPair): Promise<ContractTransaction | undefined>

  approveAmount(shares: number): Promise<ContractTransaction> | undefined

  getAllowance({ address }: UserAddress): Promise<number>

  getShares({ tokenA, tokenB }: TokenPair): Promise<number>

  totalSupply({ tokenA, tokenB }: TokenPair): Promise<number>
}
