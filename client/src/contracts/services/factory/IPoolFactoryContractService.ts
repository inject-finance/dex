import { type ContractTransaction } from 'ethers'
export interface IPoolFactoryContractService {
  init: () => Promise<void>
  pairExists: (tokenA: string, tokenB: string) => Promise<boolean>
  createPair: (
    tokenA: string,
    tokenB: string
  ) => Promise<ContractTransaction | undefined>
  addToWhitelist: (
    metamaskAddress: string
  ) => Promise<ContractTransaction> | undefined
  removeFromWhitelist: (
    metamaskAddress: string
  ) => Promise<ContractTransaction> | undefined
  getPairAddress: (
    tokenA: string,
    tokenB: string
  ) => Promise<string | undefined>
}
