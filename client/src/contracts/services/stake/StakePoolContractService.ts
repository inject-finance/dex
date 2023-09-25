/* eslint-disable line-comment-position */
/* eslint-disable no-inline-comments */
import constants from '@/common/configuration/constants'
import { StakePoolToken } from '@/contracts/types/StakePoolToken'
import { utils } from 'ethers'
import { StakePoolConstants } from '../../data/StakePool.constants'
import { createAsyncContract } from '../../utils/createContract'
import { IStakePoolContractService } from './IStakePoolContractService'

export class StakePoolContractService implements IStakePoolContractService {
  private declare contract: StakePoolToken | null

  constructor() {
    this.contract = null
  }

  /**
   * Initializes the StakePoolContractService by creating an async contract with the given address and ABI.
   * @returns A Promise that resolves to void when the contract is created.
   */
  public async init() {
    this.contract = await createAsyncContract<StakePoolToken>(
      StakePoolConstants.address,
      StakePoolConstants.abi
    )
  }

  public async setStakingPool({
    poolAddress,
    interestRate = 0.02,
    initialDeposit,
    minReserve = 0,
    minStakeAmount
  }: {
    poolAddress: string
    interestRate: number
    initialDeposit: number // InjectToken,
    minReserve: number // Should be less than initial deposit
    minStakeAmount: number // The minimum amount to do stacking is 10USD
  }) {
    await this.init()
    return this.contract?.setStakingPool(
      poolAddress,
      interestRate * constants.feesFactor, // 200 represents 2% = 0.02.
      utils.parseEther(String(initialDeposit)),
      utils.parseEther(String(minReserve)),
      utils.parseEther(String(minStakeAmount))
    )
  }

  public async stakeToken({
    shares,
    poolAddress,
    duration // Number in days [1,2,3]
  }: {
    shares: number
    poolAddress: string
    duration: number
  }) {
    await this.init()
    return this.contract?.stakeToken(
      utils.parseEther(String(shares)),
      poolAddress,
      60 * 60 * 24 * duration
      // 60 * 10
    )
  }

  public async claimRewards(poolAddress: string) {
    await this.init()
    return this.contract?.claimRewards(poolAddress)
  }

  public async stakingPoolExists(poolAddress: string): Promise<boolean> {
    await this.init()
    return Boolean(
      await this.contract?.stakingPoolExists(poolAddress).catch(() => undefined)
    )
  }

  public async getTotalRewards(poolAddress: string, metamaskAddress: string) {
    await this.init()
    const rewards = await this.contract
      ?.getTotalRewards(poolAddress, metamaskAddress)
      .catch(() => undefined)
    return rewards ? Number(utils.formatEther(rewards)) : 0
  }

  public async getPoolInfo(poolAddress: string) {
    await this.init()
    const data = await this.contract
      ?.poolInfo(poolAddress)
      .catch(() => undefined)

    return {
      interestRate: data ? Number(utils.formatEther(data.interestRate)) : 0,
      isActive: data ? data.isActive : false,
      minReserve: data ? Number(utils.formatEther(data.minReserve)) : 0,
      minStakeAmount: data ? Number(utils.formatEther(data.minStakeAmount)) : 0,
      poolReserves: data ? Number(utils.formatEther(data.poolReserves)) : 0,
      totalStakers: data ? Number(utils.formatEther(data.totalStakers)) : 0
    }
  }

  public async getUserStakeInfo(poolAddress: string, metamaskAddress: string) {
    await this.init()
    const data = await this.contract
      ?.stakeInfo(poolAddress, metamaskAddress)
      .catch(() => undefined)

    return {
      end: data ? Number(utils.formatEther(data.end)) : 0,
      stakedAmount: data ? Number(utils.formatEther(data.stakeAmount)) : 0,
      start: data ? Number(utils.formatEther(data.start)) : 0,
      totalClaimed: data ? Number(utils.formatEther(data.totalClaimed)) : 0,
      totalSupply: data ? Number(utils.formatEther(data.totalSupply)) : 0
    }
  }
}
export const stakePoolContractService = new StakePoolContractService()
