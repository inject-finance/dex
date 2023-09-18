import { type PoolFactory } from '@/contracts/types/PoolFactory'
import { type ContractTransaction } from 'ethers'
import { PoolFactoryConstants } from '../../data/PoolFactory.constants'
import { createAsyncContract } from '../../utils/createContract'
import { type IPoolFactoryContractService } from './IPoolFactoryContractService'

export class PoolFactoryContractService implements IPoolFactoryContractService {
  private declare contract: PoolFactory | null

  constructor() {
    this.contract = null
  }

  public async init() {
    this.contract = await createAsyncContract<PoolFactory>(
      PoolFactoryConstants.address,
      PoolFactoryConstants.abi
    )
  }

  public async pairExists(tokenA: string, tokenB: string): Promise<boolean> {
    await this.init()
    try {
      return Boolean(await this.contract?.pairExists(tokenA, tokenB))
    } catch (error) {
      return false
    }
  }

  public async createPair(
    tokenA: string,
    tokenB: string
  ): Promise<ContractTransaction | undefined> {
    await this.init()
    return this.contract?.createPair(tokenA, tokenB, 300)
  }

  public async getPairAddress(tokenA: string, tokenB: string) {
    try {
      if (!tokenA.length || !tokenB.length) {
        return ''
      }

      await this.init()
      const poolAddress = await this.contract?.getPairAddress(tokenA, tokenB)
      return poolAddress === '0x0000000000000000000000000000000000000000' ||
        !poolAddress
        ? ''
        : poolAddress
    } catch (error) {
      return ''
    }
  }

  public addToWhitelist(metamaskAddress: string) {
    return this.contract?.addToWhitelist([
      PoolFactoryConstants.address,
      metamaskAddress
    ])
  }

  public removeFromWhitelist(metamaskAddress: string) {
    return this.contract?.removeFromWhitelist([metamaskAddress])
  }
}
export const poolFactoryContractService = new PoolFactoryContractService()
