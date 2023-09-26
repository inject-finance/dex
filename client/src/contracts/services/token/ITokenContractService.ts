import { type Token } from '@/common/types/Token'
import { type ContractTransaction } from 'ethers'

export interface ITokenContractService {
  init: (token: Token) => Promise<void>
  approve: (token: Token) => Promise<ContractTransaction | undefined>
  getBalance: (token: Token) => Promise<number>
}
