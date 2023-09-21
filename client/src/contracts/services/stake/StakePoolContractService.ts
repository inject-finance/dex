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
    minReserve: number // Debe ser menos que el initial deposit
    minStakeAmount: number // El mínimo que el usuario puede hacer stacking, por default 10USD
  }) {
    await this.init()
    return this.contract?.setStakingPool(
      poolAddress,
      interestRate * constants.feesFactor, // Este 200 representa el 2% = 0.02.
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

  public async stakingPoolExists(
    poolAddress: string
  ): Promise<boolean | undefined> {
    await this.init()
    return this.contract?.stakingPoolExists(poolAddress).catch(() => false)
  }

  public async getTotalRewards(poolAddress: string, metamaskAddress: string) {
    await this.init()
    return this.contract
      ?.getTotalRewards(poolAddress, metamaskAddress)
      .then((res) => Number(utils.formatEther(res)))
      .catch(() => 0)
  }

  public async getPoolInfo(poolAddress: string) {
    try {
      await this.init()
      const data = await this.contract?.poolInfo(poolAddress)
      if (!data) {
        throw new Error("Doesn't have pool information")
      }
      return {
        interestRate: Number(utils.formatEther(data.interestRate)),
        isActive: data?.isActive,
        minReserve: Number(utils.formatEther(data.minReserve)),
        minStakeAmount: Number(utils.formatEther(data.minStakeAmount)),
        poolReserves: Number(utils.formatEther(data.poolReserves)),
        totalStakers: Number(utils.formatEther(data.totalStakers))
      }
    } catch (error) {
      return {
        interestRate: 0,
        isActive: false,
        minReserve: 0,
        minStakeAmount: 0,
        poolReserves: 0,
        totalStakers: 0
      }
    }
  }

  public async getUserStakeInfo(poolAddress: string, metamaskAddress: string) {
    try {
      const data = await this.contract?.stakeInfo(poolAddress, metamaskAddress)
      if (!data) {
        throw new Error("Doesn't have user stake information")
      }

      return {
        end: Number(utils.formatEther(data.end)),
        stakedAmount: Number(utils.formatEther(data.stakeAmount)),
        start: Number(utils.formatEther(data.start)),
        totalClaimed: Number(utils.formatEther(data.totalClaimed)),
        totalSupply: Number(utils.formatEther(data.totalSupply))
      }
    } catch (error) {
      return {
        end: 0,
        stakedAmount: 0,
        start: 0,
        totalClaimed: 0,
        totalSupply: 0
      }
    }
  }
}
export const stakePoolContractService = new StakePoolContractService()
