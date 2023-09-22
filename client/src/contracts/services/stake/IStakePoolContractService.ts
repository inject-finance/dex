import { ContractTransaction } from 'ethers'

export interface IStakePoolContractService {
  init: () => Promise<void>

  setStakingPool: ({
    poolAddress,
    interestRate = 0.02,
    initialDeposit,
    minReserve = 0,
    minStakeAmount
  }: {
    poolAddress: string
    interestRate: number
    initialDeposit: number
    minReserve: number
    minStakeAmount: number
  }) => Promise<ContractTransaction | undefined>

  stakeToken: ({
    shares,
    poolAddress,
    duration
  }: {
    shares: number
    poolAddress: string
    duration: number
  }) => Promise<ContractTransaction | undefined>
  claimRewards: (
    poolAddress: string
  ) => Promise<ContractTransaction | undefined>

  stakingPoolExists: (poolAddress: string) => Promise<boolean>

  getTotalRewards: (
    poolAddress: string,
    metamaskAddress: string
  ) => Promise<number | undefined>

  getUserStakeInfo: (
    poolAddress: string,
    metamaskAddress: string
  ) => Promise<{
    end: number
    stakedAmount: number
    start: number
    totalClaimed: number
    totalSupply: number
  }>
}
