/* eslint-disable no-console */
import { UserAddress } from '@/common/types/User'
import { DexPoolConstants } from '@/contracts/data/DexPool.constants'
import { DexRouterConstants } from '@/contracts/data/DexRouter.constants'
import { type DexPool } from '@/contracts/types/DexPool'
import { utils, type ContractTransaction } from 'ethers'
import { createAsyncContract } from '../../utils/createContract'
import { type IDexPoolContractService } from './IDexPoolContractService'
import { StakePoolConstants } from '@/contracts/data/StakePool.constants'

export class DexPoolContractService implements IDexPoolContractService {
  private declare contract: DexPool | null

  constructor() {
    this.contract = null
  }

  public async init(address: string): Promise<void> {
    if (address) {
      this.contract = await createAsyncContract<DexPool>(
        address,
        DexPoolConstants.abi
      )
    }
  }

  public approveStakePool(
    shares: number
  ): Promise<ContractTransaction> | undefined {
    return this.contract?.approve(
      StakePoolConstants.address,
      utils.parseEther(String(shares))
    )
  }

  /**
   * Approves an amount of tokens to be spent by the DexRouter contract.
   *
   * @param {string} shares - The amount of tokens to approve, expressed as a string and should be parse to ether
   * @returns {Promise<ContractTransaction> | undefined} - A promise that resolves with a ContractTransaction object if the contract is defined, or undefined otherwise.
   */
  public approve(shares: number): Promise<ContractTransaction> | undefined {
    return this.contract?.approve(
      DexRouterConstants.address,
      utils.parseEther(String(shares))
    )
  }

  public async getAllowance({ address }: UserAddress) {
    try {
      const allowance = await this.contract?.allowance(
        address,
        DexRouterConstants.address
      )

      if (!allowance) {
        return 0
      }
      return Number(utils.formatEther(allowance))
    } catch (error) {
      return 0
    }
  }

  public async getShares({ address }: UserAddress): Promise<number> {
    const shares = await this.contract
      ?.balanceOf(address)
      .then((res) => Number(utils.formatEther(res)))
      .catch(() => 0)

    if (!shares) {
      return 0
    }
    return shares
  }

  public async totalSupply() {
    try {
      const totalSupply = await this.contract?.totalSupply()
      return totalSupply ? Number(utils.formatEther(totalSupply)) : 0
    } catch (error) {
      return 0
    }
  }
}
export const dexPoolContractService = new DexPoolContractService()
