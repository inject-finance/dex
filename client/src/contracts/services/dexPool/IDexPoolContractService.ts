import { UserAddress } from '@/common/types/User'
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
    account: UserAddress
  }): Promise<ContractTransaction | undefined>

  approveAmount(shares: number): Promise<ContractTransaction> | undefined

  getAllowance({ address }: UserAddress): Promise<number>

  getShares({ address }: UserAddress): Promise<number>

  totalSupply(): Promise<number>
}
