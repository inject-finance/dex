import { UserAddress } from '@/common/types/User'
import { type ContractTransaction } from 'ethers'

export interface IDexPoolContractService {
  init: (address: string) => Promise<void>
  getShares: ({ address }: UserAddress) => Promise<number>
  totalSupply: () => Promise<number>
  approve: (shares: number) => Promise<ContractTransaction> | undefined
  getAllowance: ({ address }: UserAddress) => Promise<number>
}
